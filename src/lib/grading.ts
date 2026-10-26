import "server-only";
import { aiGrade } from "@/lib/ai-grader";

export const MIN_WORDS: Record<number, number> = { 1: 10, 2: 15, 3: 20, 4: 25 };

// Lower-case, drop apostrophes, unify minus signs and collapse spaces.
export const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.$/, "");

export const fibCorrect = (accepted: string[], input: string) => {
  const n = norm(input);
  return n !== "" && accepted.some((a) => norm(a) === n);
};

export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export type WrittenGrade = { correct: boolean; feedback: string; via: "basic" | "length" | "ai" };

// The prototype's key-term check. Used when the AI is unavailable, over its limit, or fails.
export function basicGrade(level: number, keyIdeas: string[], answer: string): WrittenGrade {
  const need = level >= 3 ? 3 : 2;
  const low = norm(answer);
  const hits = keyIdeas.filter((k) => low.includes(norm(k))).length;
  const ok = hits >= need;
  return {
    correct: ok,
    via: "basic",
    feedback: ok
      ? "Good, you used the right terms."
      : "Explain the idea more fully, using the correct terms from the lesson.",
  };
}

export function lengthGrade(level: number, answer: string): WrittenGrade | null {
  const min = MIN_WORDS[level] ?? 10;
  const words = wordCount(answer);
  if (words >= min) return null;
  return {
    correct: false,
    via: "length",
    feedback: `Good start! Write at least ${min} words so your explanation is complete. You have ${words} so far.`,
  };
}

// Written answers, in the order CLAUDE.md asks for:
//   1. enforce the minimum word count BEFORE any AI call,
//   2. ask the AI teacher (rate-limited per student),
//   3. if the AI cannot answer for any reason, fall back to the key-term check.
export async function gradeWritten(input: {
  studentId: string;
  subject: string;
  chapter: string;
  levelName: string;
  level: number;
  question: string;
  keyIdeas: string[];
  answer: string;
}): Promise<WrittenGrade> {
  const short = lengthGrade(input.level, input.answer);
  if (short) return short;

  const r = await aiGrade({
    studentId: input.studentId,
    subject: input.subject,
    chapter: input.chapter,
    level: input.levelName,
    question: input.question,
    keyIdeas: input.keyIdeas,
    minWords: MIN_WORDS[input.level] ?? 10,
    answer: input.answer,
  });
  return r.ok ? r.grade : basicGrade(input.level, input.keyIdeas, input.answer);
}
