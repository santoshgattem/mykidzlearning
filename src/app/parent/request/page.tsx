import Link from "next/link";
import { RequestAccountForm } from "@/components/request-account-form";
import { TopBar } from "@/components/ui";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function RequestPage() {
  await redirectIfSignedIn();
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <RequestAccountForm />
        <p className="mx-auto mt-4 max-w-[460px] text-center text-[0.9rem]">
          <Link href="/parent/login">← Back to sign in</Link>
        </p>
      </main>
    </>
  );
}
