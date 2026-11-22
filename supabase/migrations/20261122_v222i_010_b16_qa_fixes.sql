-- Rate Buddies v2.2.2 build 16 — QA sweep fixes (test project ztniuyeovcdspbmobvip only)
-- #1  suspended / rejected accounts lose member access: member-side RLS also requires an approved account
-- #9  friend request -> notification to the recipient; only the recipient (or an admin) can confirm
-- #33 swap / review notifications say who; #39 admin support reply -> notification; #52 feature idea status -> notification
-- #43 / #45 member status changes are audited server-side with the member's name, with an optional reason and a member notice
-- #25 real "last seen" (member_presence, not in realtime so heartbeats don't wake every phone)
-- #7  delete my account: archive copy first, then remove the login (same pattern as admin-delete-member)

-- ---------- #1 RLS ----------
alter policy chat_messages_select on public.chat_messages
  using ((private.is_conversation_member(conversation_id) and hidden = false and (select private.is_approved())) or (select private.is_admin()));
alter policy chat_messages_update on public.chat_messages
  using ((sender_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()))
  with check ((sender_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));
alter policy conv_members_select on public.conversation_members
  using ((private.is_conversation_member(conversation_id) and (select private.is_approved())) or (select private.is_admin()));
alter policy conv_members_update_own on public.conversation_members
  using (member_id = (select auth.uid()) and (select private.is_approved()))
  with check (member_id = (select auth.uid()) and (select private.is_approved()));
alter policy conversations_select on public.conversations
  using (((created_by = (select auth.uid()) or private.is_conversation_member(id)) and (select private.is_approved())) or (select private.is_admin()));
alter policy conversations_update on public.conversations
  using ((created_by = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()))
  with check ((created_by = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));
alter policy google_reviews_select on public.google_reviews
  using ((select private.is_admin()) or ((from_member_id = (select auth.uid()) or to_member_id = (select auth.uid())) and (select private.is_approved())));
alter policy google_reviews_update on public.google_reviews
  using ((from_member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()))
  with check ((from_member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));
alter policy review_swaps_select on public.review_swaps
  using (((requester_id = (select auth.uid()) or recipient_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()));
alter policy review_swaps_update on public.review_swaps
  using (((requester_id = (select auth.uid()) or recipient_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()))
  with check (((requester_id = (select auth.uid()) or recipient_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()));
alter policy fb_friends_insert on public.facebook_friends
  with check ((from_member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));
alter policy fb_friends_select on public.facebook_friends
  using ((select private.is_admin()) or ((from_member_id = (select auth.uid()) or to_member_id = (select auth.uid())) and (select private.is_approved())));
alter policy fb_friends_update on public.facebook_friends
  using (((from_member_id = (select auth.uid()) or to_member_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()))
  with check (((from_member_id = (select auth.uid()) or to_member_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()));
alter policy messages_select on public.messages
  using (((from_id = (select auth.uid()) or to_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()));
alter policy messages_insert on public.messages
  with check (from_id = (select auth.uid()) and (select private.is_approved()));
alter policy messages_update on public.messages
  using (((to_id = (select auth.uid()) or from_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()))
  with check (((to_id = (select auth.uid()) or from_id = (select auth.uid())) and (select private.is_approved())) or (select private.is_admin()));
alter policy reminders_own on public.google_review_reminders
  using ((member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()))
  with check ((member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));
alter policy fb_queue_update on public.facebook_queue
  using ((select private.is_admin()) or (member_id = (select auth.uid()) and status = 'waiting' and (select private.is_approved())));
alter policy facebook_vouches_update on public.facebook_vouches
  using ((to_member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()))
  with check ((to_member_id = (select auth.uid()) and (select private.is_approved())) or (select private.is_admin()));

-- helper: a member's display name
create or replace function private.member_name(m uuid) returns text
language sql stable security definer set search_path = '' as $$
  select coalesce(nullif(trim(coalesce(p.first_name,'') || ' ' || coalesce(p.last_name,'')), ''), 'A member')
  from public.profiles p where p.id = m
$$;
revoke all on function private.member_name(uuid) from public, anon;

-- ---------- #33 notifications say who ----------
create or replace function public.review_swaps_notify() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.recipient_id, coalesce(private.member_name(new.requester_id), 'A member') || ' asked you for a Google Review swap',
            case when new.note <> '' then left(new.note, 140) else 'Open Reviews to see it.' end,
            'swap_request', jsonb_build_object('swap_id', new.id, 'from', new.requester_id));
  end if;
  return null;
end;
$$;

create or replace function public.google_reviews_after_done() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status is distinct from 'done') then
    update public.profiles set reviews_received_count = reviews_received_count + 1 where id = new.to_member_id;
    update public.profiles set reviews_given_count = reviews_given_count + 1 where id = new.from_member_id;
    if new.swap_id is not null then
      update public.review_swaps s set status = case
          when exists (select 1 from public.google_reviews g where g.swap_id = s.id and g.status = 'done'
                        and g.from_member_id = s.requester_id)
           and exists (select 1 from public.google_reviews g where g.swap_id = s.id and g.status = 'done'
                        and g.from_member_id = s.recipient_id)
          then 'swapped' else 'recipient_done' end
       where s.id = new.swap_id and s.status in ('pending', 'accepted', 'recipient_done');
    end if;
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.to_member_id, coalesce(private.member_name(new.from_member_id), 'A member') || ' left you a Google Review',
            coalesce(private.member_name(new.from_member_id), 'A member') || ' marked a Google Review for you as done.',
            'review_done', jsonb_build_object('review_id', new.id, 'from', new.from_member_id));
  end if;
  return null;
end;
$$;

-- ---------- #9 / #29 Facebook friend requests ----------
create or replace function public.facebook_friends_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null or private.is_admin() then return new; end if;
  if tg_op = 'INSERT' and new.status = 'added' then
    new.status := 'requested';            -- a new request always starts as "requested"
  end if;
  if tg_op = 'UPDATE' and new.status = 'added' and old.status is distinct from 'added'
     and (select auth.uid()) = old.from_member_id then
    raise exception 'Only the person you asked can confirm the friend request.' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger if exists facebook_friends_guard_biu on public.facebook_friends;
create trigger facebook_friends_guard_biu before insert or update on public.facebook_friends
  for each row execute function public.facebook_friends_guard();

create or replace function public.facebook_friends_notify() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'requested' and (tg_op = 'INSERT' or old.status is distinct from 'requested') then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.to_member_id, private.member_name(new.from_member_id) || ' sent you a Facebook friend request',
            'Accept it on Facebook, then tap Confirm under Facebook › Circle.',
            'friend_request', jsonb_build_object('friend_id', new.id, 'from', new.from_member_id));
  elsif tg_op = 'UPDATE' and new.status = 'added' and old.status is distinct from 'added' then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.from_member_id, private.member_name(new.to_member_id) || ' confirmed your friend request',
            'You are now Facebook friends in Rate Buddies.',
            'friend_added', jsonb_build_object('friend_id', new.id, 'from', new.to_member_id));
  end if;
  return null;
end;
$$;
drop trigger if exists facebook_friends_notify_aiu on public.facebook_friends;
create trigger facebook_friends_notify_aiu after insert or update on public.facebook_friends
  for each row execute function public.facebook_friends_notify();

-- ---------- #39 admin support reply -> member notification ----------
create or replace function public.support_messages_notify() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.from_admin then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.member_id, 'Rate Buddies Support replied', left(new.body, 140), 'support',
            jsonb_build_object('support_id', new.id));
  end if;
  return null;
end;
$$;
drop trigger if exists support_messages_notify_ai on public.support_messages;
create trigger support_messages_notify_ai after insert on public.support_messages
  for each row execute function public.support_messages_notify();

-- ---------- #52 feature idea status -> author notification ----------
create or replace function public.feature_requests_notify() returns trigger
language plpgsql security definer set search_path = '' as $$
declare lab text;
begin
  if (new.status is distinct from old.status or new.status_reason is distinct from old.status_reason) and new.author_id is not null then
    lab := case new.status when 'under_review' then 'Under review' when 'planned' then 'Planned' when 'in_progress' then 'In progress'
                when 'released' then 'Released' when 'declined' then 'Declined' when 'archived' then 'Archived' else new.status end;
    insert into public.notifications (member_id, title, body, kind, payload)
    values (new.author_id, 'Your idea is now ' || lab,
            left('"' || new.title || '"' || case when coalesce(new.status_reason, '') <> '' then ' · ' || new.status_reason else '' end, 200),
            'feature', jsonb_build_object('feature_id', new.id, 'status', new.status));
  end if;
  return null;
end;
$$;
drop trigger if exists feature_requests_notify_au on public.feature_requests;
create trigger feature_requests_notify_au after update on public.feature_requests
  for each row execute function public.feature_requests_notify();

-- ---------- #43 / #45 member status with name, reason and member notice ----------
create or replace function public.admin_set_member_status_v2(target uuid, new_status text, reason text default null)
returns public.profiles
language plpgsql security definer set search_path = 'public' as $$
declare rec public.profiles; prev text; nm text; why text := nullif(trim(coalesce(reason, '')), '');
begin
  if not public.is_admin() then raise exception 'Only admins can change member status'; end if;
  if new_status not in ('pending', 'approved', 'rejected', 'suspended') then raise exception 'Invalid status'; end if;
  if target = auth.uid() then raise exception 'You cannot change your own membership status this way'; end if;
  select status into prev from public.profiles where id = target;
  if prev is null then raise exception 'Member not found'; end if;
  update public.profiles set status = new_status,
    approved_at = case when new_status = 'approved' and prev in ('pending', 'rejected') then now() else approved_at end,
    approved_by = case when new_status = 'approved' and prev in ('pending', 'rejected') then auth.uid() else approved_by end,
    extras = case
      when new_status = 'suspended' then coalesce(extras, '{}'::jsonb) || jsonb_build_object('suspension', jsonb_build_object('reason', coalesce(why, ''), 'at', now()))
      when new_status = 'approved' then coalesce(extras, '{}'::jsonb) - 'suspension'
      else extras end
  where id = target returning * into rec;
  nm := private.member_name(target);
  if new_status = 'approved' and prev in ('pending', 'rejected') then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (target, 'You’re in', 'Your Rate Buddies profile has been approved. Watch the intro to get started.', 'approved', jsonb_build_object('status', 'approved'));
  elsif new_status = 'approved' and prev = 'suspended' then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (target, 'Your account is active again', 'Welcome back. You can use Rate Buddies again.', 'account', jsonb_build_object('status', 'approved'));
  elsif new_status = 'suspended' then
    insert into public.notifications (member_id, title, body, kind, payload)
    values (target, 'Your account is suspended', coalesce('Reason: ' || why, 'Contact Rate Buddies if you think this is a mistake.'), 'account', jsonb_build_object('status', 'suspended'));
  end if;
  insert into public.admin_audit (admin_id, action, target)
  values (auth.uid(),
          case when new_status = 'approved' and prev = 'suspended' then 'Reactivated a member'
               when new_status = 'approved' then 'Approved a member'
               when new_status = 'rejected' then 'Declined a member'
               when new_status = 'suspended' then 'Suspended a member'
               else 'Set a member to ' || new_status end,
          left(nm || coalesce(' · reason: ' || why, ''), 300));
  return rec;
end; $$;
revoke all on function public.admin_set_member_status_v2(uuid, text, text) from public, anon;
grant execute on function public.admin_set_member_status_v2(uuid, text, text) to authenticated;

-- the old 2-argument RPC (used by Approve / Decline) now goes through the same audited path
create or replace function public.admin_set_member_status(target uuid, new_status text)
returns public.profiles
language sql security definer set search_path = 'public' as $$
  select public.admin_set_member_status_v2(target, new_status, null);
$$;

-- ---------- #25 last seen ----------
create table if not exists public.member_presence (
  member_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);
alter table public.member_presence enable row level security;
drop policy if exists member_presence_select on public.member_presence;
create policy member_presence_select on public.member_presence for select to authenticated
  using ((select private.is_approved()) or (select private.is_admin()));
create or replace function public.touch_presence() returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare t timestamptz := now();
begin
  if (select auth.uid()) is null or not private.is_approved() then return null; end if;
  insert into public.member_presence (member_id, last_seen_at) values ((select auth.uid()), t)
  on conflict (member_id) do update set last_seen_at = excluded.last_seen_at;
  return t;
end; $$;
revoke all on function public.touch_presence() from public, anon;
grant execute on function public.touch_presence() to authenticated;

-- ---------- #7 delete my account ----------
create or replace function public.delete_my_account(confirm text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); prof public.profiles; au record; arch uuid; nm text;
begin
  if uid is null then raise exception 'Please sign in again.' using errcode = '42501'; end if;
  if upper(coalesce(confirm, '')) <> 'DELETE' then raise exception 'Type DELETE to confirm.'; end if;
  if exists (select 1 from public.admins where user_id = uid) then raise exception 'Admin accounts can''t be deleted from the app.'; end if;
  select * into prof from public.profiles where id = uid;
  select id, email, phone, created_at, last_sign_in_at, raw_user_meta_data, raw_app_meta_data into au from auth.users where id = uid;
  nm := coalesce(nullif(trim(coalesce(prof.first_name,'') || ' ' || coalesce(prof.last_name,'')), ''), au.email);
  insert into public.deleted_members_archive (member_id, email, profile, auth_user, deleted_by, note)
  values (uid, coalesce(au.email, prof.email), coalesce(to_jsonb(prof), '{}'::jsonb),
          case when au.id is null then null else jsonb_build_object('id', au.id, 'email', au.email, 'phone', au.phone, 'created_at', au.created_at,
               'last_sign_in_at', au.last_sign_in_at, 'user_metadata', au.raw_user_meta_data, 'app_metadata', au.raw_app_meta_data) end,
          uid, 'Deleted by the member in the app')
  returning id into arch;
  insert into public.admin_audit (admin_id, action, target) values (null, 'A member deleted their account (archived)', left(coalesce(nm, '') || coalesce(' · ' || au.email, ''), 300));
  delete from auth.users where id = uid;   -- profile and the member's own rows go with it by cascade
  return jsonb_build_object('ok', true, 'archive_id', arch);
end; $$;
revoke all on function public.delete_my_account(text) from public, anon;
grant execute on function public.delete_my_account(text) to authenticated;
