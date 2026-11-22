-- Rate Buddies v2.2.2 build 16 - QA #49: members can create a real group chat.
create or replace function public.create_group_chat(p_title text, p_members uuid[])
returns uuid
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  me uuid := auth.uid();
  cid uuid;
  t text := btrim(coalesce(p_title, ''));
  ids uuid[];
  my_name text;
begin
  if me is null or not private.is_approved() then
    raise exception 'Only approved members can create a group' using errcode = '42501';
  end if;
  if length(t) < 2 or length(t) > 60 then
    raise exception 'Give the group a name (2 to 60 characters)' using errcode = '22023';
  end if;
  select coalesce(array_agg(distinct p.id), '{}') into ids
    from profiles p
   where p.id = any(coalesce(p_members, '{}')) and p.id <> me and p.status = 'approved'
     and not exists (select 1 from admins a where a.user_id = p.id);
  if coalesce(array_length(ids, 1), 0) < 1 then
    raise exception 'Pick at least one member' using errcode = '22023';
  end if;
  if array_length(ids, 1) > 49 then
    raise exception 'A group can have up to 50 members' using errcode = '22023';
  end if;
  insert into conversations (kind, title, created_by) values ('group', t, me) returning id into cid;
  insert into conversation_members (conversation_id, member_id, role) values (cid, me, 'owner');
  insert into conversation_members (conversation_id, member_id, role) select cid, x, 'member' from unnest(ids) x;
  select trim(coalesce(first_name,'') || ' ' || coalesce(last_name,'')) into my_name from profiles where id = me;
  insert into notifications (member_id, title, body, kind, payload)
    select x, coalesce(nullif(my_name, ''), 'A member') || ' added you to "' || t || '"', 'Open Chats to say hello.', 'group_added',
           jsonb_build_object('conversation_id', cid, 'by', me)
      from unnest(ids) x;
  return cid;
end;
$$;
revoke all on function public.create_group_chat(text, uuid[]) from public, anon;
grant execute on function public.create_group_chat(text, uuid[]) to authenticated;
