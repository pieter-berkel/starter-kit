"use client";

import { useForm } from "@tanstack/react-form";
import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be less than 30 characters"),
});

export const CreateOrganizationForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      setError(null);

      const slug = slugify(value.name);

      const { data, error } = await authClient.organization.create({
        name: value.name,
        slug,
      });

      if (error) {
        setError(error.message || "Something went wrong");
        return;
      }

      toast.success(`Organization ${data.name} created`);

      await authClient.organization.setActive(
        { organizationId: data.id },
        {
          onError: ({ error }) => {
            setError(error.message || "Something went wrong");
            return;
          },
          onSuccess: () => {
            router.push("/hub");
          },
        }
      );
    },
  });

  return (
    <form
      id="create-organization-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {error ? (
          <Alert className="border-destructive" variant="destructive">
            <AlertTriangleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <form.Field name="name">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="off"
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
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={isSubmitting || !canSubmit}
              form="create-organization-form"
              type="submit"
            >
              <LoadingSwap isLoading={!!isSubmitting}>Create organizaiton</LoadingSwap>
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};
