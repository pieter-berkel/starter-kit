"use client";

import type { Auth } from "@workspace/auth";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@workspace/ui/components/sidebar";
import { FileBracesCornerIcon, HomeIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrgSwitcher } from "./org-switcher";
import { UserMenu } from "./user-menu";

const items = [
	{ title: "Hub", url: "/hub", icon: HomeIcon },
	{ title: "Pages", url: "/hub/pages", icon: FileBracesCornerIcon },
];

export const HubSidebar = ({
	activeOrganizationId,
	organizations,
	user,
}: {
	activeOrganizationId: string;
	organizations: Auth["$Infer"]["Organization"][];
	user: Auth["$Infer"]["Session"]["user"];
}) => {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<OrgSwitcher
					activeOrganizationId={activeOrganizationId}
					organizations={organizations}
				/>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>General</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.url}>
									<SidebarMenuButton
										isActive={pathname === item.url}
										render={<Link href={item.url} />}
									>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={pathname.startsWith("/hub/settings")}
									render={<Link href="/hub/settings/account" />}
								>
									<SettingsIcon />
									<span>Settings</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};
