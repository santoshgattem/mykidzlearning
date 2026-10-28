import Link from "next/link";
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
          footer="Parent accounts are created by the mykidzlearning admin. Contact them if you have forgotten your password."
        />
        <p className="mx-auto mt-4 max-w-[460px] text-center">
          New here? <Link href="/parent/request" className="font-bold">Request an account</Link>
        </p>
      </main>
    </>
  );
}
