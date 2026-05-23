# starter-kit

pnpm monorepo: Next.js app (`apps/web`), oRPC API, Drizzle database, and shared packages.

```bash
pnpm dev          # run all apps
pnpm check        # lint/format (Biome)
pnpm build        # build + typecheck
pnpm db:push      # sync database schema
```

## Package guides

| Package | Guide |
| --- | --- |
| `@workspace/db` | [packages/db/AGENTS.md](packages/db/AGENTS.md) |
| `@workspace/api` | [packages/api/AGENTS.md](packages/api/AGENTS.md) |

Work in the matching package guide before changing database schema, API procedures, or related app code.
