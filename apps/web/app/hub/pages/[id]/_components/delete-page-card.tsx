"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "@workspace/api";
import { ActionButton } from "@workspace/ui/components/action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";

export const DeletePageCard = ({
  page,
}: {
  page: NonNullable<RouterOutputs["pages"]["get"]["data"]>;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deletePage } = useMutation(orpc.pages.delete.mutationOptions());

  const handleDeletePage = () => {
    deletePage(
      { id: page.id },
      {
        onError: (error) => {
          toast.error(error.message || "Something went wrong");
        },
        onSuccess: () => {
          toast.success("Page deleted");
          router.push("/hub/pages");
          queryClient.invalidateQueries({ queryKey: orpc.pages.key() });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete page</CardTitle>
        <CardDescription>Permanently delete the page and all associated data.</CardDescription>
      </CardHeader>
      <CardContent>
        <ActionButton action={handleDeletePage} confirmation="simple" variant="destructive">
          Delete page
        </ActionButton>
      </CardContent>
    </Card>
  );
};
