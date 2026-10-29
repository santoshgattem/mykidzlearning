import "server-only";
import { randomInt } from "node:crypto";
import { aiGradeKid } from "@/lib/ai-grader";
import { fibCorrect, norm } from "@/lib/grading";
import { hindiMatch, hindiNorm } from "@/lib/hindi-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { completeSet } from "@/lib/sets";
import { KID_TEST, TEST_GRACE_SECONDS, KID_LEVELS, levelPoints, type Level } from "@/lib/learning";

// The Class 3 test: 5 multiple-choice, 5 fill-in-the-blanks and 5 one-line answers. It follows the
// same rules as the Class 11 test (marks only at 100%, correct answers stay locked in, the child only
// redoes the wrong ones, right answers are never shown) with a relaxed 20-minute timer.

export type KidView = {
  chapterId: string;
  level: Level;
  levelName: string;
  points: number;
  setNo: number;
  tries: number;
  deadline: string;
  serverNow: number;
  limitSeconds: number;
  notice: string;
  right: number;
  total: number;
  mcq: { id: string; prompt: string; options: string[]; ok: boolean; answer: number | null }[];
  fib: { id: string; prompt: string; ok: boolean; answer: string }[];
  short: { id: string; prompt: string; ok: boolean; answer: string; feedback: string }[];
};
export type KidAnswers = { mcq: Record<string, number>; fib: Record<string, string>; short: Record<string, string> };
export type KidOutcome =
  | { status: "progress"; view: KidView }
  | { status: "late"; view: KidView }
  | { status: "done"; setNo: number }
  | { status: "error"; error: string };

type Session = {
  student_id: string; chapter_id: string; level: number; set_no: number;
  question_ids: { mcq: string[]; fib: string[]; short: string[] };
  ok: { mcq: Record<string, boolean>; fib: Record<string, boolean>; short: Record<string, boolean> };
  answers: KidAnswers;
  tries: number;
  feedback: string | null; // JSON: { questionId: feedback }
  deadline: string; limit_seconds: number;
};

const shuffle = <T,>(a: T[]) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};
const fresh = () => ({ limit_seconds: KID_TEST.seconds, deadline: new Date(Date.now() + KID_TEST.seconds * 1000).toISOString() });
const parseFb = (s: string | null): Record<string, string> => { try { return JSON.parse(s || "{}"); } catch { return {}; } };

export async function ensureKidSession(studentId: string, chapterId: string, level: Level, setNo = 1) {
  const db = createAdminClient();
  const { data: existing } = await db.from("test_sessions").select("chapter_id, set_no").eq("student_id", studentId).maybeSingle();
  if (existing?.chapter_id === chapterId && (existing.set_no ?? 1) === setNo) return;
  if (existing) await db.from("test_sessions").delete().eq("student_id", studentId);

  // Set 1 draws at the student's level, topped up from below, as always. Sets 2 and 3 are fixed in
  // difficulty by the set itself, so they draw from all of their own questions.
  let q = db.from("questions").select("id, kind, level").eq("chapter_id", chapterId).eq("set_no", setNo);
  if (setNo === 1) q = q.lte("level", level);
  const { data: qs } = await q;
  const pool = qs ?? [];
  // Questions from the current level first, topped up from the levels below it.
  const pick = (kind: string, n: number) => {
    if (setNo > 1) return shuffle(pool.filter((q) => q.kind === kind)).map((q) => q.id as string).slice(0, n);
    let out: string[] = [];
    for (let l = level; l >= 1 && out.length < n; l--) {
      out = out.concat(shuffle(pool.filter((q) => q.kind === kind && q.level === l)).map((q) => q.id as string).slice(0, n - out.length));
    }
    return out;
  };
  const mcq = pick("mcq", KID_TEST.mcq), fib = pick("fib", KID_TEST.fib), short = pick("written", KID_TEST.short);
  if (!mcq.length && !fib.length && !short.length) throw new Error("This chapter has no questions yet.");

  const { error } = await db.from("test_sessions").insert({
    student_id: studentId, chapter_id: chapterId, level, set_no: setNo,
    question_ids: { mcq, fib, short }, ok: { mcq: {}, fib: {}, short: {} },
    answers: { mcq: {}, fib: {}, short: {} }, ...fresh(),
  });
  if (error) throw new Error("Couldn’t start the test.");
}

async function getSession(studentId: string, chapterId: string): Promise<Session | null> {
  const { data } = await createAdminClient().from("test_sessions").select("*").eq("student_id", studentId).eq("chapter_id", chapterId).maybeSingle();
  const s = data as Session | null;
  // A session made by the Class 11 test has a different shape; it is not ours.
  return s && Array.isArray(s.question_ids?.short) ? s : null;
}

// Prompts and options only. Right answers never leave the server.
async function buildView(s: Session, notice = ""): Promise<KidView> {
  const ids = [...s.question_ids.mcq, ...s.question_ids.fib, ...s.question_ids.short];
  const { data: qs } = await createAdminClient().from("questions").select("id, prompt, options").in("id", ids);
  const by = new Map((qs ?? []).map((q) => [q.id as string, q]));
  const fb = parseFb(s.feedback);
  const level = s.level as Level;
  const mcq = s.question_ids.mcq.map((id) => ({
    id, prompt: by.get(id)?.prompt ?? "", options: (by.get(id)?.options ?? []) as string[],
    ok: !!s.ok.mcq[id], answer: s.ok.mcq[id] ? (s.answers.mcq[id] ?? null) : null,
  }));
  const fib = s.question_ids.fib.map((id) => ({
    id, prompt: by.get(id)?.prompt ?? "", ok: !!s.ok.fib[id], answer: s.ok.fib[id] ? (s.answers.fib[id] ?? "") : "",
  }));
  const short = s.question_ids.short.map((id) => ({
    id, prompt: by.get(id)?.prompt ?? "", ok: !!s.ok.short[id], answer: s.answers.short[id] ?? "",
    feedback: s.tries > 0 ? (fb[id] ?? "") : "",
  }));
  const right = [...mcq, ...fib, ...short].filter((q) => q.ok).length;
  return {
    chapterId: s.chapter_id, level, levelName: KID_LEVELS[level].n, points: s.set_no > 1 ? 0 : levelPoints(level), setNo: s.set_no ?? 1,
    tries: s.tries, deadline: s.deadline, serverNow: Date.now(), limitSeconds: s.limit_seconds,
    notice, right, total: mcq.length + fib.length + short.length, mcq, fib, short,
  };
}

export async function loadKidView(studentId: string, chapterId: string): Promise<KidView | null> {
  const s = await getSession(studentId, chapterId);
  if (!s) return null;
  let notice = "";
  if (Date.now() > new Date(s.deadline).getTime() + TEST_GRACE_SECONDS * 1000) {
    const f = fresh();
    await createAdminClient().from("test_sessions").update(f).eq("student_id", studentId);
    Object.assign(s, f);
    notice = "Time ran out while you were away. Here is fresh time for the questions you still need to answer.";
  }
  return buildView(s, notice);
}

// A one-line answer is right if the AI teacher says so; if the AI cannot answer for any reason,
// it is right when it contains one of the question's key words.
const keyCheck = (keys: string[], answer: string) => {
  const low = norm(answer);
  const hi = hindiNorm(answer);
  return (low !== "" && keys.some((k) => low.includes(norm(k)))) || (hi !== "" && keys.some((k) => hi.includes(hindiNorm(k))));
};

export async function submitKidAnswers(studentId: string, chapterId: string, input: KidAnswers): Promise<KidOutcome> {
  const db = createAdminClient();
  const s = await getSession(studentId, chapterId);
  if (!s) return { status: "error", error: "There is no test in progress for this chapter." };

  if (Date.now() > new Date(s.deadline).getTime() + TEST_GRACE_SECONDS * 1000) {
    const f = fresh();
    await db.from("test_sessions").update(f).eq("student_id", studentId);
    Object.assign(s, f);
    return { status: "late", view: await buildView(s, "Time was up before your answers arrived, so they weren’t checked. You have fresh time to try again.") };
  }

  const ids = [...s.question_ids.mcq, ...s.question_ids.fib, ...s.question_ids.short];
  const { data: chapter } = await db.from("chapters").select("title, subject_id").eq("id", chapterId).single();
  const isHindi = chapter?.subject_id === "c3-hin";
  const { data: keys } = await db.from("question_answers").select("question_id, correct_index, accepted_answers, key_ideas").in("question_id", ids);
  const key = new Map((keys ?? []).map((k) => [k.question_id as string, k]));
  const ok = { mcq: { ...s.ok.mcq }, fib: { ...s.ok.fib }, short: { ...s.ok.short } };
  const answers: KidAnswers = { mcq: { ...s.answers.mcq }, fib: { ...s.answers.fib }, short: { ...s.answers.short } };

  for (const id of s.question_ids.mcq) {
    if (ok.mcq[id]) continue;
    const raw = input.mcq?.[id];
    const sel = Number.isInteger(raw) ? (raw as number) : -1;
    answers.mcq[id] = sel;
    ok.mcq[id] = sel === key.get(id)?.correct_index;
  }
  for (const id of s.question_ids.fib) {
    if (ok.fib[id]) continue;
    const text = String(input.fib?.[id] ?? "").slice(0, 100);
    answers.fib[id] = text;
    const accepted = (key.get(id)?.accepted_answers ?? []) as string[];
    // Hindi: harmless spelling differences (long/short vowel signs, chandrabindu, dots) are accepted.
    ok.fib[id] = fibCorrect(accepted, text) || (isHindi && hindiMatch(accepted, text));
  }

  // One-line answers still to mark, all in a single AI call.
  const fb = parseFb(s.feedback);
  const todo = s.question_ids.short.filter((id) => !ok.short[id]);
  const items = [];
  for (const id of todo) {
    const text = String(input.short?.[id] ?? "").slice(0, 300);
    answers.short[id] = text;
    if (!text.trim()) { ok.short[id] = false; fb[id] = "Write your answer in one line."; continue; }
    items.push({ id, text });
  }
  if (items.length) {
    const ch = chapter;
    const { data: sub } = await db.from("subjects").select("name").eq("id", ch?.subject_id ?? "").maybeSingle();
    const { data: prompts } = await db.from("questions").select("id, prompt").in("id", items.map((i) => i.id));
    const q = new Map((prompts ?? []).map((p) => [p.id as string, p.prompt as string]));
    const r = await aiGradeKid({
      studentId, subject: sub?.name ?? "", chapter: ch?.title ?? "",
      items: items.map((i) => ({ id: i.id, question: q.get(i.id) ?? "", keyIdeas: (key.get(i.id)?.key_ideas ?? []) as string[], answer: i.text })),
    });
    for (const i of items) {
      const g = r.ok ? r.grades.get(i.id) : undefined;
      if (g) { ok.short[i.id] = g.correct; fb[i.id] = g.feedback; }
      else {
        const good = keyCheck((key.get(i.id)?.key_ideas ?? []) as string[], i.text);
        ok.short[i.id] = good;
        fb[i.id] = good ? "Well done!" : "Not quite. Think about it again and try once more.";
      }
    }
  }

  const tries = s.tries + 1;
  const all = ids.every((id) => ok.mcq[id] || ok.fib[id] || ok.short[id]);
  const feedback = JSON.stringify(fb);

  if (!all) {
    const next = { ...s, ok, answers, tries, feedback };
    const f = fresh();
    await db.from("test_sessions").update({ ok, answers, tries, feedback, updated_at: new Date().toISOString(), ...f }).eq("student_id", studentId);
    return { status: "progress", view: await buildView({ ...next, ...f }) };
  }

  // 100%. Deleting the session makes sure the points are given only once.
  const { data: removed } = await db.from("test_sessions").delete().eq("student_id", studentId).eq("chapter_id", chapterId).eq("tries", s.tries).select("student_id");
  if (!removed?.length) {
    const again = await getSession(studentId, chapterId);
    return again ? { status: "progress", view: await buildView(again) } : { status: "error", error: "This test was already completed." };
  }

  if ((s.set_no ?? 1) > 1) {
    const { data: chT } = await db.from("chapters").select("title").eq("id", chapterId).single();
    await completeSet(studentId, chapterId, s.set_no, s.level as Level, tries, chT?.title ?? chapterId);
    return { status: "done", setNo: s.set_no };
  }

  const level = s.level as Level;
  const pts = levelPoints(level);
  const { data: prev } = await db.from("chapter_progress").select("completed_level, completed_points").eq("student_id", studentId).eq("chapter_id", chapterId).maybeSingle();
  const prevPts = prev?.completed_points ?? 0;
  const gained = Math.max(0, pts - prevPts);
  if (!prev?.completed_level || level > prev.completed_level) {
    await db.from("chapter_progress").upsert(
      { student_id: studentId, chapter_id: chapterId, completed_level: level, completed_points: Math.max(pts, prevPts), completed_at: new Date().toISOString() },
      { onConflict: "student_id,chapter_id" },
    );
  }
  const lastFeedback = ""; // the result screen has its own message; old hints would only confuse
  await db.from("test_attempts").insert({
    student_id: studentId, chapter_id: chapterId, level, tries,
    written_answer: s.question_ids.short.map((id) => answers.short[id]).join(" | ").slice(0, 1000), feedback: lastFeedback, graded_by: "ai",
  });
  const { data: chRow } = await db.from("chapters").select("title").eq("id", chapterId).single();
  if (gained > 0) {
    await db.rpc("add_points", { p_student: studentId, p_amount: gained, p_reason: `100% in ${chRow?.title ?? chapterId} (${KID_LEVELS[level].n})`, p_by: null });
  }
  return { status: "done", setNo: 1 };
}
