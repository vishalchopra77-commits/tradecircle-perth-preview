-- Rate Buddies v2.1.3 — Support desk conversation (one thread per member).
-- NOT APPLIED. Needs Vishal's OK before it is run, and only on the TEST project gbkammdluulczowcergu.
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  from_admin boolean not null default false,
  admin_id uuid references public.profiles (id) on delete set null,
  topic text check (topic is null or topic in ('Account','Reviews','Facebook','Billing','Report a problem')),
  body text not null check (char_length(body) between 1 and 4000),
  read_by_member boolean not null default false,
  read_by_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists support_messages_member_idx on public.support_messages (member_id, created_at);
create index if not exists support_messages_unread_admin_idx on public.support_messages (read_by_admin) where read_by_admin = false;

alter table public.support_messages enable row level security;

-- members read their own thread; admins read every thread
create policy support_messages_select on public.support_messages for select to authenticated
  using (member_id = auth.uid() or public.is_admin());
-- members write only to their own thread as themselves; admins reply into any thread
create policy support_messages_insert on public.support_messages for insert to authenticated
  with check (
    (member_id = auth.uid() and from_admin = false and admin_id is null)
    or (public.is_admin() and from_admin = true and admin_id = auth.uid())
  );
-- read flags only
create policy support_messages_update on public.support_messages for update to authenticated
  using (member_id = auth.uid() or public.is_admin())
  with check (member_id = auth.uid() or public.is_admin());

grant select, insert, update on public.support_messages to authenticated;
