-- Rate Buddies v2.2.2f — admin "Delete member" (test project ztniuyeovcdspbmobvip only).
-- Nothing is lost: before an account is removed, the Edge Function admin-delete-member writes the full
-- profile (jsonb) + auth email into public.deleted_members_archive and an admin_audit row.
-- Removing the auth user frees the email so the same person can sign up again (for repeat testing).

create table if not exists public.deleted_members_archive (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null,
  email text,
  profile jsonb not null,
  auth_user jsonb,
  deleted_by uuid,
  deleted_at timestamptz not null default now(),
  note text not null default ''
);
create index if not exists deleted_members_archive_member_idx on public.deleted_members_archive (member_id);
create index if not exists deleted_members_archive_email_idx on public.deleted_members_archive (lower(email));
alter table public.deleted_members_archive enable row level security;
drop policy if exists dma_admin_select on public.deleted_members_archive;
create policy dma_admin_select on public.deleted_members_archive for select to authenticated using ((select public.is_admin()));
-- no insert/update/delete policies: only the Edge Function (service role) writes; nobody edits or removes archive rows
revoke all on public.deleted_members_archive from anon;

-- Rows that pointed at a removed member must not block the removal.
-- Reports / requests / audit keep their row (member column set to null); vouches between two members go with the member.
alter table public.member_reports alter column reporter_id drop not null;
alter table public.recommendation_requests drop constraint if exists recommendation_requests_created_by_fkey,
  add constraint recommendation_requests_created_by_fkey foreign key (created_by) references public.profiles(id) on delete set null;
alter table public.member_reports drop constraint if exists member_reports_reporter_id_fkey,
  add constraint member_reports_reporter_id_fkey foreign key (reporter_id) references public.profiles(id) on delete set null;
alter table public.member_reports drop constraint if exists member_reports_target_member_id_fkey,
  add constraint member_reports_target_member_id_fkey foreign key (target_member_id) references public.profiles(id) on delete set null;
alter table public.member_reports drop constraint if exists member_reports_resolved_by_fkey,
  add constraint member_reports_resolved_by_fkey foreign key (resolved_by) references public.profiles(id) on delete set null;
alter table public.admin_audit drop constraint if exists admin_audit_admin_id_fkey,
  add constraint admin_audit_admin_id_fkey foreign key (admin_id) references public.profiles(id) on delete set null;
alter table public.facebook_vouches drop constraint if exists facebook_vouches_from_member_id_fkey,
  add constraint facebook_vouches_from_member_id_fkey foreign key (from_member_id) references public.profiles(id) on delete cascade;
alter table public.facebook_vouches drop constraint if exists facebook_vouches_to_member_id_fkey,
  add constraint facebook_vouches_to_member_id_fkey foreign key (to_member_id) references public.profiles(id) on delete cascade;
