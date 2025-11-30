import { auth, getOwnedOrganizations } from "@workspace/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./_components/delete-account-card";
import { DetailsCard } from "./_components/details-card";
import { SessionsCard } from "./_components/sessions-card";
import { UpdatePasswordCard } from "./_components/update-password-card";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const sessions = await auth.api.listSessions({ headers: await headers() });
  sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const ownedOrganizations = await getOwnedOrganizations({ userId: session.user.id });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
      <h1 className="font-bold text-3xl">My account</h1>

      <DetailsCard defaultValues={{ name: session.user.name, email: session.user.email }} />

      <UpdatePasswordCard />

      <SessionsCard activeSessionId={session.session.id} sessions={sessions} />

      <DeleteAccountCard ownedOrganizations={ownedOrganizations} user={session.user} />
    </div>
  );
}
