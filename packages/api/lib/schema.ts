import z from "zod";

export const paginationInput = z
  .object({
    cursor: z.string().optional(),
    limit: z.int().min(1).default(30),
  })
  .default({
    cursor: undefined,
    limit: 30,
  });

export const paginationMeta = z.object({
  hasNextPage: z.boolean(),
  nextCursor: z.string().optional(),
});

export type PaginationMeta = z.infer<typeof paginationMeta>;
