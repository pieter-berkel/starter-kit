"use client";

import { useForm } from "@tanstack/react-form";
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

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues,
    onSubmit: async ({ value }) => {
      const slug = slugify(value.name);

      await authClient.organization.update(
        {
          data: { name: value.name, slug },
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
        }
      );
    },
  });

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldLegend>Organization details</FieldLegend>
            <FieldDescription>Update your organization details.</FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <FieldDescription>Your organization name.</FieldDescription>
                      </FieldContent>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="organization"
                        disabled={!["owner", "admin"].includes(role)}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
              {["owner", "admin"].includes(role) && (
                <>
                  <FieldSeparator />
                  <div>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                      {([canSubmit, isSubmitting]) => (
                        <Button disabled={isSubmitting || !canSubmit} type="submit">
                          <LoadingSwap isLoading={!!isSubmitting}>Save changes</LoadingSwap>
                        </Button>
                      )}
                    </form.Subscribe>
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
