# Procedures

Built on `base` from `lib/orpc.ts` (`os.$context<Context>()`).

## Chain

```ts
base
	.input(/* zod schema */)
	.use(/* optional middleware */)
	.handler(async ({ input, context }) => { /* ... */ });
```

## Input validation

| Source | Use for |
| --- | --- |
| `@workspace/db/schema` | `create*Schema`, `update*Schema` on app-owned resources |
| Local `z` schemas | Procedure-specific shapes (ids, unions, filters) |

Wrap persisted payloads consistently:

```ts
create: base
	.input(z.object({ data: createPageSchema }))
	// ...

update: base
	.input(z.object({ id: z.string(), data: updatePageSchema }))
	// ...
```

Do not redefine create/update field rules in the API — import from `@workspace/db/schema`.

## Handlers

- Use `db` and `schema` from `@workspace/db`.
- Prefer `db.query.<table>.findMany` / `findFirst` with explicit `columns` when returning data to clients.
- Filter soft-deleted rows: `isNull(schema.<table>.deletedAt)` on reads and updates.
- **Soft delete:** `update` with `deletedAt: sql\`now()\`` — do not hard-delete app-owned rows unless required.

## Responses

Return a **`{ data: ... }`** envelope for single-resource operations. List endpoints use `{ data, meta }` — see [list-endpoints.md](list-endpoints.md).

## Errors

Use `ORPCError` from `@orpc/client`:

| Code | When |
| --- | --- |
| `NOT_FOUND` | Row missing or soft-deleted |
| `UNAUTHORIZED` | No session or organization when required |
| `FORBIDDEN` | Permission check failed |
| `INTERNAL_SERVER_ERROR` | Unexpected insert/update failure |

Reference: `router/pages.ts`.
