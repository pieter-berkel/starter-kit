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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
	email: z.email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
	const [error, setError] = useState<string | null>(null);
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setError(null);

		await authClient.requestPasswordReset(
			{
				email: data.email,
				redirectTo: "/reset-password",
			},
			{
				onError: ({ error }) => {
					setError(error.message || "Something went wrong");
					return;
				},
				onSuccess: () => {
					toast.success(
						"Your password reset token has been sent. Please check your email (and spam folder) for the link to reset your password.",
					);
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
					name="email"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="forgot-password-form-email">
								Email address
							</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								autoComplete="email"
								id="forgot-password-form-email"
								type="email"
							/>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Button disabled={form.formState.isSubmitting} type="submit">
					<LoadingSwap isLoading={!!form.formState.isSubmitting}>
						Request password reset
					</LoadingSwap>
				</Button>
			</FieldGroup>
		</form>
	);
};
