import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id, timestamps } from "../helpers";

export const verifications = pgTable("verifications", {
  id,
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
