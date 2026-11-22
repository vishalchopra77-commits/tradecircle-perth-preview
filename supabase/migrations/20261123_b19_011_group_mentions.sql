-- b19 (applied 23 Nov 2026): @mentions in group chats notify the member mentioned.
-- Found in the b18 two-member E2E: the app has a "Group mentions" notification setting, but nothing in live mode
-- ever created a mention notification. Matches "@First" or "@First Last" (case-insensitive) for members of the group,
-- never the sender, at most one notification per message per member, skipped for muted members.
create or replace function public.chat_messages_mentions() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r record; v_kind text; v_title text;
begin
  select c.kind, c.title into v_kind, v_title from public.conversations c where c.id = new.conversation_id;
  if v_kind is distinct from 'group' or new.body is null or position('@' in new.body) = 0 then return null; end if;
  for r in
    select cm.member_id, p.first_name, p.last_name
    from public.conversation_members cm join public.profiles p on p.id = cm.member_id
    where cm.conversation_id = new.conversation_id and cm.member_id <> new.sender_id and coalesce(cm.muted, false) = false
  loop
    if coalesce(r.first_name, '') <> '' and (
         new.body ~* ('@' || regexp_replace(r.first_name, '([.^$*+?()\[\]{}|\\])', '\\\1', 'g') || '(\M|$)')
      or new.body ~* ('@' || regexp_replace(trim(r.first_name || ' ' || coalesce(r.last_name, '')), '([.^$*+?()\[\]{}|\\])', '\\\1', 'g'))) then
      insert into public.notifications (member_id, title, body, kind, payload)
      values (r.member_id,
              coalesce(private.member_name(new.sender_id), 'A member') || ' mentioned you in ' || coalesce(nullif(v_title, ''), 'a group'),
              left(new.body, 140), 'mention',
              jsonb_build_object('conversation_id', new.conversation_id, 'message_id', new.id, 'from', new.sender_id));
    end if;
  end loop;
  return null;
end;
$$;
drop trigger if exists chat_messages_mentions on public.chat_messages;
create trigger chat_messages_mentions after insert on public.chat_messages
  for each row execute function public.chat_messages_mentions();
