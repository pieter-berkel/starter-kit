import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { CreatePageForm } from "./_components/create-page-form";

export default function Page() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="grid gap-2">
					<h1 className="font-bold text-3xl">Create Page</h1>
					<p className="text-muted-foreground text-sm">Create a new page.</p>
				</div>
				<Button
					nativeButton={false}
					render={<Link href="/hub/pages" />}
					variant="ghost"
				>
					<ArrowLeftIcon className="size-4" />
					<span>Back to pages</span>
				</Button>
			</div>
			<CreatePageForm />
		</div>
	);
}
