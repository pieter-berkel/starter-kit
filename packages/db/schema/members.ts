import { pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "../helpers";
import { organizations } from "./organizations";
import { users } from "./users";

export const members = pgTable("members", {
	id,
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	...timestamps,
});
