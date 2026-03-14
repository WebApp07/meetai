import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const Page = async () => {
  // temporarily store fetched data on the server
  const queryClient = getQueryClient();
  // fetch data and store it in the queryClient cache
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    // HydrationBoundary sends the server cache to the browser
    // dehydrate(queryClient) converts the cache into JSON
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
