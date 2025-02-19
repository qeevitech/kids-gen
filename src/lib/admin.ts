import { stripe } from "@/lib/stripe/config";
import { db } from "@/db/drizzle";
import {
  products,
  prices,
  type Price,
  subscriptions,
  credits,
} from "@/db/schema";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import type { Stripe as StripeType } from "stripe";

const TRIAL_PERIOD_DAYS = 0;

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : null,
    active: price.active,
    currency: price.currency,
    type: price.type as "one_time" | "recurring",
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval as
      | "day"
      | "week"
      | "month"
      | "year"
      | null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    metadata: price.metadata,
  };

  try {
    const existingPrice = await db
      .select()
      .from(prices)
      .where(eq(prices.id, price.id));

    if (existingPrice.length > 0) {
      await db.update(prices).set(priceData).where(eq(prices.id, price.id));
      console.log(`Price updated: ${price.id}`);
    } else {
      await db.insert(prices).values(priceData);
      console.log(`Price inserted: ${price.id}`);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("foreign key constraint") &&
      retryCount < maxRetries
    ) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return upsertPriceRecord(price, retryCount + 1, maxRetries);
    }
    console.error("Error upserting price:", error);
    throw new Error(
      `Price insert/update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active ?? null,
    name: product.name ?? null,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata ?? null,
  };

  try {
    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, product.id));

    if (existingProduct.length > 0) {
      // Update existing product
      await db
        .update(products)
        .set(productData)
        .where(eq(products.id, product.id));
      console.log(`Product updated: ${product.id}`);
    } else {
      // Insert new product
      await db.insert(products).values(productData);
      console.log(`Product inserted: ${product.id}`);
    }
  } catch (error) {
    console.error("Error upserting product:", error);
    // throw new Error(
    //   `Product insert/update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    // );
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  try {
    await db.delete(products).where(eq(products.id, product.id));
    console.log(`Product deleted: ${product.id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(
      `Product deletion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

const deletePriceRecord = async (price: Stripe.Price) => {
  try {
    await db.delete(prices).where(eq(prices.id, price.id));
    console.log(`Price deleted: ${price.id}`);
  } catch (error) {
    console.error("Error deleting price:", error);
    throw new Error(
      `Price deletion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  metadata: Record<string, string>,
  createAction = false,
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    const subscriptionData = {
      id: subscription.id,
      customer_id: customerId,
      user_id: metadata.userId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      current_period_start: new Date(
        subscription.current_period_start * 1000,
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      created: new Date(subscription.created * 1000).toISOString(),
      ended_at: subscription.ended_at
        ? new Date(subscription.ended_at * 1000).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      metadata: subscription.metadata,
    };

    await db.insert(subscriptions).values(subscriptionData).onConflictDoUpdate({
      target: subscriptions.id,
      set: subscriptionData,
    });

    console.log(
      `Inserted/updated subscription [${subscription.id}] for customer [${customerId}]`,
    );
  } catch (error) {
    console.error("Error managing subscription status change:", error);
    throw error;
  }
}

export async function updateUserCredits(
  userId: string,
  metadata: Record<string, string>,
) {
  try {
    await db
      .update(credits)
      .set({
        image_generation_count: Number(metadata.image_generation_count) || 0,
        model_training_count: Number(metadata.model_training_count) || 0,
        max_image_generation_count:
          Number(metadata.image_generation_count) || 0,
        max_model_training_count: Number(metadata.model_training_count) || 0,
        updated_at: new Date(),
      })
      .where(eq(credits.user_id, userId));

    console.log(`Credits updated for user [${userId}]`);
  } catch (error) {
    console.error("Error updating user credits:", error);
    throw new Error(
      `Credits update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function checkModelTrainingCredits(userId: string) {
  const [userCredits] = await db
    .select()
    .from(credits)
    .where(eq(credits.user_id, userId));

  if (!userCredits) {
    throw new Error("No credits found");
  }

  const remainingCredits = userCredits.model_training_count ?? 0;

  if (remainingCredits <= 0) {
    throw new Error("Insufficient model training credits");
  }

  return remainingCredits;
}

export async function checkImageGenerationCredits(userId: string) {
  const [userCredits] = await db
    .select()
    .from(credits)
    .where(eq(credits.user_id, userId));

  if (!userCredits) {
    throw new Error("No credits found");
  }

  const remainingCredits = userCredits.image_generation_count ?? 0;

  if (remainingCredits <= 0) {
    throw new Error("Insufficient image generation credits");
  }

  return remainingCredits;
}

export async function decrementModelTrainingCredits(userId: string) {
  const [userCredits] = await db
    .select()
    .from(credits)
    .where(eq(credits.user_id, userId));

  if (!userCredits) {
    throw new Error("No credits found");
  }

  await db
    .update(credits)
    .set({
      model_training_count: (userCredits.model_training_count ?? 0) - 1,
      updated_at: new Date(),
    })
    .where(eq(credits.user_id, userId));
}

export async function decrementImageGenerationCredits(userId: string) {
  const [userCredits] = await db
    .select()
    .from(credits)
    .where(eq(credits.user_id, userId));

  if (!userCredits) {
    throw new Error("No credits found");
  }

  await db
    .update(credits)
    .set({
      image_generation_count: (userCredits.image_generation_count ?? 0) - 1,
      updated_at: new Date(),
    })
    .where(eq(credits.user_id, userId));
}

export {
  upsertPriceRecord,
  upsertProductRecord,
  deleteProductRecord,
  deletePriceRecord,
};
