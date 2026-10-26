# Building mykidzlearning.com with Claude Code

## What you need

| What | Why | Cost |
|---|---|---|
| Claude Pro or Max plan | Claude Code needs a paid plan (not available on the free plan) | Subscription |
| GitHub account | Stores your code; Vercel deploys from it | Free |
| Supabase account (supabase.com) | Database and logins | Free tier to start |
| Vercel account (vercel.com) | Hosts the website on mykidzlearning.com | Free tier to start |
| Anthropic API key (console.anthropic.com) | AI grading on the live site | Pay per use, very small per answer |
| Node.js 20 or newer (nodejs.org) | Runs the app on your computer | Free |

## 1. Install Claude Code

Easiest: download the Claude desktop app and open the Code tab. Or, in a terminal:

- Mac / Linux: `curl -fsSL https://claude.ai/install.sh | bash`
- Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex`

Docs: https://code.claude.com/docs/en/quickstart

## 2. Open this folder

Unzip this kit, open a terminal in the `mykidzlearning` folder and run `claude`
(or choose this folder in the desktop app). Claude Code reads `CLAUDE.md` automatically,
so it already knows the whole project.

## 3. Build in phases — paste one prompt at a time

Wait for each phase to work before starting the next. Test it in your browser each time.

**Phase 1 — Set up**
> Read CLAUDE.md and the prototype. Propose a plan and the database tables first, then set up
> the Next.js project with Tailwind and Supabase. Tell me exactly what to create in Supabase
> and which keys to put in .env.local.

**Phase 2 — Accounts**
> Build sign-in for admin, parent and student, the admin portal (create/reset/disable/delete
> parents, add admins) and forced password change on first sign-in. Add Row Level Security.
> Give me a way to create the first admin account.

**Phase 3 — Parent portal**
> Build the parent portal exactly like the prototype: add child, rewards, notebook checks,
> test answers, video links with preferred channel, bonus points, child settings.

**Phase 4 — Student portal**
> Build the student portal: class/group setup, reward road, level card, subjects, chapter
> path, the 3-step chapter page, and the test with 100%-only scoring, locked correct answers,
> levels and points exactly as the prototype. Move the question bank into the database.

**Phase 5 — AI grading**
> Add the /api/grade server route described in CLAUDE.md using my ANTHROPIC_API_KEY, with
> rate limiting and the key-term fallback. Show the feedback like the prototype does.

**Phase 6 — Check before launch**
> Review the whole app for security problems (RLS, secrets, admin routes, PIN brute force),
> test every flow as admin, parent and student, and fix what you find.

**Phase 7 — Go live**
> Help me put this on GitHub and deploy to Vercel, add the environment variables there,
> and connect my domain mykidzlearning.com. Tell me the exact DNS records to add at my
> domain registrar.

## Tips

- If something looks wrong, describe what you see (or paste a screenshot) and ask Claude to fix it.
- Ask Claude Code to commit to Git after each working phase, so you can always go back.
- Never paste your API keys into chat messages you share; keep them in `.env.local` and in Vercel.
- The `prototype` folder is for reference only. Open the HTML file in a browser to compare.
