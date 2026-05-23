# List queries

Shared list/pagination/sort logic: `@workspace/db/utils/list-query`.

**Where config lives:** In the **API router** that owns the list procedure — sortable columns, default sort, and resource-specific filters. The db package supplies primitives only.

**Example:** `packages/api/router/pages.ts` — `listConfig`, `listQuerySchema(listConfig)`, `buildListQuery`, `computeNextCursor`.

```ts
import {
	buildListQuery,
	computeNextCursor,
	defineListQueryDefinition,
	listQuerySchema,
} from "@workspace/db/utils/list-query";

export const listConfig = defineListQueryDefinition({
	id: schema.pages.id,
	sortable: {
		id: schema.pages.id,
		title: schema.pages.title,
		createdAt: schema.pages.createdAt,
	},
	defaultSort: { column: "createdAt", direction: "desc" },
});
```

Extend `listQuerySchema(listConfig)` in the procedure `.input()` when you need extra filters (see the `pages` router).
