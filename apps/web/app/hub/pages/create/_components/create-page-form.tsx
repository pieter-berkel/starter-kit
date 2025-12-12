"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageSchema } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
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
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { orpc } from "@/lib/orpc";
import { slugify } from "@/lib/utils";

export const CreatePageForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
      slug: "/",
      description: "",
      content: "",
      published: false,
    },
  });

  useEffect(() => {
    return form.subscribe({
      name: "title",
      exact: true,
      formState: { values: true },
      callback: ({ values }) => {
        form.setValue("slug", `/${slugify(values.title)}`);
      },
    });
  }, [form.subscribe, form.setValue]);

  const { mutate: createPage } = useMutation(orpc.pages.create.mutationOptions());

  const onSubmit = (data: z.infer<typeof createPageSchema>) => {
    createPage(
      { data },
      {
        onError: (error) => {
          toast.error(error.message || "Something went wrong");
        },
        onSuccess: () => {
          toast.success("Page created");
          router.push("/hub/pages");
          queryClient.invalidateQueries({ queryKey: orpc.pages.key() });
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Create page</FieldLegend>
        <FieldDescription>Update your account details.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="create-page-form-title">Title</FieldLabel>
                  <FieldDescription>The title of the page.</FieldDescription>
                </FieldContent>
                <div className="flex flex-col gap-2">
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="create-page-form-title"
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </div>
              </Field>
            )}
          />
          <FieldSeparator />
          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="create-page-form-slug">Slug</FieldLabel>
                  <FieldDescription>The slug of the page.</FieldDescription>
                </FieldContent>
                <div className="flex flex-col gap-2">
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="create-page-form-slug"
                    placeholder="/slug"
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </div>
              </Field>
            )}
          />
          <FieldSeparator />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="create-page-form-description">Description</FieldLabel>
                  <FieldDescription>A brief description of the page.</FieldDescription>
                </FieldContent>
                <div className="flex flex-col gap-2">
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id="create-page-form-description"
                    value={field.value || ""}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </div>
              </Field>
            )}
          />
          <FieldSeparator />
          <Controller
            control={form.control}
            name="published"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="create-page-form-published">Published</FieldLabel>
                  <FieldDescription>Make this page publicly visible.</FieldDescription>
                </FieldContent>
                <Switch
                  checked={field.value}
                  id="create-page-form-published"
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
          <FieldSeparator />
          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-textarea-content">Content</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="min-h-[420px]"
                  id="form-rhf-textarea-content"
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
          <FieldSeparator />
          <div>
            <Button disabled={form.formState.isSubmitting} type="submit">
              <LoadingSwap isLoading={!!form.formState.isSubmitting}>Create page</LoadingSwap>
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
