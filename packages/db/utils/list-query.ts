import {
	and,
	asc,
	type Column,
	desc,
	eq,
	gt,
	lt,
	or,
	type SQL,
} from "drizzle-orm";
import z from "zod";
import { decodeCursor, encodeCursor } from "./cursor";

type SortDirection = "asc" | "desc";

export type ListQueryDefinition<TSortable extends Record<string, Column>> = {
	id: Column;
	sortable?: TSortable;
	defaultSort: { column: keyof TSortable; direction: SortDirection };
};

export const defineListQueryDefinition = <
	const TSortable extends Record<string, Column>,
>(
	config: ListQueryDefinition<TSortable>,
) => config;

export const listQuerySchema = <const TSortable extends Record<string, Column>>(
	config: ListQueryDefinition<TSortable>,
) => {
	const sortableColumnNames = Object.keys(
		config.sortable ?? {},
	) as (keyof TSortable & string)[];

	return z
		.object({
			pagination: z
				.discriminatedUnion("mode", [
					z.object({
						mode: z.literal("cursor"),
						limit: z.number().int().min(1).max(128).default(30),
						cursor: z.string().nullish(),
					}),
					z.object({
						mode: z.literal("offset"),
						page: z.number().int().min(1).default(1),
						pageSize: z.number().int().min(1).max(128).default(30),
					}),
				])
				.default({
					mode: "cursor",
					limit: 30,
				}),
			sort: z
				.array(
					z.object({
						column: z.enum(sortableColumnNames),
						direction: z.enum(["asc", "desc"]),
					}),
				)
				.optional()
				.default([]),
		})
		.superRefine((data, ctx) => {
			if (data.pagination.mode === "cursor" && (data.sort ?? []).length > 1) {
				ctx.addIssue({
					code: "too_big",
					maximum: 1,
					origin: "array",
					message: "Cursor mode does not support multiple sort columns",
					input: data,
					path: ["sort"],
				});
			}
		});
};

type ListQueryInput<TSortable extends Record<string, Column>> = z.output<
	ReturnType<typeof listQuerySchema<TSortable>>
>;

const compileOrderBy = <TSortable extends Record<string, Column>>(
	input: ListQueryInput<TSortable>,
	config: ListQueryDefinition<TSortable>,
) => {
	const orderBy: SQL[] = [];

	const sorts = input.sort.length > 0 ? input.sort : [config.defaultSort];

	if (input.pagination.mode === "cursor") {
		const primary = sorts[0] ?? config.defaultSort;
		const primaryColumn = config.sortable?.[primary.column];

		if (!primaryColumn) {
			throw new Error(`Invalid sort column: ${String(primary.column)}`);
		}

		orderBy.push(
			primary.direction === "asc" ? asc(primaryColumn) : desc(primaryColumn),
		);
		orderBy.push(
			primary.direction === "asc" ? asc(config.id) : desc(config.id),
		);

		return { orderBy, cursorSort: primary };
	}

	for (const sort of sorts) {
		const column = config.sortable?.[sort.column];

		if (!column) {
			throw new Error(`Invalid sort column: ${String(sort.column)}`);
		}

		orderBy.push(sort.direction === "asc" ? asc(column) : desc(column));
	}

	const hasIdAlready = input.sort.some((s) => s.column === config.id.name);

	if (!hasIdAlready) {
		const tieBreakDirection =
			input.sort.at(-1)?.direction ?? config.defaultSort.direction;
		orderBy.push(
			tieBreakDirection === "asc" ? asc(config.id) : desc(config.id),
		);
	}

	return { orderBy, cursorSort: null as any };
};

const compileCursorWhere = <TSortable extends Record<string, Column>>(
	input: ListQueryInput<TSortable>,
	config: ListQueryDefinition<TSortable>,
	cursorSort: { column: string; direction: SortDirection },
) => {
	if (input.pagination.mode !== "cursor") {
		return undefined;
	}

	if (!input.pagination.cursor) {
		return undefined;
	}

	const sortColumn = config.sortable?.[cursorSort.column];

	if (!sortColumn) {
		throw new Error(`Invalid sort column: ${String(cursorSort.column)}`);
	}

	const decoded = decodeCursor(input.pagination.cursor);

	if (cursorSort.direction === "desc") {
		return or(
			lt(sortColumn, decoded.value),
			and(eq(sortColumn, decoded.value), lt(config.id, decoded.id)),
		);
	}

	return or(
		gt(sortColumn, decoded.value),
		and(eq(sortColumn, decoded.value), gt(config.id, decoded.id)),
	);
};

export const buildListQuery = <TSortable extends Record<string, Column>>(
	input: ListQueryInput<TSortable>,
	config: ListQueryDefinition<TSortable>,
) => {
	const { orderBy, cursorSort } = compileOrderBy(input, config);

	const whereParts: (SQL | undefined)[] = [];

	if (input.pagination.mode === "cursor") {
		whereParts.push(compileCursorWhere(input, config, cursorSort));
	}

	const where = and(...whereParts.filter((x) => x != null));

	const limit =
		input.pagination.mode === "cursor"
			? input.pagination.limit + 1
			: input.pagination.pageSize;

	const offset =
		input.pagination.mode === "offset"
			? (input.pagination.page - 1) * input.pagination.pageSize
			: undefined;

	return { orderBy, where, limit, offset, cursorSort };
};

export const computeNextCursor = <TSortable extends Record<string, Column>>(
	rows: Record<string, any>[],
	cursorSort: { column: string; direction: SortDirection } | null,
	config: ListQueryDefinition<TSortable>,
) => {
	if (!cursorSort) {
		return null;
	}

	const last = rows.at(-1);

	if (!last) {
		return null;
	}

	const idColumnName = config.id.name;
	const value = last[cursorSort.column];
	const id = last[idColumnName];

	if (!(value && id)) {
		return null;
	}

	return encodeCursor({
		value,
		id,
	});
};
