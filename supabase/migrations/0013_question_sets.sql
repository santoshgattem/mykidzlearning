-- Question sets. Every chapter has up to 3 sets of questions: Set 1 simple (today's questions),
-- Set 2 medium, Set 3 complex. A chapter is complete when every set that exists for it is passed.
-- Nothing is deleted or changed for current students: existing questions become Set 1, existing
-- completions count as Set 1 passed, and each student's current level is saved so it can never drop.

-- 1. Which set a question belongs to. Every existing question is Set 1.
alter table public.questions add column set_no smallint not null default 1 check (set_no between 1 and 3);
create index questions_chapter_set_idx on public.questions (chapter_id, set_no);

-- 2. A test in progress belongs to one set.
alter table public.test_sessions add column set_no smallint not null default 1 check (set_no between 1 and 3);

-- 3. Which sets exist for each chapter (readable by signed-in users). Every chapter has Set 1 today.
create table public.chapter_sets (
  chapter_id text not null references public.chapters(id) on delete cascade,
  set_no     smallint not null check (set_no between 1 and 3),
  primary key (chapter_id, set_no)
);
insert into public.chapter_sets (chapter_id, set_no) select id, 1 from public.chapters;
alter table public.chapter_sets enable row level security;
create policy chapter_sets_select on public.chapter_sets for select to authenticated using (public.account_active());

-- 4. Sets 2 and 3 passed at 100%. (Set 1 stays in chapter_progress and test_attempts, as before.)
create table public.set_results (
  student_id     uuid not null references public.students(id) on delete cascade,
  chapter_id     text not null references public.chapters(id) on delete cascade,
  set_no         smallint not null check (set_no in (2, 3)),
  tries          integer not null default 1,
  points_awarded integer not null default 0,
  completed_at   timestamptz not null default now(),
  primary key (student_id, chapter_id, set_no)
);
create index set_results_student_idx on public.set_results (student_id, completed_at desc);
alter table public.set_results enable row level security;
create policy set_results_select on public.set_results for select to authenticated using (
  public.account_active() and (student_id = (select auth.uid()) or public.is_my_child(student_id) or public.is_admin()));

-- 5. The highest level a student has reached. A student's level is the higher of this and the level
--    their progress gives, so adding sets can never lower it. Filled in from today's progress.
alter table public.students add column level_reached smallint not null default 1 check (level_reached between 1 and 4);
update public.students s set level_reached = x.lvl
from (
  select st.id, case when st.pct >= 75 then 4 when st.pct >= 50 then 3 when st.pct >= 25 then 2 else 1 end as lvl
  from (
    select s2.id,
           case when t.total = 0 then 0 else round(100.0 * coalesce(d.done, 0) / t.total) end as pct
    from public.students s2
    left join lateral (
      select count(*) as total from public.chapters c
      join public.group_subjects g on g.subject_id = c.subject_id where g.grp = s2.grp
    ) t on true
    left join lateral (
      select count(*) as done from public.chapter_progress p
      join public.chapters c on c.id = p.chapter_id
      join public.group_subjects g on g.subject_id = c.subject_id
      where p.student_id = s2.id and g.grp = s2.grp and p.completed_level is not null
    ) d on true
  ) st
) x where s.id = x.id;
