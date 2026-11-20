-- Rate Buddies v2.1
-- Daily cap applies to Google Reviews RECEIVED (to_member_id), not given.
-- Members can give as many as they like. Also adds availability + reminder list.

-- ---------- received cap (replaces the giving cap) ----------
create or replace function public.google_reviews_daily_cap()
returns trigger
language plpgsql
set search_path to 'public'
as $$
declare
  n int;
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status is distinct from 'done') then
    new.done_at := coalesce(new.done_at, now());
    select count(*) into n
    from public.google_reviews
    where to_member_id = new.to_member_id
      and status = 'done'
      and (done_at at time zone 'Australia/Perth')::date
          = (now() at time zone 'Australia/Perth')::date
      and id is distinct from new.id;
    if n >= 3 then
      raise exception 'Daily Google Review received cap of 3 reached';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.google_reviews_daily_cap() from public, anon, authenticated;

-- ---------- availability ----------
alter table public.profiles
  add column if not exists available_for_swap boolean not null default true;

alter table public.profiles
  add column if not exists swap_paused_on date;

-- ---------- personal reminder list (when a member is full for the day) ----------
create table if not exists public.google_review_reminders (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  target_member_id uuid not null references public.profiles (id) on delete cascade,
  remind_at timestamptz not null,
  label text not null default 'Tomorrow, 9:00 AM',
  created_at timestamptz not null default now(),
  unique (member_id, target_member_id)
);

create index if not exists google_review_reminders_member_idx
  on public.google_review_reminders (member_id, remind_at);

alter table public.google_review_reminders enable row level security;

drop policy if exists "reminders_select_own" on public.google_review_reminders;
create policy "reminders_select_own"
  on public.google_review_reminders for select
  using (member_id = auth.uid() or public.is_admin());

drop policy if exists "reminders_insert_own" on public.google_review_reminders;
create policy "reminders_insert_own"
  on public.google_review_reminders for insert
  with check (member_id = auth.uid() or public.is_admin());

drop policy if exists "reminders_update_own" on public.google_review_reminders;
create policy "reminders_update_own"
  on public.google_review_reminders for update
  using (member_id = auth.uid() or public.is_admin())
  with check (member_id = auth.uid() or public.is_admin());

drop policy if exists "reminders_delete_own" on public.google_review_reminders;
create policy "reminders_delete_own"
  on public.google_review_reminders for delete
  using (member_id = auth.uid() or public.is_admin());

grant select, insert, update, delete on public.google_review_reminders to authenticated;
grant select on public.google_review_reminders to anon;
