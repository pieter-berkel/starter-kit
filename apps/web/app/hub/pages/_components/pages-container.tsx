"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import {
  ErrorContent,
  ErrorDescription,
  ErrorHeader,
  ErrorMedia,
  ErrorState,
  ErrorTitle,
} from "@workspace/ui/components/error";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangleIcon, ChevronRightIcon, FileBracesCornerIcon } from "lucide-react";
import Link from "next/link";
import { Activity, Fragment, useState } from "react";
import { orpc } from "@/lib/orpc";

export const PagesContainer = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);

  const { data, error, isLoading, refetch } = useQuery(
    orpc.pages.list.queryOptions({
      input: {
        pagination: { mode: "cursor", cursor },
        sort: [{ column: "createdAt", direction: "asc" }],
        filters: { published: true },
      },
      placeholderData: (prev) => prev,
    })
  );

  if (isLoading) {
    return <Skeleton className="h-20" />;
  }

  if (error) {
    return (
      <ErrorState className="border border-dashed">
        <ErrorHeader>
          <ErrorMedia variant="icon">
            <AlertTriangleIcon />
          </ErrorMedia>
          <ErrorTitle>Pages could not be loaded</ErrorTitle>
          <ErrorDescription>{error.message || "An unknown error occurred"}</ErrorDescription>
        </ErrorHeader>
        <ErrorContent>
          <Button onClick={() => refetch()} size="sm" variant="outline">
            Try again
          </Button>
        </ErrorContent>
      </ErrorState>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileBracesCornerIcon />
          </EmptyMedia>
          <EmptyTitle>No pages created yet</EmptyTitle>
          <EmptyDescription>Create a new page to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/hub/pages/create" />}>
            Create a new page
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-8">
      <ItemGroup>
        {data.data.map((page, i) => (
          <Fragment key={page.id}>
            <Item
              className="-mx-4 [a]:hover:bg-transparent"
              render={<Link href={`/hub/pages/${page.id}`} />}
            >
              <ItemContent>
                <ItemTitle>{page.title}</ItemTitle>
                <ItemDescription>{page.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ItemContent className="items-end">
                  <ItemTitle>
                    <div
                      className={cn(
                        "flex-none rounded-full p-1",
                        page.published
                          ? "bg-emerald-500/20 dark:bg-emerald-500/30"
                          : "bg-yellow-500/20 dark:bg-yellow-500/30"
                      )}
                    >
                      <div
                        className={cn(
                          "size-1.5 rounded-full",
                          page.published ? "bg-emerald-500" : "bg-yellow-500"
                        )}
                      />
                    </div>
                    {page.published ? "Published" : "Draft"}
                  </ItemTitle>
                  <ItemDescription>{formatDistanceToNow(page.createdAt)}</ItemDescription>
                </ItemContent>
                <Button className="rounded-full text-muted-foreground" size="icon" variant="ghost">
                  <ChevronRightIcon className="size-4" />
                </Button>
              </ItemActions>
            </Item>
            {i !== data.data.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
      <Activity
        mode={cursorHistory.length > 0 || !!data.meta.pagination.nextCursor ? "visible" : "hidden"}
      >
        <div className="flex items-center justify-between gap-2">
          <Button
            disabled={cursorHistory.length === 0}
            onClick={() => {
              const prev = cursorHistory.at(-1) ?? null;
              setCursorHistory((h) => h.slice(0, -1));
              setCursor(prev);
            }}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!data.meta.pagination.hasNextPage}
            onClick={() => {
              const next = data.meta.pagination.nextCursor ?? null;
              setCursorHistory((h) => [...h, cursor]);
              setCursor(next);
            }}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </Activity>
    </div>
  );
};
