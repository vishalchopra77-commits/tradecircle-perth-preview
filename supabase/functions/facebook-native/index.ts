// Rate Buddies v2.2.2c — native Facebook sign-in (Android Facebook app → access token → Supabase session).
// Supabase's id-token sign-in only accepts Facebook Limited Login JWTs (iOS), so the Android access token is
// checked here: Graph /app must say the token belongs to the Rate Buddies Facebook app, then /me gives the
// verified profile. We create or find the user and return a one-time magic-link token hash; the app turns it
// into a normal session with auth.verifyOtp. No secrets are returned. The service role stays inside this function.
import { createClient } from "npm:@supabase/supabase-js@2";

const APP_ID = "1699917951765989";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  let token = "";
  try { token = String((await req.json()).access_token || ""); } catch { /* bad body */ }
  if (!token || token.length > 4096) return json({ error: "Missing Facebook token" }, 400);

  const g = (path: string) =>
    fetch(`https://graph.facebook.com/v19.0/${path}${path.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(token)}`)
      .then((r) => r.json()).catch(() => ({}));
  const app = await g("app");
  if (!app || String(app.id) !== APP_ID) return json({ error: "This Facebook sign-in is not for Rate Buddies" }, 401);
  const me = await g("me?fields=id,first_name,last_name,name,email,link,picture.type(large)");
  if (!me || !me.id) return json({ error: "Facebook did not return your profile" }, 401);

  const email = String(me.email || `fb_${me.id}@facebook.ratebuddies.invalid`).toLowerCase();
  const link = /^https:\/\/(www\.|m\.)?facebook\.com\//i.test(me.link || "") ? me.link : "";
  const avatar = me.picture?.data?.url || "";
  const meta: Record<string, string> = {
    first_name: me.first_name || "", last_name: me.last_name || "", full_name: me.name || "",
    avatar_url: avatar, facebook_id: String(me.id), signup_provider: "facebook",
  };
  if (link) meta.link = link;

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: meta });
  if (created.error && !/already|registered|exists/i.test(created.error.message)) {
    return json({ error: "Could not create the account: " + created.error.message }, 500);
  }
  const link1 = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (link1.error || !link1.data?.properties?.hashed_token) {
    return json({ error: "Could not start the session: " + (link1.error?.message || "no token") }, 500);
  }
  return json({
    token_hash: link1.data.properties.hashed_token,
    new_user: !created.error,
    profile: { first_name: meta.first_name, last_name: meta.last_name, email: me.email || "", avatar_url: avatar, link },
  });
});
