"use client";

import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const InvitationButtons = ({
	disabled,
	invitationId,
}: {
	disabled: boolean;
	invitationId: string;
}) => {
	const router = useRouter();

	const handleDecline = useCallback(async () => {
		const { error } = await authClient.organization.rejectInvitation({
			invitationId,
		});

		if (error) {
			toast.error(error.message || "Something went wrong");
			return;
		}

		toast.success("Invitation declined");
		router.push("/");
	}, [invitationId, router]);

	const handleAccept = useCallback(async () => {
		const { error } = await authClient.organization.acceptInvitation({
			invitationId,
		});

		if (error) {
			toast.error(error.message || "Something went wrong");
			return;
		}

		toast.success("Invitation accepted");
		router.push("/hub");
	}, [invitationId, router]);

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Button disabled={disabled} onClick={handleDecline} variant="outline">
				Decline
			</Button>
			<Button disabled={disabled} onClick={handleAccept}>
				Accept
			</Button>
		</div>
	);
};
