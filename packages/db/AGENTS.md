# @workspace/db

Drizzle ORM schema, Zod validation for app-owned resources, and shared database utilities for the monorepo.

**Package manager:** pnpm (run commands from the repo root).

**Database commands:**

```bash
pnpm db:push    # sync schema to the database
pnpm db:studio  # open Drizzle Studio
```

**Imports:** `@workspace/db` · `@workspace/db/schema` · `@workspace/db/utils/<name>`

## Agent docs

Read only what applies to your task:

| Topic | File |
| --- | --- |
| Schema files, validation, types, new-table checklist | [docs/agents/schema.md](docs/agents/schema.md) |
| List pagination and sorting | [docs/agents/list-queries.md](docs/agents/list-queries.md) |
| Reusable utils (`list-query`, cursor, IDs) | [docs/agents/utils.md](docs/agents/utils.md) |

**Related:** List config is defined in [@workspace/api](../api/AGENTS.md) routers.
