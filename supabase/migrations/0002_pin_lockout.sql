-- Student PIN lockout. Run in Supabase SQL Editor after 0001.
--
-- begin_pin_attempt() is called BEFORE each PIN check. It counts the attempt in the same
-- transaction (row-locked), so parallel guesses cannot slip past the limit. After p_max
-- attempts in a row the account is locked for p_lock_minutes. A correct PIN resets the
-- counter (done by the sign-in route).

create function public.begin_pin_attempt(p_student uuid, p_max integer, p_lock_minutes integer)
returns table (allowed boolean, locked_until timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  s         public.students%rowtype;
  new_count integer;
begin
  select * into s from public.students where id = p_student for update;
  if not found then
    return query select false, null::timestamptz;
    return;
  end if;

  if s.pin_locked_until is not null and s.pin_locked_until > now() then
    return query select false, s.pin_locked_until;
    return;
  end if;

  -- An expired lock starts a fresh window.
  if s.pin_locked_until is not null then
    s.pin_failed_count := 0;
  end if;

  new_count := s.pin_failed_count + 1;
  update public.students
     set pin_failed_count = new_count,
         pin_locked_until = case when new_count >= p_max
                                 then now() + make_interval(mins => p_lock_minutes)
                                 else null end
   where id = p_student;

  return query select true, null::timestamptz;
end $$;

revoke all on function public.begin_pin_attempt(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.begin_pin_attempt(uuid, integer, integer) to service_role;
