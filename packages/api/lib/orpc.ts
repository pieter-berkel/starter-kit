import { os } from "@orpc/server";
import type { Auth } from "@workspace/auth";

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
