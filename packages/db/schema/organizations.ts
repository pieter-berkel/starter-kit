import { pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "../helpers";

export const organizations = pgTable("organizations", {
	id,
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	logo: text("logo"),
	metadata: text("metadata"),
	...timestamps,
});

export type Organization = typeof organizations.$inferSelect;
