import { text, timestamp } from "drizzle-orm/pg-core";
import { generateID } from "./utils/id-generator";

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => generateID());

export const createdAt = timestamp("created_at").defaultNow().notNull();

export const updatedAt = timestamp("updated_at")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const deletedAt = timestamp("deleted_at");

export const timestamps = {
  createdAt,
  updatedAt,
  deletedAt,
};
