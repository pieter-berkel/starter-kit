"use client";

import type { Auth } from "@workspace/auth";
import { authClient } from "@workspace/auth/client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const OrgSwitcher = ({
	activeOrganizationId,
	organizations,
}: {
	activeOrganizationId: string;
	organizations: Auth["$Infer"]["Organization"][];
}) => {
	const router = useRouter();
	const { isMobile } = useSidebar();

	const setActiveOrganization = useCallback(
		async (organizationId: string) => {
			await authClient.organization.setActive(
				{ organizationId },
				{
					onError: ({ error }) => {
						toast.error(error.message);
					},
					onSuccess: () => {
						router.refresh();
					},
				},
			);
		},
		[router],
	);

	const activeOrg = organizations.find(
		(org) => org.id === activeOrganizationId,
	);

	if (!activeOrg) {
		return null;
	}

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
								alt={activeOrg.name}
								src={
									activeOrg.logo ??
									`https://api.dicebear.com/9.x/glass/svg?seed=${activeOrg.id}`
								}
							/>
							<AvatarFallback className="rounded-lg">
								{activeOrg.name.at(0)}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{activeOrg.name}</span>
						</div>
						<ChevronsUpDownIcon className="ml-auto size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-(--anchor-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Organizations
							</DropdownMenuLabel>
							{organizations.map((org) => (
								<DropdownMenuItem
									className="gap-2 p-2"
									disabled={org.id === activeOrganizationId}
									key={org.id}
									onClick={() => setActiveOrganization(org.id)}
								>
									<Avatar className="size-6 rounded-md">
										<AvatarImage
											alt={org.name}
											src={
												org.logo ??
												`https://api.dicebear.com/9.x/glass/svg?seed=${org.id}`
											}
										/>
										<AvatarFallback className="rounded-md text-xs">
											{org.name.at(0)}
										</AvatarFallback>
									</Avatar>
									{org.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 p-2"
							render={<Link href="/onboarding" />}
						>
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<PlusIcon className="size-4" />
							</div>
							<div className="font-medium text-muted-foreground">
								Add organization
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
