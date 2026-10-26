import { SignInForm } from "@/components/sign-in-form";
import { TopBar } from "@/components/ui";
import { signInStaff } from "@/app/actions/auth";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function ParentLogin() {
  await redirectIfSignedIn();
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <SignInForm
          title="Parent sign in"
          secret="password"
          action={signInStaff.bind(null, "parent")}
          footer="Parent accounts are created by the mykidzlearning admin. Contact them if you need an account or have forgotten your password."
        />
      </main>
    </>
  );
}
