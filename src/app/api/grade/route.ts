import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { aiGrade } from "@/lib/ai-grader";
import { basicGrade, lengthGrade, MIN_WORDS, norm } from "@/lib/grading";
import { LEVELS, type Level } from "@/lib/learning";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/grade
//   { subject, chapter, level, question, keyIdeas, minWords, answer } -> { correct, feedback }
//
// Gives a signed-in student the AI teacher's verdict on a written answer. It records
// nothing: points and progress are decided only inside the test itself (src/lib/test.ts),
// which calls the same grader on the server. Because this route is public to students, it
// does not trust the body: the question must match a real written question, and the key
// ideas and minimum length come from the database, not from the request. That also stops
// it being used as a free general-purpose AI endpoint.

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const text = (v: unknown, max: number) => (typeof v === "string" && v.length > 0 && v.length <= max ? v : null);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") return bad("Please sign in as a student.", 401);

  if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return bad("Send JSON.", 415);
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("That wasn’t valid JSON.");
  }

  const subject = text(body.subject, 80);
  const chapter = text(body.chapter, 160);
  const question = text(body.question, 600);
  const answer = text(body.answer, 2000);
  if (!subject || !chapter || !question || !answer) return bad("Missing or too long: subject, chapter, question or answer.");

  // Level may arrive as a number (1-4) or as its name ("JEE Main").
  const level = ([1, 2, 3, 4] as Level[]).find(
    (l) => l === Number(body.level) || norm(LEVELS[l].n) === norm(body.level),
  );
  if (!level) return bad("Unknown level.");

  // Find the real question this refers to.
  const db = createAdminClient();
  const { data: sub } = await db.from("subjects").select("id").ilike("name", subject).maybeSingle();
  const { data: ch } = sub
    ? await db.from("chapters").select("id, title").eq("subject_id", sub.id).ilike("title", chapter).maybeSingle()
    : { data: null };
  if (!ch) return bad("Unknown chapter.");
  const { data: wq } = await db.from("questions").select("id, prompt").eq("chapter_id", ch.id).eq("kind", "written");
  const strip = (p: string) => norm(p.replace(/^In two lines,?\s*/i, ""));
  const real = (wq ?? []).find((q) => strip(q.prompt) === strip(question));
  if (!real) return bad("That isn’t one of this chapter’s questions.");
  const { data: key } = await db.from("question_answers").select("key_ideas").eq("question_id", real.id).single();
  const keyIdeas = (key?.key_ideas ?? []) as string[];

  // 1. Minimum word count, before any AI call.
  const short = lengthGrade(level, answer);
  if (short) return NextResponse.json({ correct: short.correct, feedback: short.feedback });

  // 2. AI teacher, 3. key-term check if the AI cannot answer.
  const r = await aiGrade({
    studentId: user.id,
    subject,
    chapter: ch.title,
    level: LEVELS[level].n,
    question: real.prompt.replace(/^In two lines,?\s*/i, ""),
    keyIdeas,
    minWords: MIN_WORDS[level],
    answer,
  });
  if (!r.ok && r.reason === "rate_limited") {
    return bad("Too many checks at once. Wait a few minutes and try again.", 429);
  }
  const g = r.ok ? r.grade : basicGrade(level, keyIdeas, answer);
  return NextResponse.json({ correct: g.correct, feedback: g.feedback });
}
