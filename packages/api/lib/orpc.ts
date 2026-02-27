import { ORPCError, os } from "@orpc/server";
import type { Auth } from "@workspace/auth";
import { db, schema } from "@workspace/db";
import type { Organization } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export type Scope = "client" | "server";

export type Context = {
	headers: Headers | null;
	auth: Auth;
	scope: Scope;

	/**
	 * Optional cache for auth-derived data to avoid repeated lookups across middlewares.
	 * Middlewares may populate this.
	 */
	session?: Auth["$Infer"]["Session"] | null;
	organization?: Omit<Organization, "updatedAt" | "deletedAt"> | null;
};

export const base = os.$context<Context>();

export const authMiddleware = base.middleware(async ({ context, next }) => {
	const session =
		context.session ??
		(await context.auth.api.getSession({ headers: context.headers }));

	return next({ context: { session } });
});

export const requireAuthMiddleware = authMiddleware.concat(
	base.middleware(({ context, next }) => {
		if (!context.session) {
			throw new ORPCError("UNAUTHORIZED", { message: "No session found" });
		}

		return next({ context: { session: context.session } });
	}),
);

export const requirePermissionsMiddleware = (permissions: {
	[key: string]: string[];
}) =>
	requireAuthMiddleware.concat(
		base.middleware(async ({ context, next }) => {
			if (!context.session) {
				throw new ORPCError("UNAUTHORIZED", { message: "No session found" });
			}

			const { success } = await context.auth.api.userHasPermission({
				body: {
					userId: context.session.user.id,
					permissions,
				},
			});

			if (!success) {
				throw new ORPCError("FORBIDDEN", {
					message: "User does not have permission to perform this action",
				});
			}

			return next();
		}),
	);

export const organizationMiddleware = authMiddleware.concat(
	base.middleware(async ({ context, next }) => {
		const activeOrganizationId = context.session?.session.activeOrganizationId;

		const organization = activeOrganizationId
			? ((await db.query.organizations.findFirst({
					columns: {
						id: true,
						name: true,
						slug: true,
						createdAt: true,
						logo: true,
						metadata: true,
					},
					where: eq(schema.organizations.id, activeOrganizationId),
				})) ?? null)
			: null;

		return next({ context: { organization } });
	}),
);

export const requireOrganizationMiddleware = organizationMiddleware.concat(
	base.middleware(({ context, next }) => {
		if (!context.organization) {
			throw new ORPCError("UNAUTHORIZED", { message: "No organization found" });
		}

		return next({ context: { organization: context.organization } });
	}),
);

export const requireOrganizationPermissionsMiddleware = (permissions: {
	[key: string]: string[];
}) =>
	requireOrganizationMiddleware.concat(
		base.middleware(async ({ context, next }) => {
			if (!context.organization) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "No organization found",
				});
			}

			const { success } = await context.auth.api.hasPermission({
				headers: context.headers,
				body: {
					organizationId: context.organization.id,
					permissions,
				},
			});

			if (!success) {
				throw new ORPCError("FORBIDDEN", {
					message: "User does not have permission to perform this action",
				});
			}

			return next();
		}),
	);
