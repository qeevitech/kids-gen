"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product, Price, Subscription } from "@/db/schema";
import { SubscriptionWithProduct } from "../types";
import { useCheckout } from "../api/use-checkout";

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PricingProps {
  subscription: SubscriptionWithProduct | undefined;
  user: { id: string; email: string } | null;
  products: ProductWithPrices[] | null;
  mostPopularProduct?: string;
  showInterval?: boolean;
  className?: string;
  activeProduct?: string;
}

function renderPricingButton({
  subscription,
  user,
  product,
  price,
  mostPopularProduct,
  handleStripeCheckout,
  handleStripePortalRequest,
}: {
  subscription: SubscriptionWithProduct | undefined;
  user: { id: string; email: string } | null;
  product: ProductWithPrices;
  price: Price;
  mostPopularProduct: string;
  handleStripeCheckout: (price: Price) => Promise<void>;
  handleStripePortalRequest: () => Promise<void>;
}) {
  if (
    user &&
    subscription &&
    subscription.price?.product?.name?.toLowerCase() ===
      product.name?.toLowerCase()
  ) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        onClick={handleStripePortalRequest}
      >
        Manage Subscription
      </Button>
    );
  }

  if (user && subscription) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        variant="secondary"
        onClick={handleStripePortalRequest}
      >
        Switch Plan
      </Button>
    );
  }

  if (user && !subscription) {
    return (
      <Button
        className="mt-8 w-full font-semibold"
        variant={
          product.name?.toLowerCase() === mostPopularProduct.toLowerCase()
            ? "default"
            : "secondary"
        }
        onClick={() => handleStripeCheckout(price)}
      >
        Subscribe
      </Button>
    );
  }

  return (
    <Button
      className="mt-8 w-full font-semibold"
      variant={
        product.name?.toLowerCase() === mostPopularProduct.toLowerCase()
          ? "default"
          : "secondary"
      }
      onClick={() => handleStripeCheckout(price)}
    >
      Subscribe
    </Button>
  );
}

export function Pricing({
  user,
  products,
  mostPopularProduct = "",
  subscription,
  showInterval = true,
  className,
  activeProduct = "",
}: PricingProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month",
  );
  const router = useRouter();
  const currentPath = usePathname();
  const checkout = useCheckout();

  const handleStripeCheckout = async (price: Price) => {
    checkout.mutate(price.id);
  };

  const handleStripePortalRequest = async () => {
    toast.info("Redirecting to billing portal...");
    try {
      const response = await fetch("/api/subscriptions/billing", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 lg:px-8",
        className,
      )}
    >
      {showInterval && (
        <div className="flex items-center justify-center space-x-4 py-8">
          <Label htmlFor="pricing-switch" className="text-base font-semibold">
            Monthly
          </Label>

          <Switch
            id="pricing-switch"
            checked={billingInterval === "year"}
            onCheckedChange={(checked) =>
              setBillingInterval(checked ? "year" : "month")
            }
          />
          <Label htmlFor="pricing-switch" className="text-base font-semibold">
            Yearly
          </Label>
        </div>
      )}

      <div className="mx-auto grid grid-cols-1 place-items-center gap-8 space-y-0 sm:grid-cols-2 xl:grid-cols-3">
        {products?.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval,
          );
          if (!price) return null;

          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency!,
            minimumFractionDigits: 0,
          }).format((price?.unit_amount || 0) / 100);

          return (
            <div
              key={product.id}
              className={cn(
                "h-fit divide-y divide-border rounded-xl border bg-background shadow-sm",
                product.name?.toLowerCase() === activeProduct.toLowerCase()
                  ? "border-primary bg-background drop-shadow-md"
                  : "border-border",
              )}
            >
              <div className="p-6">
                <h2 className="flex items-center justify-between text-2xl font-semibold leading-6 text-foreground">
                  {product.name}

                  {product.name?.toLowerCase() ===
                    activeProduct.toLowerCase() && (
                    <Badge className="border-border font-semibold">
                      Selected
                    </Badge>
                  )}

                  {product.name?.toLowerCase() ===
                    mostPopularProduct.toLowerCase() && (
                    <Badge className="border-border font-semibold">
                      Most Popular
                    </Badge>
                  )}
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  {product.description}
                </p>

                {/* Add features list */}
                <ul className="mt-6 space-y-2">
                  {Object.entries(product.metadata as Record<string, string>)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([key, feature]) => (
                      <li
                        key={key}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <svg
                          className="mr-2 h-4 w-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                </ul>

                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-foreground">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    /{billingInterval}
                  </span>
                </p>

                {renderPricingButton({
                  subscription,
                  user,
                  product,
                  price,
                  mostPopularProduct,
                  handleStripeCheckout,
                  handleStripePortalRequest,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Pricing;
