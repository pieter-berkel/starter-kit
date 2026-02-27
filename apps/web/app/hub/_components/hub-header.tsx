import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export const HubHeader = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger />
			</div>
		</header>
	);
};
