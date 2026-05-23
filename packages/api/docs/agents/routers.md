# Routers

## Layout

```
packages/api/
├── index.ts          # export router + RouterInputs / RouterOutputs types
├── lib/orpc.ts       # base builder, Context, middleware
└── router/
    ├── index.ts      # root router — register all resources here
    └── <resource>.ts # one router object per resource (e.g. pages.ts)
```

## Rules

- **One resource per file** in `router/` — export `<resource>Router` as a plain object of procedures.
- **Register** every resource on the root router in `router/index.ts`:

```ts
export const router = base.router({
	pages: pagesRouter,
});
```

- **Do not** put business logic in `index.ts` or `lib/orpc.ts` — only wiring and shared middleware.

## Consumer wiring (outside this package)

| Consumer | Location | Role |
| --- | --- | --- |
| HTTP `/rpc` | `apps/web/app/rpc/[[...rest]]/route.ts` | `RPCHandler` + per-request `context` |
| Server calls | `apps/web/lib/orpc/server.ts` | `createRouterClient(router, { context })` |
| Client types | `apps/web/lib/orpc/index.ts` | Typed client from `router` |

When adding procedures, assume both **client** (`scope: "client"`) and **server** (`scope: "server"`) contexts unless a procedure is explicitly server-only.

## New resource checklist

1. Add `router/<resource>.ts` with procedures.
2. Register in `router/index.ts`.
3. Import validation from `@workspace/db/schema` for create/update (see [db schema docs](../../db/docs/agents/schema.md)).
4. Add permission keys to auth config if using `requirePermissionsMiddleware`.
5. Expose UI routes in `apps/web` that call the new procedures.
