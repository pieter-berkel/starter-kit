import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { PagesContainer } from "./_components/pages-container";

export default function Page() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="grid gap-2">
					<h1 className="font-bold text-3xl">Pages</h1>
					<p className="text-muted-foreground text-sm">
						Manage your pages and their content.
					</p>
				</div>
				<Button nativeButton={false} render={<Link href="/hub/pages/create" />}>
					<PlusIcon className="size-4" />
					<span>Create Page</span>
				</Button>
			</div>
			<PagesContainer />
		</div>
	);
}
