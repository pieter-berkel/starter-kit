"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

type FormValues = z.infer<typeof schema>;

export const ResetPasswordForm = ({ token }: { token: string }) => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setError(null);

		await authClient.resetPassword(
			{
				newPassword: data.password,
				token,
			},
			{
				onError: ({ error }) => {
					setError(error.message || "Something went wrong");
					return;
				},
				onSuccess: () => {
					toast.success(
						"Your password has been reset. You can now sign in with your new password.",
					);
					router.push("/sign-in");
				},
			},
		);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				{error ? (
					<Alert className="border-destructive" variant="destructive">
						<AlertTriangleIcon />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}
				<Controller
					control={form.control}
					name="password"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="reset-password-form-password">
								New password
							</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								autoComplete="off"
								id="reset-password-form-password"
								type="password"
							/>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="confirmPassword"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="reset-password-form-confirmPassword">
								Confirm new password
							</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								autoComplete="off"
								id="reset-password-form-confirmPassword"
								type="password"
							/>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Button disabled={form.formState.isSubmitting} type="submit">
					<LoadingSwap isLoading={!!form.formState.isSubmitting}>
						Reset password
					</LoadingSwap>
				</Button>
			</FieldGroup>
		</form>
	);
};
