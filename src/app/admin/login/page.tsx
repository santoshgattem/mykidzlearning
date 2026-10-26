import { SignInForm } from "@/components/sign-in-form";
import { TopBar } from "@/components/ui";
import { signInStaff } from "@/app/actions/auth";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function AdminLogin() {
  await redirectIfSignedIn();
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <SignInForm title="Admin sign in" secret="password" action={signInStaff.bind(null, "admin")} />
      </main>
    </>
  );
}
