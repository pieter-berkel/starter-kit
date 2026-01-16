import { ORPCError, os } from "@orpc/server";
import type { Auth } from "@workspace/auth";
import { db, schema } from "@workspace/db";
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
};

export const base = os.$context<Context>();

export const authMiddleware = base.middleware(async ({ context, next }) => {
  const session =
    context.session ?? (await context.auth.api.getSession({ headers: context.headers }));

  return next({ context: { session } });
});

export const requireAuthMiddleware = authMiddleware.concat(
  base.middleware(({ context, next }) => {
    if (!context.session) {
      throw new ORPCError("UNAUTHORIZED", { message: "No session found" });
    }

    return next({ context: { session: context.session } });
  })
);

export const organizationMiddleware = authMiddleware.concat(
  base.middleware(async ({ context, next }) => {
    const activeOrganizationId = context.session?.session.activeOrganizationId;

    const organization = activeOrganizationId
      ? ((await db.query.organizations.findFirst({
          where: eq(schema.organizations.id, activeOrganizationId),
        })) ?? null)
      : null;

    return next({ context: { organization } });
  })
);

export const requireOrganizationMiddleware = requireAuthMiddleware.concat(
  base.middleware(async ({ context, next }) => {
    const activeOrganizationId = context.session?.session.activeOrganizationId;

    if (!activeOrganizationId) {
      throw new ORPCError("UNAUTHORIZED", { message: "No active organization found" });
    }

    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, activeOrganizationId),
    });

    return next({ context: { organization } });
  })
);
