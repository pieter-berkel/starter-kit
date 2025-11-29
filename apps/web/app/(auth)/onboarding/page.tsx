import { CreateOrganizationForm } from "./_components/create-organization-form";

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
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
