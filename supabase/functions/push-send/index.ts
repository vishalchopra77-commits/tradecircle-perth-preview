// Rate Buddies v2.2.2 build 16 — QA #14: send FCM push for a new notification or chat message.
// {ping:true} = health check (token + validate_only dry run).
// Called by the database trigger private.push_hook() (only while app_settings.push_enabled is true).
// The body only names a row ({table, id}); everything else is re-read here with the service role, so a caller
// cannot choose the text or the recipients. A row is pushed once (notifications.pushed_at) and only while fresh.
// Needs the secret FCM_SERVICE_ACCOUNT (the Firebase service-account JSON). Without it nothing is sent and
// notifications.push_status is set to 'needs_fcm_key'.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FRESH_MS = 3 * 60 * 1000;

// notification kind -> the toggle on the app's Notification settings screen (null = always on)
const KIND_PREF: Record<string, string | null> = {
  swap_request: "reviews", review_done: "reviews", friend_request: "friends", friend_added: "friends",
  group_added: "messages", rec_alert: "alerts", new_member: "members", limit: "limits",
  support: null, feature: null, account: null, approved: null, info: null,
};

function b64url(buf: ArrayBuffer | Uint8Array | string) {
  const bytes = typeof buf === "string" ? new TextEncoder().encode(buf) : buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
let cachedToken: { t: string; exp: number } | null = null;
async function googleToken(sa: { client_email: string; private_key: string }) {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.t;
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/firebase.messaging", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(head + "." + claim));
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: head + "." + claim + "." + b64url(sig) }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google token failed: " + (j.error_description || j.error || r.status));
  cachedToken = { t: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return cachedToken.t;
}

function inQuiet(p: Record<string, unknown>) {
  if (!p.quietOn) return false;
  const tz = String(p.tz || "Australia/Perth");
  let hm: string;
  try { hm = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()); }
  catch { hm = new Intl.DateTimeFormat("en-GB", { timeZone: "Australia/Perth", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()); }
  const m = (s: string) => { const [h, mi] = String(s || "0:0").split(":").map(Number); return (h || 0) * 60 + (mi || 0); };
  const now = m(hm), from = m(String(p.quietFrom || "21:00")), to = m(String(p.quietTo || "07:00"));
  return from <= to ? now >= from && now < to : now >= from || now < to;
}
function allowed(extras: Record<string, unknown> | null, pref: string | null) {
  const p = ((extras || {}) as Record<string, Record<string, unknown>>).notif || {};
  if (inQuiet(p)) return "quiet";
  if (pref && p[pref] === false) return "off";
  return "ok";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  let body: { table?: string; id?: string; ping?: boolean };
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  // health check: mint a Google token and do an FCM V1 dry run (validate_only) to a topic. Returns no secrets.
  if (body.ping) {
    const raw = Deno.env.get("FCM_SERVICE_ACCOUNT");
    if (!raw) return json({ fcm: "needs FCM_SERVICE_ACCOUNT secret" });
    try {
      const sa = JSON.parse(raw);
      const t = await googleToken(sa);
      const r = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
        method: "POST", headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" },
        body: JSON.stringify({ validate_only: true, message: { topic: "rb-dryrun", notification: { title: "Rate Buddies", body: "Dry run" } } }),
      });
      return json({ fcm: r.ok ? "ok" : "fcm_error_" + r.status, token: true, project: sa.project_id });
    } catch (e) { return json({ fcm: "error", detail: String((e as Error).message || e).slice(0, 120) }); }
  }
  if (!body.id || !UUID.test(body.id) || (body.table !== "notifications" && body.table !== "chat_messages")) return json({ error: "bad row" }, 400);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  // 1. who gets what
  type Job = { member: string; title: string; body: string; pref: string | null; data: Record<string, string> };
  const jobs: Job[] = [];
  if (body.table === "notifications") {
    const r = await db.from("notifications").select("id,member_id,title,body,kind,payload,created_at,pushed_at").eq("id", body.id).maybeSingle();
    const n = r.data;
    if (!n || n.pushed_at || Date.now() - new Date(n.created_at).getTime() > FRESH_MS) return json({ skipped: "not fresh" });
    const pref = n.kind in KIND_PREF ? KIND_PREF[n.kind] : null;
    jobs.push({ member: n.member_id, title: n.title || "Rate Buddies", body: n.body || "", pref, data: { kind: String(n.kind || ""), notification_id: n.id } });
  } else {
    const r = await db.from("chat_messages").select("id,conversation_id,sender_id,body,created_at,hidden").eq("id", body.id).maybeSingle();
    const m = r.data;
    if (!m || m.hidden || Date.now() - new Date(m.created_at).getTime() > FRESH_MS) return json({ skipped: "not fresh" });
    const [conv, mem, who] = await Promise.all([
      db.from("conversations").select("kind,title").eq("id", m.conversation_id).maybeSingle(),
      db.from("conversation_members").select("member_id,muted").eq("conversation_id", m.conversation_id),
      db.from("profiles").select("first_name,last_name").eq("id", m.sender_id).maybeSingle(),
    ]);
    const name = [who.data?.first_name, who.data?.last_name].filter(Boolean).join(" ") || "A member";
    const title = conv.data?.kind === "group" ? `${name} in ${conv.data?.title || "your group"}` : name;
    for (const x of mem.data || []) if (x.member_id !== m.sender_id && !x.muted)
      jobs.push({ member: x.member_id, title, body: String(m.body || "").slice(0, 180), pref: "messages", data: { kind: "chat", conversation_id: m.conversation_id } });
  }
  if (!jobs.length) return json({ sent: 0 });

  // 2. settings + tokens
  const ids = [...new Set(jobs.map((j) => j.member))];
  const [profs, toks] = await Promise.all([
    db.from("profiles").select("id,extras,status").in("id", ids),
    db.from("device_tokens").select("token,member_id").in("member_id", ids),
  ]);
  const prof = new Map((profs.data || []).map((p) => [p.id, p]));
  const saRaw = Deno.env.get("FCM_SERVICE_ACCOUNT");
  const mark = (status: string) => body.table === "notifications"
    ? db.from("notifications").update({ push_status: status, pushed_at: new Date().toISOString() }).eq("id", body.id) : Promise.resolve();
  if (!saRaw) { await mark("needs_fcm_key"); return json({ sent: 0, needs: "FCM_SERVICE_ACCOUNT secret" }); }
  let sa: { client_email: string; private_key: string; project_id: string };
  try { sa = JSON.parse(saRaw); } catch { await mark("bad_fcm_key"); return json({ error: "FCM_SERVICE_ACCOUNT is not valid JSON" }, 500); }
  const access = await googleToken(sa);

  // 3. send
  let sent = 0; const skipped: Record<string, number> = {};
  for (const j of jobs) {
    const p = prof.get(j.member);
    if (!p || (p.status !== "approved" && p.status !== "active")) { skipped.status = (skipped.status || 0) + 1; continue; }
    const ok = allowed(p.extras, j.pref);
    if (ok !== "ok") { skipped[ok] = (skipped[ok] || 0) + 1; continue; }
    for (const t of (toks.data || []).filter((x) => x.member_id === j.member)) {
      const r = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
        method: "POST", headers: { Authorization: "Bearer " + access, "Content-Type": "application/json" },
        body: JSON.stringify({ message: { token: t.token, notification: { title: j.title, body: j.body }, data: j.data,
          android: { priority: "HIGH", notification: { channel_id: "rb_default", sound: "default" } } } }),
      });
      if (r.ok) sent++;
      else {
        const e = await r.json().catch(() => ({}));
        const code = JSON.stringify(e);
        if (r.status === 404 || /UNREGISTERED|INVALID_ARGUMENT/.test(code)) await db.from("device_tokens").delete().eq("token", t.token);
      }
    }
  }
  await mark(sent ? "sent" : (Object.keys(skipped)[0] || "no_device"));
  return json({ sent, skipped });
});
