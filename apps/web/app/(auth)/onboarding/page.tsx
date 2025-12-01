import { buttonVariants } from "@workspace/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { CreateOrganizationForm } from "./_components/create-organization-form";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <Link
        className={buttonVariants({
          variant: "ghost",
          size: "icon-lg",
          className: "fixed top-4 left-4 rounded-full",
        })}
        href="/select-organization"
      >
        <ChevronLeftIcon className="size-4" />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-6 text-center font-bold text-3xl tracking-tight">
          Start with your organization
        </h2>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Please create your organization to continue
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <CreateOrganizationForm />
      </div>
    </div>
  );
}
