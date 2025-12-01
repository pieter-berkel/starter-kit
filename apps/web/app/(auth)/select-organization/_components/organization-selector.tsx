"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item";
import { Building2Icon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const Selector = ({
  organizations,
}: {
  organizations: Auth["$Infer"]["Organization"][];
}) => {
  const router = useRouter();

  const handleSelectOrganization = useCallback(
    async (organizationId: string) => {
      const { error } = await authClient.organization.setActive({ organizationId });

      if (error) {
        toast.error(error.message || "Something went wrong");
        return;
      }

      router.push("/hub");
    },
    [router]
  );

  return (
    <ItemGroup className="gap-3">
      {organizations.map((organization) => (
        <Item
          key={organization.id}
          render={
            <button onClick={() => handleSelectOrganization(organization.id)} type="button" />
          }
          variant="outline"
        >
          <ItemMedia>
            <Avatar className="rounded-md">
              <AvatarImage
                alt={organization.name}
                src={
                  organization.logo ??
                  `https://api.dicebear.com/9.x/glass/svg?seed=${organization.id}`
                }
              />
              <AvatarFallback className="rounded-md text-xs">
                {organization.name.at(0)}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{organization.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Item>
      ))}
      <Item className="border-dashed" render={<Link href="/onboarding" />} variant="outline">
        <ItemMedia variant="icon">
          <Building2Icon className="size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Add organization</ItemTitle>
        </ItemContent>
        <ItemActions>
          <PlusIcon className="size-4" />
        </ItemActions>
      </Item>
    </ItemGroup>
  );
};
