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
