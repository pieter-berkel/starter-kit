"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

type FormValues = z.infer<typeof schema>;

export const UpdatePasswordCard = () => {
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		await authClient.changePassword(
			{
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			},
			{
				onError: ({ error }) => {
					toast.error(error.message || "Something went wrong");
					return;
				},
				onSuccess: () => {
					toast.success("Password updated successfully");
					form.reset();
					router.refresh();
				},
			},
		);
	};

	return (
		<Card>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldSet>
						<FieldLegend>Password</FieldLegend>
						<FieldDescription>
							Update your password to keep your account secure.
						</FieldDescription>
						<FieldSeparator />
						<FieldGroup>
							<Controller
								control={form.control}
								name="currentPassword"
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										orientation="responsive"
									>
										<FieldContent>
											<FieldLabel htmlFor="update-password-currentPassword">
												Current password
											</FieldLabel>
											<FieldDescription>
												Enter your current password.
											</FieldDescription>
										</FieldContent>
										<div className="flex flex-col gap-2">
											<Input
												{...field}
												aria-invalid={fieldState.invalid}
												autoComplete="current-password"
												id="update-password-currentPassword"
												type="password"
											/>
											{fieldState.invalid ? (
												<FieldError errors={[fieldState.error]} />
											) : null}
										</div>
									</Field>
								)}
							/>
							<FieldSeparator />
							<Controller
								control={form.control}
								name="newPassword"
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										orientation="responsive"
									>
										<FieldContent>
											<FieldLabel htmlFor="update-password-newPassword">
												New password
											</FieldLabel>
											<FieldDescription>
												Must be at least 8 characters long.
											</FieldDescription>
										</FieldContent>
										<div className="flex flex-col gap-2">
											<Input
												{...field}
												aria-invalid={fieldState.invalid}
												autoComplete="new-password"
												id="update-password-newPassword"
												type="password"
											/>
											{fieldState.invalid ? (
												<FieldError errors={[fieldState.error]} />
											) : null}
										</div>
									</Field>
								)}
							/>
							<FieldSeparator />
							<Controller
								control={form.control}
								name="confirmPassword"
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										orientation="responsive"
									>
										<FieldContent>
											<FieldLabel htmlFor="update-password-confirmPassword">
												Confirm new password
											</FieldLabel>
											<FieldDescription>
												Re-enter your new password to confirm.
											</FieldDescription>
										</FieldContent>
										<div className="flex flex-col gap-2">
											<Input
												{...field}
												aria-invalid={fieldState.invalid}
												autoComplete="new-password"
												id="update-password-confirmPassword"
												type="password"
											/>
											{fieldState.invalid ? (
												<FieldError errors={[fieldState.error]} />
											) : null}
										</div>
									</Field>
								)}
							/>
							<FieldSeparator />
							<div>
								<Button disabled={form.formState.isSubmitting} type="submit">
									<LoadingSwap isLoading={!!form.formState.isSubmitting}>
										Update password
									</LoadingSwap>
								</Button>
							</div>
						</FieldGroup>
					</FieldSet>
				</form>
			</CardContent>
		</Card>
	);
};
