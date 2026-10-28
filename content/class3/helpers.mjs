// Helpers for writing Class 3 content.
//   mc(q, correct, [3 wrong])  multiple choice; the right option's position is derived from the text
//   fb(q, [accepted answers])  fill in the blank (the blank is written ____)
//   sh(q, [key words])         one-line answer; the AI teacher marks it, the key words are guidance
//                              and the fallback check if the AI is unavailable
// Questions are Foundation level (1) unless a level is given as the last argument.
export const mc = (q, correct, wrong, l = 1) => {
  if (wrong.length !== 3) throw new Error(`mc needs 3 wrong options: ${q}`);
  let h = 0;
  for (const ch of q) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const at = h % 4;
  const o = [...wrong.map(String)];
  o.splice(at, 0, String(correct));
  return { l, q, o, a: at };
};
export const fb = (q, accepted, l = 1) => ({ l, q, a: accepted.map(String) });
export const sh = (q, keys, l = 1) => ({ l, q, k: keys.map(String) });
