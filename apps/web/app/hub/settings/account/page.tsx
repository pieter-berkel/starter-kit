import { auth, getOwnedOrganizations } from "@workspace/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteAccountCard } from "./_components/delete-account-card";
import { DetailsCard } from "./_components/details-card";
import { SessionsCard } from "./_components/sessions-card";
import { UpdatePasswordCard } from "./_components/update-password-card";

export default async function Page() {
	const headersList = await headers();

	const [session, sessions] = await Promise.all([
		auth.api.getSession({ headers: headersList }),
		auth.api.listSessions({ headers: headersList }),
	]);

	if (!session) {
		redirect("/sign-in");
	}

	sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

	const ownedOrganizations = await getOwnedOrganizations({
		userId: session.user.id,
	});

	return (
		<div className="flex flex-col gap-8">
			<DetailsCard
				defaultValues={{ name: session.user.name, email: session.user.email }}
			/>
			<UpdatePasswordCard />
			<SessionsCard activeSessionId={session.session.id} sessions={sessions} />
			<DeleteAccountCard
				ownedOrganizations={ownedOrganizations}
				user={session.user}
			/>
		</div>
	);
}
