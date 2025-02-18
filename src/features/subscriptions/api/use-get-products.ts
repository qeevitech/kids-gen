import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import type { Product, Price } from "@/db/schema";

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await client.api.subscriptions.products.$get();
      if (!response.ok) throw new Error("Failed to fetch products");
      const { data } = await response.json();
      return data as ProductWithPrices[];
    },
  });
};
