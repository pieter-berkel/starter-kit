"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { ActionButton } from "@workspace/ui/components/action-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const LeaveCard = ({
	organization,
}: {
	organization: Auth["$Infer"]["Organization"];
}) => {
	const router = useRouter();

	const handleLeaveOrganization = useCallback(async () => {
		const { error } = await authClient.organization.leave({
			organizationId: organization.id,
		});

		if (error) {
			toast.error(error.message || "Something went wrong");
			return;
		}

		toast.success("You have left the organization");
		router.push("/select-organization");
	}, [organization.id, router]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Leave organization</CardTitle>
				<CardDescription>
					Leave your organization and remove your access to it.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ActionButton
					action={handleLeaveOrganization}
					confirmation="simple"
					confirmText="Leave organization"
					title="Leave your organization?"
					variant="destructive"
				>
					Leave organization
				</ActionButton>
			</CardContent>
		</Card>
	);
};
