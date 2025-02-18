import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import type { Product, Price, Subscription } from "@/db/schema";

export interface PriceWithProduct extends Price {
  products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
  price:
    | (Price & {
        product: Product | null;
      })
    | null;
}

export const useGetSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await client.api.subscriptions.current.$get();
      if (!response.ok) throw new Error("Failed to fetch subscription");
      const { data } = await response.json();
      return data as SubscriptionWithProduct;
    },
  });
};
