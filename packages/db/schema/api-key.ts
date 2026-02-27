import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { id, timestamps } from "../helpers";
import { users } from "./users";

export const apiKeys = pgTable("api_keys", {
	id,
	name: text("name"),
	start: text("start"),
	prefix: text("prefix"),
	key: text("key").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "no action" }),
	refillInterval: integer("refill_interval"),
	refillAmount: integer("refill_amount"),
	lastRefillAt: timestamp("last_refill_at"),
	enabled: boolean("enabled").notNull(),
	rateLimitEnabled: boolean("rate_limit_enabled").notNull(),
	rateLimitTimeWindow: integer("rate_limit_time_window"),
	rateLimitMax: integer("rate_limit_max"),
	requestsCount: integer("requests_count").notNull(),
	remaining: integer("remaining"),
	lastRequest: timestamp("last_request"),
	expiresAt: timestamp("expires_at"),
	permissions: text("permissions"),
	metadata: jsonb("metadata"),
	...timestamps,
});
