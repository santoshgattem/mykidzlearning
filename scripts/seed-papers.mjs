// Loads the JEE practice papers from content/papers/*.mjs into Supabase.
//   npm run seed-papers            (validate, then load or refresh every paper)
//   npm run seed-papers -- --dry   (validate only, touches no database)
// Question ids are stable (<paper>-<position>), so reloading a paper updates it in place and
// never breaks an attempt that is already in progress.
import { readdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const dry = process.argv.includes("--dry");
const dir = new URL("../content/papers/", import.meta.url);
const files = readdirSync(dir).filter((f) => /^c\d+(-\d+)?-\d+\.mjs$/.test(f)).sort();

const problems = [];
const papers = [];
for (const f of files) {
  const { paper, questions } = await import(new URL(f, dir));
  const tag = paper.id;
  const bySubject = { phy: [], chem: [], math: [] };
  questions.forEach((q) => bySubject[q.s]?.push(q));
  for (const [s, list] of Object.entries(bySubject)) {
    if (list.length !== 30) problems.push(`${tag}: ${s} has ${list.length} questions (need 30)`);
    const m = list.filter((q) => q.t === "mcq").length, n = list.filter((q) => q.t === "num").length;
    if (m !== 20 || n !== 10) problems.push(`${tag}: ${s} has ${m} multiple-choice and ${n} numerical (need 20 and 10)`);
  }
  if (questions.length !== 90) problems.push(`${tag}: ${questions.length} questions (need 90)`);
  if (paper.scope === "11" && questions.some((q) => q.grade !== 11)) problems.push(`${tag}: a Class 11 paper has a non-Class-11 question`);
  if (paper.scope === "11+12") {
    const g12 = questions.filter((q) => q.grade === 12).length;
    if (g12 < 30 || g12 > 60) problems.push(`${tag}: ${g12} Class 12 questions (a Class 11+12 paper needs 30 to 60)`);
  }
  const seen = new Set();
  questions.forEach((q, i) => {
    const where = `${tag} Q${i + 1} "${q.q.slice(0, 40)}"`;
    if (seen.has(q.q)) problems.push(`${where}: duplicate question`);
    seen.add(q.q);
    if (q.t === "mcq") {
      if (q.o.length !== 4 || new Set(q.o.map((o) => o.trim())).size !== 4) problems.push(`${where}: needs 4 different options`);
      if (![0, 1, 2, 3].includes(q.a)) problems.push(`${where}: bad answer index`);
    } else if (q.t === "num") {
      if (!Number.isFinite(q.n)) problems.push(`${where}: numerical answer is not a number`);
      if (!(q.tol >= 0)) problems.push(`${where}: bad tolerance`);
    } else problems.push(`${where}: unknown type`);
    if (![11, 12].includes(q.grade)) problems.push(`${where}: bad class`);
    if (!q.ch) problems.push(`${where}: no chapter`);
  });
  papers.push({ paper, questions });
}
if (problems.length) {
  console.error("Paper problems found, nothing was loaded:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log(`Validated ${papers.length} paper(s): ${papers.map((p) => `${p.paper.id} (${p.questions.length} questions)`).join(", ")}`);
if (dry) process.exit(0);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase settings. Fill in .env.local first."); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const must = async (label, p) => { const { error } = await p; if (error) { console.error(`${label} failed:`, error.message); process.exit(1); } };

for (const { paper, questions } of papers) {
  await must("paper", db.from("papers").upsert({ id: paper.id, title: paper.title, scope: paper.scope, duration_minutes: paper.duration_minutes, position: paper.position }));
  const rows = questions.map((q, i) => ({
    id: `${paper.id}-${String(i + 1).padStart(3, "0")}`, paper_id: paper.id, position: i + 1, subject: q.s, section: q.t, grade: q.grade,
    chapter: q.ch, prompt: q.q, options: q.t === "mcq" ? q.o : null,
  }));
  const keys = questions.map((q, i) => ({
    question_id: rows[i].id, correct_index: q.t === "mcq" ? q.a : null, num_answer: q.t === "num" ? Number(q.n.toPrecision(12)) : null, num_tolerance: q.t === "num" ? q.tol : 0,
  }));
  await must("questions", db.from("paper_questions").upsert(rows));
  await must("answers", db.from("paper_answers").upsert(keys));
  console.log(`Loaded ${paper.id}: ${rows.length} questions.`);
}
