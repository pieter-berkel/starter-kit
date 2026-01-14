import { text, timestamp } from "drizzle-orm/pg-core";
import { generateID } from "./utils/id-generator";

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => generateID());

export const createdAt = timestamp("created_at", { withTimezone: true, mode: "string" })
  .defaultNow()
  .notNull();

export const updatedAt = timestamp("updated_at", { withTimezone: true, mode: "string" })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date().toISOString());

export const deletedAt = timestamp("deleted_at", { withTimezone: true, mode: "string" });

export const timestamps = {
  createdAt,
  updatedAt,
  deletedAt,
};
