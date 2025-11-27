import "server-only";

import type { QueryOptionsBase } from "@orpc/tanstack-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import { createQueryClient } from "./client";

export const getQueryClient = cache(createQueryClient);

export const prefetch = <T extends QueryOptionsBase<any, any>>(
  queryOptions: T
) => {
  const queryClient = getQueryClient();
  if ((queryOptions.queryKey[1] as any)?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
};

export const HydrateClient = (props: { children: React.ReactNode }) => {
  const client = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(client)}>
      {props.children}
    </HydrationBoundary>
  );
};
