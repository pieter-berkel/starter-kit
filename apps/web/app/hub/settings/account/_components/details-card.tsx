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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export const DetailsCard = ({ defaultValues }: { defaultValues: FormValues }) => {
  const router = useRouter();

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues,
    onSubmit: async ({ value }) => {
      await authClient.updateUser(
        { name: value.name },
        {
          onError: ({ error }) => {
            toast.error(error.message || "Something went wrong");
            return;
          },
          onSuccess: () => {
            toast.success("Account details updated");
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
            <FieldLegend>Profile details</FieldLegend>
            <FieldDescription>Update your account details.</FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <FieldDescription>Your full name.</FieldDescription>
                      </FieldContent>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="name"
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
              <FieldSeparator />
              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} orientation="responsive">
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                        <FieldDescription>
                          For security reasons, your email address cannot be changed.
                        </FieldDescription>
                      </FieldContent>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        disabled
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
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
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
