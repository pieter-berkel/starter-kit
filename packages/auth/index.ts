import { db } from "@workspace/db";
import { generateID } from "@workspace/db/utils/id-generator";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  advanced: { database: { generateId: () => generateID() } },
  user: { deleteUser: { enabled: true } },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 3600, // 1 hour
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 20,
      },
      "/sign-up/email": {
        window: 60,
        max: 10,
      },
      "/request-password-reset": {
        window: 60,
        max: 3,
      },
      "/reset-password": {
        window: 60,
        max: 3,
      },
    },
  },
  plugins: [
    admin(),
    apiKey(),
    organization(),
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { sendPasswordResetEmail } = await import("@workspace/mailer/templates/password-reset");
      await sendPasswordResetEmail({ to: user.email, link: url, name: user.name });
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { sendEmailVerificationEmail } = await import(
        "@workspace/mailer/templates/email-verification"
      );
      await sendEmailVerificationEmail({ to: user.email, link: url, name: user.name });
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await db.query.members.findFirst({
            where: (fields, { eq, isNull, and }) =>
              and(eq(fields.userId, session.userId), isNull(fields.deletedAt)),
            orderBy: (fields, { asc }) => asc(fields.createdAt),
          });

          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId,
            },
          };
        },
      },
    },
  },
});

export type Auth = typeof auth;
