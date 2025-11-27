"use client";

import { useForm } from "@tanstack/react-form";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const CredentialsForm = () => {
  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: { email: "", password: "", rememberMe: false },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          rememberMe: value.rememberMe,
        },
        {
          onError: ({ error }) => {
            if (error.status === 403) {
              toast.error("Please verify your email address");
              return;
            }
            toast.error(error.message);
          },
          onSuccess: ({ data }) => {
            toast.success(`Welcome back, ${data.user.name}`);
            router.push("/");
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
        <form.Field name="password">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
              </Field>
            );
          }}
        </form.Field>
        <div className="flex items-center justify-between">
          <form.Field name="rememberMe">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <FieldGroup data-slot="checkbox-group">
                  <Field data-invalid={isInvalid} orientation="horizontal">
                    <Checkbox
                      checked={field.state.value}
                      id={`sign-in-form-${field.name}`}
                      name={field.name}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    <FieldLabel className="font-normal" htmlFor={`sign-in-form-${field.name}`}>
                      Remember me
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              );
            }}
          </form.Field>

          <Link
            className="shrink-0 font-semibold text-primary text-sm hover:text-primary/80"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button disabled={isSubmitting || !canSubmit} type="submit">
              <LoadingSwap isLoading={!!isSubmitting}>Sign in</LoadingSwap>
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};
