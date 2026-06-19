import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@workspace/ui/components/empty";
import { LayoutDashboardIcon } from "lucide-react";

export default async function Hub() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
			<div className="grid gap-2">
				<h1 className="font-bold text-3xl">Hub</h1>
				<p className="text-muted-foreground text-sm">
					Je startpunt in de werkruimte.
				</p>
			</div>
			<Empty className="border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<LayoutDashboardIcon />
					</EmptyMedia>
					<EmptyTitle>Dit is het startpunt van het nieuwe dashboard</EmptyTitle>
					<EmptyDescription>
						Hier bouwen we het dashboard verder uit.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}
