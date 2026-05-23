# @workspace/api

oRPC router and procedures for the monorepo. Consumed by `apps/web` via `/rpc` and the server router client.

**Package manager:** pnpm (run commands from the repo root).

**Quality checks:** `pnpm check` (Biome) · `pnpm build` (Turbo, includes typecheck)

**Import:** `@workspace/api` — `router`, `RouterInputs`, `RouterOutputs`

## Agent docs

Read only what applies to your task:

| Topic | File |
| --- | --- |
| Router layout and adding resources | [docs/agents/routers.md](docs/agents/routers.md) |
| Procedures (input, handlers, responses, errors) | [docs/agents/procedures.md](docs/agents/procedures.md) |
| Context and middleware (auth, permissions, org) | [docs/agents/middleware.md](docs/agents/middleware.md) |
| List endpoints (pagination, sort, filters) | [docs/agents/list-endpoints.md](docs/agents/list-endpoints.md) |

**Related:** Validation schemas and list-query primitives live in [@workspace/db](../db/AGENTS.md).
