## A note from Pieter

I like ambitious ideas, simple systems, and software that feels obvious. Do not preserve complexity just because it already exists. Do not introduce machinery because it looks architecturally impressive. Understand the real constraint, then fight for the smallest model that makes the correct behavior unsurprising.

## Taste

- Complexity belongs at the adapter boundary. Orchestration stays pure, UI stays dumb. That is about where systems change, not a reason to extract helpers from a call site.
- Inferred types over annotations.
- Comments describe how a thing is used, and move when the code moves. To be used mostly to describe functions, not to annotate every line of behavior.
- Do not extract a helper for a single call site. Inline it.
- Extract only when a name hides a real rule (invariant, reused policy, adapter), not when it restates the next few lines.
- Prefer a slightly longer function over a file of `handleX` / `isY` / `getZ` wrappers.

## Project structure

When creating, moving, or renaming JavaScript/TypeScript source files, read [Project structure](docs/PROJECT_STRUCTURE.md).

## shadcn

This is a monorepo. shadcn lives in `packages/ui`, not in the apps.

- Components: `packages/ui/components`
- Config: `packages/ui/components.json`
- Import as `@workspace/ui/components/<name>`

Run every shadcn CLI command from inside `packages/ui`. Change into that directory first, then `pnpm dlx shadcn@latest docs attachment` (same for `info`, `add`, `search`). `--cwd` is not a global flag, and `docs` does not take it. Never run the CLI from an app. Those apps consume `@workspace/ui`. They are not shadcn projects.

If the CLI is missing in an app, that is expected. Do not install it there. Do not run `init`. Do not rewrite that app's `global.css` to wire up tokens. Theme CSS already exists per app.

New shared primitives go in `packages/ui/components`. App-specific composition stays in the app.