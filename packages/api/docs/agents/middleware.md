# Context and middleware

Defined in `lib/orpc.ts`. Applied per procedure with `.use(...)`.

## Context

```ts
export type Context = {
	headers: Headers | null;
	auth: Auth;
	scope: "client" | "server";
	session?: Auth["$Infer"]["Session"] | null;
	organization?: Omit<Organization, "updatedAt" | "deletedAt"> | null;
};
```

`session` and `organization` may be pre-filled by middleware to avoid duplicate lookups.

## Middleware stack

| Middleware | Requires | Effect |
| --- | --- | --- |
| `authMiddleware` | — | Loads `session` from headers via Better Auth |
| `requireAuthMiddleware` | session | `UNAUTHORIZED` if missing |
| `requirePermissionsMiddleware({ resource: ["action"] })` | session | User-level permission via `userHasPermission` |
| `organizationMiddleware` | — | Loads active org from session |
| `requireOrganizationMiddleware` | organization | `UNAUTHORIZED` if missing |
| `requireOrganizationPermissionsMiddleware({ ... })` | org + headers | Org-level permission via `hasPermission` |

## Usage

- **Mutations** on app-owned resources: `.use(requirePermissionsMiddleware({ page: ["create"] }))` (match auth plugin permission map).
- **Public reads** (e.g. `pages.list`, `pages.get`): no auth middleware on `base` unless the product requires it.
- Compose with `.concat()` — order matters; see existing definitions in `lib/orpc.ts`.

Do not call `context.auth.api` directly in handlers for permission checks — use the middleware that matches the required scope (user vs organization).
