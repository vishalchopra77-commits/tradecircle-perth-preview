// Rate Buddies v2.2.2f — admin "Delete member" (archive first, then remove the login so the email can sign up again).
// Only a signed-in admin (row in public.admins) may call it. Admin accounts and yourself can never be removed.
// The service role key is read from the function environment and never leaves the server.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. who is calling?
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const caller = jwt ? await admin.auth.getUser(jwt) : null;
  const callerId = caller?.data?.user?.id;
  if (!callerId) return json({ error: "Please sign in to the admin again." }, 401);
  const isAdmin = await admin.from("admins").select("user_id").eq("user_id", callerId).maybeSingle();
  if (isAdmin.error) return json({ error: "Admin check failed: " + isAdmin.error.message }, 500);
  if (!isAdmin.data) return json({ error: "Only an admin can delete members." }, 403);

  // 2. which member?
  let target = "", note = "";
  try { const b = await req.json(); target = String(b.member_id || ""); note = String(b.note || "").slice(0, 300); } catch { /* bad body */ }
  if (!UUID.test(target)) return json({ error: "Missing member" }, 400);
  if (target === callerId) return json({ error: "You can't delete your own admin account." }, 400);
  const targetAdmin = await admin.from("admins").select("user_id").eq("user_id", target).maybeSingle();
  if (targetAdmin.error) return json({ error: "Admin check failed: " + targetAdmin.error.message }, 500);
  if (targetAdmin.data) return json({ error: "Admin accounts can't be deleted here." }, 400);

  const prof = await admin.from("profiles").select("*").eq("id", target).maybeSingle();
  if (prof.error) return json({ error: "Could not read the member: " + prof.error.message }, 500);
  const au = await admin.auth.admin.getUserById(target);
  const user = au.data?.user;
  if (!prof.data && !user) return json({ error: "Member not found (already deleted?)" }, 404);
  if (prof.data && prof.data.role === "admin") return json({ error: "Admin accounts can't be deleted here." }, 400);

  // 3. archive copy first (if this fails, nothing is removed)
  const arch = await admin.from("deleted_members_archive").insert({
    member_id: target,
    email: user?.email || prof.data?.email || null,
    profile: prof.data || {},
    auth_user: user ? { id: user.id, email: user.email, phone: user.phone, created_at: user.created_at, last_sign_in_at: user.last_sign_in_at, user_metadata: user.user_metadata, app_metadata: user.app_metadata } : null,
    deleted_by: callerId,
    note,
  }).select("id").single();
  if (arch.error) return json({ error: "Could not archive the member: " + arch.error.message }, 500);

  const name = [prof.data?.first_name, prof.data?.last_name].filter(Boolean).join(" ") || user?.email || target;
  await admin.from("admin_audit").insert({ admin_id: callerId, action: "Deleted a member (archived)", target: name + (user?.email ? " · " + user.email : "") });

  // 4. remove the login (profile + the member's own rows go with it by cascade)
  if (user) {
    const del = await admin.auth.admin.deleteUser(target);
    if (del.error) return json({ error: "Archived, but the login could not be removed: " + del.error.message, archive_id: arch.data.id }, 500);
  } else if (prof.data) {
    const delp = await admin.from("profiles").delete().eq("id", target);
    if (delp.error) return json({ error: "Archived, but the profile could not be removed: " + delp.error.message, archive_id: arch.data.id }, 500);
  }
  return json({ ok: true, archive_id: arch.data.id, name, email: user?.email || "" });
});
