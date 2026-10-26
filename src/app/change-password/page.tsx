import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";
import { btnGhost, TopBar } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { getCurrentUser, HOME } from "@/lib/auth";

// Shown to admins and parents whose password was set or reset by an admin.
export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (!user.mustChangePassword) redirect(HOME[user.role]);

  return (
    <>
      <TopBar>
        <form action={signOut}>
          <button className={`${btnGhost} !rounded-[10px] !px-3 !py-[7px] !text-[0.88rem]`}>
            Sign out
          </button>
        </form>
      </TopBar>
      <main className="mx-auto max-w-[1100px] px-5 py-5">
        <ChangePasswordForm
          askCurrent={false}
          title="Set your own password"
          intro="You signed in with a temporary password. Choose a new one to continue."
        />
      </main>
    </>
  );
}
