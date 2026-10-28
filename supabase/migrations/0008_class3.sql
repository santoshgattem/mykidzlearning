-- Class 3 (CBSE) students. They use the group code 'C3' (no PCM/PCB choice) and Class 3 subjects.
-- Class 3 tests have 5 multiple-choice, 5 fill-in and 5 one-line answers; the one-line answers are
-- stored as ordinary 'written' questions, so no new question kind is needed.
alter table public.students drop constraint if exists students_grade_check;
alter table public.students add constraint students_grade_check check (grade in (3, 11, 12));
alter table public.students drop constraint if exists students_grp_check;
alter table public.students add constraint students_grp_check check (grp in ('PCM', 'PCB', 'PCMB', 'C3'));
alter table public.group_subjects drop constraint if exists group_subjects_grp_check;
alter table public.group_subjects add constraint group_subjects_grp_check check (grp in ('PCM', 'PCB', 'PCMB', 'C3'));
