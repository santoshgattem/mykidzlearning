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
  PCM: ["phy", "chem", "math"],
  PCB: ["phy", "chem", "bio"],
  PCMB: ["phy", "chem", "math", "bio"],
} as const;
export type Group = keyof typeof GROUPS;

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
