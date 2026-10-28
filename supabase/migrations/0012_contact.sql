-- Messages sent to the admin from the "Contact the admin" form on the main page. Server-only: RLS on, no policies.
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null check (char_length(full_name) <= 80),
  email      text not null check (char_length(email) <= 254),
  phone      text check (char_length(phone) <= 30),
  message    text not null check (char_length(message) between 1 and 1000),
  status     text not null default 'new' check (status in ('new', 'done')),
  created_at timestamptz not null default now(),
  handled_at timestamptz,
  handled_by uuid references public.profiles(id) on delete set null
);
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);
alter table public.contact_messages enable row level security;
