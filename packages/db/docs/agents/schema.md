# Schema conventions

## File structure

- **One table per file** in `schema/`.
- Use `pgTable` from `drizzle-orm/pg-core` with `id` and `timestamps` from `helpers.ts`.
- Re-export every table from `schema/index.ts` (barrel). Avoid importing individual table files from outside the package unless breaking a circular dependency.

## App-owned vs auth-managed

| Kind | Tables | Create/update Zod schemas? |
| --- | --- | --- |
| App-owned | Resources the app/API creates and updates (e.g. `pages`) | **Yes** — colocate in the same file |
| Auth-managed | `users`, `accounts`, `sessions`, `verifications`, `members`, `invitations`, … | **No** — owned by `@workspace/auth` unless you add explicit app CRUD |

## Validation schemas (app-owned)

Colocate with the Drizzle table in `schema/<resource>.ts`:

```ts
export const createPageSchema = z.object({
	slug: z.string().startsWith("/"),
	title: z.string().min(1),
	description: z.string().nullish(),
	content: z.string(),
	published: z.boolean(),
});

export const updatePageSchema = createPageSchema.partial();

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
```

| Export | Rule |
| --- | --- |
| `create<Entity>Schema` | Fields required on create |
| `update<Entity>Schema` | Always `create<Entity>Schema.partial()` |
| `Create<Entity>Input` / `Update<Entity>Input` | `z.infer` of the schemas above |
| Omit from schemas | `id`, `createdAt`, `updatedAt`, `deletedAt` unless the product deliberately accepts them on input |

Reference implementation: `schema/pages.ts` (schemas today; add input types when that file is next touched).

## Drizzle types

Export row types when consumers need the persisted shape:

```ts
export type Page = typeof pages.$inferSelect;
```

| Use case | Type source |
| --- | --- |
| API input, forms | Zod `Create*Input` / `Update*Input` |
| Database rows | Drizzle `$inferSelect` / `$inferInsert` |

Export both Zod input types and Drizzle row types when each is consumed.

## New app-owned table checklist

1. Add `schema/<resource>.ts` with `pgTable`, `create*Schema`, `update*Schema`, and input types.
2. Export from `schema/index.ts`.
3. Add API procedures; for list endpoints see [list-queries.md](list-queries.md).
4. Import schemas/types in the app via `@workspace/db/schema`.
