// Builds src/lib/hindi-words.json: every Hindi word in the Class 3 Hindi content, most common first,
// followed by a list of everyday words children use. Run after changing content/class3/hindi.mjs.
//   node scripts/build-hindi-dict.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chapters } from "../content/class3/hindi.mjs";

const count = new Map();
const add = (text) => {
  for (const w of String(text).split(/[^ऀ-ॿ]+/)) {
    if (!w || w.length < 1 || /[०-९।॥]/.test(w)) continue;
    count.set(w, (count.get(w) ?? 0) + 1);
  }
};
for (const c of chapters) {
  add(c.title);
  [...c.mcq, ...c.fib, ...c.short].forEach((q) => { add(q.q); (q.o ?? []).forEach(add); (Array.isArray(q.a) ? q.a : []).forEach(add); (q.k ?? []).forEach(add); });
  (c.practice ?? []).forEach(add);
}
const extra = readFileSync(new URL("../content/class3/hindi-words.txt", import.meta.url), "utf8").split(/\s+/).filter(Boolean);
extra.forEach((w) => count.set(w, (count.get(w) ?? 0) + 0.5)); // everyday words rank after words from the lessons
const words = [...count.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
writeFileSync(new URL("../src/lib/hindi-words.json", import.meta.url), JSON.stringify(words));
console.log(`${words.length} words written`);
