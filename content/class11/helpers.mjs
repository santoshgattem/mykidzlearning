// Helpers for writing questions.
//
// M(topic, level, question, correct, [wrong, wrong, wrong])  -> multiple choice
//   The right answer is placed at a position chosen from the question text, so the
//   author never has to count option indexes and the answers are not always "B".
// F(topic, level, question, answer | [answers])               -> fill in the blank
// P(topic, question, keyIdeas)                                -> written question
// generate(templates, key, perTemplate)                       -> numeric questions whose
//   answers are computed by code, so they are right by construction.

export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = hash(String(seed));
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}

export const M = (t, l, q, correct, wrong) => {
  if (wrong.length !== 3) throw new Error(`M(): need 3 wrong options for "${q}"`);
  const pos = hash(q) % 4;
  const o = [...wrong];
  o.splice(pos, 0, correct);
  return { t, l, q, o, a: pos };
};
export const F = (t, l, q, a) => ({ t, l, q, a: Array.isArray(a) ? a : [a] });
export const P = (t, q, k) => ({ t, q, k });

// ---- number formatting for generated questions
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
export const sup = (n) => String(n).split("").map((c) => SUP[c]).join("");

// 3 significant figures, trailing zeros removed; scientific form for very large/small values
export function n(x) {
  if (x === 0) return "0";
  const ax = Math.abs(x);
  if (ax >= 1e6 || ax < 1e-3) {
    const e = Math.floor(Math.log10(ax));
    const m = Number((x / 10 ** e).toPrecision(3));
    return `${m} × 10${sup(e)}`;
  }
  return String(Number(x.toPrecision(4)));
}

// ---- generated numeric questions
// A template is (r) => { l, t, q, a, w:[3 wrong] }   (multiple choice, a and w are strings)
//                  or { l, t, q, fib: [accepted answers] }            (fill in the blank)
// or null to skip a combination that is not clean.
export function generate(templates, key, perTemplate = 4) {
  const mcq = [];
  const fib = [];
  const seen = new Set();
  templates.forEach((tpl, i) => {
    let made = 0;
    for (let k = 0; k < 80 && made < perTemplate; k++) {
      const r = rng(`${key}:${i}:${k}`);
      const x = tpl(r);
      if (!x || seen.has(x.q)) continue;
      if (x.fib) {
        seen.add(x.q);
        fib.push(F(x.t, x.l, x.q, x.fib));
      } else {
        const opts = [x.a, ...x.w];
        if (new Set(opts).size !== 4) continue; // distractors must differ from each other and the answer
        seen.add(x.q);
        mcq.push(M(x.t, x.l, x.q, x.a, x.w));
      }
      made++;
    }
  });
  return { mcq, fib };
}

// Subscript digits for chemical formulae in generated questions
export const sub = (x) => String(x).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);
// Signed oxidation number
export const sgn = (x) => (x > 0 ? `+${x}` : x < 0 ? `−${Math.abs(x)}` : "0");

// Maths helpers for generated questions
export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const frac = (a, b) => {
  const g = gcd(a, b);
  let p = a / g, q = b / g;
  if (q < 0) { p = -p; q = -q; }
  return q === 1 ? `${p}` : `${p}/${q}`;
};
export const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
export const comb = (nn, r) => (r < 0 || r > nn ? 0 : fact(nn) / (fact(r) * fact(nn - r)));
export const perm = (nn, r) => (r < 0 || r > nn ? 0 : fact(nn) / fact(nn - r));
// complex number a + bi as text
export const cx = (a, b) => {
  const im = b === 1 ? "i" : b === -1 ? "−i" : `${Math.abs(b)}i`;
  if (b === 0) return `${a}`;
  if (a === 0) return b < 0 ? `−${im.replace("−", "")}` : im;
  return `${a} ${b < 0 ? "−" : "+"} ${b === 1 || b === -1 ? "i" : Math.abs(b) + "i"}`;
};
