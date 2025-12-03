"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

export const DetailsCard = ({ defaultValues }: { defaultValues: FormValues }) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    await authClient.updateUser(
      { name: data.name },
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
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend>Account details</FieldLegend>
            <FieldDescription>Update your account details.</FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="account-details-name">Name</FieldLabel>
                      <FieldDescription>Your full name.</FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="name"
                        id="account-details-name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="account-details-email">Email address</FieldLabel>
                      <FieldDescription>
                        For security reasons, your email address cannot be changed.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        disabled
                        id="account-details-email"
                        type="email"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </div>
                  </Field>
                )}
              />
              <FieldSeparator />
              <div>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  <LoadingSwap isLoading={!!form.formState.isSubmitting}>Save changes</LoadingSwap>
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
