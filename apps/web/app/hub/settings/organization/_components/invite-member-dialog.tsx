"use client";

import { useForm } from "@tanstack/react-form";
import { authClient } from "@workspace/auth/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.email(),
  role: z.enum(["member", "admin", "owner"]),
});

type FormValues = z.infer<typeof schema>;

export const InviteMemberDialog = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: { email: "", role: "member" },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.inviteMember({
        email: value.email,
        role: value.role as FormValues["role"],
        resend: true,
      });

      if (error) {
        setError(error.message || "Something went wrong");
        return;
      }

      toast.success("Member invited");
      form.reset();
      router.refresh();
      setOpen(false);
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Invite</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>Invite a new member to your organization.</DialogDescription>
        </DialogHeader>
        <form
          id="invite-member-form"
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
                      value={field.state.value}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="role">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={(value) => field.handleChange(value ?? "member")}
                      value={field.state.value}
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPositioner>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </SelectPositioner>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button disabled={isSubmitting || !canSubmit} form="invite-member-form" type="submit">
                <LoadingSwap isLoading={!!isSubmitting}>Invite</LoadingSwap>
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
