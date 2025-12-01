"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@workspace/ui/components/item";
import { LoadingSwap } from "@workspace/ui/components/loading-swap";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { OctagonAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteAccountCard = ({
  user,
  ownedOrganizations,
}: {
  user: Auth["$Infer"]["Session"]["user"];
  ownedOrganizations: Auth["$Infer"]["Organization"][];
}) => {
  const router = useRouter();

  const [value, setValue] = useState("");

  const handleDeleteUser = async () => {
    if (value !== user.email) {
      toast.error("Email does not match");
      return;
    }

    const { error } = await authClient.deleteUser({ callbackURL: "/" });

    if (error) {
      toast.error(error.message || "Something went wrong");
      return;
    }

    toast.success("Account deleted successfully");
    router.push("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>Permanently delete your account and all associated data.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Delete account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="rounded-none">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <OctagonAlertIcon className="mt-1 size-5 shrink-0 fill-destructive/10 text-destructive" />
                <div className="flex flex-col gap-1">
                  <AlertDialogTitle>Permanently delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your entire account will be permanently deleted
                    and you will be removed from all shared organizations. In addition, your owned
                    organizations will also be permanently deleted and other members and their
                    access will be removed.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <ScrollArea className="max-h-48 rounded-lg border">
              <ItemGroup>
                {ownedOrganizations.map((organization) => (
                  <Item key={organization.id}>
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
                  </Item>
                ))}
              </ItemGroup>
            </ScrollArea>
            <div>
              <p className="mb-2 font-medium text-sm">
                Type <span className="font-semibold">{user.email}</span> to confirm.
              </p>
              <Input
                onChange={(e) => setValue(e.target.value)}
                placeholder={user.email}
                value={value}
              />
            </div>
            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                disabled={value !== user.email}
                onClick={handleDeleteUser}
                variant="destructive"
              >
                <LoadingSwap isLoading={false}>
                  Delete your account and {ownedOrganizations.length} organizations
                </LoadingSwap>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
