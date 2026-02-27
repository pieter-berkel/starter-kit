import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { id, timestamps } from "../helpers";

export const users = pgTable(
	"users",
	{
		id,
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").notNull().default(false),
		image: text("image"),
		role: text("role"),
		banned: boolean("banned"),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
		...timestamps,
	},
	(t) => [index("users_email_idx").on(t.email)],
);
