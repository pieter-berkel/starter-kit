/** biome-ignore-all lint/performance/noNamespaceImport: Drizzle expects the schema as a namespace (`import * as schema`) so we can pass it to `drizzle()` and keep it strongly typed. */
/** biome-ignore-all lint/style/noExportedImports: We intentionally re-export the `schema` namespace from this package so downstream packages can reference tables/types from a single entrypoint. */

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

declare global {
  // Prevents multiple connections during HMR in dev
  var __pgPool: Pool | undefined;
  var __postgres: NodePgDatabase<typeof schema> | undefined;
}

const getPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  return new Pool({ connectionString: process.env.DATABASE_URL });
};

const initDB = () => {
  const pool = getPool();
  return drizzle(pool, { schema, casing: "snake_case" });
};

export const db: Database = (() => {
  if (process.env.NODE_ENV === "production") {
    return initDB();
  }

  if (!globalThis.__pgPool) {
    globalThis.__pgPool = getPool();
  }

  if (!globalThis.__postgres) {
    globalThis.__postgres = drizzle(globalThis.__pgPool, {
      schema,
      casing: "snake_case",
    });
  }

  return globalThis.__postgres;
})();

export { schema };
