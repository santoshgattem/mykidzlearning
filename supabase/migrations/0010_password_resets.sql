-- One-time email codes for resetting an admin password. Only a keyed hash of each code is stored,
-- never the code itself. Server-only: RLS on, no policies.
create table public.password_resets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   integer not null default 0,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index password_resets_user_idx on public.password_resets (user_id, created_at desc);
alter table public.password_resets enable row level security;
