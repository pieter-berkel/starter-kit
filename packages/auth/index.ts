import { db, schema } from "@workspace/db";
import { generateID } from "@workspace/db/utils/id-generator";
import { sendEmailVerificationEmail } from "@workspace/mailer/templates/email-verification";
import { sendMemberInvitationEmail } from "@workspace/mailer/templates/member-invitation";
import { sendPasswordResetEmail } from "@workspace/mailer/templates/password-reset";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import {
	admin as adminPlugin,
	apiKey,
	createAuthMiddleware,
	organization,
} from "better-auth/plugins";
import { and, eq, isNull, sql } from "drizzle-orm";
import { ac, organizationRoles, systemRoles } from "./permissions";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
	advanced: { database: { generateId: () => generateID() } },
	user: { deleteUser: { enabled: true } },
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
	plugins: [
		adminPlugin({
			ac,
			roles: systemRoles,
		}),
		organization({
			ac,
			roles: organizationRoles,
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
		apiKey(),
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
			await sendPasswordResetEmail({
				to: user.email,
				link: url,
				name: user.name,
			});
		},
	},
	emailVerification: {
		sendOnSignIn: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmailVerificationEmail({
				to: user.email,
				link: url,
				name: user.name,
			});
		},
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/delete-user") {
				const headers = ctx.headers ?? new Headers();
				const session = await auth.api.getSession({ headers });

				if (!session) {
					throw new Error("Unauthorized");
				}

				const ownedOrganizations = await getOwnedOrganizations({
					userId: session.user.id,
				});

				for await (const org of ownedOrganizations) {
					await auth.api.deleteOrganization({
						headers,
						body: { organizationId: org.id },
					});
				}
			}
		}),
	},
});

export type Auth = typeof auth;

export const getOwnedOrganizations = async ({ userId }: { userId: string }) => {
	return await db
		.select({
			id: schema.organizations.id,
			name: schema.organizations.name,
			slug: schema.organizations.slug,
			logo: schema.organizations.logo,
			metadata: schema.organizations.metadata,
			createdAt: schema.organizations.createdAt,
			updatedAt: schema.organizations.updatedAt,
		})
		.from(schema.organizations)
		.innerJoin(
			schema.members,
			and(
				eq(schema.members.organizationId, schema.organizations.id),
				eq(schema.members.userId, userId),
				eq(schema.members.role, "owner"),
				isNull(schema.members.deletedAt),
			),
		)
		.where(
			sql`(
        SELECT COUNT(*) 
        FROM members 
        WHERE members.organization_id = ${schema.organizations.id} 
          AND members.role = 'owner' 
          AND members.deleted_at IS NULL
      ) = 1`,
		)
		.groupBy(schema.organizations.id);
};
