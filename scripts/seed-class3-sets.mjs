// Loads Set 2 and Set 3 questions for Class 3 from content/class3/sets/*.mjs into Supabase.
//   npm run seed-class3-sets                    (validate, then load every set file)
//   npm run seed-class3-sets -- --dry           (validate only, touches no database)
//   npm run seed-class3-sets -- --only c3-math  (one subject)
//   npm run seed-class3-sets -- --force         (replace the questions of the sets named in the files)
// Each file exports { subjectId, setNo (2 or 3), chapters: [{ id, mcq, fib, short }] } in the same
// shape as the Set 1 files. Set 1 is never touched, so no student's result or points can change.
// A chapter becomes a "chapter with this set" (and needs it passed) only after its questions load.
import { readdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dry = args.includes("--dry"), force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const base = new URL("../content/class3/", import.meta.url);
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

// Set 1 text per chapter, so a later set never repeats an earlier question.
const set1 = new Map();
for (const f of readdirSync(base).filter((x) => x.endsWith(".mjs") && x !== "helpers.mjs")) {
  const { chapters } = await import(new URL(f, base));
  for (const c of chapters) set1.set(c.id, new Set([...c.mcq, ...c.fib, ...c.short].map((q) => norm(q.q))));
}

const problems = [];
const files = [];
const sdir = new URL("sets/", base);
for (const f of readdirSync(sdir).filter((x) => x.endsWith(".mjs")).sort()) {
  const m = await import(new URL(f, sdir));
  if (only && m.subjectId !== only) continue;
  if (![2, 3].includes(m.setNo)) { problems.push(`${f}: setNo must be 2 or 3`); continue; }
  const rows = [], answers = [];
  for (const c of m.chapters) {
    const at = `${f}/${c.id}`;
    if (!set1.has(c.id)) { problems.push(`${at}: unknown chapter`); continue; }
    if (c.mcq.length < 5 || c.fib.length < 5 || c.short.length < 5) problems.push(`${at}: needs 5+ of each kind`);
    const seen = new Set();
    const dup = (q) => {
      const k = norm(q);
      if (seen.has(k)) problems.push(`${at}: duplicate "${q.slice(0, 40)}"`);
      if (set1.get(c.id).has(k)) problems.push(`${at}: repeats a Set 1 question "${q.slice(0, 40)}"`);
      seen.add(k);
    };
    c.mcq.forEach((q) => {
      dup(q.q);
      if (q.o.length !== 4 || new Set(q.o.map(norm)).size !== 4) problems.push(`${at} "${q.q.slice(0, 40)}": needs 4 different options`);
      if (![0, 1, 2, 3].includes(q.a)) problems.push(`${at} "${q.q.slice(0, 40)}": bad answer index`);
    });
    c.fib.forEach((q) => { dup(q.q); if (!q.q.includes("____")) problems.push(`${at} "${q.q.slice(0, 40)}": no blank`); if (!q.a.length) problems.push(`${at}: blank with no answer`); });
    c.short.forEach((q) => { dup(q.q); if (!q.k.length) problems.push(`${at} "${q.q.slice(0, 40)}": no key words`); });
    const add = (kind, prompt, options, answer) => {
      const id = crypto.randomUUID();
      rows.push({ id, chapter_id: c.id, kind, level: m.setNo, set_no: m.setNo, prompt, options: options ?? null });
      answers.push({ question_id: id, ...answer });
    };
    c.mcq.forEach((q) => add("mcq", q.q, q.o, { correct_index: q.a }));
    c.fib.forEach((q) => add("fib", q.q, null, { accepted_answers: q.a }));
    c.short.forEach((q) => add("written", q.q, null, { key_ideas: q.k }));
  }
  files.push({ f, subjectId: m.subjectId, setNo: m.setNo, ids: m.chapters.map((c) => c.id), rows, answers });
}
if (!files.length) { console.error("No set file found."); process.exit(1); }
if (problems.length) { console.error("Content problems found, nothing was loaded:\n - " + problems.join("\n - ")); process.exit(1); }
for (const x of files) console.log(`${x.f}: Set ${x.setNo}, ${x.ids.length} chapters, ${x.rows.length} questions`);
if (dry) process.exit(0);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase settings. Fill in .env.local first."); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const must = async (label, p) => { const { error } = await p; if (error) { console.error(`${label} failed:`, error.message); process.exit(1); } };

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
