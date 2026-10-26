-- Phase 6 security hardening. Run in Supabase SQL Editor after 0003.

-- ---------------------------------------------------------------- sign-in throttling
-- Counts attempts per key (a hashed email, an IP address). Atomic, so parallel guesses
-- cannot slip past the limit. Server only: no policies, and execute is limited to the
-- service role.
create table public.rate_limit_hits (
  id         bigint generated always as identity primary key,
  key        text not null,
  created_at timestamptz not null default now()
);
create index rate_limit_hits_key_idx on public.rate_limit_hits (key, created_at desc);
alter table public.rate_limit_hits enable row level security;
revoke all on public.rate_limit_hits from anon, authenticated;

-- Returns true if the attempt is allowed (and records it), false if the key is over its limit.
create function public.rate_limit_hit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  n integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  select count(*) into n from public.rate_limit_hits
   where key = p_key and created_at > now() - make_interval(secs => p_window_seconds);
  if n >= p_max then
    return false;
  end if;
  insert into public.rate_limit_hits (key) values (p_key);
  if random() < 0.02 then
    delete from public.rate_limit_hits where created_at < now() - interval '2 days';
  end if;
  return true;
end $$;

-- A correct sign-in clears that key's history.
create function public.rate_limit_reset(p_key text) returns void
language sql security definer set search_path = public as $$
  delete from public.rate_limit_hits where key = p_key
$$;

-- ---------------------------------------------------------------- ending sessions
-- Used when a password or PIN is reset, an account is disabled, or a child is removed.
-- Deleting the sessions stops the browser from refreshing its login; a token already issued
-- stops working within the hour, and disabled accounts are blocked immediately by RLS.
create function public.revoke_user_sessions(p_user uuid) returns void
language sql security definer set search_path = public, auth as $$
  delete from auth.sessions where user_id = p_user
$$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.rate_limit_reset(text) from public, anon, authenticated;
revoke all on function public.revoke_user_sessions(uuid) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.rate_limit_reset(text) to service_role;
grant execute on function public.revoke_user_sessions(uuid) to service_role;
