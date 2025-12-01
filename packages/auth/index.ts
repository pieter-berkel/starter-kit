import { db } from "@workspace/db";
import { generateID } from "@workspace/db/utils/id-generator";
import { sendEmailVerificationEmail } from "@workspace/mailer/templates/email-verification";
import { sendMemberInvitationEmail } from "@workspace/mailer/templates/member-invitation";
import { sendPasswordResetEmail } from "@workspace/mailer/templates/password-reset";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  advanced: { database: { generateId: () => generateID() } },
  user: { deleteUser: { enabled: true } },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  plugins: [
    admin(),
    apiKey(),
    organization({
      organizationLimit: 5,
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${data.id}`;

        await sendMemberInvitationEmail({
          to: data.email,
          organizationName: data.organization.name,
          invitedByEmail: data.inviter.user.email,
          invitedByUsername: data.inviter.user.name,
          inviteLink,
        });
      },
    }),
    nextCookies(), // make sure nextCookies is the last plugin
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, link: url, name: user.name });
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ to: user.email, link: url, name: user.name });
    },
  },
  databaseHooks: {
    user: {
      delete: {
        before: async (user, request) => {
          const ownedOrganizations = await getOwnedOrganizations({ userId: user.id });

          await Promise.all(
            ownedOrganizations.map((org) =>
              auth.api.deleteOrganization({
                headers: request?.headers,
                body: { organizationId: org.id },
              })
            )
          );
        },
      },
    },
  },
});

export type Auth = typeof auth;

export const getOwnedOrganizations = async ({ userId }: { userId: string }) => {
  const members = await db.query.members.findMany({
    where: (fields, { eq, and, isNull }) =>
      and(eq(fields.userId, userId), eq(fields.role, "owner"), isNull(fields.deletedAt)),
  });

  const organizations = await db.query.organizations.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.id,
        members.map((m) => m.organizationId)
      ),
  });

  return organizations;
};

export const activeDefaultOrganization = async ({ userId }: { userId: string }) => {
  const member = await db.query.members.findFirst({
    where: (fields, { eq, isNull, and }) =>
      and(eq(fields.userId, userId), isNull(fields.deletedAt)),
    orderBy: (fields, { asc }) => asc(fields.createdAt),
  });

  if (!member) {
    return;
  }

  await auth.api.setActiveOrganization({ body: { organizationId: member.organizationId } });
};
