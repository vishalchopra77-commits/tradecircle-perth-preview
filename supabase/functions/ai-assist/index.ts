// Rate Buddies v2.2.2 build 16 — QA #44/#47: the AI assistant's free-form questions.
// Simple commands (friend requests, reviews, messages, queue, alerts) are answered in the app from live data and
// never reach this function. Free-form questions come here and go to the provider the admin allowed.
// Needs one of these secrets: XAI_API_KEY (Grok), OPENAI_API_KEY (ChatGPT), ANTHROPIC_API_KEY (Claude).
// Without a key it answers {needs_key: true} and the app shows "Needs an AI key".
// Optional model overrides: XAI_MODEL, OPENAI_MODEL, ANTHROPIC_MODEL.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const KEYS = { grok: "XAI_API_KEY", chatgpt: "OPENAI_API_KEY", claude: "ANTHROPIC_API_KEY" } as const;
type P = keyof typeof KEYS;
const SYSTEM = "You are the Rate Buddies assistant inside a members-only app for Australian tradies who swap genuine Google reviews and Facebook recommendations. " +
  "Answer in plain Australian English, in 1 to 3 short sentences that can be read aloud while driving. Never write a review for the member, never promise to send friend requests, " +
  "and tell them to tap the button themselves for anything on Facebook or Google.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const u = jwt ? await db.auth.getUser(jwt) : null;
  const uid = u?.data?.user?.id;
  if (!uid) return json({ error: "Please sign in again." }, 401);
  const [prof, adm, set] = await Promise.all([
    db.from("profiles").select("first_name,trade,status").eq("id", uid).maybeSingle(),
    db.from("admins").select("user_id").eq("user_id", uid).maybeSingle(),
    db.from("app_settings").select("key,value").in("key", ["ai_allow_grok", "ai_allow_chatgpt", "ai_allow_claude", "ai_voice"]),
  ]);
  const isAdmin = !!adm.data;
  if (!isAdmin && prof.data?.status !== "approved") return json({ error: "Only approved members can use the assistant." }, 403);
  const s: Record<string, unknown> = {}; (set.data || []).forEach((r) => (s[r.key] = r.value));
  const allowedP = (p: P) => s["ai_allow_" + p] !== false; // allowed unless the admin switched it off
  const has = (p: P) => !!Deno.env.get(KEYS[p]);
  let body: { message?: string; provider?: string; ping?: boolean };
  try { body = await req.json(); } catch { body = {}; }
  const status = { grok: { key: has("grok"), allowed: allowedP("grok") }, chatgpt: { key: has("chatgpt"), allowed: allowedP("chatgpt") }, claude: { key: has("claude"), allowed: allowedP("claude") } };
  if (body.ping) return json({ status });

  const want = (["grok", "chatgpt", "claude"].includes(String(body.provider)) ? body.provider : "grok") as P;
  const order: P[] = [want, ...(["grok", "chatgpt", "claude"] as P[]).filter((x) => x !== want)];
  const p = order.find((x) => has(x) && allowedP(x));
  if (!p) return json({ needs_key: true, status });
  const msg = String(body.message || "").slice(0, 800).trim();
  if (!msg) return json({ error: "Say or type a question." }, 400);
  const who = `The member is ${prof.data?.first_name || "a member"}${prof.data?.trade ? ", a " + prof.data.trade : ""}.`;
  const key = Deno.env.get(KEYS[p])!;
  try {
    let reply = "";
    if (p === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: Deno.env.get("ANTHROPIC_MODEL") || "claude-3-5-haiku-latest", max_tokens: 300, system: SYSTEM + " " + who, messages: [{ role: "user", content: msg }] }) });
      const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || String(r.status));
      reply = (j.content || []).map((c: { text?: string }) => c.text || "").join("").trim();
    } else {
      const url = p === "grok" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const model = p === "grok" ? (Deno.env.get("XAI_MODEL") || "grok-3-mini") : (Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini");
      const r = await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        body: JSON.stringify({ model, max_tokens: 300, messages: [{ role: "system", content: SYSTEM + " " + who }, { role: "user", content: msg }] }) });
      const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || String(r.status));
      reply = String(j.choices?.[0]?.message?.content || "").trim();
    }
    return json({ reply, provider: p });
  } catch (e) {
    return json({ error: "The AI service didn't answer: " + ((e as Error).message || "error"), provider: p }, 502);
  }
});
