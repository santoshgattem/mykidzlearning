// Loads the Class 3 subjects from content/class3/*.mjs into Supabase.
//   npm run seed-class3                       (validate, then load every Class 3 subject not loaded yet)
//   npm run seed-class3 -- --dry              (validate only, touches no database)
//   npm run seed-class3 -- --only c3-math     (just one subject)
//   npm run seed-class3 -- --only c3-math --force   (replace that subject's questions)
// Never touches Class 11 content. Replacing questions refuses to run if students already have
// progress on those chapters, unless --wipe-progress is also given.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const dry = args.includes("--dry"), force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const dir = new URL("../content/class3/", import.meta.url);
const videosFile = new URL("videos.json", dir);
const videos = existsSync(videosFile) ? JSON.parse(readFileSync(videosFile, "utf8")) : {};
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

const problems = [];
const loaded = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith(".mjs") && x !== "helpers.mjs").sort()) {
  const { subject, chapters } = await import(new URL(f, dir));
  if (only && subject.id !== only) continue;
  const rows = { subject, chapters: [], practice: [], questions: [], answers: [] };
  const ids = new Set();
  chapters.forEach((c, idx) => {
    const at = `${subject.id}/${c.id}`;
    if (ids.has(c.id)) problems.push(`${at}: duplicate chapter id`);
    ids.add(c.id);
    if (c.mcq.length < 5) problems.push(`${at}: only ${c.mcq.length} multiple-choice questions (need 5+)`);
    if (c.fib.length < 5) problems.push(`${at}: only ${c.fib.length} fill-in-the-blanks (need 5+)`);
    if (c.short.length < 5) problems.push(`${at}: only ${c.short.length} one-line questions (need 5+)`);
    if ((c.practice ?? []).length < 3) problems.push(`${at}: fewer than 3 practice items`);
    const seen = new Set();
    const dup = (q) => { const k = norm(q); if (seen.has(k)) problems.push(`${at}: duplicate question "${q.slice(0, 40)}"`); seen.add(k); };
    c.mcq.forEach((q) => {
      dup(q.q);
      if (q.o.length !== 4 || new Set(q.o.map((x) => norm(x))).size !== 4) problems.push(`${at} "${q.q.slice(0, 40)}": needs 4 different options`);
      if (![0, 1, 2, 3].includes(q.a)) problems.push(`${at} "${q.q.slice(0, 40)}": bad answer index`);
    });
    c.fib.forEach((q) => {
      dup(q.q);
      if (!q.q.includes("____")) problems.push(`${at} "${q.q.slice(0, 40)}": no blank (____)`);
      if (!q.a.length) problems.push(`${at} "${q.q.slice(0, 40)}": no accepted answers`);
    });
    c.short.forEach((q) => { dup(q.q); if (!q.k.length) problems.push(`${at} "${q.q.slice(0, 40)}": no key words`); });

    rows.chapters.push({ id: c.id, subject_id: subject.id, grade: 3, position: idx + 1, title: c.title, default_video_url: videos[c.id] ?? "" });
    c.practice.forEach((p, j) => rows.practice.push({ chapter_id: c.id, position: j + 1, prompt: p }));
    const add = (kind, level, prompt, options, answer) => {
      const id = crypto.randomUUID();
      rows.questions.push({ id, chapter_id: c.id, kind, level, prompt, options: options ?? null });
      rows.answers.push({ question_id: id, ...answer });
    };
    c.mcq.forEach((q) => add("mcq", q.l ?? 1, q.q, q.o, { correct_index: q.a }));
    c.fib.forEach((q) => add("fib", q.l ?? 1, q.q, null, { accepted_answers: q.a }));
    c.short.forEach((q) => add("written", q.l ?? 1, q.q, null, { key_ideas: q.k }));
  });
  loaded.push(rows);
}
if (!loaded.length) { console.error("No Class 3 subject found" + (only ? ` called ${only}` : "") + "."); process.exit(1); }
if (problems.length) { console.error("Content problems found, nothing was loaded:\n - " + problems.join("\n - ")); process.exit(1); }
for (const r of loaded) {
  const n = (k) => r.questions.filter((q) => q.kind === k).length;
  console.log(`${r.subject.id}: ${r.chapters.length} chapters, ${r.questions.length} questions (${n("mcq")} multiple-choice, ${n("fib")} fill-in, ${n("written")} one-line), ${Object.keys(videos).filter((v) => r.chapters.some((c) => c.id === v)).length} videos`);
}
if (dry) process.exit(0);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing Supabase settings. Fill in .env.local first."); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const must = async (label, p) => { const { error } = await p; if (error) { console.error(`${label} failed:`, error.message); process.exit(1); } };

for (const r of loaded) {
  const ids = r.chapters.map((c) => c.id);
  const { count: have } = await db.from("questions").select("id", { count: "exact", head: true }).in("chapter_id", ids);
  if (have > 0 && !force) { console.log(`${r.subject.id} already has ${have} questions. Add --force to replace them.`); continue; }
  if (have > 0) {
    const { count: prog } = await db.from("chapter_progress").select("student_id", { count: "exact", head: true }).in("chapter_id", ids);
    if (prog > 0 && !args.includes("--wipe-progress")) { console.error(`Refusing: ${prog} progress rows on ${r.subject.id} would be deleted. Add --wipe-progress only if you really want that.`); process.exit(1); }
    await must("clear old questions", db.from("questions").delete().eq("set_no", 1).in("chapter_id", ids));
  }
  await must("subject", db.from("subjects").upsert(r.subject));
  await must("group_subjects", db.from("group_subjects").upsert({ grp: "C3", subject_id: r.subject.id }));
  await must("chapters", db.from("chapters").upsert(r.chapters));
  await must("chapter_practice", db.from("chapter_practice").upsert(r.practice));
  for (let i = 0; i < r.questions.length; i += 200) {
    await must("questions", db.from("questions").insert(r.questions.slice(i, i + 200)));
    await must("question_answers", db.from("question_answers").insert(r.answers.slice(i, i + 200)));
  }
  console.log(`Loaded ${r.subject.id}.`);
}
