import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  typeof client.api.templates.$get,
  200
>;
type RequestType = InferRequestType<typeof client.api.templates.$get>["query"];

export const useGetTemplates = (apiQuery: RequestType) => {
  return useQuery({
    queryKey: [
      "templates",
      {
        page: apiQuery.page,
        limit: apiQuery.limit,
        category: apiQuery.category,
      },
    ],
    queryFn: async () => {
      const response = await client.api.templates.$get({
        query: apiQuery,
      });
      if (!response.ok) throw new Error("Failed to fetch templates");
      const { data } = await response.json();
      return data;
    },
  });
};
