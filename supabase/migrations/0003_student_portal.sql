-- Student portal: test timer and reward celebrations. Run in Supabase SQL Editor after 0002.

-- The test deadline lives on the server so leaving and returning does not reset the clock.
alter table public.test_sessions
  add column if not exists deadline      timestamptz not null default now(),
  add column if not exists limit_seconds integer     not null default 0;

-- A reached milestone is celebrated once; the student portal shows the celebration
-- until celebrated_at is set (this also covers points a parent gave while offline).
alter table public.milestones
  add column if not exists celebrated_at timestamptz;
