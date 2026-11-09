# JavaScript/TypeScript project structure

Use these conventions for React application code and packages organized around product features. Packages built around a technical boundary can keep the vocabulary of that boundary, such as `routers`, `schemas`, `templates`, or `processes`.

This document describes the target structure. New files follow it now. Existing files can remain in place until a separate migration, except when adding a second file triggers the category-folder rule below. Follow framework-required locations and more specific repository or package instructions.

## Ownership and reuse

- Start with the smallest directory that contains every current consumer. Code used by one route stays with that route, even when several files within it import the code.
- Code shared by related routes stays with their common route area. The physical route tree determines ownership, so route groups and pathless layouts can be owners.
- A common route prefix owns only code for that route area itself, such as its layout or navigation. It does not own domain behavior merely because otherwise independent routes sit below it.
- Create `features/<subject>` when independent route areas or another feature actually share domain functionality. A feature owns that subject's UI, hooks, and business rules. Size or anticipated reuse alone does not justify a feature.
- Use the general shared categories below only for code with actual reuse that is not owned by a domain subject.
- Route-local code can import features and general shared code. Features can import other features and general shared code. General shared code cannot import a route or feature, and nothing can import route-local code from outside its route area.
- If feature imports would form a cycle, move the shared responsibility into its own feature. Deep feature imports are allowed; an `index.ts` public entrypoint is optional.
- For cross-app reuse, use the repository's shared domain and UI packages. Create a shared package only when reuse actually crosses an app boundary. An app's shared folders belong only to that app.

## Shared categories

These are the allowed general top-level categories. Put them inside an existing `src` directory, or at the package root when there is no `src`.

- `assets`: imported images, fonts, and other static source assets. Use framework locations such as `public` for assets served directly by URL.
- `components`: general UI shared by routes in one app. Subject-specific UI belongs to its feature or route area. UI shared across apps belongs in the repository's shared UI package when it has one.
- `features`: domain functionality shared by independent consumers. Keep each subject together under `features/<subject>`.
- `hooks`: general shared React hooks. Subject-specific hooks stay with their owner.
- `lib`: adapters and configuration for external systems, such as database, storage, analytics, and email clients.
- `utils`: general technical transformations without external interaction, such as normalizing text or formatting file sizes.

Business rules stay with their owning route area or feature, even when they are pure functions or have many consumers. Do not use `lib` or `utils` as a home for domain code.

Top-level `types` is reserved for ambient declarations such as module augmentations and third-party `.d.ts` files that have no consuming owner. Other types, configuration, constants, schemas, state, queries, and actions stay with their route area or feature. Keep single-use declarations in their consuming file.

## Colocation and subfolders

- Within a route area or feature, one file for a category stays directly in the owner's folder.
- When an owner has at least two primary files in the same category, create one category subfolder and move both files into it.
- Category names are open rather than prescribed. Use a clear plural noun such as `components`, `hooks`, `schemas`, `actions`, `queries`, or `adapters`.
- Count files within the same category and owner. One component and one schema do not justify separate category subfolders. A component's test or stylesheet does not count as a second component.
- Prefix category subfolders inside route directories with `_`, such as `_components`, `_hooks`, `_actions`, and `_schemas`. Inside features, use ordinary names such as `components`, `hooks`, `actions`, and `schemas`.
- Category folders are one level deep. Do not invent nested taxonomies such as `server/actions`; use the category folder directly. Framework-required directories and boundary-specific package structures are exceptions.
- The general top-level categories and named feature folders can start with one file. Create them only when needed; do not scaffold empty folders or a full set of category subfolders.
- Keep tests and component-specific styles beside the code they belong to, subject to tooling requirements.

## Filenames

- Choose a filename that describes the file's subject or operation. For a file directly in its owner's folder, add a category suffix when needed for clarity, such as `order.schema.ts` or `order.types.ts`.
- Inside a category subfolder, omit redundant category suffixes: `schemas/order.ts`, `types/order.ts`, and `_utils/selection.ts`.
- Preserve name parts required by the language, framework, or tooling, such as `.d.ts`, `.test.ts`, `.module.css`, and route entrypoint names.
- When grouping files into a new subfolder, remove redundant suffixes and update imports and other affected references.

For example, a feature's only schema stays at `features/orders/order.schema.ts`. Adding an order-item schema gives:

```text
features/orders/schemas/order.ts
features/orders/schemas/order-item.ts
```

A route's only component stays at `app/editor/toolbar.tsx`. Adding a second component gives `app/editor/_components/toolbar.tsx` and `app/editor/_components/sidebar.tsx`.
