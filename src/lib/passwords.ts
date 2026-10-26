import "server-only";
import { randomInt } from "node:crypto";

export const MIN_PASSWORD_LENGTH = 8;

// No look-alike characters (0/O, 1/l/I), so parents can read it out over the phone.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTempPassword(length = 10) {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}
