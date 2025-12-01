import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { DeleteCard } from "./_components/delete-card";
import { DetailsCard } from "./_components/details-card";
import { LeaveCard } from "./_components/leave-card";
import { MembersCard } from "./_components/members-card";

export default async function Page() {
  const headersList = await headers();

  const [organization, { role }] = await Promise.all([
    auth.api.getFullOrganization({ headers: headersList }),
    auth.api.getActiveMemberRole({ headers: headersList }),
  ]);

  if (!organization) {
    throw new Error("Organization not found");
  }

  return (
    <div className="flex flex-col gap-8">
      <DetailsCard
        defaultValues={{ name: organization.name }}
        organizationId={organization.id}
        role={role}
      />

      <MembersCard members={organization.members} role={role} />

      {role === "owner" ? (
        <DeleteCard organization={organization} />
      ) : (
        <LeaveCard organization={organization} />
      )}
    </div>
  );
}
