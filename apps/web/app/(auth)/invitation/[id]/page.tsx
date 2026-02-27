import { auth } from "@workspace/auth";
import { Alert, AlertTitle } from "@workspace/ui/components/alert";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { InvitationButtons } from "./_components/invitation-buttons";

export default async function Page(props: PageProps<"/invitation/[id]">) {
	const { id } = await props.params;
	const headersList = await headers();

	const session = await auth.api.getSession({ headers: headersList });

	if (!session) {
		// Gets handled by the proxy
		throw new Error("Unauthorized");
	}

	const invitation = await auth.api.getInvitation({
		headers: headersList,
		query: { id },
	});

	if (!invitation) {
		notFound();
	}

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-6 text-center font-bold text-3xl tracking-tight">
					You've been invited
				</h2>
				<p className="mt-2 text-center text-muted-foreground text-sm">
					You've been invited to join "{invitation.organizationName}"
				</p>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				{["rejected", "canceled"].includes(invitation.status) && (
					<Alert className="border-destructive" variant="destructive">
						<AlertTriangleIcon />
						<AlertTitle>
							The invitation to join "{invitation.organizationName}" has been{" "}
							{invitation.status === "rejected" ? "rejected" : "canceled"}.
						</AlertTitle>
					</Alert>
				)}
				{invitation.status === "accepted" && (
					<Alert variant="default">
						<CheckCircle2Icon />
						<AlertTitle>
							The invitation to join "{invitation.organizationName}" has been
							accepted.
						</AlertTitle>
					</Alert>
				)}
				<InvitationButtons
					disabled={invitation.status !== "pending"}
					invitationId={invitation.id}
				/>
			</div>
		</div>
	);
}
