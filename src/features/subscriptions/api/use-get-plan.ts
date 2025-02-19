import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCurrentPlan = () => {
  const query = useQuery({
    queryKey: ["plan"],
    queryFn: async () => {
      const response = await client.api.subscriptions.plan.$get();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
