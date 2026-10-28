import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_MINUTES = 10;
export const OTP_MAX_TRIES = 5;

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

// A keyed hash, so a copy of the table is no use without the server's secret. Fails closed.
function pepper() {
  const p = process.env.STUDENT_PIN_PEPPER;
  if (!p) throw new Error("STUDENT_PIN_PEPPER is not set");
  return p;
}
export const hashCode = (userId: string, code: string) => createHmac("sha256", pepper()).update(`otp:${userId}:${code}`).digest("hex");

export function sameHash(a: string, b: string) {
  const x = Buffer.from(a, "hex"), y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}
