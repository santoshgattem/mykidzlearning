// Words that mark a cold sales pitch rather than a real message to the admin. Used by the form (to disable
// Send and explain why) and again on the server, so the rule cannot be skipped by calling the action directly.
export const BLOCKED_MESSAGE = "This website is for personal use, google search is not needed";
const BLOCKED = /\b(google|search|seo|services?)\b/i;
export const hasBlockedWord = (text: string) => BLOCKED.test(text);
