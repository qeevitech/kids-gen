import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseType = InferResponseType<typeof client.api.train.$get, 200>;

interface GetModelsResponse {
  models: any[];
  nextCursor: string | null;
}

interface GetModelsParams {
  limit?: number;
  cursor?: string;
}

export const useGetTrainedModels = (limit: number = 10) => {
  return useInfiniteQuery<GetModelsResponse>({
    queryKey: ["trained-models"],
    queryFn: async ({ pageParam = undefined }) => {
      const response = await client.api.train.$get({
        query: {
          limit: String(limit),
          cursor: pageParam as string | undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
};
