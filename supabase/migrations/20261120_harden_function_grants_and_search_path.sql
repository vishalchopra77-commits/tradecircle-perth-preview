-- Already applied on Rate Buddies Test as migration harden_function_grants_and_search_path.
-- Locks search_path on remaining functions and tightens EXECUTE grants.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.google_reviews_daily_cap() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.profiles_guard() from public, anon, authenticated;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_approved() from public, anon;
revoke all on function public.admin_set_member_status(uuid, text) from public, anon;
revoke all on function public.admin_approve_request(uuid, uuid) from public, anon;
revoke all on function public.admin_dismiss_request(uuid) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_approved() to authenticated;
grant execute on function public.admin_set_member_status(uuid, text) to authenticated;
grant execute on function public.admin_approve_request(uuid, uuid) to authenticated;
grant execute on function public.admin_dismiss_request(uuid) to authenticated;
