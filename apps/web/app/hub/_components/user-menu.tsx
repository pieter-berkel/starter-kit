"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronsUpDownIcon, LogOutIcon, MoonIcon, SunIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export const UserMenu = ({ user }: { user: Auth["$Infer"]["Session"]["user"] }) => {
  const router = useRouter();

  const { isMobile } = useSidebar();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [setTheme, resolvedTheme]);

  const handleLogout = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                alt={user.name}
                src={user.image ?? `https://api.dicebear.com/9.x/notionists/svg?seed=${user.id}`}
              />
              <AvatarFallback className="rounded-lg">{user.name.at(0)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuPositioner align="end" side={isMobile ? "top" : "right"} sideOffset={4}>
            <DropdownMenuContent className="w-(--anchor-width) min-w-56 rounded-lg">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        alt={user.name}
                        src={
                          user.image ??
                          `https://api.dicebear.com/9.x/notionists/svg?seed=${user.id}`
                        }
                      />
                      <AvatarFallback className="rounded-lg font-bold uppercase">
                        {user.name.at(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/hub/settings/account" />}>
                  <User2Icon className="size-4" />
                  My account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
                  Toggle theme
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
