-- Rate Buddies v2.2.2 build 16 - QA #14 (FCM push, code side), #44 (Devi webhook), #47 (AI assistant wiring).
-- Push stays OFF until an admin turns on app_settings.push_enabled (after google-services.json + the FCM service account are added).

-- ---------- #14 device tokens ----------
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android' check (platform in ('android','ios','web')),
  app_version text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists device_tokens_member_idx on public.device_tokens(member_id);
alter table public.device_tokens enable row level security;
drop policy if exists device_tokens_own_select on public.device_tokens;
drop policy if exists device_tokens_own_insert on public.device_tokens;
drop policy if exists device_tokens_own_update on public.device_tokens;
drop policy if exists device_tokens_own_delete on public.device_tokens;
create policy device_tokens_own_select on public.device_tokens for select to authenticated using (member_id = (select auth.uid()) or (select private.is_admin()));
create policy device_tokens_own_insert on public.device_tokens for insert to authenticated with check (member_id = (select auth.uid()));
create policy device_tokens_own_update on public.device_tokens for update to authenticated using (member_id = (select auth.uid())) with check (member_id = (select auth.uid()));
create policy device_tokens_own_delete on public.device_tokens for delete to authenticated using (member_id = (select auth.uid()));
grant select, insert, update, delete on public.device_tokens to authenticated;

-- register (or move) a token to the signed-in member; a phone that changes hands moves to the new member
create or replace function public.register_device_token(p_token text, p_platform text default 'android', p_version text default null)
returns void language plpgsql security definer set search_path to 'public','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in first' using errcode = '42501'; end if;
  if length(coalesce(p_token,'')) < 20 then raise exception 'Bad token' using errcode = '22023'; end if;
  insert into device_tokens (member_id, token, platform, app_version)
    values (auth.uid(), p_token, coalesce(nullif(p_platform,''),'android'), p_version)
  on conflict (token) do update set member_id = excluded.member_id, platform = excluded.platform, app_version = excluded.app_version, last_seen_at = now();
end $$;
revoke all on function public.register_device_token(text,text,text) from public, anon;
grant execute on function public.register_device_token(text,text,text) to authenticated;

-- push bookkeeping on notifications (the sender marks rows so a row is pushed once)
alter table public.notifications add column if not exists push_status text;
alter table public.notifications add column if not exists pushed_at timestamptz;

-- ---------- private secrets (never exposed through the API) ----------
create table if not exists private.integration_secrets (key text primary key, value text not null, updated_at timestamptz not null default now());
revoke all on private.integration_secrets from public, anon, authenticated;

-- ---------- push trigger: notifications + chat messages -> Edge Function push-send (only when push_enabled) ----------
create extension if not exists pg_net with schema extensions;
create or replace function private.push_hook() returns trigger language plpgsql security definer set search_path to 'public','pg_temp' as $$
declare on_ boolean; url text;
begin
  select coalesce((value)::text in ('true','"true"'), false) into on_ from public.app_settings where key = 'push_enabled';
  if not coalesce(on_, false) then return new; end if;
  url := 'https://ztniuyeovcdspbmobvip.supabase.co/functions/v1/push-send';
  perform net.http_post(url := url, body := jsonb_build_object('table', TG_TABLE_NAME, 'id', new.id), headers := '{"Content-Type":"application/json"}'::jsonb, timeout_milliseconds := 4000);
  return new;
exception when others then return new; -- never block the insert because of push
end $$;
drop trigger if exists notifications_push on public.notifications;
create trigger notifications_push after insert on public.notifications for each row execute function private.push_hook();
drop trigger if exists chat_messages_push on public.chat_messages;
create trigger chat_messages_push after insert on public.chat_messages for each row execute function private.push_hook();

-- ---------- #44 Devi webhook ----------
create or replace function public.admin_devi_token(rotate boolean default false)
returns text language plpgsql security definer set search_path to 'private','public','pg_temp' as $$
declare t text;
begin
  if not private.is_admin() then raise exception 'Only an admin' using errcode = '42501'; end if;
  select value into t from private.integration_secrets where key = 'devi_token';
  if t is null or rotate then
    t := encode(extensions.gen_random_bytes(24), 'hex');
    insert into private.integration_secrets(key, value) values ('devi_token', t)
      on conflict (key) do update set value = excluded.value, updated_at = now();
  end if;
  return t;
end $$;
revoke all on function public.admin_devi_token(boolean) from public, anon;
grant execute on function public.admin_devi_token(boolean) to authenticated;

-- called only by the devi-webhook Edge Function (service role)
create or replace function public.devi_ingest(p_token text, p jsonb)
returns uuid language plpgsql security definer set search_path to 'private','public','pg_temp' as $$
declare t text; rid uuid; link text := btrim(coalesce(p->>'post_link', p->>'url', ''));
begin
  select value into t from private.integration_secrets where key = 'devi_token';
  if t is null or p_token is distinct from t then raise exception 'Bad token' using errcode = '42501'; end if;
  if link !~* '^https://([a-z0-9-]+\.)*facebook\.com/' then raise exception 'post_link must be a facebook.com link' using errcode = '22023'; end if;
  select id into rid from public.recommendation_requests where post_link = link limit 1;
  if rid is not null then return rid; end if;
  insert into public.recommendation_requests (post_link, group_name, snippet, ask, trade, city, suburb, status, confidence, source, created_by)
  values (link, left(coalesce(p->>'group_name',''),120), left(coalesce(p->>'snippet',''),500), left(coalesce(p->>'ask', p->>'snippet',''),300),
          left(coalesce(p->>'trade',''),60), left(coalesce(p->>'city','Perth'),60), left(coalesce(p->>'suburb',''),60), 'pending',
          least(100, greatest(0, coalesce((p->>'confidence')::int, 0))), 'devi', null)
  returning id into rid;
  insert into public.app_settings(key, value, updated_at) values ('devi_last_alert', to_jsonb(now()), now())
    on conflict (key) do update set value = excluded.value, updated_at = now();
  return rid;
end $$;
revoke all on function public.devi_ingest(text, jsonb) from public, anon, authenticated;
grant execute on function public.devi_ingest(text, jsonb) to service_role;
