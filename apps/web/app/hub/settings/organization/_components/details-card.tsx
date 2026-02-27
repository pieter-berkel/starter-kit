"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Auth } from "@workspace/auth";
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
import { slugify } from "@/lib/utils";

const schema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(30, "Name must be less than 30 characters"),
});

type FormValues = z.infer<typeof schema>;

export const DetailsCard = ({
	defaultValues,
	organizationId,
	role,
}: {
	defaultValues: FormValues;
	organizationId: string;
	role: Auth["$Infer"]["Member"]["role"];
}) => {
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const onSubmit = async (data: FormValues) => {
		const slug = slugify(data.name);

		await authClient.organization.update(
			{
				data: { name: data.name, slug },
				organizationId,
			},
			{
				onError: ({ error }) => {
					toast.error(error.message || "Something went wrong");
					return;
				},
				onSuccess: () => {
					toast.success("Organization details updated");
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
						<FieldLegend>Organization details</FieldLegend>
						<FieldDescription>
							Update your organization details.
						</FieldDescription>
						<FieldSeparator />
						<FieldGroup>
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										orientation="responsive"
									>
										<FieldContent>
											<FieldLabel htmlFor="organization-details-name">
												Name
											</FieldLabel>
											<FieldDescription>
												Your organization name.
											</FieldDescription>
										</FieldContent>
										<div className="flex flex-col gap-2">
											<Input
												{...field}
												aria-invalid={fieldState.invalid}
												autoComplete="organization"
												disabled={!["owner", "admin"].includes(role)}
												id="organization-details-name"
											/>
											{fieldState.invalid ? (
												<FieldError errors={[fieldState.error]} />
											) : null}
										</div>
									</Field>
								)}
							/>
							{["owner", "admin"].includes(role) && (
								<>
									<FieldSeparator />
									<div>
										<Button
											disabled={form.formState.isSubmitting}
											type="submit"
										>
											<LoadingSwap isLoading={!!form.formState.isSubmitting}>
												Save changes
											</LoadingSwap>
										</Button>
									</div>
								</>
							)}
						</FieldGroup>
					</FieldSet>
				</form>
			</CardContent>
		</Card>
	);
};
