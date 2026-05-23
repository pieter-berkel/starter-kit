# Utils (public API)

`utils/` is **not** internal-only. Other workspaces import via `@workspace/db/utils/<name>` (see `package.json` exports).

| Module | Import | Purpose |
| --- | --- | --- |
| `list-query` | `@workspace/db/utils/list-query` | Cursor/offset pagination, sorting, query compilation — see [list-queries.md](list-queries.md) |
| `cursor` | `@workspace/db/utils/cursor` | Encode/decode cursor tokens (used by `list-query`) |
| `id-generator` | `@workspace/db/utils/id-generator` | `generateID()` |

Add a new util when **multiple packages** need the same database-related behavior.
