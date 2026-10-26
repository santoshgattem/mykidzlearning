// Loads the Class 11 syllabus and question bank into Supabase.
//   npm run seed-content              (only if the questions table is empty)
//   npm run seed-content -- --force   (wipe and reload ALL chapters and questions)
//   npm run seed-content -- --dry     (build and validate only; writes docs/COVERAGE.md, touches no database)
//
// Sources:
//   content/class11/<subject>.mjs        chapter lists (NCERT order) and the base questions
//   content/class11/more-<subject>.mjs   extra questions per chapter, tagged by topic, plus generated numeric ones
//   content/class11/videos.json          chapterId -> default video URL
//   the prototype                        subject names, and the chapters marked `legacy: "<id>"`
// A question can be excluded without deleting it: add a fragment of its text to `drop` (in either file).
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { generate } from "../content/class11/helpers.mjs";

const dry = process.argv.includes("--dry");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dry && (!url || !key)) {
  console.error("Missing Supabase settings. Fill in .env.local first.");
  process.exit(1);
}
const db = dry ? null : createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

// ---- prototype (subject names + legacy chapters; already merged with its EXTRA questions)
const html = readFileSync(new URL("../prototype/mykidzlearning-prototype.html", import.meta.url), "utf8");
const start = html.indexOf("const SUBJECTS = {");
const end = html.indexOf("const GROUPS");
if (start < 0 || end < 0) throw new Error("Could not find the question bank in the prototype");
const { SUBJECTS } = new Function(`${html.slice(start, end)}; return { SUBJECTS };`)();
const legacy = new Map(Object.values(SUBJECTS).flatMap((s) => s.topics.map((t) => [t.id, t])));

const GROUPS = { PCM: ["phy", "chem", "math"], PCB: ["phy", "chem", "bio"], PCMB: ["phy", "chem", "math", "bio"] };
const FILES = { phy: "physics", chem: "chemistry", math: "maths", bio: "biology" };
const videos = existsSync(new URL("../content/class11/videos.json", import.meta.url))
  ? JSON.parse(readFileSync(new URL("../content/class11/videos.json", import.meta.url), "utf8"))
  : {};

// ---- assemble and validate
const problems = [];
const subjects = [];
const chapters = [];
const practice = [];
const questions = [];
const answers = [];
const seen = new Set();
const coverage = [];
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

for (const [i, [sid, file]] of Object.entries(FILES).entries()) {
  const meta = SUBJECTS[sid];
  subjects.push({ id: sid, name: meta.name, emoji: meta.emoji, color_key: sid, position: i + 1 });
  const { chapters: list } = await import(new URL(`../content/class11/${file}.mjs`, import.meta.url));
  let more = {};
  try {
    ({ more } = await import(new URL(`../content/class11/more-${file}.mjs`, import.meta.url)));
  } catch (e) {
    if (e.code !== "ERR_MODULE_NOT_FOUND") throw e;
  }

  list.forEach((c, idx) => {
    const base = c.legacy ? legacy.get(c.legacy) : null;
    const x = more[c.id] ?? {};
    if (c.legacy && !base) problems.push(`${c.id}: unknown legacy chapter ${c.legacy}`);

    const generated = x.gen ? generate(x.gen, c.id, x.perTemplate ?? 4) : { mcq: [], fib: [] };
    const drops = [...(c.drop ?? []), ...(x.drop ?? [])].map(norm);
    const kept = (arr) => arr.filter((q) => !drops.some((d) => norm(q.q).includes(d)));
    const dedupe = (arr) => {
      const s = new Set();
      return arr.filter((q) => (s.has(norm(q.q)) ? false : (s.add(norm(q.q)), true)));
    };

    const ch = {
      id: c.id,
      title: c.title ?? base?.title,
      mcq: dedupe(kept([...(base?.mcq ?? c.mcq ?? []), ...(c.extra?.mcq ?? []), ...(x.mcq ?? []), ...generated.mcq])),
      fib: dedupe(kept([...(base?.fib ?? c.fib ?? []), ...(c.extra?.fib ?? []), ...(x.fib ?? []), ...generated.fib])),
      paras: [base?.para ?? c.para, ...(x.para ?? [])].filter(Boolean),
      practice: base?.practice ?? c.practice ?? [],
    };
    if (seen.has(ch.id)) problems.push(`${ch.id}: duplicate chapter id`);
    seen.add(ch.id);

    // validation: catches typos before they reach students
    const count = (arr, l) => arr.filter((q) => (q.l ?? 1) === l).length;
    if (!ch.title) problems.push(`${ch.id}: missing title`);
    if (!ch.paras.length || ch.paras.some((p) => !p.q || !p.k?.length)) problems.push(`${ch.id}: written question or key ideas missing`);
    if (ch.practice.length < 3) problems.push(`${ch.id}: fewer than 3 practice items`);
    // Biology keeps the prototype's small bank for now; the depth rules apply to PCM.
    const min = sid === "bio" ? 1 : 5;
    for (const l of [1, 2, 3, 4]) {
      if (count(ch.mcq, l) < min) problems.push(`${ch.id}: only ${count(ch.mcq, l)} MCQs at level ${l} (need ${min}+)`);
    }
    if (count(ch.fib, 1) < 2) problems.push(`${ch.id}: fewer than 2 level-1 fill-in-the-blanks`);
    if (sid !== "bio") {
      for (const l of [2, 3, 4]) {
        if (count(ch.fib, l) < 2) problems.push(`${ch.id}: only ${count(ch.fib, l)} fill-in-the-blanks at level ${l} (need 2+)`);
      }
    }
    ch.mcq.forEach((q, n) => {
      const tag = `${ch.id} MCQ "${q.q.slice(0, 40)}"`;
      if (q.o.length !== 4 || new Set(q.o.map((o) => o.trim())).size !== 4) problems.push(`${tag}: needs 4 different options`);
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) problems.push(`${tag}: bad answer index`);
      if (![1, 2, 3, 4].includes(q.l ?? 1)) problems.push(`${tag}: bad level`);
    });
    ch.fib.forEach((q) => {
      if (!q.q.includes("____")) problems.push(`${ch.id} FIB "${q.q.slice(0, 40)}": no blank (____)`);
      if (!q.a?.length) problems.push(`${ch.id} FIB "${q.q.slice(0, 40)}": no accepted answers`);
    });

    const topics = {};
    [...ch.mcq, ...ch.fib].forEach((q) => { const t = q.t ?? "(prototype)"; topics[t] = (topics[t] ?? 0) + 1; });
    coverage.push({ id: ch.id, subject: meta.name, title: ch.title, mcq: ch.mcq, fib: ch.fib, paras: ch.paras.length, topics });

    chapters.push({
      id: ch.id, subject_id: sid, grade: 11, position: idx + 1, title: ch.title,
      default_video_url: videos[ch.id] ?? base?.video ?? "",
    });
    ch.practice.forEach((prompt, j) => practice.push({ chapter_id: ch.id, position: j + 1, prompt }));

    const add = (kind, level, prompt, options, answer) => {
      const id = crypto.randomUUID();
      questions.push({ id, chapter_id: ch.id, kind, level, prompt, options: options ?? null });
      answers.push({ question_id: id, ...answer });
    };
    ch.mcq.forEach((q) => add("mcq", q.l ?? 1, q.q, q.o, { correct_index: q.a }));
    ch.fib.forEach((q) => add("fib", q.l ?? 1, q.q, null, { accepted_answers: q.a }));
    ch.paras.forEach((p) => add("written", 1, p.q, null, { key_ideas: p.k }));
  });
}

// ---- coverage report (so gaps are visible)
{
  const lv = (arr, l) => arr.filter((q) => (q.l ?? 1) === l).length;
  let md = "# Question bank coverage (Class 11)\n\nGenerated by `npm run seed-content`. Counts are questions available per chapter.\n\n" +
    "| Chapter | MCQ L1 / L2 / L3 / L4 | Fill-in L1 / L2 / L3 / L4 | Written | Total |\n|---|---|---|---|---|\n";
  for (const c of coverage) {
    md += `| ${c.id} ${c.title} | ${[1, 2, 3, 4].map((l) => lv(c.mcq, l)).join(" / ")} | ${[1, 2, 3, 4].map((l) => lv(c.fib, l)).join(" / ")} | ${c.paras} | ${c.mcq.length + c.fib.length + c.paras} |\n`;
  }
  md += "\n## Topics covered by tagged questions\n\n";
  for (const c of coverage) md += `- **${c.id} ${c.title}**: ${Object.entries(c.topics).map(([t, k]) => `${t} (${k})`).join(", ")}\n`;
  writeFileSync(new URL("../docs/COVERAGE.md", import.meta.url), md);
}

if (problems.length) {
  console.error("Content problems found, nothing was loaded:\n - " + problems.join("\n - "));
  process.exit(1);
}
const per = (sid) => chapters.filter((c) => c.subject_id === sid).length;
const summary =
  `${chapters.length} chapters (Physics ${per("phy")}, Chemistry ${per("chem")}, Maths ${per("math")}, Biology ${per("bio")}), ` +
  `${practice.length} practice items, ${questions.length} questions ` +
  `(${questions.filter((q) => q.kind === "mcq").length} MCQ, ${questions.filter((q) => q.kind === "fib").length} fill-in, ${questions.filter((q) => q.kind === "written").length} written).`;
if (dry) {
  console.log("Dry run OK:", summary);
  process.exit(0);
}

// ---- load
const force = process.argv.includes("--force");
const { count } = await db.from("questions").select("id", { count: "exact", head: true });
if (count > 0 && !force) {
  console.log(`The questions table already has ${count} rows. Use --force to wipe and reload.`);
  process.exit(0);
}

const must = async (label, p) => {
  const { error } = await p;
  if (error) {
    console.error(`${label} failed:`, error.message);
    process.exit(1);
  }
};

if (force) {
  // Deleting chapters also deletes progress, tests and notebook status that point at them.
  const { count: progress } = await db.from("chapter_progress").select("student_id", { count: "exact", head: true });
  const { count: attempts } = await db.from("test_attempts").select("id", { count: "exact", head: true });
  if ((progress > 0 || attempts > 0) && !process.argv.includes("--wipe-progress")) {
    console.error(
      `Refusing: ${progress} progress rows and ${attempts} test results exist and would be deleted.\n` +
        "Add --wipe-progress only if you really want that.",
    );
    process.exit(1);
  }
  await must("clear chapters", db.from("chapters").delete().not("id", "is", null)); // cascades to questions, practice
}

await must("subjects", db.from("subjects").upsert(subjects));
await must(
  "group_subjects",
  db.from("group_subjects").upsert(
    Object.entries(GROUPS).flatMap(([grp, subs]) => subs.map((subject_id) => ({ grp, subject_id }))),
  ),
);
await must("chapters", db.from("chapters").upsert(chapters));
await must("chapter_practice", db.from("chapter_practice").upsert(practice));
for (let i = 0; i < questions.length; i += 200) {
  await must("questions", db.from("questions").insert(questions.slice(i, i + 200)));
  await must("question_answers", db.from("question_answers").insert(answers.slice(i, i + 200)));
}
console.log("Loaded", summary);
