// Rate Buddies v2.2.2 build 16 — QA #44: Devi posts a matching Facebook post here.
// URL (copy it from Admin › Devi automation): https://ztniuyeovcdspbmobvip.supabase.co/functions/v1/devi-webhook?token=<token>
// The token is checked inside the database (public.devi_ingest, service role only). Each post lands once in
// Incoming requests (recommendation_requests, status pending, source devi) for the admin to approve.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, x-devi-token", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const token = new URL(req.url).searchParams.get("token") || req.headers.get("x-devi-token") || "";
  let p: Record<string, unknown>;
  try { p = await req.json(); } catch { return json({ error: "Send JSON: {post_link, group_name, snippet, trade, suburb, city, confidence}" }, 400); }
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const r = await db.rpc("devi_ingest", { p_token: token, p });
  if (r.error) return json({ error: r.error.message }, r.error.code === "42501" ? 401 : 400);
  return json({ ok: true, id: r.data });
});
