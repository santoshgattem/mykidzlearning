import { SignInForm } from "@/components/sign-in-form";
import { TopBar } from "@/components/ui";
import { signInStaff } from "@/app/actions/auth";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  await redirectIfSignedIn();
  const { reset } = await searchParams;
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <SignInForm
          title="Admin sign in"
          intro={reset ? "Your password was changed. Please sign in with the new one." : undefined}
          secret="password"
          action={signInStaff.bind(null, "admin")}
          forgotHref="/admin/forgot"
        />
      </main>
    </>
  );
}
