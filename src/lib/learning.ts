// Scoring and level rules, copied from the prototype. Changing these changes scoring,
// so ask before editing (see CLAUDE.md).

export const PTS = { video: 20, mcq: 10, fib: 10, paraMax: 30, notebook: 50 } as const;
export const TEST = { mcq: 3, fib: 2 } as const;

export const LEVELS = {
  1: { n: "Foundation", d: "NCERT basics", x: 1 },
  2: { n: "CBSE Board", d: "Board exam level", x: 1.5 },
  3: { n: "JEE Main", d: "JEE Main level", x: 2 },
  4: { n: "JEE Advanced", d: "JEE Advanced level", x: 3 },
} as const;
export type Level = keyof typeof LEVELS;

export const TIERS = {
  bronze: { n: "Bronze", i: "🥉" },
  silver: { n: "Silver", i: "🥈" },
  gold: { n: "Gold", i: "🥇" },
  diamond: { n: "Diamond", i: "💎" },
} as const;
export type Tier = keyof typeof TIERS;
export const TIER_IDS = Object.keys(TIERS) as Tier[];

export const GROUPS = {
  PCM: ["phy", "chem", "math", "eng"],
  PCB: ["phy", "chem", "bio", "eng"],
  PCMB: ["phy", "chem", "math", "bio", "eng"],
  // Class 3 (CBSE): no group choice, every subject. Subject ids start with c3-.
  C3: ["c3-tel", "c3-eng", "c3-math", "c3-evs", "c3-hin"],
} as const;
export type Group = keyof typeof GROUPS;
// The groups a Class 11 student can pick.
export const SENIOR_GROUPS = ["PCM", "PCB", "PCMB"] as const;

// ---- Class 3
// Same points, same reward road, same 25/50/75% steps. Only the level names are gentler.
export const KID_GRADE = 3;
export const isKid = (grade: number | null | undefined) => grade === KID_GRADE;
export const KID_LEVELS = {
  1: { n: "Explorer", d: "Easy", x: 1 },
  2: { n: "Adventurer", d: "Medium", x: 1.5 },
  3: { n: "Champion", d: "Tricky", x: 2 },
  4: { n: "Super Star", d: "Challenge", x: 3 },
} as const;
export const levelsFor = (grade: number | null | undefined) => (isKid(grade) ? KID_LEVELS : LEVELS);
export const levelName = (grade: number | null | undefined, l: Level) => levelsFor(grade)[l].n;
// 5 multiple-choice, 5 fill-in-the-blanks and 5 one-line answers; a relaxed 20 minutes per try.
export const KID_TEST = { mcq: 5, fib: 5, short: 5, seconds: 20 * 60 } as const;

export const DEFAULT_CHANNEL = "Physics Wallah";

// Test timer. Time per question, in seconds, grows with the level because JEE-level
// questions need calculation. The written answer gets a larger allowance because students
// are told to research first (video, Google, NCERT) and then write in their own words.
// The timer is soft: when it runs out the answers entered so far are checked as one try.
// Nothing is lost: correct answers stay locked in and the student redoes the rest.
export const TEST_TIME: Record<Level, { mcq: number; fib: number; written: number }> = {
  1: { mcq: 60, fib: 60, written: 600 }, // 15 min for a full test
  2: { mcq: 90, fib: 90, written: 720 }, // 19.5 min
  3: { mcq: 120, fib: 120, written: 900 }, // 25 min
  4: { mcq: 180, fib: 180, written: 900 }, // 30 min
};

// Seconds allowed for a test (or a retry) with the given questions still to answer.
export const testSeconds = (level: Level, left: { mcq: number; fib: number; written: boolean }) =>
  left.mcq * TEST_TIME[level].mcq + left.fib * TEST_TIME[level].fib + (left.written ? TEST_TIME[level].written : 0);

// The server adds this much slack on top of the deadline for slow connections.
export const TEST_GRACE_SECONDS = 30;

const topicMax = TEST.mcq * PTS.mcq + TEST.fib * PTS.fib + PTS.paraMax; // 80

export const levelPoints = (l: Level) => Math.round(topicMax * LEVELS[l].x);

// Levels rise with syllabus completion of the student's group: 25%, 50%, 75%.
export const levelForPct = (pct: number): Level => (pct >= 75 ? 4 : pct >= 50 ? 3 : pct >= 25 ? 2 : 1);

export const syllabusPct = (done: number, total: number) =>
  total ? Math.round((done / total) * 100) : 0;

export const fmt = (n: number) => n.toLocaleString("en-IN");

// Weekly habit: tests passed at 100% each Monday-Sunday (India time). Below this by Saturday
// evening, the student and the parent get a reminder email.
export const WEEKLY_TARGET = 5;

// JEE Main style papers: +4 right, -1 wrong multiple-choice, 0 wrong numerical. 90 questions, 300 marks.
export const PAPER = {
  right: 4,
  wrong: -1,
  maxMarks: 300,
  // Each subject has 10 numerical questions but only 5 are marked: the first 5 the student answers (as in JEE Main).
  numMarked: 5,
  minutes: 180,
  graceSeconds: 30,
  // A fixed bonus the first time a paper is finished with at least this many questions answered,
  // so opening a paper and submitting it blank earns nothing. Once per paper per student.
  bonus: 200,
  bonusMinAnswered: 30,
} as const;
