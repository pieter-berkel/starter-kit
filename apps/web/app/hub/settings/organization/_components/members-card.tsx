"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ChevronDownIcon, EllipsisIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback } from "react";
import { toast } from "sonner";
import { InviteMemberDialog } from "./invite-member-dialog";

export const MembersCard = ({
  members,
  role,
}: {
  members: Auth["$Infer"]["Member"][];
  role: Auth["$Infer"]["Member"]["role"];
}) => {
  const router = useRouter();

  const handleUpdateMemberRole = useCallback(
    async ({ memberId, role }: { memberId: string; role: string }) => {
      const { error } = await authClient.organization.updateMemberRole({
        memberId,
        role,
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
        return;
      }

      toast.success("Member role updated");
      router.refresh();
    },
    [router]
  );

  const handleRemoveMember = useCallback(
    async ({ memberId }: { memberId: string }) => {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
        return;
      }

      toast.success("Member removed");
      router.refresh();
    },
    [router]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage the members of your organization.</CardDescription>
        <CardAction>{["owner", "admin"].includes(role) ? <InviteMemberDialog /> : null}</CardAction>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full max-h-80">
          <ItemGroup>
            {members.map((member, i) => {
              return (
                <Fragment key={member.id}>
                  <Item>
                    <ItemMedia>
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          alt={member.user.name}
                          src={
                            member.user.image ??
                            `https://api.dicebear.com/9.x/notionists/svg?seed=${member.user.id}`
                          }
                        />
                        <AvatarFallback className="rounded-lg">
                          {member.user.name.at(0)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{member.user.name}</ItemTitle>
                      <ItemDescription>{member.user.email}</ItemDescription>
                    </ItemContent>

                    <ItemActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              disabled={!["owner", "admin"].includes(role)}
                              size="sm"
                              variant="outline"
                            />
                          }
                        >
                          <span className="capitalize">{member.role}</span>
                          <ChevronDownIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPositioner align="end" side="bottom" sideOffset={4}>
                          <DropdownMenuContent className="w-44">
                            <DropdownMenuRadioGroup
                              onValueChange={(value) =>
                                handleUpdateMemberRole({ memberId: member.id, role: value })
                              }
                              value={member.role}
                            >
                              <DropdownMenuRadioItem disabled={role !== "owner"} value="owner">
                                Owner
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenuPositioner>
                      </DropdownMenu>
                      {["owner", "admin"].includes(role) && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger
                            render={
                              <Button className="rounded-full" size="icon-sm" variant="ghost" />
                            }
                          >
                            <EllipsisIcon className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuPositioner align="end" side="bottom" sideOffset={4}>
                            <DropdownMenuContent className="w-44">
                              <DropdownMenuItem
                                onClick={() => handleRemoveMember({ memberId: member.id })}
                              >
                                Remove member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPositioner>
                        </DropdownMenu>
                      )}
                    </ItemActions>
                  </Item>
                  {i < members.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              );
            })}
          </ItemGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
