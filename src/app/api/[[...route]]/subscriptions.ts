import Stripe from "stripe";
import { Hono } from "hono";
import { eq, and, inArray } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { checkIsActive } from "@/features/subscriptions/lib";

import { stripe } from "@/lib/stripe/config";
import { db } from "@/db/drizzle";
import { subscriptions, credits, prices, products } from "@/db/schema";
import {
  deletePriceRecord,
  deleteProductRecord,
  manageSubscriptionStatusChange,
  updateUserCredits,
  upsertPriceRecord,
  upsertProductRecord,
} from "@/lib/admin";

import type { Product, Price } from "@/db/schema";
import type { ProductWithPrices } from "@/features/subscriptions/api/use-get-products";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const app = new Hono()
  .post("/billing", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, auth.token.id));

    if (!subscription) {
      return c.json({ error: "No subscription found" }, 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer_id,
      return_url: `${process.env.WEBHOOK_URL}/billing`,
    });

    if (!session.url) {
      return c.json({ error: "Failed to create session" }, 400);
    }

    return c.json({ data: session.url });
  })
  .get("/plan", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.user_id, auth.token.id));

      const active = checkIsActive(subscription);

      return c.json({
        data: {
          ...subscription,
          active,
        },
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return c.json({ error: "Failed to fetch subscription" }, 500);
    }
  })
  .get("/current", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const [userSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.user_id, auth.token.id),
            inArray(subscriptions.status, ["trialing", "active"] as const),
          ),
        )
        .leftJoin(prices, eq(subscriptions.price_id, prices.id))
        .leftJoin(products, eq(prices.product_id, products.id));

      if (!userSubscription) {
        return c.json({ data: null });
      }

      return c.json({
        data: {
          ...userSubscription.subscription,
          price: {
            ...userSubscription.prices,
            product: userSubscription.products,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return c.json({ error: "Failed to fetch subscription" }, 500);
    }
  })
  .post("/checkout", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    const { priceId } = await c.req.json();

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Get price details from DB
      const [priceInfo] = await db
        .select()
        .from(prices)
        .where(eq(prices.id, priceId));

      if (!priceInfo) {
        return c.json({ error: "Price not found" }, 404);
      }

      const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.WEBHOOK_URL}/billing?success=1`,
        cancel_url: `${process.env.WEBHOOK_URL}/billing?canceled=1`,
        payment_method_types: ["card", "paypal"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: auth.token.email || "",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: auth.token.id,
          image_generation_count:
            (
              priceInfo.metadata as {
                image_generation_count?: number;
              }
            )?.image_generation_count ?? 0,
          model_training_count:
            (
              priceInfo.metadata as {
                model_training_count?: number;
              }
            )?.model_training_count ?? 0,
        },
      });

      if (!session.url) {
        return c.json({ error: "Failed to create session" }, 400);
      }

      return c.json({ data: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return c.json({ error: "Failed to create checkout session" }, 500);
    }
  })
  .post("/webhook", async (c) => {
    const body = await c.req.text();
    const signature = c.req.header("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      return c.json({ error: "Invalid signature" }, 400);
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "product.created":
          case "product.updated":
            await upsertProductRecord(event.data.object as Stripe.Product);
            break;
          case "price.created":
          case "price.updated":
            await upsertPriceRecord(event.data.object as Stripe.Price);
            break;
          case "price.deleted":
            await deletePriceRecord(event.data.object as Stripe.Price);
            break;
          case "product.deleted":
            await deleteProductRecord(event.data.object as Stripe.Product);
            break;
          // case "customer.subscription.created":
          // case "customer.subscription.updated":
          // case "customer.subscription.deleted":
          //   const subscription = event.data.object as Stripe.Subscription;
          //   await manageSubscriptionStatusChange(
          //     subscription.id,

          //     subscription.customer as string,
          //     event.type === "customer.subscription.created",
          //   );
          //   break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            if (!checkoutSession?.metadata?.userId) {
              return c.json({ error: "Invalid session" }, 400);
            }
            if (checkoutSession.mode === "subscription") {
              const subscriptionId = checkoutSession.subscription;
              await manageSubscriptionStatusChange(
                subscriptionId as string,
                checkoutSession.customer as string,
                checkoutSession.metadata as Record<string, string>,
                true,
              );

              // update credits
            }
            if (
              checkoutSession.status === "complete" &&
              checkoutSession.payment_status === "paid"
            ) {
              await updateUserCredits(
                checkoutSession.metadata.userId as string,
                checkoutSession.metadata,
              );
            }
            break;
          case "invoice.payment_succeeded":
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string,
            );

            if (!session?.metadata?.userId) {
              return c.json({ error: "Invalid session" }, 400);
            }

            await db
              .update(subscriptions)
              .set({
                status: subscription.status,
                current_period_end: new Date(
                  subscription.current_period_end * 1000,
                ).toISOString(),
              })
              .where(eq(subscriptions.id, subscription.id));
            break;
          default:
            throw new Error("Unhandled relevant event!");
        }
      } catch (error) {
        console.log(error);
        return new Response(
          "Webhook handler failed. View your Next.js function logs.",
          {
            status: 400,
          },
        );
      }
    }

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        return c.json({ error: "Invalid session" }, 400);
      }

      // await db.insert(subscriptions).values({
      //   status: subscription.status,
      //   userId: session.metadata.userId,
      //   subscriptionId: subscription.id,
      //   customerId: subscription.customer as string,
      //   priceId: subscription.items.data[0].price.product as string,
      //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        return c.json({ error: "Invalid session" }, 400);
      }

      // await db
      //   .update(subscriptions)
      //   .set({
      //     status: subscription.status,
      //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(subscriptions.id, subscription.id));
    }

    return c.json(null, 200);
  })
  .get("/credits", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const [userCredits] = await db
        .select()
        .from(credits)
        .where(eq(credits.user_id, auth.token.id));

      if (!userCredits) {
        return c.json(null);
      }

      return c.json(userCredits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      return c.json({ error: "Failed to fetch credits" }, 500);
    }
  })
  .get("/products", async (c) => {
    try {
      const activeProducts = await db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .leftJoin(prices, eq(prices.product_id, products.id));

      const formattedProducts = activeProducts.reduce<
        Record<string, ProductWithPrices>
      >((acc, row) => {
        if (!acc[row.products.id]) {
          acc[row.products.id] = {
            ...row.products,
            prices: [],
          };
        }
        if (row.prices) {
          acc[row.products.id].prices.push(row.prices);
        }
        return acc;
      }, {});

      return c.json({ data: Object.values(formattedProducts) });
    } catch (error) {
      console.error("Error fetching products:", error);
      return c.json({ error: "Failed to fetch products" }, 500);
    }
  });

export default app;
