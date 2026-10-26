import "server-only";

export const PIN_REGEX = /^\d{4}$/;
export const PIN_MAX_ATTEMPTS = 5;
export const PIN_LOCK_MINUTES = 15;

// Students' Supabase password is "<PIN>:<server pepper>". Supabase stores only the bcrypt
// hash, and the pepper never leaves the server, so a 4-digit PIN cannot be guessed
// against Supabase Auth directly. All PIN checks go through the sign-in action, which
// enforces the lockout.
export function pinToPassword(pin: string) {
  const pepper = process.env.STUDENT_PIN_PEPPER;
  if (!pepper || pepper.length < 24) {
    throw new Error("STUDENT_PIN_PEPPER is missing or too short");
  }
  return `${pin}:${pepper}`;
}
