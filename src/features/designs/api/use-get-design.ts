import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<
  (typeof client.api.designs)[":id"]["$get"],
  200
>;

export const useGetDesign = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["design", { id }],
    queryFn: async () => {
      const response = await client.api.designs[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch design");
      }

      const data = await response.json();
      return data;
    },
  });

  return query;
};
