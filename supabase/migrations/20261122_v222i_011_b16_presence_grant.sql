-- v2.2.2 b16: member_presence needs an explicit SELECT grant (project revokes defaults); writes go through touch_presence()
grant select on public.member_presence to authenticated;
