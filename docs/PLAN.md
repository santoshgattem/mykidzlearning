# mykidzlearning.com: build plan and database

## Phases (one at a time, each tested before the next)

| # | Phase | Result |
|---|---|---|
| 1 | Set up (this step) | Next.js + Tailwind + Supabase wired, schema written, `/api/health` check |
| 2 | Accounts | Admin / parent / student sign-in, admin portal, forced password change, first-admin script |
| 3 | Parent portal | Add child, rewards, notebook checks, test answers, video links, bonus points, child settings |
| 4 | Student portal | Setup, reward road, levels, chapter path, 3-step chapter, 100%-only test; question bank seeded into the database |
| 5 | AI grading | `POST /api/grade`, word minimum, per-student rate limit, key-term fallback |
| 6 | Security review | RLS, secrets, admin routes, PIN brute force |
| 7 | Go live | GitHub, Vercel, mykidzlearning.com DNS |

## Key decisions

1. **Student sign-in.** The prototype uses 4-digit PINs; Supabase passwords need 6+ characters.
   Students sign in through a server route (`/api/student/signin`). The route rate-limits, locks the account
   after 5 wrong PINs (15 min), then signs in to Supabase with `PIN + STUDENT_PIN_PEPPER` as the password.
   Supabase stores only the bcrypt hash. The pepper never leaves the server, so guessing PINs directly
   against Supabase Auth is useless. Parents still see a familiar 4-digit PIN.
2. **All point/progress writes are server-side.** The browser can read what RLS allows; nothing that changes
   points, progress, accounts or test state can be written from the browser. The only browser writes are a
   parent's own children's milestones and video links.
3. **Answers are hidden.** Correct answers live in `question_answers`, with no policy, so they cannot be read from
   the browser. Students do not read `questions` either: the test route picks questions and sends prompt + options only.
4. **Points go through `add_points()`** (service role only): clamps at 0, writes the ledger row, same transaction.
5. **Disabled parent = disabled children** enforced in RLS (`account_active()`) and at sign-in.

6. **Test timer (added by request).** Every chapter test is timed: about 15 / 19.5 / 25 / 30 minutes for a full test at
   Foundation / CBSE Board / JEE Main / JEE Advanced, built from per-question allowances (`TEST_TIME` in
   `src/lib/learning.ts`; the written answer gets 10–15 minutes because students research first). The countdown is
   shown on the test page. The deadline is stored on the server (`test_sessions`, added in the Phase 4 migration), so
   leaving and returning does not reset it. When time runs out the answers entered so far are checked as one try;
   correct answers stay locked and the student redoes the rest, so the timer never costs points. A retry is timed
   only for the questions still to answer. Submissions more than 30 seconds after the deadline are refused.

## Tables

| Table | Purpose | Browser access |
|---|---|---|
| `profiles` | One row per auth user: role, name, email, phone, `must_change_password`, `disabled` | own / children / admin: read |
| `students` | Student data: parent, class, group, points, channel, PIN lockout counters | own / parent / admin: read |
| `subjects`, `group_subjects`, `chapters`, `chapter_practice` | Syllabus (replaces `SUBJECTS`) | any signed-in: read |
| `questions` | MCQ / fill-blank / written prompts with `level` 1–4 (replaces `SUBJECTS` + `EXTRA`) | admin: read |
| `question_answers` | Answer key, accepted answers, key ideas | none (server only) |
| `chapter_progress` | Watched, completed level and points, notebook status per student and chapter | own / parent / admin: read |
| `test_sessions` | Test in progress, correct answers locked in | none (server only) |
| `test_attempts` | 100% results with written answer and feedback | own / parent / admin: read |
| `point_ledger` | Every points change with reason | own / parent / admin: read |
| `milestones` | Per-student rewards (points, reward, tier, `given_at`); 4 defaults on creation | own: read, parent: read + write, admin: read |
| `chapter_video_links` | Parent's per-chapter video link | own: read, parent: read + write |
| `grade_requests` | Per-student AI grading rate limiting | none (server only) |

Level, unlocking and "syllabus %" are computed in code from `chapter_progress` and the group's chapters, as in the prototype.

## Supabase setup

1. supabase.com → New project (region closest to India, e.g. Mumbai `ap-south-1`); save the database password.
2. SQL Editor → New query → paste all of `supabase/migrations/0001_init.sql` → Run.
3. Authentication → Sign In / Providers → Email: enabled; turn **off** "Confirm email" and **off** "Allow new users to sign up"
   (admin creates all accounts; there is no public sign-up).
4. Project Settings → API: copy the Project URL, the anon/publishable key and the service_role/secret key into `.env.local`.
5. Generate the pepper: `openssl rand -base64 32` → `STUDENT_PIN_PEPPER`.
