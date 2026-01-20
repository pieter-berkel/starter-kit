import { ORPCError } from "@orpc/client";
import { db, schema } from "@workspace/db";
import { createPageSchema, updatePageSchema } from "@workspace/db/schema";
import {
  buildListQuery,
  computeNextCursor,
  defineListQueryDefinition,
  listQuerySchema,
} from "@workspace/db/utils/list-query";
import { and, count, eq, isNull, sql } from "drizzle-orm";
import z from "zod";
import { base, requirePermissionsMiddleware } from "../lib/orpc";

export const listConfig = defineListQueryDefinition({
  id: schema.pages.id,
  sortable: {
    id: schema.pages.id,
    title: schema.pages.title,
    createdAt: schema.pages.createdAt,
  },
  defaultSort: { column: "createdAt", direction: "desc" },
});

export const pagesRouter = {
  list: base
    .input(
      listQuerySchema(listConfig).extend({
        filters: z.object({ published: z.boolean().optional() }).optional(),
      })
    )
    .handler(async ({ input }) => {
      const compiled = buildListQuery(input, listConfig);

      const where = and(
        isNull(schema.pages.deletedAt),
        input.filters?.published ? eq(schema.pages.published, input.filters.published) : undefined,
        compiled.where
      );

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
        where,
        orderBy: compiled.orderBy,
        limit: compiled.limit,
        offset: compiled.offset,
      });

      if (input.pagination.mode === "cursor") {
        const hasMore = pages.length > input.pagination.limit;
        const pageRows = hasMore ? pages.slice(0, -1) : pages;

        return {
          data: pageRows,
          meta: {
            pagination: {
              hasNextPage: hasMore,
              nextCursor: computeNextCursor(pageRows, compiled.cursorSort, listConfig),
            },
          },
        };
      }

      const countResult = await db.select({ count: count() }).from(schema.pages).where(where);
      const total = Number(countResult[0]?.count ?? 0);

      return {
        data: pages,
        meta: {
          pagination: {
            page: input.pagination.page,
            pageSize: input.pagination.pageSize,
            pageCount: Math.ceil(total / input.pagination.pageSize),
            total,
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
  create: base
    .input(z.object({ data: createPageSchema }))
    .use(requirePermissionsMiddleware({ page: ["create"] }))
    .handler(async ({ input }) => {
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
    .use(requirePermissionsMiddleware({ page: ["update"] }))
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
  delete: base
    .input(z.object({ id: z.string() }))
    .use(requirePermissionsMiddleware({ page: ["delete"] }))
    .handler(async ({ input }) => {
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
