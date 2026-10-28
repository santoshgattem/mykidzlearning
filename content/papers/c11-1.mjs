// JEE Main style paper, Class 11 syllabus only. 90 questions: Physics 1-30, Chemistry 31-60, Maths 61-90.
import { physics } from "./c11-1-physics.mjs";
import { chemistry } from "./c11-1-chemistry.mjs";
import { maths } from "./c11-1-maths.mjs";

export const paper = { id: "c11-1", title: "JEE Main Mock 1 (Class 11)", scope: "11", position: 1, duration_minutes: 180 };
export const questions = [
  ...physics.map((q) => ({ ...q, s: "phy" })),
  ...chemistry.map((q) => ({ ...q, s: "chem" })),
  ...maths.map((q) => ({ ...q, s: "math" })),
];
