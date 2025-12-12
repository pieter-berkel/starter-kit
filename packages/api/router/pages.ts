import { ORPCError } from "@orpc/client";
import { db, schema } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import z from "zod";
import { procedure } from "../lib/orpc";

export const pagesRouter = {
  // list: procedure.input().handler(),
  // get
  // create
  // update
  delete: procedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const affected = await db
      .update(schema.pages)
      .set({ deletedAt: sql`now()` })
      .where(eq(schema.pages.id, input.id))
      .returning({ id: schema.pages.id });

    if (affected.length === 0) {
      throw new ORPCError("NOT_FOUND");
    }
  }),
};
