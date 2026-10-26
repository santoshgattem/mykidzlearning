-- mykidzlearning.com: initial schema, helper functions and Row Level Security.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
--
-- Access model
--   * The browser (anon/authenticated keys) can only READ, and only what RLS allows.
--   * Parents may also write their own children's milestones and video links.
--   * Everything that changes points, progress, accounts or test state goes through
--     Next.js server routes that use the service role key (which bypasses RLS)
--     after checking who is calling.
--   * Correct answers live in question_answers, which no browser role can read.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- enums
create type public.user_role       as enum ('admin', 'parent', 'student');
create type public.badge_tier      as enum ('bronze', 'silver', 'gold', 'diamond');
create type public.notebook_status as enum ('none', 'pending', 'approved', 'redo');
create type public.question_kind   as enum ('mcq', 'fib', 'written');

-- ---------------------------------------------------------------- accounts
-- One row per auth.users row. Passwords/PINs are never stored here: Supabase Auth
-- keeps the bcrypt hash.
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  role                 public.user_role not null,
  full_name            text not null,
  email                text not null unique,
  phone                text,
  must_change_password boolean not null default false,
  disabled             boolean not null default false,
  created_by           uuid references public.profiles(id) on delete set null,
  created_at           timestamptz not null default now()
);

create table public.students (
  id                uuid primary key references public.profiles(id) on delete cascade,
  parent_id         uuid not null references public.profiles(id) on delete cascade,
  grade             smallint check (grade in (11, 12)),
  grp               text check (grp in ('PCM', 'PCB', 'PCMB')),
  points            integer not null default 0 check (points >= 0),
  preferred_channel text not null default 'Physics Wallah',
  pin_failed_count  integer not null default 0,
  pin_locked_until  timestamptz,
  created_at        timestamptz not null default now()
);
create index students_parent_idx on public.students(parent_id);

-- ---------------------------------------------------------------- content
create table public.subjects (
  id        text primary key,            -- phy, chem, math, bio
  name      text not null,
  emoji     text not null,
  color_key text not null,               -- phy | chem | math | bio (maps to CSS tokens)
  position  smallint not null
);

create table public.group_subjects (
  grp        text not null check (grp in ('PCM', 'PCB', 'PCMB')),
  subject_id text not null references public.subjects(id) on delete cascade,
  primary key (grp, subject_id)
);

create table public.chapters (
  id                text primary key,    -- p1, c2, m3 ... (same ids as the prototype)
  subject_id        text not null references public.subjects(id) on delete cascade,
  grade             smallint not null default 11,
  position          smallint not null,   -- order inside the subject; drives unlocking
  title             text not null,
  default_video_url text not null default '',
  unique (subject_id, grade, position)
);

create table public.chapter_practice (
  chapter_id text not null references public.chapters(id) on delete cascade,
  position   smallint not null,
  prompt     text not null,
  primary key (chapter_id, position)
);

-- Question text and options. Students never read this table directly; the test route
-- picks questions and sends only prompt + options.
create table public.questions (
  id         uuid primary key default gen_random_uuid(),
  chapter_id text not null references public.chapters(id) on delete cascade,
  kind       public.question_kind not null,
  level      smallint not null default 1 check (level between 1 and 4),
  prompt     text not null,
  options    jsonb,                      -- mcq only: ["a","b","c","d"]
  created_at timestamptz not null default now(),
  check ((kind = 'mcq') = (options is not null))
);
create index questions_pick_idx on public.questions(chapter_id, kind, level);

-- Answer key. No policies for browser roles = unreadable from the browser.
create table public.question_answers (
  question_id      uuid primary key references public.questions(id) on delete cascade,
  correct_index    smallint,             -- mcq
  accepted_answers text[],               -- fib (compared after normalising)
  key_ideas        text[]                -- written: grader guidance + basic fallback terms
);

-- ---------------------------------------------------------------- student data
create table public.chapter_progress (
  student_id       uuid not null references public.students(id) on delete cascade,
  chapter_id       text not null references public.chapters(id) on delete cascade,
  watched_at       timestamptz,
  completed_level  smallint check (completed_level between 1 and 4),
  completed_points integer not null default 0,
  completed_at     timestamptz,
  notebook_status  public.notebook_status not null default 'none',
  primary key (student_id, chapter_id)
);

-- The test in progress (prototype: kid.quiz). Correct answers stay locked in here.
create table public.test_sessions (
  student_id   uuid primary key references public.students(id) on delete cascade,
  chapter_id   text not null references public.chapters(id) on delete cascade,
  level        smallint not null check (level between 1 and 4),
  question_ids jsonb not null,           -- {"mcq":[uuid..],"fib":[uuid..],"written":uuid}
  ok           jsonb not null default '{"mcq":{},"fib":{},"written":false}',
  answers      jsonb not null default '{"mcq":{},"fib":{},"written":""}',
  tries        integer not null default 0,
  feedback     text,
  graded_by    text,
  updated_at   timestamptz not null default now()
);

-- Recorded only when a test reaches 100%.
create table public.test_attempts (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.students(id) on delete cascade,
  chapter_id     text not null references public.chapters(id) on delete cascade,
  level          smallint not null check (level between 1 and 4),
  tries          integer not null,
  written_answer text not null default '',
  feedback       text not null default '',
  graded_by      text check (graded_by in ('ai', 'basic', 'length')),
  created_at     timestamptz not null default now()
);
create index test_attempts_student_idx on public.test_attempts(student_id, created_at desc);

create table public.point_ledger (
  id         bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  amount     integer not null,
  reason     text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index point_ledger_student_idx on public.point_ledger(student_id, created_at desc);

-- ---------------------------------------------------------------- parent settings
create table public.milestones (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  points     integer not null check (points > 0),
  reward     text not null,
  tier       public.badge_tier not null,
  given_at   timestamptz,
  created_at timestamptz not null default now()
);
create index milestones_student_idx on public.milestones(student_id, points);

create table public.chapter_video_links (
  student_id uuid not null references public.students(id) on delete cascade,
  chapter_id text not null references public.chapters(id) on delete cascade,
  url        text not null,
  primary key (student_id, chapter_id)
);

-- ---------------------------------------------------------------- rate limiting
-- /api/grade rate limit per student (count rows in the last N minutes).
create table public.grade_requests (
  id         bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index grade_requests_student_idx on public.grade_requests(student_id, created_at desc);

-- ---------------------------------------------------------------- helper functions
-- SECURITY DEFINER so they can read profiles without recursing through RLS.
create function public.current_role_name() returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = (select auth.uid())
$$;

-- False for disabled accounts, and for students whose parent is disabled.
create function public.account_active() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select not p.disabled
       and (p.role <> 'student' or not exists (
             select 1 from public.students s
             join public.profiles pp on pp.id = s.parent_id
             where s.id = p.id and pp.disabled))
    from public.profiles p where p.id = (select auth.uid())
  ), false)
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.account_active() and public.current_role_name() = 'admin'
$$;

create function public.is_my_child(sid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.account_active() and exists (
    select 1 from public.students s
    where s.id = sid and s.parent_id = (select auth.uid()))
$$;

-- The only way points change. Clamps at 0 (as the prototype does) and writes the
-- ledger row in the same transaction. Server only.
create function public.add_points(p_student uuid, p_amount integer, p_reason text, p_by uuid default null)
returns table (points_before integer, points_after integer)
language plpgsql security definer set search_path = public as $$
declare
  v_before integer;
  v_after  integer;
begin
  select points into v_before from public.students where id = p_student for update;
  if not found then
    raise exception 'student not found';
  end if;
  v_after := greatest(0, v_before + p_amount);
  update public.students set points = v_after where id = p_student;
  insert into public.point_ledger (student_id, amount, reason, created_by)
  values (p_student, p_amount, p_reason, p_by);
  return query select v_before, v_after;
end $$;

revoke all on function public.add_points(uuid, integer, text, uuid) from public, anon, authenticated;
grant execute on function public.add_points(uuid, integer, text, uuid) to service_role;

-- New students start with the prototype's default reward road.
create function public.seed_default_milestones() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.milestones (student_id, points, reward, tier) values
    (new.id,   1000, '₹100 pocket money',                     'bronze'),
    (new.id,  10000, 'Gift of your choice (up to ₹1,000)',    'silver'),
    (new.id,  50000, 'Wireless headphones',                   'gold'),
    (new.id, 100000, 'New mobile phone',                      'diamond');
  return new;
end $$;

create trigger students_default_milestones
after insert on public.students
for each row execute function public.seed_default_milestones();

-- ---------------------------------------------------------------- Row Level Security
alter table public.profiles            enable row level security;
alter table public.students            enable row level security;
alter table public.subjects            enable row level security;
alter table public.group_subjects      enable row level security;
alter table public.chapters            enable row level security;
alter table public.chapter_practice    enable row level security;
alter table public.questions           enable row level security;
alter table public.question_answers    enable row level security;
alter table public.chapter_progress    enable row level security;
alter table public.test_sessions       enable row level security;
alter table public.test_attempts       enable row level security;
alter table public.point_ledger        enable row level security;
alter table public.milestones          enable row level security;
alter table public.chapter_video_links enable row level security;
alter table public.grade_requests      enable row level security;

-- profiles: yourself, your children (parent), everyone (admin). No browser writes.
create policy profiles_select on public.profiles for select to authenticated using (
  public.account_active() and (
    id = (select auth.uid())
    or public.is_admin()
    or public.is_my_child(id))
);

-- students: yourself, your children, everyone (admin). No browser writes.
create policy students_select on public.students for select to authenticated using (
  public.account_active() and (
    id = (select auth.uid())
    or parent_id = (select auth.uid())
    or public.is_admin())
);

-- catalogue: readable by any active signed-in user; admins edit through the server.
create policy subjects_select on public.subjects for select to authenticated using (public.account_active());
create policy group_subjects_select on public.group_subjects for select to authenticated using (public.account_active());
create policy chapters_select on public.chapters for select to authenticated using (public.account_active());
create policy chapter_practice_select on public.chapter_practice for select to authenticated using (public.account_active());

-- questions: admin only from the browser (students get questions via the test route).
create policy questions_select on public.questions for select to authenticated using (public.is_admin());
-- question_answers: intentionally no policy at all.

-- progress, attempts, ledger, test state: student sees own, parent sees children, admin sees all.
create policy chapter_progress_select on public.chapter_progress for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));

create policy test_attempts_select on public.test_attempts for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));

create policy point_ledger_select on public.point_ledger for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));

-- test_sessions and grade_requests: no policies = server only.

-- milestones: student reads own; parent reads and edits children's; admin reads all.
create policy milestones_select on public.milestones for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));
create policy milestones_parent_insert on public.milestones for insert to authenticated
  with check (public.is_my_child(student_id) and given_at is null);
create policy milestones_parent_update on public.milestones for update to authenticated
  using (public.is_my_child(student_id)) with check (public.is_my_child(student_id));
create policy milestones_parent_delete on public.milestones for delete to authenticated
  using (public.is_my_child(student_id));

-- video links: student reads own; parent reads and edits children's.
create policy video_links_select on public.chapter_video_links for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));
create policy video_links_parent_insert on public.chapter_video_links for insert to authenticated
  with check (public.is_my_child(student_id));
create policy video_links_parent_update on public.chapter_video_links for update to authenticated
  using (public.is_my_child(student_id)) with check (public.is_my_child(student_id));
create policy video_links_parent_delete on public.chapter_video_links for delete to authenticated
  using (public.is_my_child(student_id));

-- Tables are locked down for the public anon role entirely.
revoke all on all tables in schema public from anon;
