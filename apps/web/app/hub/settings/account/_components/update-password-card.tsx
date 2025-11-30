"use client";

import { useForm } from "@tanstack/react-form";
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

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const UpdatePasswordCard = () => {
  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
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
            <FieldLegend>Password</FieldLegend>
            <FieldDescription>Update your password to keep your account secure.</FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <form.Field name="currentPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                        <FieldDescription>Enter your current password.</FieldDescription>
                      </FieldContent>
                      <div className="flex flex-col gap-2">
                        <Input
                          aria-invalid={isInvalid}
                          autoComplete="current-password"
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          value={field.state.value}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </div>
                    </Field>
                  );
                }}
              </form.Field>
              <FieldSeparator />
              <form.Field name="newPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                      </FieldContent>
                      <div className="flex flex-col gap-2">
                        <Input
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          value={field.state.value}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </div>
                    </Field>
                  );
                }}
              </form.Field>
              <FieldSeparator />
              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
                        <FieldDescription>Re-enter your new password to confirm.</FieldDescription>
                      </FieldContent>
                      <div className="flex flex-col gap-2">
                        <Input
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          value={field.state.value}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </div>
                    </Field>
                  );
                }}
              </form.Field>
              <FieldSeparator />
              <div>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button disabled={isSubmitting || !canSubmit} type="submit">
                      <LoadingSwap isLoading={!!isSubmitting}>Update password</LoadingSwap>
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
