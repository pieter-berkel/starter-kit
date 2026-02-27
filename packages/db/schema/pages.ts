import { isNull } from "drizzle-orm";
import { boolean, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import z from "zod";
import { id, timestamps } from "../helpers";

export const pages = pgTable(
	"pages",
	{
		id,
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		content: text("content").notNull(),
		published: boolean("published").notNull(),
		...timestamps,
	},
	(t) => [uniqueIndex("pages_slug_idx").on(t.slug).where(isNull(t.deletedAt))],
);

export const createPageSchema = z.object({
	slug: z.string().startsWith("/"),
	title: z.string().min(1),
	description: z.string().nullish(),
	content: z.string(),
	published: z.boolean(),
});

export const updatePageSchema = createPageSchema.partial();
