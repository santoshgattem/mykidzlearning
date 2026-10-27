-- Remembers which students were sent the weekly reminder, so a retry never sends twice.
-- Only the server (service role) touches this table; RLS is on with no policies.
create table public.weekly_reminders (
  student_id uuid not null references public.students(id) on delete cascade,
  week_start date not null,
  done_count integer not null,
  sent_at    timestamptz not null default now(),
  primary key (student_id, week_start)
);
alter table public.weekly_reminders enable row level security;
