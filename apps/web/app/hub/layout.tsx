import { auth } from "@workspace/auth";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { HubHeader } from "./_components/hub-header";
import { HubSidebar } from "./_components/hub-sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const organizations = await auth.api.listOrganizations({ headers: await headers() });
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session.activeOrganizationId) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <HubSidebar
        activeOrganizationId={session.session.activeOrganizationId}
        organizations={organizations}
        user={session.user}
      />
      <SidebarInset>
        <HubHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
