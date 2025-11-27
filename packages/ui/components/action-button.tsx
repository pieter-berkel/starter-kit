"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { OctagonAlertIcon } from "lucide-react";
import { type ComponentProps, type TransitionFunction, useState, useTransition } from "react";
import { toast } from "sonner";

type ActionButtonProps = ComponentProps<typeof Button> & {
  action: TransitionFunction;
  confirmation?: "simple" | "text";
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  confirmationText?: string;
};
export const ActionButton = ({
  children,
  action,
  confirmation,
  confirmationText = "DELETE",
  title = "Weet je het zeker?",
  description = "Deze actie kan niet ongedaan worden gemaakt.",
  cancelText = "Annuleren",
  confirmText = "Bevestigen",
  ...props
}: ActionButtonProps) => {
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleAction = () => {
    if (confirmation === "text" && confirmationInput !== confirmationText) {
      toast.error("Bevestigingstekst komt niet overeen");
      return;
    }

    startTransition(async () => {
      try {
        await action();
        setIsOpen(false);
        setConfirmationInput("");
      } catch (error) {
        // biome-ignore lint/complexity/noUselessCatch: -
        throw error;
      }
    });
  };

  if (confirmation) {
    const match = confirmation === "text" ? confirmationInput === confirmationText : true;

    const element = props.render ? props.render : <Button {...props} />;

    return (
      <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
        <AlertDialogTrigger render={element}>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="rounded-none">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <OctagonAlertIcon className="mt-1 size-5 shrink-0 fill-destructive/10 text-destructive" />
              <div className="flex flex-col gap-1">
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          {confirmation === "text" ? (
            <div>
              <p className="mb-2 font-medium text-sm">
                Typ <span className="font-semibold">{confirmationText}</span> om te bevestigen.
              </p>
              <Input
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={confirmationText}
                value={confirmationInput}
              />
            </div>
          ) : null}
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel>{cancelText}</AlertDialogCancel>
            <Button disabled={isLoading || !match} onClick={handleAction} variant="destructive">
              <LoadingSwap isLoading={isLoading}>{confirmText}</LoadingSwap>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={props.disabled || isLoading}
      onClick={(e) => {
        handleAction();
        props.onClick?.(e);
      }}
    >
      <LoadingSwap isLoading={isLoading}>{children}</LoadingSwap>
    </Button>
  );
};
