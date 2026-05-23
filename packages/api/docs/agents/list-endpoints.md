# List endpoints

List **config** lives in the API router for each resource. Shared **primitives** come from `@workspace/db/utils/list-query` — see [db list-queries.md](../../db/docs/agents/list-queries.md).

## Pattern

1. Define `listConfig` next to the router (sortable columns, default sort, id column).
2. Use `listQuerySchema(listConfig)` as base input; `.extend()` for resource-specific `filters`.
3. In the handler: `buildListQuery(input, listConfig)` → pass `orderBy`, `limit`, `offset`, `where` to Drizzle.
4. Return shape depends on pagination mode.

## Cursor mode

```ts
const pages = await db.query.pages.findMany({ /* ... */, limit: compiled.limit });

const hasMore = pages.length > input.pagination.limit;
const pageRows = hasMore ? pages.slice(0, -1) : pages;

return {
	data: pageRows,
	meta: {
		pagination: {
			hasNextPage: hasMore,
			nextCursor: computeNextCursor(pageRows, compiled.cursorSort, listConfig),
		},
	},
};
```

Request `limit + 1` rows internally via `buildListQuery` — trim the extra row before responding.

## Offset mode

Run the same `findMany`, then a separate `count()` with the same `where` for `total` / `pageCount`.

## Filters

Keep resource-specific filters in the router input schema, not in `@workspace/db`:

```ts
listQuerySchema(listConfig).extend({
	filters: z.object({ published: z.boolean().optional() }).optional(),
})
```

Merge filter conditions into `and(...)` with `compiled.where` and soft-delete guards.

Reference: `router/pages.ts`.
