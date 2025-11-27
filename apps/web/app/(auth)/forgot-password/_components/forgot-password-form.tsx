"use client";

import { useForm } from "@tanstack/react-form";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email(),
});

export const ForgotPasswordForm = () => {
  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: "/reset-password",
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || "Something went wrong");
          },
          onSuccess: () => {
            toast.success(
              "Your password reset token has been sent. Please check your email (and spam folder) for the link to reset your password."
            );
          },
        }
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button disabled={isSubmitting || !canSubmit} type="submit">
              <LoadingSwap isLoading={!!isSubmitting}>Request password reset</LoadingSwap>
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};
