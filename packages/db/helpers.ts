import { text, timestamp } from "drizzle-orm/pg-core";
import { generateID } from "./utils/id-generator";

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => generateID());

export const createdAt = timestamp("created_at", { withTimezone: true, precision: 0 })
  .defaultNow()
  .notNull();

export const updatedAt = timestamp("updated_at", { withTimezone: true, precision: 0 })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const deletedAt = timestamp("deleted_at", { withTimezone: true, precision: 0 });

export const timestamps = {
  createdAt,
  updatedAt,
  deletedAt,
};
