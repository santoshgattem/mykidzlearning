// The learning week runs Monday 00:00 to Sunday 24:00 in India time (UTC+5:30, no daylight saving).
const IST_MS = (5 * 60 + 30) * 60_000;

// The instant (UTC) at which the current week began.
export function weekStart(now = new Date()): Date {
  const ist = new Date(now.getTime() + IST_MS);
  const sinceMonday = (ist.getUTCDay() + 6) % 7; // Monday = 0
  const mondayIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - sinceMonday);
  return new Date(mondayIst - IST_MS);
}

// "2026-10-26", used to remember which week a reminder was sent for.
export const weekKey = (now = new Date()) => new Date(weekStart(now).getTime() + IST_MS).toISOString().slice(0, 10);
