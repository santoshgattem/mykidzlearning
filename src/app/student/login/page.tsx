import { SignInForm } from "@/components/sign-in-form";
import { TopBar } from "@/components/ui";
import { signInStudent } from "@/app/actions/auth";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function StudentLogin() {
  await redirectIfSignedIn();
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <SignInForm
          title="Student sign in"
          intro="Use the email and PIN your parent set up."
          secret="pin"
          action={signInStudent}
        />
      </main>
    </>
  );
}
