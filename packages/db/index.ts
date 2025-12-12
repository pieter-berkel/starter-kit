/** biome-ignore-all lint/performance/noNamespaceImport: Drizzle expects the schema as a namespace (`import * as schema`) so we can pass it to `drizzle()` and keep it strongly typed. */
/** biome-ignore-all lint/style/noExportedImports: We intentionally re-export the `schema` namespace from this package so downstream packages can reference tables/types from a single entrypoint. */

import { SQL } from "bun";
import { type BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";

import * as schema from "./schema";

export type Database = BunSQLDatabase<typeof schema>;

declare global {
  // Prevents multiple connections during HMR in dev
  var __postgres: BunSQLDatabase<typeof schema> | undefined;
}

const initDB = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new SQL(process.env.DATABASE_URL);

  return drizzle(client, { schema, casing: "snake_case" });
};

export const db: Database = (() => {
  if (process.env.NODE_ENV === "production") {
    return initDB();
  }

  if (!global.__postgres) {
    global.__postgres = initDB();
  }

  return global.__postgres;
})();

export { schema };
