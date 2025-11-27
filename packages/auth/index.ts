import { db } from "@workspace/db";
import { generateID } from "@workspace/db/utils/id-generator";
import { sendEmailVerificationEmail } from "@workspace/mailer/templates/email-verification";
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
      await sendPasswordResetEmail({ to: user.email, link: url, name: user.name });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ to: user.email, link: url, name: user.name });
    },
  },
});

export type Auth = typeof auth;
