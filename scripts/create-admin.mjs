// Creates the FIRST admin account. Run it yourself in a terminal:
//   npm run create-admin
// The password is typed here, hidden, and goes straight to your Supabase project.
// It is never written to a file or printed.
import readline from "node:readline";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase settings. Fill in .env.local first.");
  process.exit(1);
}

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      const write = rl._writeToOutput.bind(rl);
      rl._writeToOutput = (s) => (s.includes(question) ? write(s) : undefined);
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

const name = await ask("Admin name: ");
const email = (await ask("Admin email: ")).toLowerCase();
const password = await ask("Password (min 8 characters, hidden): ", { hidden: true });
const again = await ask("Type the password again: ", { hidden: true });

if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Enter a name and a valid email.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("The password needs at least 8 characters.");
  process.exit(1);
}
if (password !== again) {
  console.error("The two passwords don't match.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (error || !data.user) {
  console.error("Couldn't create the user:", error?.message ?? "unknown error");
  process.exit(1);
}

const { error: profileError } = await db.from("profiles").insert({
  id: data.user.id,
  role: "admin",
  full_name: name,
  email,
  must_change_password: false,
});
if (profileError) {
  await db.auth.admin.deleteUser(data.user.id);
  console.error("Couldn't create the admin profile (did you run 0001_init.sql?):", profileError.message);
  process.exit(1);
}

console.log(`Admin created. Sign in at /admin/login with ${email}`);
