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
import { HomeIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";
import { OrgSwitcher } from "./org-switcher";
import { UserMenu } from "./user-menu";

const items = [
  { title: "Home", url: "/hub", icon: HomeIcon },
  { title: "Settings", url: "/hub/settings", icon: Settings2Icon },
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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher activeOrganizationId={activeOrganizationId} organizations={organizations} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
