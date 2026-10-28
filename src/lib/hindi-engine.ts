// Typing Hindi with English letters ("dilli" -> "दिल्ली"), and a forgiving comparison for marking.
// Pure functions with no imports, so the browser, the server and a plain Node test can all use them.

// ---------------------------------------------------------------- Roman -> Devanagari (rule based)
const CONS: Record<string, string> = {
  kh: "ख", gh: "घ", chh: "छ", ch: "च", jh: "झ", Th: "ठ", Dh: "ढ", th: "थ", dh: "ध", ph: "फ", bh: "भ", sh: "श", gy: "ज्ञ", ksh: "क्ष",
  k: "क", g: "ग", c: "क", j: "ज", T: "ट", D: "ड", N: "ण", t: "त", d: "द", n: "न", p: "प", b: "ब", m: "म", y: "य", r: "र", l: "ल",
  v: "व", w: "व", S: "ष", s: "स", h: "ह", f: "फ़", z: "ज़", q: "क़", R: "ड़", x: "क्स",
};
const VOWELS = ["aa", "ii", "ee", "oo", "uu", "ai", "au", "a", "i", "u", "e", "o"];
const IND: Record<string, string> = { a: "अ", aa: "आ", i: "इ", ii: "ई", ee: "ई", u: "उ", uu: "ऊ", oo: "ऊ", e: "ए", ai: "ऐ", o: "ओ", au: "औ" };
const MAT: Record<string, string> = { a: "", aa: "ा", i: "ि", ii: "ी", ee: "ी", u: "ु", uu: "ू", oo: "ू", e: "े", ai: "ै", o: "ो", au: "ौ" };
const MULTI = ["ksh", "chh", "ch", "kh", "gh", "jh", "th", "dh", "ph", "bh", "sh", "gy"];
// n or m just before these is written as an anusvara (ं): hindi -> हिंदी, ganga -> गंगा.
const ANUSVARA_BEFORE = new Set(["k", "kh", "g", "gh", "ch", "chh", "j", "jh", "t", "th", "d", "dh", "T", "Th", "D", "Dh", "p", "ph", "b", "bh", "c"]);

type Item = { c: string; key: string } | { v: string } | { raw: string };

// Splits a typed word into consonants, vowels and anything else. Capital T, D, N, S and R are
// their own letters (ट ड ण ष ड़); any other capital is read as a small letter.
function tokenise(w: string): Item[] {
  const out: Item[] = [];
  let i = 0;
  while (i < w.length) {
    const ch = w[i];
    if ("TDNSR".includes(ch)) {
      if ((ch === "T" || ch === "D") && w[i + 1] === "h") { out.push({ c: CONS[ch + "h"], key: ch + "h" }); i += 2; }
      else { out.push({ c: CONS[ch], key: ch }); i += 1; }
      continue;
    }
    const low = w.slice(i).toLowerCase();
    const multi = MULTI.find((k) => low.startsWith(k));
    if (multi) { out.push({ c: CONS[multi], key: multi }); i += multi.length; continue; }
    const vow = VOWELS.find((k) => low.startsWith(k));
    if (vow) { out.push({ v: vow }); i += vow.length; continue; }
    const one = low[0];
    if (CONS[one] !== undefined) out.push({ c: CONS[one], key: one });
    else out.push({ raw: w[i] });
    i += 1;
  }
  return out;
}

export type Variant = { finalA?: boolean; finalI?: boolean; firstA?: boolean };

// One reading of a typed word. `finalA` makes a last "a" long (tara -> तारा); `finalI` makes a last
// "i" long (dilli -> दिल्ली); `firstA` makes the first "a" long (pani -> पानी).
export function romanToDev(word: string, v: Variant = { finalA: true, finalI: true }): string {
  const w = /^[A-Z]{2,}$/.test(word) ? word.toLowerCase() : word;
  const items = tokenise(w);
  // Long final vowels and a long first "a", when asked for.
  const last = items[items.length - 1];
  if (last && "v" in last && items.length > 1 && "c" in items[items.length - 2]) {
    if (v.finalA && last.v === "a") last.v = "aa";
    if (v.finalI && last.v === "i") last.v = "ii";
  }
  if (v.firstA) {
    const fi = items.findIndex((x) => "v" in x && x.v === "a");
    if (fi > 0 && fi < items.length - 1) (items[fi] as { v: string }).v = "aa";
  }
  let out = "";
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if ("raw" in it) { out += it.raw; continue; }
    if ("v" in it) {
      // A vowel that is not attached to a consonant is a full vowel letter.
      out += IND[it.v] ?? "";
      continue;
    }
    const next = items[i + 1];
    if (next && "v" in next) { out += it.c + (MAT[next.v] ?? ""); i++; continue; }
    if (next && "c" in next) {
      // n or m before a stop is an anusvara, otherwise a joined letter (halant).
      if ((it.key === "n" || it.key === "m") && ANUSVARA_BEFORE.has(next.key) && out.length > 0) { out += "ं"; continue; }
      out += it.c + "्"; continue;
    }
    out += it.c;
  }
  return out;
}

// ---------------------------------------------------------------- phonetic keys for matching words
// Two spellings of the same sound get the same key: vowel length, double letters, the schwa ("a")
// and nasal dots are ignored. Used to look a typed word up in the word list.
const DEV_CONS: Record<string, string> = {
  क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "n", च: "ch", छ: "ch", ज: "j", झ: "jh", ञ: "n", ट: "t", ठ: "th", ड: "d", ढ: "dh", ण: "n",
  त: "t", थ: "th", द: "d", ध: "dh", न: "n", प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y", र: "r", ल: "l", व: "v", श: "sh", ष: "sh", स: "s", ह: "h",
};
const DEV_IND: Record<string, string> = { अ: "", आ: "", इ: "i", ई: "i", उ: "u", ऊ: "u", ए: "e", ऐ: "e", ओ: "o", औ: "o", ऋ: "ri" };
const DEV_MAT: Record<string, string> = { "ा": "", "ि": "i", "ी": "i", "ु": "u", "ू": "u", "े": "e", "ै": "e", "ो": "o", "ौ": "o", "ृ": "ri", "ॉ": "o", "ॅ": "e" };

function squash(s: string): string {
  return s.replace(/(.)\1+/g, "$1");
}

export function devKey(d: string): string {
  const s = d.normalize("NFD").replace(/ज्ञ/g, "gy");
  let out = "";
  for (const ch of s) {
    if (ch in DEV_CONS) out += DEV_CONS[ch];
    else if (ch in DEV_IND) out += DEV_IND[ch];
    else if (ch in DEV_MAT) out += DEV_MAT[ch];
    else if (ch === "ं" || ch === "ँ") out += "n";
    else if (ch === "ः") out += "h";
    else if (/[A-Za-z]/.test(ch)) out += ch.toLowerCase();
  }
  return squash(out.replace(/chh/g, "ch").replace(/(ch|kh|gh|jh|th|dh|ph|bh|sh)\1+/g, "$1"));
}

export function romanKeys(r: string): string[] {
  let s = r.toLowerCase();
  s = s.replace(/chh|cch/g, "ch").replace(/ck/g, "k").replace(/f/g, "ph").replace(/w/g, "v").replace(/z/g, "j").replace(/q/g, "k").replace(/x/g, "ksh");
  s = s.replace(/c(?!h)/g, "k");
  s = s.replace(/aa|ee|ii|oo|uu/g, (m) => ({ aa: "a", ee: "i", ii: "i", oo: "u", uu: "u" })[m]!).replace(/ei|ey/g, "e").replace(/au|ou/g, "o");
  // "ai" is ऐ (है) in some words and आई (भाई) in others: try both readings.
  const reads = s.includes("ai") ? [s.replace(/ai/g, "e"), s.replace(/ai/g, "i")] : [s];
  return reads.map((x) => squash(x.replace(/a/g, "").replace(/(ch|kh|gh|jh|th|dh|ph|bh|sh)\1+/g, "$1")));
}
export const romanKey = (r: string) => romanKeys(r)[0];
// A looser key that also ignores aspiration (th/t, kh/k, bh/b), for children who type "tanda" for ठंडा.
const loose = (k: string) => k.replace(/h/g, "");
// The bare consonants, for children who write a spoken "e" or "i" in the middle (behen for बहन).
const bare = (k: string) => k.replace(/[aeiouh]/g, "");
// English school words children type as they see them.
const ALIASES: Record<string, string> = { school: "स्कूल", class: "क्लास", copy: "कॉपी", pencil: "पेंसिल", bag: "बैग", bus: "बस", train: "ट्रेन", teacher: "टीचर", ok: "ओके", asia: "एशिया", europe: "यूरोप", africa: "अफ्रीका", australia: "ऑस्ट्रेलिया", india: "इंडिया", antarctica: "अंटार्कटिका", america: "अमेरिका", earth: "अर्थ" };

// ---------------------------------------------------------------- word list and suggestions
export function makeHindi(words: string[]) {
  const strict = new Map<string, string[]>();
  const looser = new Map<string, string[]>();
  const barer = new Map<string, string[]>();
  const keys: [string, string][] = [];
  const add = (m: Map<string, string[]>, k: string, w: string) => { const a = m.get(k); if (a) { if (!a.includes(w)) a.push(w); } else m.set(k, [w]); };
  for (const w of words) {
    const k = devKey(w);
    if (!k) continue;
    add(strict, k, w);
    add(looser, loose(k), w);
    add(barer, bare(k), w);
    keys.push([k, w]);
  }

  // Up to `limit` Devanagari guesses for a typed English-letter word, best first.
  function suggest(roman: string, limit = 5): string[] {
    const rks = romanKeys(roman);
    const out: string[] = [];
    const push = (w: string) => { if (w && !out.includes(w) && out.length < limit) out.push(w); };
    const alias = ALIASES[roman.toLowerCase()];
    if (alias) push(alias);
    rks.forEach((rk) => (strict.get(rk) ?? []).forEach(push));
    rks.forEach((rk) => (looser.get(loose(rk)) ?? []).forEach(push));
    // Rule-based readings, for words that are not in the list.
    const variants: Variant[] = [{ finalA: true, finalI: true }, { finalA: false, finalI: true }, { finalA: true, finalI: false }, { firstA: true, finalA: true, finalI: true }];
    variants.forEach((v) => push(romanToDev(roman, v)));
    // Spoken e or i in the middle of a word, then words that begin the same way.
    rks.forEach((rk) => rk.length >= 2 && (barer.get(bare(rk)) ?? []).forEach(push));
    const rk = rks[0];
    if (rk.length >= 2) for (const [k, w] of keys) { if (k.startsWith(rk) && k !== rk) push(w); if (out.length >= limit) break; }
    return out;
  }
  const best = (roman: string) => suggest(roman, 1)[0] ?? roman;
  return { suggest, best };
}

// ---------------------------------------------------------------- forgiving comparison (marking)
// Ignores harmless differences: long or short vowel signs (पानी / पानि), chandrabindu or anusvara
// (हूँ / हूं), dots under letters (ज़ / ज), a trailing danda or full stop, spaces and case.
export function hindiNorm(s: string): string {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/़/g, "")
    .normalize("NFC")
    .replace(/[ँं]/g, "ं")
    .replace(/ी/g, "ि").replace(/ू/g, "ु").replace(/ई/g, "इ").replace(/ऊ/g, "उ")
    .replace(/[।.!?,]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
export const hindiMatch = (accepted: string[], input: string) => {
  const n = hindiNorm(input);
  return n !== "" && accepted.some((a) => hindiNorm(a) === n);
};

// Turns every run of English letters in `text` into Devanagari.
export function finalizeHindi(text: string, best: (r: string) => string): string {
  return text.replace(/[A-Za-z]+/g, (m) => best(m));
}
