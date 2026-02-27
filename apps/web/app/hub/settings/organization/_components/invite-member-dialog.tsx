"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
	email: z.email("Invalid email address"),
	role: z.enum(["member", "admin", "owner"]),
});

type FormValues = z.infer<typeof schema>;

export const InviteMemberDialog = () => {
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", role: "member" },
	});

	const onSubmit = async (data: FormValues) => {
		const { error: inviteError } = await authClient.organization.inviteMember({
			email: data.email,
			role: data.role,
			resend: true,
		});

		if (inviteError) {
			setError(inviteError.message || "Something went wrong");
			return;
		}

		toast.success("Member invited");
		form.reset();
		router.refresh();
		setOpen(false);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={<Button size="sm" variant="outline" />}>
				Invite
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite member</DialogTitle>
					<DialogDescription>
						Invite a new member to your organization.
					</DialogDescription>
				</DialogHeader>
				<form id="invite-member-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						{error ? (
							<Alert className="border-destructive" variant="destructive">
								<AlertTriangleIcon />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}
						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="invite-member-email">
										Email address
									</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										autoComplete="email"
										id="invite-member-email"
										type="email"
									/>
									{fieldState.invalid ? (
										<FieldError errors={[fieldState.error]} />
									) : null}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="role"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="invite-member-role">Role</FieldLabel>
									<Select
										name={field.name}
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger
											aria-invalid={fieldState.invalid}
											id="invite-member-role"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="member">Member</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
											<SelectItem value="owner">Owner</SelectItem>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError errors={[fieldState.error]} />
									) : null}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={form.formState.isSubmitting}
						form="invite-member-form"
						type="submit"
					>
						<LoadingSwap isLoading={!!form.formState.isSubmitting}>
							Invite
						</LoadingSwap>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
