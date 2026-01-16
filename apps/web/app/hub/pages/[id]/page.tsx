import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { DeletePageCard } from "./_components/delete-page-card";
import { UpdatePageCard } from "./_components/update-page-card";

export default async function Page(props: PageProps<"/hub/pages/[id]">) {
  const { id } = await props.params;

  const { data: page } = await client.pages.get({ id });

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 sm:px-12 sm:py-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-bold text-3xl">Update Page</h1>
        </div>
        <Button nativeButton={false} render={<Link href="/hub/pages" />} variant="ghost">
          <ArrowLeftIcon className="size-4" />
          <span>Back to pages</span>
        </Button>
      </div>
      <UpdatePageCard defaultValues={page} id={id} />
      <DeletePageCard page={page} />
    </div>
  );
}
