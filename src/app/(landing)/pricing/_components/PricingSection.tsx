"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useGetProducts } from "@/features/subscriptions/api/use-get-products";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "year",
  );
  const { data: products, isLoading } = useGetProducts();
  const { mutate: checkout, isPending } = useCheckout();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base font-semibold leading-7 text-brand-primary">
          Pricing
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Create Personalized Stories with AI
        </p>
        <p className="mt-6 text-lg text-muted-foreground">
          Choose the perfect plan to bring your stories to life with custom
          AI-generated illustrations
        </p>
      </div>

      {/* Free Plan Highlight */}
      <div className="mx-auto mt-16 w-full max-w-4xl rounded-2xl bg-gradient-to-r from-brand-primary/5 via-brand-primary/10 to-brand-primary/5 p-2">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-x-8">
            <div>
              <h3 className="flex items-center gap-x-3 text-xl font-semibold">
                Start Creating for Free
                <Sparkles className="h-5 w-5 text-brand-primary" />
              </h3>
              <p className="mt-2 text-muted-foreground">
                Get started with 2 AI-generated stories per month and unlimited
                designs
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "2 AI story generations monthly",
                  "Unlimited design creation",
                  "Basic templates access",
                  "Essential editing tools",
                  "5GB storage space",
                  "Community support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-x-3">
                    <svg
                      className="h-4 w-4 flex-none text-brand-primary"
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
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block">
              <Link href="/register">
                <Button className="flex items-center gap-x-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-6 sm:hidden">
            <Link href="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

        <p className="my-8 text-center text-sm font-medium text-muted-foreground">
          Looking for more features? Check out our premium plans
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 py-8">
        <Label htmlFor="billing-switch" className="text-base font-semibold">
          Monthly
        </Label>
        <Switch
          id="billing-switch"
          checked={billingInterval === "year"}
          onCheckedChange={(checked) =>
            setBillingInterval(checked ? "year" : "month")
          }
        />
        <Label
          htmlFor="billing-switch"
          className="flex items-center gap-x-2 text-base font-semibold"
        >
          Yearly
          <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-semibold text-brand-primary">
            Save up to 33%
          </span>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid grid-cols-1 place-items-center gap-8 space-y-0 sm:grid-cols-2 xl:grid-cols-3">
        {products?.map((product) => {
          const price = product.prices.find(
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
                "h-fit w-full divide-y divide-border rounded-xl border bg-background shadow-sm",
                product.name?.toLowerCase() === "pro"
                  ? "border-primary bg-background drop-shadow-md"
                  : "border-border",
              )}
            >
              <div className="p-6">
                <h2 className="flex items-center justify-between text-2xl font-semibold leading-6 text-foreground">
                  {product.name}
                  {product.name?.toLowerCase() === "pro" && (
                    <Badge variant="default">Most Popular</Badge>
                  )}
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  {product.description}
                </p>

                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-foreground">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    /{billingInterval}
                  </span>
                </p>

                <Button
                  variant={product.name === "Pro" ? "default" : "outline"}
                  className="mt-6 w-full"
                  onClick={() => checkout(price.id)}
                  disabled={isPending}
                >
                  {product.name === "Free" ? "Get Started" : "Subscribe"}
                </Button>

                {/* Features list */}
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

                {/* Highlight for Pro Plan */}
                {product.name?.toLowerCase() === "pro" && (
                  <div className="mt-6 rounded-lg bg-primary/5 p-4">
                    <p className="text-sm font-medium text-primary">
                      Perfect for creators who want to generate unique stories
                      with custom AI models
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mx-auto mt-16 max-w-2xl text-center">
        <p className="text-sm text-muted-foreground">
          All plans include access to our story templates, basic AI generation,
          and customer support.
          <br />
          Need a custom plan?{" "}
          <a
            href="mailto:support@storybook.com"
            className="text-primary hover:underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
}
