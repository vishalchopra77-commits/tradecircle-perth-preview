-- Rate Buddies v2.2.2 build 16: web admin "Conversations" view (Vishal, 22 Nov 2026).
-- Admin-only list of every chat conversation with participants, last message, time and message count.
-- SECURITY DEFINER, but it refuses anyone who is not an admin (private.is_admin()). Read-only.
create or replace function public.admin_conversations(q text default null)
returns table (
  id uuid, kind text, title text, created_at timestamptz,
  participants jsonb, last_body text, last_sender uuid, last_at timestamptz, msg_count bigint
)
language plpgsql stable security definer
set search_path = public, pg_temp
as $$
begin
  if not private.is_admin() then
    raise exception 'Only an admin can list conversations' using errcode = '42501';
  end if;
  return query
  with parts as (
    select cm.conversation_id,
           jsonb_agg(jsonb_build_object('id', p.id,
                                        'name', trim(coalesce(p.first_name,'') || ' ' || coalesce(p.last_name,'')),
                                        'trade', coalesce(p.trade,''))
                     order by p.first_name) as participants,
           string_agg(lower(coalesce(p.first_name,'') || ' ' || coalesce(p.last_name,'') || ' ' || coalesce(p.business,'')), ' ') as hay
    from conversation_members cm
    join profiles p on p.id = cm.member_id
    group by cm.conversation_id
  ),
  stats as (
    select m.conversation_id, count(*) as n, max(m.created_at) as last_at
    from chat_messages m group by m.conversation_id
  ),
  lastm as (
    select distinct on (m.conversation_id) m.conversation_id, m.body, m.sender_id
    from chat_messages m order by m.conversation_id, m.created_at desc
  )
  select c.id, c.kind, c.title, c.created_at,
         coalesce(pa.participants, '[]'::jsonb), lm.body, lm.sender_id,
         coalesce(st.last_at, c.last_message_at, c.created_at), coalesce(st.n, 0)
  from conversations c
  left join parts pa on pa.conversation_id = c.id
  left join stats st on st.conversation_id = c.id
  left join lastm lm on lm.conversation_id = c.id
  where q is null or btrim(q) = ''
     or coalesce(pa.hay,'') like '%' || lower(btrim(q)) || '%'
     or lower(coalesce(c.title,'')) like '%' || lower(btrim(q)) || '%'
  order by coalesce(st.last_at, c.last_message_at, c.created_at) desc;
end;
$$;
revoke all on function public.admin_conversations(text) from public, anon;
grant execute on function public.admin_conversations(text) to authenticated;
