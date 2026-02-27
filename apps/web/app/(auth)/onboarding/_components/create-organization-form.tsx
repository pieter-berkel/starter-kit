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
import { slugify } from "@/lib/utils";

const schema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(30, "Name must be less than 30 characters"),
});

type FormValues = z.infer<typeof schema>;

export const CreateOrganizationForm = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setError(null);

		const slug = slugify(data.name);

		const { data: orgData, error: orgError } =
			await authClient.organization.create({
				name: data.name,
				slug,
			});

		if (orgError) {
			setError(orgError.message || "Something went wrong");
			return;
		}

		toast.success(`Organization ${orgData.name} created`);

		await authClient.organization.setActive(
			{ organizationId: orgData.id },
			{
				onError: ({ error }) => {
					setError(error.message || "Something went wrong");
					return;
				},
				onSuccess: () => {
					router.push("/hub");
				},
			},
		);
	};

	return (
		<form id="create-organization-form" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				{error ? (
					<Alert className="border-destructive" variant="destructive">
						<AlertTriangleIcon />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}
				<Controller
					control={form.control}
					name="name"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="create-organization-form-name">
								Name
							</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								autoComplete="off"
								id="create-organization-form-name"
							/>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<Button
					disabled={form.formState.isSubmitting}
					form="create-organization-form"
					type="submit"
				>
					<LoadingSwap isLoading={!!form.formState.isSubmitting}>
						Create organization
					</LoadingSwap>
				</Button>
			</FieldGroup>
		</form>
	);
};
