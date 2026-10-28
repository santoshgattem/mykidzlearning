import { AdminResetForm } from "@/components/admin-reset-form";
import { TopBar } from "@/components/ui";
import { redirectIfSignedIn } from "@/lib/auth";

export default async function AdminForgot() {
  await redirectIfSignedIn();
  return (
    <>
      <TopBar />
      <main className="px-5 py-5">
        <AdminResetForm />
      </main>
    </>
  );
}
