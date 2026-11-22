-- Rate Buddies v2.2.2f — the admin-delete-member Edge Function runs as service_role, which had no table
-- privileges on this project. Grant only what that function needs.
grant select on public.admins to service_role;
grant select, delete on public.profiles to service_role;
grant select, insert on public.deleted_members_archive to service_role;
grant insert on public.admin_audit to service_role;

-- admins read the archive in the web admin (RLS limits it to admins)
grant select on public.deleted_members_archive to authenticated;
