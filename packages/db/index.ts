/** biome-ignore-all lint/performance/noNamespaceImport: <explanation> */

import { sql } from "bun";
import { type BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";

import * as schema from "./schema";

declare global {
  var __postgress: BunSQLDatabase<typeof schema> | undefined;
}

export let db: BunSQLDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(sql, { schema, casing: "snake_case" });
} else {
  if (!global.__postgress) {
    global.__postgress = drizzle(sql, { schema, casing: "snake_case" });
  }
  db = global.__postgress;
}
