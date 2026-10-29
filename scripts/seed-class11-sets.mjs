// Loads Set 2 and Set 3 questions for Class 11 from content/class11/sets/*.mjs into Supabase.
//   npm run seed-class11-sets                     (validate, then load every set file)
//   npm run seed-class11-sets -- --dry            (validate only, touches no database writes)
//   npm run seed-class11-sets -- --only phy       (one subject: phy, chem, math, bio, eng)
//   npm run seed-class11-sets -- --force          (replace the questions of the sets named in the files)
// Each file exports { subjectId, setNo (2 or 3), chapters: [{ id, mcq, fib, para }] } using M / F / P
// from content/class11/helpers.mjs. Set 1 is never touched, so no student's result or points can change.
// A chapter needs a set passed only after that set's questions load. Questions are checked against the
// chapter's Set 1 questions in the database so a later set never repeats an earlier one.
import { readdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dry = args.includes("--dry"), force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase settings. Fill in .env.local first."); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const must = async (label, p) => { const { error } = await p; if (error) { console.error(`${label} failed:`, error.message); process.exit(1); } };

const problems = [];
const files = [];
const sdir = new URL("../content/class11/sets/", import.meta.url);
for (const f of readdirSync(sdir).filter((x) => x.endsWith(".mjs")).sort()) {
  const m = await import(new URL(f, sdir));
  if (only && m.subjectId !== only) continue;
  if (![2, 3].includes(m.setNo)) { problems.push(`${f}: setNo must be 2 or 3`); continue; }
  const rows = [], answers = [];
  for (const c of m.chapters) {
    const at = `${f}/${c.id}`;
    const { data: ch } = await db.from("chapters").select("id").eq("id", c.id).maybeSingle();
    if (!ch) { problems.push(`${at}: unknown chapter`); continue; }
    const { data: s1 } = await db.from("questions").select("prompt").eq("chapter_id", c.id).eq("set_no", 1);
    const earlier = new Set((s1 ?? []).map((q) => norm(q.prompt)));
    if (c.mcq.length < 4 || c.fib.length < 3 || c.para.length < 1) problems.push(`${at}: needs 4+ MCQ, 3+ fill-in and 1+ written`);
    const seen = new Set();
    const dup = (q) => {
      const k = norm(q);
      if (seen.has(k)) problems.push(`${at}: duplicate "${q.slice(0, 40)}"`);
      if (earlier.has(k)) problems.push(`${at}: repeats a Set 1 question "${q.slice(0, 40)}"`);
      seen.add(k);
    };
    c.mcq.forEach((q) => {
      dup(q.q);
      if (q.o.length !== 4 || new Set(q.o.map((o) => norm(o))).size !== 4) problems.push(`${at} "${q.q.slice(0, 40)}": needs 4 different options`);
      if (![0, 1, 2, 3].includes(q.a)) problems.push(`${at} "${q.q.slice(0, 40)}": bad answer index`);
    });
    c.fib.forEach((q) => { dup(q.q); if (!q.q.includes("____")) problems.push(`${at} "${q.q.slice(0, 40)}": no blank`); if (!q.a?.length) problems.push(`${at} "${q.q.slice(0, 40)}": no answer`); });
    c.para.forEach((p) => { dup(p.q); if (!p.k?.length) problems.push(`${at} "${p.q.slice(0, 40)}": no key ideas`); });
    const add = (kind, level, prompt, options, answer) => {
      const id = crypto.randomUUID();
      rows.push({ id, chapter_id: c.id, kind, level, set_no: m.setNo, prompt, options: options ?? null });
      answers.push({ question_id: id, ...answer });
    };
    c.mcq.forEach((q) => add("mcq", q.l ?? m.setNo + 1, q.q, q.o, { correct_index: q.a }));
    c.fib.forEach((q) => add("fib", q.l ?? m.setNo + 1, q.q, null, { accepted_answers: q.a }));
    c.para.forEach((p) => add("written", m.setNo + 1, p.q, null, { key_ideas: p.k }));
  }
  files.push({ f, setNo: m.setNo, ids: m.chapters.map((c) => c.id), rows, answers });
}
if (!files.length) { console.error("No set file found."); process.exit(1); }
if (problems.length) { console.error("Content problems found, nothing was loaded:\n - " + problems.join("\n - ")); process.exit(1); }
for (const x of files) console.log(`${x.f}: Set ${x.setNo}, ${x.ids.length} chapters, ${x.rows.length} questions`);
if (dry) process.exit(0);

for (const x of files) {
  const { count: have } = await db.from("questions").select("id", { count: "exact", head: true }).eq("set_no", x.setNo).in("chapter_id", x.ids);
  if (have > 0 && !force) { console.log(`${x.f} already loaded (${have} questions). Add --force to replace them.`); continue; }
  if (have > 0) await must("clear old set questions", db.from("questions").delete().eq("set_no", x.setNo).in("chapter_id", x.ids));
  for (let i = 0; i < x.rows.length; i += 200) {
    await must("questions", db.from("questions").insert(x.rows.slice(i, i + 200)));
    await must("question_answers", db.from("question_answers").insert(x.answers.slice(i, i + 200)));
  }
  await must("chapter_sets", db.from("chapter_sets").upsert(x.ids.map((id) => ({ chapter_id: id, set_no: x.setNo }))));
  console.log(`Loaded ${x.f}.`);
}
