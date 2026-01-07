import { ORPCError } from "@orpc/client";
import { db, schema } from "@workspace/db";
import { createPageSchema, updatePageSchema } from "@workspace/db/schema";
import { and, desc, eq, isNull, lt, or, type SQL, sql } from "drizzle-orm";
import z from "zod";
import { decodeCursor, encodeCursor } from "../lib/cursor";
import { base } from "../lib/orpc";
import { paginationInput } from "../lib/schema";

export const pagesRouter = {
  list: base
    .input(
      z
        .object({
          pagination: paginationInput,
          filters: z.object({ published: z.boolean().optional() }).optional(),
        })
        .prefault({})
    )
    .handler(async ({ input }) => {
      const { pagination, filters } = input;

      let cursorWhere: SQL | undefined;
      if (pagination.cursor) {
        const data = decodeCursor<{ createdAt: string; id: string }>(pagination.cursor);

        cursorWhere = or(
          lt(schema.pages.createdAt, new Date(data.createdAt)),
          and(eq(schema.pages.createdAt, new Date(data.createdAt)), lt(schema.pages.id, data.id))
        );
      }

      const pages = await db.query.pages.findMany({
        columns: {
          id: true,
          slug: true,
          title: true,
          description: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
        where: and(
          isNull(schema.pages.deletedAt),
          filters?.published ? eq(schema.pages.published, filters.published) : undefined,
          cursorWhere
        ),
        orderBy: [desc(schema.pages.createdAt), desc(schema.pages.id)],
        limit: pagination.limit + 1,
      });

      const hasNextPage = pages.length > pagination.limit;
      const last = hasNextPage ? pages.pop() : null;

      const nextCursor = last
        ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id })
        : null;

      return {
        data: pages,
        meta: {
          pagination: {
            hasNextPage,
            nextCursor,
          },
        },
      };
    }),
  get: base
    .input(
      z.union([z.object({ id: z.string() }).strict(), z.object({ slug: z.string() }).strict()])
    )
    .handler(async ({ input }) => {
      const page = await db.query.pages.findFirst({
        columns: {
          id: true,
          slug: true,
          title: true,
          description: true,
          content: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
        where: and(
          eq(
            "id" in input ? schema.pages.id : schema.pages.slug,
            "id" in input ? input.id : input.slug
          ),
          isNull(schema.pages.deletedAt)
        ),
      });

      if (!page) {
        throw new ORPCError("NOT_FOUND");
      }

      return { data: page };
    }),
  create: base.input(z.object({ data: createPageSchema })).handler(async ({ input }) => {
    const [page] = await db
      .insert(schema.pages)
      .values(input.data)
      .returning({ id: schema.pages.id });

    if (!page) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return { data: page };
  }),
  update: base
    .input(z.object({ id: z.string(), data: updatePageSchema }))
    .handler(async ({ input }) => {
      const [page] = await db
        .update(schema.pages)
        .set(input.data)
        .where(and(eq(schema.pages.id, input.id), isNull(schema.pages.deletedAt)))
        .returning({ id: schema.pages.id });

      if (!page) {
        throw new ORPCError("NOT_FOUND");
      }

      return { data: page };
    }),
  delete: base.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [page] = await db
      .update(schema.pages)
      .set({ deletedAt: sql`now()` })
      .where(and(eq(schema.pages.id, input.id), isNull(schema.pages.deletedAt)))
      .returning({ id: schema.pages.id });

    if (!page) {
      throw new ORPCError("NOT_FOUND");
    }

    return { data: page };
  }),
};
