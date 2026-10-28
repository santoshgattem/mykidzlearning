-- Full-length JEE Main style papers: 90 questions (30 each in Physics, Chemistry, Maths),
-- 20 multiple-choice + 10 numerical per subject, 3 hours. +4 for a right answer, -1 for a wrong
-- multiple-choice answer, nothing for a wrong numerical answer.
-- Questions and answers are served and marked only by the server (service role). Students and
-- parents can read the attempts and results of their own children, nothing else.

create table public.papers (
  id               text primary key,                                  -- e.g. c11-1, c1112-1
  title            text not null,
  scope            text not null check (scope in ('11', '11+12')),    -- Class 11 only, or Class 11 + 12
  duration_minutes integer not null default 180,
  position         smallint not null,
  created_at       timestamptz not null default now()
);

create table public.paper_questions (
  id        text primary key,                                         -- e.g. c11-1-045
  paper_id  text not null references public.papers(id) on delete cascade,
  position  smallint not null,
  subject   text not null check (subject in ('phy', 'chem', 'math')),
  section   text not null check (section in ('mcq', 'num')),
  grade     smallint not null check (grade in (11, 12)),
  chapter   text not null,
  prompt    text not null,
  options   jsonb,                                                    -- 4 strings for mcq, null for num
  unique (paper_id, position)
);

-- The right answers. No policy at all: only the server reads this.
create table public.paper_answers (
  question_id   text primary key references public.paper_questions(id) on delete cascade,
  correct_index smallint check (correct_index between 0 and 3),
  num_answer    numeric,
  num_tolerance numeric not null default 0
);

create table public.paper_attempts (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  paper_id      text not null references public.papers(id) on delete cascade,
  started_at    timestamptz not null default now(),
  deadline      timestamptz not null,
  answers       jsonb not null default '{}'::jsonb,                   -- { question_id: option index | number }
  submitted_at  timestamptz,
  marks         integer,
  correct       integer,
  wrong         integer,
  skipped       integer,
  breakdown     jsonb,                                                -- per subject and per chapter
  bonus_points  integer not null default 0
);
-- One unfinished attempt per student and paper.
create unique index paper_attempts_open_idx on public.paper_attempts(student_id, paper_id) where submitted_at is null;
create index paper_attempts_student_idx on public.paper_attempts(student_id, started_at desc);

alter table public.papers          enable row level security;
alter table public.paper_questions enable row level security;
alter table public.paper_answers   enable row level security;
alter table public.paper_attempts  enable row level security;

create policy papers_select on public.papers for select to authenticated using (public.account_active());
-- paper_questions and paper_answers: no policies = server only.
create policy paper_attempts_select on public.paper_attempts for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));

-- Saves (or clears) one answer in a single statement, so quick clicks can never overwrite each
-- other. Refused once the paper is submitted or the time (plus a short grace) has run out.
create function public.paper_set_answer(p_attempt uuid, p_student uuid, p_question text, p_value jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  update public.paper_attempts
     set answers = case when p_value is null or p_value = 'null'::jsonb
                        then answers - p_question
                        else jsonb_set(answers, array[p_question], p_value, true) end
   where id = p_attempt and student_id = p_student and submitted_at is null
     and now() < deadline + interval '30 seconds';
  get diagnostics n = row_count;
  return n = 1;
end $$;
revoke all on function public.paper_set_answer(uuid, uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.paper_set_answer(uuid, uuid, text, jsonb) to service_role;
