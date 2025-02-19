import { subscriptions } from "@/db/schema";

const DAY_IN_MS = 86_400_000;

export const checkIsActive = (
  subscription: typeof subscriptions.$inferSelect,
) => {
  let active = false;

  if (
    subscription &&
    subscription.price_id &&
    subscription.current_period_end
  ) {
    active =
      new Date(subscription.current_period_end).getTime() + DAY_IN_MS >
      Date.now();
  }

  return active;
};
