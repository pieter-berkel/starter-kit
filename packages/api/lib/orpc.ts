import { StandardRPCJsonSerializer } from "@orpc/client/standard";
import { type Middleware, ORPCError, os } from "@orpc/server";
import type { Auth } from "@workspace/auth";

type Scope = "client" | "internal";
type Role = "user" | "admin";

export type Context = {
  headers: Headers | null;
  auth: Auth;
  scope: Scope;
};

export const serializer = new StandardRPCJsonSerializer();

export const procedure = os.$context<Context>();

type ScopeOrWildcard = Scope | "*";
type RoleOrWildcard = Role | "*";

type AccessRule = ScopeOrWildcard | `${ScopeOrWildcard}/${Exclude<RoleOrWildcard, "user">}`;

type RuleContainsAuth<T> = T extends `${string}/${string}` ? true : false;

type AllRulesContainAuth<T extends readonly AccessRule[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends AccessRule
    ? RuleContainsAuth<First> extends true
      ? Rest extends readonly AccessRule[]
        ? AllRulesContainAuth<Rest>
        : true
      : false
    : false
  : true;

type AccessMiddleware<T extends readonly AccessRule[]> = Middleware<
  Context & Record<never, never>,
  {
    session: AllRulesContainAuth<T> extends true
      ? Auth["$Infer"]["Session"]
      : Auth["$Infer"]["Session"] | null;
  },
  unknown,
  any,
  any,
  Record<never, never>
>;

export const accessMiddleware = <const T extends readonly AccessRule[]>(
  rules: T
): AccessMiddleware<T> => {
  return procedure.middleware(async ({ context, next }) => {
    const hasMatchingScope = rules.some((r) => {
      if (r === "*") {
        return true;
      }

      const [ruleScope] = String(r).split("/");
      return ruleScope === "*" || ruleScope === context.scope;
    });

    if (!hasMatchingScope) {
      throw new ORPCError("FORBIDDEN", { message: "Invalid scope" });
    }

    const session = await context.auth.api.getSession({
      headers: context.headers ?? new Headers(),
    });

    if (rules.includes(context.scope) || rules.includes("*")) {
      return next({ context: { session } });
    }

    if (!session) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const role = (session.user.role ?? "user") as Exclude<Role, "user">;

    const isAuthorized = rules.some((r) => {
      if (r === "*") {
        return true;
      }

      const [ruleScope, ruleRole] = String(r).split("/") as [ScopeOrWildcard, RoleOrWildcard?];

      if (!ruleRole) {
        return false; // no role requirement in this rule
      }

      const scopeOk = ruleScope === "*" || ruleScope === context.scope;

      if (!scopeOk) {
        return false;
      }

      if (ruleRole === "*") {
        return true;
      }

      return ruleRole === role;
    });

    if (!isAuthorized) {
      throw new ORPCError("FORBIDDEN", { message: "Insufficient role" });
    }

    return next({ context: { session } });
  }) as AccessMiddleware<T>;
};
