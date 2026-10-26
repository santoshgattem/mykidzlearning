import "server-only";
import { randomInt } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { fibCorrect, gradeWritten, MIN_WORDS } from "@/lib/grading";
import { LEVELS, TEST, levelPoints, testSeconds, TEST_GRACE_SECONDS, type Level } from "@/lib/learning";

// ---------------------------------------------------------------- types shared with the client
export type TestView = {
  chapterId: string;
  level: Level;
  levelName: string;
  points: number;
  tries: number;
  deadline: string; // ISO time the server will stop accepting this try
  serverNow: number; // ms, lets the browser correct for a wrong clock
  limitSeconds: number;
  notice: string;
  right: number;
  total: number;
  mcq: { id: string; prompt: string; options: string[]; ok: boolean; answer: number | null }[];
  fib: { id: string; prompt: string; ok: boolean; answer: string }[];
  written: {
    id: string;
    prompt: string;
    ok: boolean;
    answer: string;
    minWords: number;
    feedback: string;
    via: string;
    hint: string;
  };
};

export type TestResult = {
  level: Level;
  levelName: string;
  tries: number;
  gained: number;
  feedback: string;
  pointsAfter: number;
};

export type Answers = { mcq: Record<string, number>; fib: Record<string, string>; written: string };

type Session = {
  student_id: string;
  chapter_id: string;
  level: number;
  question_ids: { mcq: string[]; fib: string[]; written: string };
  ok: { mcq: Record<string, boolean>; fib: Record<string, boolean>; written: boolean };
  answers: { mcq: Record<string, number>; fib: Record<string, string>; written: string };
  tries: number;
  feedback: string | null;
  graded_by: string | null;
  deadline: string;
  limit_seconds: number;
};

const shuffle = <T,>(a: T[]) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

const left = (s: Session) => ({
  mcq: s.question_ids.mcq.filter((id) => !s.ok.mcq[id]).length,
  fib: s.question_ids.fib.filter((id) => !s.ok.fib[id]).length,
  written: !s.ok.written,
});

const newDeadline = (level: number, l: ReturnType<typeof left>) => {
  const secs = testSeconds(level as Level, l);
  return { limit_seconds: secs, deadline: new Date(Date.now() + secs * 1000).toISOString() };
};

// ---------------------------------------------------------------- start / resume
// One test in progress per student. Questions come from the student's current level and are
// topped up from lower levels, as in the prototype.
export async function ensureSession(studentId: string, chapterId: string, level: Level) {
  const db = createAdminClient();
  const { data: existing } = await db.from("test_sessions").select("chapter_id").eq("student_id", studentId).maybeSingle();
  if (existing?.chapter_id === chapterId) return;
  if (existing) await db.from("test_sessions").delete().eq("student_id", studentId);

  const { data: qs } = await db.from("questions").select("id, kind, level").eq("chapter_id", chapterId).lte("level", level);
  const pool = qs ?? [];
  const pick = (kind: string, n: number) => {
    let out: string[] = [];
    for (let l = level; l >= 1 && out.length < n; l--) {
      const ids = shuffle(pool.filter((q) => q.kind === kind && q.level === l)).map((q) => q.id as string);
      out = out.concat(ids.slice(0, n - out.length));
    }
    return out;
  };
  const mcq = pick("mcq", TEST.mcq);
  const fib = pick("fib", TEST.fib);
  const written = shuffle(pool.filter((q) => q.kind === "written")).map((q) => q.id as string)[0];
  if (!mcq.length || !written) throw new Error("This chapter has no questions yet.");

  const base = { mcq: {}, fib: {}, written: false };
  const first = newDeadline(level, { mcq: mcq.length, fib: fib.length, written: true });
  const { error } = await db.from("test_sessions").insert({
    student_id: studentId,
    chapter_id: chapterId,
    level,
    question_ids: { mcq, fib, written },
    ok: base,
    answers: { mcq: {}, fib: {}, written: "" },
    ...first,
  });
  if (error) throw new Error("Couldn’t start the test.");
}

async function getSession(studentId: string, chapterId: string): Promise<Session | null> {
  const { data } = await createAdminClient().from("test_sessions").select("*").eq("student_id", studentId).eq("chapter_id", chapterId).maybeSingle();
  return (data as Session | null) ?? null;
}

// ---------------------------------------------------------------- the view sent to the browser
// Contains prompts and options only. Correct answers never leave the server.
async function buildView(s: Session, notice = ""): Promise<TestView> {
  const db = createAdminClient();
  const ids = [...s.question_ids.mcq, ...s.question_ids.fib, s.question_ids.written];
  const { data: qs } = await db.from("questions").select("id, prompt, options").in("id", ids);
  const byId = new Map((qs ?? []).map((q) => [q.id as string, q]));

  let hint = "";
  if (!s.ok.written && s.tries >= 2) {
    const { data: a } = await db.from("question_answers").select("key_ideas").eq("question_id", s.question_ids.written).maybeSingle();
    const k = (a?.key_ideas ?? []).slice(0, 2) as string[];
    if (k.length) hint = `Hint: a strong answer uses terms like ${k.join(", ")}.`;
  }

  const level = s.level as Level;
  const mcq = s.question_ids.mcq.map((id) => ({
    id,
    prompt: byId.get(id)?.prompt ?? "",
    options: (byId.get(id)?.options ?? []) as string[],
    ok: !!s.ok.mcq[id],
    answer: s.ok.mcq[id] ? (s.answers.mcq[id] ?? null) : null,
  }));
  const fib = s.question_ids.fib.map((id) => ({
    id,
    prompt: byId.get(id)?.prompt ?? "",
    ok: !!s.ok.fib[id],
    answer: s.ok.fib[id] ? (s.answers.fib[id] ?? "") : "",
  }));
  const written = {
    id: s.question_ids.written,
    prompt: (byId.get(s.question_ids.written)?.prompt ?? "").replace(/^In two lines,?\s*/i, "").replace(/^./, (c: string) => c.toUpperCase()),
    ok: s.ok.written,
    answer: s.answers.written,
    minWords: MIN_WORDS[level] ?? 10,
    feedback: s.tries > 0 ? (s.feedback ?? "") : "",
    via: s.graded_by ?? "",
    hint,
  };
  const right = mcq.filter((q) => q.ok).length + fib.filter((q) => q.ok).length + (written.ok ? 1 : 0);

  return {
    chapterId: s.chapter_id,
    level,
    levelName: LEVELS[level].n,
    points: levelPoints(level),
    tries: s.tries,
    deadline: s.deadline,
    serverNow: Date.now(),
    limitSeconds: s.limit_seconds,
    notice,
    right,
    total: mcq.length + fib.length + 1,
    mcq,
    fib,
    written,
  };
}

// For the test page. If the clock ran out while the student was away, they get fresh time
// for the questions still to answer (nothing is lost).
export async function loadTestView(studentId: string, chapterId: string): Promise<TestView | null> {
  const s = await getSession(studentId, chapterId);
  if (!s) return null;
  let notice = "";
  if (Date.now() > new Date(s.deadline).getTime() + TEST_GRACE_SECONDS * 1000) {
    const fresh = newDeadline(s.level, left(s));
    await createAdminClient().from("test_sessions").update(fresh).eq("student_id", studentId);
    Object.assign(s, fresh);
    notice = "Time ran out while you were away. Here is fresh time for the questions you still need to answer.";
  }
  return buildView(s, notice);
}

// ---------------------------------------------------------------- checking a try
export type SubmitOutcome =
  | { status: "progress"; view: TestView }
  | { status: "late"; view: TestView }
  | { status: "done"; result: TestResult }
  | { status: "error"; error: string };

export async function submitAnswers(studentId: string, chapterId: string, input: Answers): Promise<SubmitOutcome> {
  const db = createAdminClient();
  const s = await getSession(studentId, chapterId);
  if (!s) return { status: "error", error: "There is no test in progress for this chapter." };

  // Past the deadline (plus a little slack for slow connections): nothing is checked.
  if (Date.now() > new Date(s.deadline).getTime() + TEST_GRACE_SECONDS * 1000) {
    const fresh = newDeadline(s.level, left(s));
    await db.from("test_sessions").update(fresh).eq("student_id", studentId);
    Object.assign(s, fresh);
    return {
      status: "late",
      view: await buildView(s, "Time was up before your answers arrived, so they weren’t checked. You have fresh time for the questions still to answer."),
    };
  }

  const ids = [...s.question_ids.mcq, ...s.question_ids.fib, s.question_ids.written];
  const { data: keys } = await db.from("question_answers").select("question_id, correct_index, accepted_answers, key_ideas").in("question_id", ids);
  const key = new Map((keys ?? []).map((k) => [k.question_id as string, k]));

  const ok = { mcq: { ...s.ok.mcq }, fib: { ...s.ok.fib }, written: s.ok.written };
  const answers = { mcq: { ...s.answers.mcq }, fib: { ...s.answers.fib }, written: s.answers.written };

  for (const id of s.question_ids.mcq) {
    if (ok.mcq[id]) continue; // correct answers stay locked in
    const raw = input.mcq?.[id];
    const sel = Number.isInteger(raw) ? (raw as number) : -1;
    answers.mcq[id] = sel;
    ok.mcq[id] = sel === key.get(id)?.correct_index;
  }
  for (const id of s.question_ids.fib) {
    if (ok.fib[id]) continue;
    const text = String(input.fib?.[id] ?? "").slice(0, 200);
    answers.fib[id] = text;
    ok.fib[id] = fibCorrect((key.get(id)?.accepted_answers ?? []) as string[], text);
  }
  let feedback = s.feedback ?? "";
  let via = s.graded_by ?? "";
  if (!ok.written) {
    const text = String(input.written ?? "").slice(0, 2000);
    answers.written = text;
    const { data: chRow } = await db.from("chapters").select("title, subject_id").eq("id", chapterId).single();
    const { data: subRow } = await db.from("subjects").select("name").eq("id", chRow?.subject_id ?? "").maybeSingle();
    const { data: wq } = await db.from("questions").select("prompt").eq("id", s.question_ids.written).single();
    const g = await gradeWritten({
      studentId,
      subject: subRow?.name ?? "",
      chapter: chRow?.title ?? "",
      level: s.level,
      levelName: LEVELS[s.level as Level].n,
      question: String(wq?.prompt ?? "").replace(/^In two lines,?\s*/i, ""),
      keyIdeas: (key.get(s.question_ids.written)?.key_ideas ?? []) as string[],
      answer: text,
    });
    ok.written = g.correct;
    feedback = g.feedback;
    via = g.via;
  }
  const tries = s.tries + 1;
  const all =
    s.question_ids.mcq.every((id) => ok.mcq[id]) && s.question_ids.fib.every((id) => ok.fib[id]) && ok.written;

  if (!all) {
    const next = { ...s, ok, answers, tries, feedback, graded_by: via };
    const fresh = newDeadline(s.level, left(next));
    await db
      .from("test_sessions")
      .update({ ok, answers, tries, feedback, graded_by: via, updated_at: new Date().toISOString(), ...fresh })
      .eq("student_id", studentId);
    return { status: "progress", view: await buildView({ ...next, ...fresh }) };
  }

  // 100%. Deleting the session is the guard that makes sure points are given only once,
  // even if the same request arrives twice.
  const { data: removed } = await db
    .from("test_sessions")
    .delete()
    .eq("student_id", studentId)
    .eq("chapter_id", chapterId)
    .eq("tries", s.tries)
    .select("student_id");
  if (!removed?.length) {
    const again = await getSession(studentId, chapterId);
    return again
      ? { status: "progress", view: await buildView(again) }
      : { status: "error", error: "This test was already completed." };
  }

  const level = s.level as Level;
  const pts = levelPoints(level);
  const { data: prev } = await db
    .from("chapter_progress")
    .select("completed_level, completed_points")
    .eq("student_id", studentId)
    .eq("chapter_id", chapterId)
    .maybeSingle();
  const prevPts = prev?.completed_points ?? 0;
  const gained = Math.max(0, pts - prevPts);

  if (!prev?.completed_level || level > prev.completed_level) {
    await db.from("chapter_progress").upsert(
      {
        student_id: studentId,
        chapter_id: chapterId,
        completed_level: level,
        completed_points: Math.max(pts, prevPts),
        completed_at: new Date().toISOString(),
      },
      { onConflict: "student_id,chapter_id" },
    );
  }
  await db.from("test_attempts").insert({
    student_id: studentId,
    chapter_id: chapterId,
    level,
    tries,
    written_answer: answers.written,
    feedback,
    graded_by: via || null,
  });

  const { data: ch } = await db.from("chapters").select("title").eq("id", chapterId).single();
  let pointsAfter = 0;
  if (gained > 0) {
    const { data: r } = await db.rpc("add_points", {
      p_student: studentId,
      p_amount: gained,
      p_reason: `100% in ${ch?.title ?? chapterId} (${LEVELS[level].n})`,
      p_by: null,
    });
    pointsAfter = (Array.isArray(r) ? r[0] : r)?.points_after ?? 0;
  } else {
    const { data: st } = await db.from("students").select("points").eq("id", studentId).single();
    pointsAfter = st?.points ?? 0;
  }

  return { status: "done", result: { level, levelName: LEVELS[level].n, tries, gained, feedback, pointsAfter } };
}

// The most recent completed test for a chapter, for the result page. The points gained are
// read from the ledger row written at the same moment (none for a revision round).
export async function latestResult(studentId: string, chapterId: string, maxAgeMinutes = 60) {
  const db = createAdminClient();
  const { data: a } = await db
    .from("test_attempts")
    .select("level, tries, feedback, created_at")
    .eq("student_id", studentId)
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!a || Date.now() - new Date(a.created_at).getTime() > maxAgeMinutes * 60_000) return null;

  const { data: ch } = await db.from("chapters").select("title").eq("id", chapterId).single();
  const from = new Date(new Date(a.created_at).getTime() - 30_000).toISOString();
  const { data: led } = await db
    .from("point_ledger")
    .select("amount")
    .eq("student_id", studentId)
    .like("reason", `100% in ${ch?.title ?? chapterId} (%`)
    .gte("created_at", from)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const level = a.level as Level;
  return {
    level,
    levelName: LEVELS[level].n,
    tries: a.tries as number,
    feedback: (a.feedback as string) ?? "",
    gained: led?.amount ?? 0,
    title: ch?.title ?? "",
  };
}
