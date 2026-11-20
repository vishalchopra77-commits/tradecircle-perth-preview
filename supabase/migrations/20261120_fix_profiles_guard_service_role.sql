-- Already applied on Rate Buddies Test as migration fix_profiles_guard_service_role.
-- Lets service-role / SQL seed updates through (auth.uid() is null).
-- Members still cannot self-assign admin or approved; nobody can change their own role.

create or replace function public.profiles_guard()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  -- Unauthenticated / service-role SQL may seed or repair rows.
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.id := auth.uid();
      new.role := 'member';
      new.status := 'pending';
      new.approved_at := null;
      new.approved_by := null;
    end if;
    return new;
  end if;

  -- Nobody can change their own role (including admins).
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
