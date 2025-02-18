"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { useGetCredits } from "../api/use-get-credits";
import { useGetSubscription } from "../api/use-get-subscription";
import { useGetProducts } from "../api/use-get-products";
import { Pricing } from "./pricing";

export const PlanSummary = () => {
  const { data: session } = useSession();
  const { data: credits, isLoading: isLoadingCredits } = useGetCredits();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  if (isLoadingCredits || isLoadingSubscription || isLoadingProducts) {
    return <div>Loading...</div>;
  }

  const planName = subscription?.price?.product?.name || "Free";
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  if (!credits) {
    return (
      <div className="space-y-8">
        <Card className="max-w-5xl">
          <CardContent className="px-5 py-4">
            <h3 className="flex flex-wrap items-center gap-x-2 pb-4 text-base font-semibold">
              <span>Plan Summary</span>
              <Badge variant={"secondary"} className="bg-primary/10">
                {planName}
              </Badge>
            </h3>

            <div className="grid grid-cols-8 gap-4">
              <div className="col-span-5 flex flex-col pr-12">
                <div className="flex w-full flex-1 justify-between pb-1 text-sm font-normal">
                  <span className="ml-1 font-normal lowercase text-muted-foreground">
                    Image Generation credits left
                  </span>
                  <span className="font-medium">0 remaining</span>
                </div>
                <div className="mb-1 flex items-end">
                  <Progress value={0} className="h-2 w-full" />
                </div>
              </div>

              <div className="col-span-5 flex flex-col pr-12">
                <div className="flex w-full flex-1 justify-between pb-1 text-sm font-normal">
                  <span className="ml-1 font-normal lowercase text-muted-foreground">
                    model training credits left
                  </span>
                  <span className="font-medium">0 remaining</span>
                </div>
                <div className="mb-1 flex items-end">
                  <Progress value={0} className="h-2 w-full" />
                </div>
              </div>

              <div className="col-span-full flex flex-col">
                Please upgrade to a plan to continue using the app.
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-4 py-3">
            {!isActive && (
              <p className="text-sm text-muted-foreground">
                Your subscription is not active. Please renew your subscription
                to continue.
              </p>
            )}
          </CardFooter>
        </Card>

        <Pricing
          user={session?.user ?? null}
          subscription={subscription}
          products={products ?? null}
          mostPopularProduct="Pro"
        />
      </div>
    );
  }

  const imagePercentage =
    (credits.image_generation_count / credits.max_image_generation_count) * 100;
  const modelPercentage =
    (credits.model_training_count / credits.max_model_training_count) * 100;

  return (
    <div className="space-y-8">
      <Card className="max-w-5xl">
        <CardContent className="px-5 py-4">
          <h3 className="flex flex-wrap items-center gap-x-2 pb-4 text-base font-semibold">
            <span>Plan Summary</span>
            <Badge variant={"secondary"} className="bg-primary/10">
              {planName}
            </Badge>
          </h3>

          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-5 flex flex-col pr-12">
              <div className="flex w-full flex-1 justify-between pb-1 text-sm font-normal">
                <span className="ml-1 font-normal lowercase text-muted-foreground">
                  Image Generation credits left
                </span>
                <span className="font-medium">
                  {credits.image_generation_count} /{" "}
                  {credits.max_image_generation_count} remaining
                </span>
              </div>
              <div className="mb-1 flex items-end">
                <Progress value={imagePercentage} className="h-2 w-full" />
              </div>
            </div>

            <div className="col-span-5 flex flex-col pr-12">
              <div className="flex w-full flex-1 justify-between pb-1 text-sm font-normal">
                <span className="ml-1 font-normal lowercase text-muted-foreground">
                  model training credits left
                </span>
                <span className="font-medium">
                  {credits.model_training_count} /{" "}
                  {credits.max_model_training_count} remaining
                </span>
              </div>
              <div className="mb-1 flex items-end">
                <Progress value={modelPercentage} className="h-2 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border px-4 py-3">
          {!isActive && (
            <p className="text-sm text-muted-foreground">
              Your subscription is not active. Please renew your subscription to
              continue.
            </p>
          )}
        </CardFooter>
      </Card>

      <Pricing
        user={session?.user ?? null}
        subscription={subscription}
        products={products ?? null}
        mostPopularProduct="Pro"
      />
    </div>
  );
};
