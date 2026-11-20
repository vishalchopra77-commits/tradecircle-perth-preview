-- Rate Buddies v1.9.0 — core schema, helpers, RLS
-- Project: Rate Buddies Test (gbkammdluulczowcergu)

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  first_name text not null default '',
  last_name text not null default '',
  business text not null default '',
  trade text not null default '',
  state text not null default 'wa',
  city text not null default 'Perth',
  regions text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  role text not null default 'member' check (role in ('member', 'admin')),
  intro_watched boolean not null default false,
  rec_share jsonb not null default '{"phone":true,"facebook":true,"website":true,"profile":true}'::jsonb,
  phone text not null default '',
  facebook text not null default '',
  page text not null default '',
  website text not null default '',
  profile_url text not null default '',
  bio text not null default '',
  color text not null default 'navy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid
);

create index profiles_status_idx on public.profiles (status);
create index profiles_city_trade_idx on public.profiles (city, trade);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Admin / approved checks (bypass RLS; stable)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'approved'
  );
$$;

create or replace function public.is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and status = 'approved'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_approved() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_approved() to authenticated;

-- New auth users get a pending member profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, first_name, last_name, business, trade, phone,
    role, status, intro_watched
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'business', ''),
    coalesce(new.raw_user_meta_data->>'trade', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'member',
    'pending',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Members cannot self-assign admin/approved; nobody can change their own role
create or replace function public.profiles_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is null then
      return new; -- seed / service role
    end if;
    if not public.is_admin() then
      new.id := auth.uid();
      new.role := 'member';
      new.status := 'pending';
      new.approved_at := null;
      new.approved_by := null;
    end if;
    return new;
  end if;

  -- UPDATE
  if new.id = auth.uid() and new.role is distinct from old.role then
    raise exception 'You cannot change your own role';
  end if;
  if not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.approved_at := old.approved_at;
    new.approved_by := old.approved_by;
    new.id := old.id;
    new.email := old.email;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_biu
  before insert or update on public.profiles
  for each row execute function public.profiles_guard();

alter table public.profiles
  add constraint profiles_approved_by_fk
  foreign key (approved_by) references public.profiles (id) on delete set null;

-- Pending/rejected profiles as applications (RLS inherited via security_invoker)
create view public.signup_applications
  with (security_invoker = true)
as
  select *
  from public.profiles
  where status in ('pending', 'rejected');

-- ---------- recommendation requests ----------
create table public.recommendation_requests (
  id uuid primary key default gen_random_uuid(),
  post_link text,
  group_name text,
  snippet text,
  ask text,
  trade text,
  city text,
  suburb text,
  featured_member_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  confidence int,
  source text not null default 'admin',
  when_label text,
  closes_label text,
  of_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles (id) on delete set null
);

create trigger rec_requests_set_updated_at
  before update on public.recommendation_requests
  for each row execute function public.set_updated_at();

create table public.rec_progress (
  request_id uuid not null references public.recommendation_requests (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (request_id, member_id)
);

create table public.rec_text_ledger (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.recommendation_requests (id) on delete cascade,
  viewer_id uuid not null references public.profiles (id) on delete cascade,
  issued_text text not null,
  created_at timestamptz not null default now()
);

create unique index rec_text_ledger_unique_text
  on public.rec_text_ledger (request_id, issued_text);

-- ---------- google reviews ----------
create table public.google_reviews (
  id uuid primary key default gen_random_uuid(),
  from_member_id uuid not null references public.profiles (id) on delete cascade,
  to_member_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'done', 'skipped')),
  created_at timestamptz not null default now(),
  done_at timestamptz
);

create or replace function public.google_reviews_daily_cap()
returns trigger
language plpgsql
as $$
declare
  n int;
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status is distinct from 'done') then
    new.done_at := coalesce(new.done_at, now());
    select count(*) into n
    from public.google_reviews
    where from_member_id = new.from_member_id
      and status = 'done'
      and (done_at at time zone 'Australia/Perth')::date
          = (now() at time zone 'Australia/Perth')::date
      and id is distinct from new.id;
    if n >= 3 then
      raise exception 'Daily Google review cap of 3 reached';
    end if;
  end if;
  return new;
end;
$$;

create trigger google_reviews_daily_cap
  before insert or update on public.google_reviews
  for each row execute function public.google_reviews_daily_cap();

-- ---------- facebook circle & queue ----------
create table public.facebook_friends (
  id uuid primary key default gen_random_uuid(),
  from_member_id uuid not null references public.profiles (id) on delete cascade,
  to_member_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'added', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (from_member_id, to_member_id),
  check (from_member_id <> to_member_id)
);

create table public.facebook_queue (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  place int,
  note text,
  status text not null default 'waiting',
  created_at timestamptz not null default now()
);

-- ---------- notifications & messages ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  kind text not null default 'info',
  payload jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_member_idx on public.notifications (member_id, created_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now(),
  check (from_id <> to_id)
);

-- ---------- video tutorials & intro ----------
create table public.tutorial_sections (
  id text primary key,
  title text not null,
  sort_order int not null default 0,
  hidden boolean not null default false
);

create table public.tutorial_videos (
  id text primary key,
  section_id text references public.tutorial_sections (id) on delete set null,
  url text not null,
  provider text,
  video_id text,
  thumb text,
  embed text,
  title text not null,
  description text not null default '',
  duration text not null default '',
  sort_order int not null default 0,
  hidden boolean not null default false,
  archived boolean not null default false,
  sample boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.intro_settings (
  id int primary key default 1 check (id = 1),
  url text,
  provider text,
  video_id text,
  thumb text,
  embed text,
  title text,
  description text not null default '',
  duration text not null default '',
  duration_sec int not null default 200,
  require_intro boolean not null default true,
  min_watched_pct int not null default 90,
  sample boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger intro_settings_set_updated_at
  before update on public.intro_settings
  for each row execute function public.set_updated_at();

create table public.previous_intros (
  id text primary key,
  url text,
  provider text,
  video_id text,
  thumb text,
  title text,
  archived_at text,
  sample boolean not null default true
);

create table public.tutorial_watched (
  member_id uuid not null references public.profiles (id) on delete cascade,
  video_id text not null,
  watched_at timestamptz not null default now(),
  primary key (member_id, video_id)
);

-- ---------- app settings ----------
create table public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- ---------- admin RPCs ----------
create or replace function public.admin_set_member_status(target uuid, new_status text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.profiles;
begin
  if not public.is_admin() then
    raise exception 'Only admins can change member status';
  end if;
  if new_status not in ('pending', 'approved', 'rejected') then
    raise exception 'Invalid status';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot change your own membership status this way';
  end if;
  update public.profiles
  set
    status = new_status,
    approved_at = case when new_status = 'approved' then now() else approved_at end,
    approved_by = case when new_status = 'approved' then auth.uid() else approved_by end
  where id = target
  returning * into rec;
  if rec.id is null then
    raise exception 'Member not found';
  end if;
  if new_status = 'approved' then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (
      target,
      'You’re in',
      'Your Rate Buddies profile has been approved. Watch the intro to get started.',
      'approved',
      jsonb_build_object('status', 'approved')
    );
  end if;
  return rec;
end;
$$;

create or replace function public.admin_approve_request(req uuid, featured uuid default null)
returns public.recommendation_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.recommendation_requests;
  feat public.profiles;
  recipient record;
  n int := 0;
begin
  if not public.is_admin() then
    raise exception 'Only admins can approve recommendation requests';
  end if;
  select * into rec from public.recommendation_requests where id = req;
  if rec.id is null then
    raise exception 'Request not found';
  end if;
  if featured is not null then
    rec.featured_member_id := featured;
  end if;
  if rec.featured_member_id is null then
    raise exception 'A featured member is required';
  end if;
  select * into feat from public.profiles
    where id = rec.featured_member_id and status = 'approved';
  if feat.id is null then
    raise exception 'Featured member is not an approved member';
  end if;
  if feat.trade is distinct from rec.trade then
    -- allow if trade text differs slightly; still require a trade match when both set
    if rec.trade is not null and feat.trade is not null and lower(feat.trade) <> lower(rec.trade) then
      raise exception 'Featured member is not in that trade';
    end if;
  end if;

  update public.recommendation_requests
  set
    status = 'approved',
    featured_member_id = feat.id,
    approved_at = now(),
    approved_by = auth.uid()
  where id = req
  returning * into rec;

  for recipient in
    select p.* from public.profiles p
    where p.status = 'approved'
      and p.role = 'member'
      and p.city = rec.city
      and p.id <> feat.id
      and lower(coalesce(p.trade, '')) <> lower(coalesce(rec.trade, feat.trade, ''))
  loop
    insert into public.notifications (member_id, title, body, kind, payload)
    values (
      recipient.id,
      'Facebook recommendation alert for "' || coalesce(rec.trade, feat.trade, 'a trade') || '"',
      'Let’s help ' || coalesce(feat.first_name, 'a buddy') || '!',
      'recommend',
      jsonb_build_object('request_id', rec.id, 'featured_id', feat.id)
    );
    n := n + 1;
  end loop;

  update public.recommendation_requests
  set of_count = n
  where id = rec.id
  returning * into rec;

  return rec;
end;
$$;

create or replace function public.admin_dismiss_request(req uuid)
returns public.recommendation_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.recommendation_requests;
begin
  if not public.is_admin() then
    raise exception 'Only admins can dismiss requests';
  end if;
  update public.recommendation_requests
  set status = 'dismissed'
  where id = req
  returning * into rec;
  return rec;
end;
$$;

grant execute on function public.admin_set_member_status(uuid, text) to authenticated;
grant execute on function public.admin_approve_request(uuid, uuid) to authenticated;
grant execute on function public.admin_dismiss_request(uuid) to authenticated;

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.recommendation_requests enable row level security;
alter table public.rec_progress enable row level security;
alter table public.rec_text_ledger enable row level security;
alter table public.google_reviews enable row level security;
alter table public.facebook_friends enable row level security;
alter table public.facebook_queue enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.tutorial_sections enable row level security;
alter table public.tutorial_videos enable row level security;
alter table public.intro_settings enable row level security;
alter table public.previous_intros enable row level security;
alter table public.tutorial_watched enable row level security;
alter table public.app_settings enable row level security;

-- profiles
create policy profiles_select
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.is_admin()
    or (status = 'approved' and public.is_approved())
  );

create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() or public.is_admin());

create policy profiles_update_own_or_admin
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- no delete for members; admins may not hard-delete either (archive via status)
-- (no delete policy)

-- recommendation_requests
create policy rec_req_select
  on public.recommendation_requests for select
  to authenticated
  using (
    public.is_admin()
    or (status = 'approved' and public.is_approved())
  );

create policy rec_req_admin_write
  on public.recommendation_requests for insert
  to authenticated
  with check (public.is_admin());

create policy rec_req_admin_update
  on public.recommendation_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- rec_progress
create policy rec_progress_select
  on public.rec_progress for select
  to authenticated
  using (public.is_admin() or public.is_approved());

create policy rec_progress_insert_own
  on public.rec_progress for insert
  to authenticated
  with check (member_id = auth.uid() and public.is_approved());

-- rec_text_ledger
create policy rec_ledger_select
  on public.rec_text_ledger for select
  to authenticated
  using (viewer_id = auth.uid() or public.is_admin());

create policy rec_ledger_insert_own
  on public.rec_text_ledger for insert
  to authenticated
  with check (viewer_id = auth.uid() and public.is_approved());

-- google_reviews
create policy google_reviews_select
  on public.google_reviews for select
  to authenticated
  using (
    public.is_admin()
    or from_member_id = auth.uid()
    or to_member_id = auth.uid()
  );

create policy google_reviews_insert
  on public.google_reviews for insert
  to authenticated
  with check (from_member_id = auth.uid() or public.is_admin());

create policy google_reviews_update
  on public.google_reviews for update
  to authenticated
  using (from_member_id = auth.uid() or to_member_id = auth.uid() or public.is_admin())
  with check (from_member_id = auth.uid() or to_member_id = auth.uid() or public.is_admin());

-- facebook_friends
create policy fb_friends_select
  on public.facebook_friends for select
  to authenticated
  using (
    public.is_admin()
    or from_member_id = auth.uid()
    or to_member_id = auth.uid()
  );

create policy fb_friends_insert
  on public.facebook_friends for insert
  to authenticated
  with check (from_member_id = auth.uid() or public.is_admin());

create policy fb_friends_update
  on public.facebook_friends for update
  to authenticated
  using (from_member_id = auth.uid() or to_member_id = auth.uid() or public.is_admin())
  with check (from_member_id = auth.uid() or to_member_id = auth.uid() or public.is_admin());

-- facebook_queue (members see all approved-queue rows; only admin writes)
create policy fb_queue_select
  on public.facebook_queue for select
  to authenticated
  using (public.is_admin() or public.is_approved());

create policy fb_queue_admin_write
  on public.facebook_queue for insert
  to authenticated
  with check (public.is_admin());

create policy fb_queue_admin_update
  on public.facebook_queue for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- notifications
create policy notifications_select
  on public.notifications for select
  to authenticated
  using (member_id = auth.uid() or public.is_admin());

create policy notifications_update_own
  on public.notifications for update
  to authenticated
  using (member_id = auth.uid() or public.is_admin())
  with check (member_id = auth.uid() or public.is_admin());

create policy notifications_admin_insert
  on public.notifications for insert
  to authenticated
  with check (public.is_admin() or member_id = auth.uid());

-- messages
create policy messages_select
  on public.messages for select
  to authenticated
  using (from_id = auth.uid() or to_id = auth.uid() or public.is_admin());

create policy messages_insert
  on public.messages for insert
  to authenticated
  with check (from_id = auth.uid());

create policy messages_update
  on public.messages for update
  to authenticated
  using (to_id = auth.uid() or from_id = auth.uid() or public.is_admin())
  with check (to_id = auth.uid() or from_id = auth.uid() or public.is_admin());

-- tutorials: approved or admin can read; admin writes
create policy tutorial_sections_select
  on public.tutorial_sections for select
  to authenticated
  using (public.is_admin() or public.is_approved());

create policy tutorial_sections_admin
  on public.tutorial_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tutorial_videos_select
  on public.tutorial_videos for select
  to authenticated
  using (public.is_admin() or public.is_approved());

create policy tutorial_videos_admin
  on public.tutorial_videos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy intro_settings_select
  on public.intro_settings for select
  to authenticated
  using (public.is_admin() or auth.uid() is not null);

create policy intro_settings_admin
  on public.intro_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy previous_intros_select
  on public.previous_intros for select
  to authenticated
  using (public.is_admin());

create policy previous_intros_admin
  on public.previous_intros for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tutorial_watched_select
  on public.tutorial_watched for select
  to authenticated
  using (member_id = auth.uid() or public.is_admin());

create policy tutorial_watched_insert
  on public.tutorial_watched for insert
  to authenticated
  with check (member_id = auth.uid());

-- app_settings: authenticated can read; admin writes
create policy app_settings_select
  on public.app_settings for select
  to authenticated
  using (true);

create policy app_settings_admin
  on public.app_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Grants
grant usage on schema public to authenticated, anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.recommendation_requests to authenticated;
grant select, insert on public.rec_progress to authenticated;
grant select, insert on public.rec_text_ledger to authenticated;
grant select, insert, update on public.google_reviews to authenticated;
grant select, insert, update on public.facebook_friends to authenticated;
grant select, insert, update on public.facebook_queue to authenticated;
grant select, insert, update on public.notifications to authenticated;
grant select, insert, update on public.messages to authenticated;
grant select, insert, update, delete on public.tutorial_sections to authenticated;
grant select, insert, update, delete on public.tutorial_videos to authenticated;
grant select, insert, update, delete on public.intro_settings to authenticated;
grant select, insert, update, delete on public.previous_intros to authenticated;
grant select, insert on public.tutorial_watched to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;
grant select on public.signup_applications to authenticated;

-- Realtime
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.recommendation_requests;
alter publication supabase_realtime add table public.rec_progress;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.tutorial_sections;
alter publication supabase_realtime add table public.tutorial_videos;
alter publication supabase_realtime add table public.intro_settings;
alter publication supabase_realtime add table public.google_reviews;
