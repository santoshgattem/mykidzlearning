-- 1. Mid-week reminders: the weekly_reminders table now remembers which kind was sent, so a student
--    can get one Wednesday reminder and one Saturday reminder in the same week.
alter table public.weekly_reminders add column kind text not null default 'final' check (kind in ('midweek', 'final'));
alter table public.weekly_reminders drop constraint weekly_reminders_pkey;
alter table public.weekly_reminders add primary key (student_id, week_start, kind);

-- 2. Parent account requests. A new parent (or an existing parent asking for a partner's account)
--    asks the admin to create an account. Only the server touches this table: RLS on, no policies.
create table public.parent_requests (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  phone        text,
  message      text,
  requested_by uuid references public.profiles(id) on delete set null,   -- null for a public request
  status       text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  created_at   timestamptz not null default now(),
  handled_at   timestamptz,
  handled_by   uuid references public.profiles(id) on delete set null
);
-- One open request per email address.
create unique index parent_requests_open_email_idx on public.parent_requests (lower(email)) where status = 'pending';
create index parent_requests_status_idx on public.parent_requests (status, created_at desc);
alter table public.parent_requests enable row level security;
