"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { ActionButton } from "@workspace/ui/components/action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const DeleteCard = ({ organization }: { organization: Auth["$Infer"]["Organization"] }) => {
  const router = useRouter();

  const handleDeleteOrganization = useCallback(async () => {
    const { data, error } = await authClient.organization.delete({
      organizationId: organization.id,
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
      return;
    }

    toast.success(`Organization ${data.name} deleted`);
    router.push("/select-organization");
  }, [organization.id, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete organization</CardTitle>
        <CardDescription>
          Permanently delete your organization and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActionButton
          action={handleDeleteOrganization}
          confirmation="text"
          confirmationText={organization.slug}
          confirmText="Delete organization"
          description="This action cannot be undone. your organization will be permanently deleted and other members and their access will be removed."
          title="Permanently delete your organization?"
          variant="destructive"
        >
          Delete organization
        </ActionButton>
      </CardContent>
    </Card>
  );
};
