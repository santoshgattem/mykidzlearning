import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { PAPER } from "@/lib/learning";

export type Subject = "phy" | "chem" | "math";
export const SUBJECT_NAMES: Record<Subject, string> = { phy: "Physics", chem: "Chemistry", math: "Mathematics" };

export type Paper = { id: string; title: string; scope: "11" | "11+12"; duration_minutes: number; position: number };
export type PaperQuestion = {
  id: string; position: number; subject: Subject; section: "mcq" | "num"; prompt: string; options: string[] | null;
};
export type Attempt = {
  id: string; student_id: string; paper_id: string; started_at: string; deadline: string;
  answers: Record<string, number>; submitted_at: string | null;
  marks: number | null; correct: number | null; wrong: number | null; skipped: number | null;
  breakdown: Breakdown | null; bonus_points: number;
};
export type Tally = { marks: number; correct: number; wrong: number; skipped: number; total: number };
export type Breakdown = {
  subjects: Record<Subject, Tally>;
  chapters: ({ subject: Subject; chapter: string; grade: number } & Omit<Tally, "marks">)[];
};

const ATTEMPT_COLS = "id, student_id, paper_id, started_at, deadline, answers, submitted_at, marks, correct, wrong, skipped, breakdown, bonus_points";

export async function listPapers(): Promise<Paper[]> {
  const { data } = await createAdminClient().from("papers").select("id, title, scope, duration_minutes, position").order("position");
  return (data ?? []) as Paper[];
}

export async function myAttempts(studentId: string): Promise<Attempt[]> {
  const { data } = await createAdminClient()
    .from("paper_attempts").select(ATTEMPT_COLS).eq("student_id", studentId).order("started_at", { ascending: false });
  return (data ?? []) as Attempt[];
}

export async function startAttempt(studentId: string, paperId: string): Promise<Attempt | null> {
  const db = createAdminClient();
  const { data: paper } = await db.from("papers").select("id, duration_minutes").eq("id", paperId).maybeSingle();
  if (!paper) return null;
  // The unique index allows one unfinished attempt per paper: starting again resumes it.
  const { data: open } = await db
    .from("paper_attempts").select(ATTEMPT_COLS).eq("student_id", studentId).eq("paper_id", paperId).is("submitted_at", null).maybeSingle();
  if (open) return open as Attempt;
  const deadline = new Date(Date.now() + paper.duration_minutes * 60_000).toISOString();
  const { data, error } = await db
    .from("paper_attempts").insert({ student_id: studentId, paper_id: paperId, deadline }).select(ATTEMPT_COLS).single();
  if (error) {
    const { data: again } = await db
      .from("paper_attempts").select(ATTEMPT_COLS).eq("student_id", studentId).eq("paper_id", paperId).is("submitted_at", null).maybeSingle();
    return (again as Attempt) ?? null; // a double click raced us
  }
  return data as Attempt;
}

// What the student sees during the exam: prompts and options only. No answers, no chapter names.
export async function examQuestions(paperId: string): Promise<PaperQuestion[]> {
  const { data } = await createAdminClient()
    .from("paper_questions").select("id, position, subject, section, prompt, options").eq("paper_id", paperId).order("position");
  return (data ?? []) as PaperQuestion[];
}

export async function getAttempt(studentId: string, attemptId: string): Promise<Attempt | null> {
  const { data } = await createAdminClient()
    .from("paper_attempts").select(ATTEMPT_COLS).eq("id", attemptId).eq("student_id", studentId).maybeSingle();
  return (data as Attempt) ?? null;
}

export const timeLeftSeconds = (a: Attempt, now = Date.now()) => Math.max(0, Math.ceil((new Date(a.deadline).getTime() - now) / 1000));

export async function saveAnswer(studentId: string, attemptId: string, questionId: string, value: number | null): Promise<boolean> {
  const db = createAdminClient();
  // The question must belong to this attempt's paper, and the value must fit its type.
  const { data: a } = await db.from("paper_attempts").select("paper_id").eq("id", attemptId).eq("student_id", studentId).maybeSingle();
  if (!a) return false;
  const { data: q } = await db.from("paper_questions").select("section, paper_id").eq("id", questionId).maybeSingle();
  if (!q || q.paper_id !== a.paper_id) return false;
  if (value !== null) {
    if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 1e9) return false;
    if (q.section === "mcq" && ![0, 1, 2, 3].includes(value)) return false;
  }
  const { data: ok } = await db.rpc("paper_set_answer", {
    p_attempt: attemptId, p_student: studentId, p_question: questionId, p_value: value,
  });
  return ok === true;
}

const blank = (): Tally => ({ marks: 0, correct: 0, wrong: 0, skipped: 0, total: 0 });

// Marks the paper and stores the result. Only the call that actually closes the attempt
// goes on to give the bonus, so a double submit cannot pay twice.
export async function finalizeAttempt(studentId: string, attemptId: string): Promise<Attempt | null> {
  const db = createAdminClient();
  const a = await getAttempt(studentId, attemptId);
  if (!a) return null;
  if (a.submitted_at) return a;

  const [{ data: qs }, { data: keys }, { data: paper }] = await Promise.all([
    db.from("paper_questions").select("id, subject, section, grade, chapter").eq("paper_id", a.paper_id),
    db.from("paper_answers").select("question_id, correct_index, num_answer, num_tolerance, paper_questions!inner(paper_id)").eq("paper_questions.paper_id", a.paper_id),
    db.from("papers").select("title").eq("id", a.paper_id).single(),
  ]);
  const key = new Map((keys ?? []).map((k) => [k.question_id, k]));

  const subjects: Record<Subject, Tally> = { phy: blank(), chem: blank(), math: blank() };
  const chapters = new Map<string, Breakdown["chapters"][number]>();
  let answered = 0;
  for (const q of qs ?? []) {
    const k = key.get(q.id);
    const given = a.answers[q.id];
    const s = subjects[q.subject as Subject];
    const ck = `${q.subject}|${q.chapter}`;
    const c = chapters.get(ck) ?? { subject: q.subject as Subject, chapter: q.chapter, grade: q.grade, correct: 0, wrong: 0, skipped: 0, total: 0 };
    s.total++; c.total++;
    if (given === undefined || given === null || !k) {
      s.skipped++; c.skipped++;
    } else {
      answered++;
      const right = q.section === "mcq"
        ? given === k.correct_index
        : k.num_answer !== null && Math.abs(Number(given) - Number(k.num_answer)) <= Number(k.num_tolerance) + 1e-12;
      if (right) { s.correct++; c.correct++; s.marks += PAPER.right; }
      else {
        s.wrong++; c.wrong++;
        if (q.section === "mcq") s.marks += PAPER.wrong; // wrong numerical answers cost nothing
      }
    }
    chapters.set(ck, c);
  }
  const all = Object.values(subjects);
  const sum = (f: (t: Tally) => number) => all.reduce((n, t) => n + f(t), 0);
  const breakdown: Breakdown = { subjects, chapters: [...chapters.values()] };

  // Only the call that flips submitted_at from empty goes on.
  const { data: closed } = await db
    .from("paper_attempts")
    .update({
      submitted_at: new Date().toISOString(),
      marks: sum((t) => t.marks), correct: sum((t) => t.correct), wrong: sum((t) => t.wrong), skipped: sum((t) => t.skipped),
      breakdown,
    })
    .eq("id", attemptId).eq("student_id", studentId).is("submitted_at", null)
    .select("id");
  if (closed?.length && answered >= PAPER.bonusMinAnswered) {
    const { count } = await db
      .from("paper_attempts").select("id", { count: "exact", head: true })
      .eq("student_id", studentId).eq("paper_id", a.paper_id).gt("bonus_points", 0);
    if (!count) {
      await db.rpc("add_points", {
        p_student: studentId, p_amount: PAPER.bonus, p_reason: `JEE paper finished: ${paper?.title ?? a.paper_id}`, p_by: null,
      });
      await db.from("paper_attempts").update({ bonus_points: PAPER.bonus }).eq("id", attemptId);
    }
  }
  return getAttempt(studentId, attemptId);
}
