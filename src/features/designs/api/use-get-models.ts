import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof client.api.train)["$get"],
  200
>;
export const useGetTrainedModels = (limit: number = 20) => {
  const query = useInfiniteQuery<ResponseType, Error>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: ["trained-models"],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.train.$get({
        query: {
          page: (pageParam as number).toString(),
          limit: limit.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return response.json();
    },
  });

  return query;
};
