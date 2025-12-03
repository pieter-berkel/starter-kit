"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export const CredentialsForm = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: "/hub",
      },
      {
        onError: ({ error }) => {
          if (error.status === 403) {
            setError(
              "Your account has not been verified yet. Check your email inbox (and spam folder) to verify your email address."
            );
            return;
          }
          setError(error.message);
        },
        onSuccess: ({ data }) => {
          toast.success(`Welcome back, ${data.user.name}`);
        },
      }
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
              <FieldLabel htmlFor="sign-in-form-email">Email address</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                id="sign-in-form-email"
                type="email"
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-form-password">Password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                id="sign-in-form-password"
                type="password"
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <div className="flex items-center justify-between">
          <Controller
            control={form.control}
            name="rememberMe"
            render={({ field, fieldState }) => (
              <FieldGroup data-slot="checkbox-group">
                <Field data-invalid={fieldState.invalid} orientation="horizontal">
                  <Checkbox
                    checked={field.value}
                    id="sign-in-form-rememberMe"
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel className="font-normal" htmlFor="sign-in-form-rememberMe">
                    Remember me
                  </FieldLabel>
                </Field>
              </FieldGroup>
            )}
          />

          <Link
            className="shrink-0 font-semibold text-primary text-sm hover:text-primary/80"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <Button disabled={form.formState.isSubmitting} type="submit">
          <LoadingSwap isLoading={!!form.formState.isSubmitting}>Sign in</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};
