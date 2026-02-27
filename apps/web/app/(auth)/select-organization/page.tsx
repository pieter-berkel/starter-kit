import { auth } from "@workspace/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Selector } from "./_components/organization-selector";

export default async function Page() {
	const organizations = await auth.api.listOrganizations({
		headers: await headers(),
	});

	if (organizations.length === 0) {
		redirect("/onboarding");
	}

	if (organizations.length === 1) {
		await auth.api.setActiveOrganization({
			headers: await headers(),
			body: { organizationId: organizations[0]?.id },
		});

		redirect("/hub");
	}

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-6 text-center font-bold text-3xl tracking-tight">
					Select your organization
				</h2>
				<p className="mt-2 text-center text-muted-foreground text-sm">
					Please select your organization to continue
				</p>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<Selector organizations={organizations} />
			</div>
		</div>
	);
}
