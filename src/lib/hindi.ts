import WORDS from "./hindi-words.json";
import { makeHindi } from "./hindi-engine";

// The word list and the typing helpers, ready to use.
export const hindi = makeHindi(WORDS as string[]);
export { finalizeHindi, hindiMatch, hindiNorm } from "./hindi-engine";
