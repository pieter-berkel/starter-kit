import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { id, timestamps } from "../helpers";
import { organizations } from "./organizations";
import { users } from "./users";

export const sessions = pgTable(
  "sessions",
  {
    id,
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at").notNull(),
    impersonatedBy: text("impersonated_by"),
    activeOrganizationId: text("active_organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [index("sessions_token_idx").on(t.token)]
);
