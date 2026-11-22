-- Rate Buddies v2.2.2 build 16: region group chats belong to the Rate Buddies admin, so deleting a member never
-- cascades a whole region group away (Hills + East groups were lost that way in the test-data cleanup; restored here).
do $$
declare adm uuid := (select a.user_id from public.admins a join public.profiles p on p.id = a.user_id where p.email = 'ratebuddies@gmail.com');
begin
  if adm is null then raise exception 'admin not found'; end if;
  update public.conversations set created_by = adm where kind = 'group' and dm_key like 'region:%';
  insert into public.conversations (kind, title, created_by, dm_key) values
    ('group', 'Hills group', adm, 'region:hills'), ('group', 'East group', adm, 'region:east')
    on conflict (dm_key) do nothing;
  -- every approved member is in the group for each region on their profile
  insert into public.conversation_members (conversation_id, member_id)
    select distinct c.id, p.id from public.profiles p
      cross join lateral unnest(coalesce(p.regions, '{}')) as r(reg)
      join public.conversations c on c.dm_key = 'region:' || lower(btrim(r.reg))
     where p.status = 'approved' and c.kind = 'group'
       and not exists (select 1 from public.admins a where a.user_id = p.id)
    on conflict do nothing;
end $$;

create or replace function public.join_region_groups() returns integer
language plpgsql security definer set search_path to '' as $function$
declare r text; cid uuid; n int := 0; me uuid := auth.uid();
        owner_id uuid := coalesce((select a.user_id from public.admins a join public.profiles p on p.id = a.user_id where p.email = 'ratebuddies@gmail.com'),
                                   (select a.user_id from public.admins a order by a.created_at limit 1), auth.uid());
begin
  if me is null or not private.is_approved() then return 0; end if;
  for r in select unnest(coalesce(regions, '{}')) from public.profiles where id = me loop
    if r is null or btrim(r) = '' then continue; end if;
    insert into public.conversations (kind, title, created_by, dm_key)
      values ('group', initcap(replace(btrim(r), '-', ' ')) || ' group', owner_id, 'region:' || lower(btrim(r)))
      on conflict (dm_key) do nothing;
    select id into cid from public.conversations where dm_key = 'region:' || lower(btrim(r));
    insert into public.conversation_members (conversation_id, member_id) values (cid, me) on conflict do nothing;
    n := n + 1;
  end loop;
  return n;
end $function$;
