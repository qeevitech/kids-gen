import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";
import { useGetCurrentPlan } from "@/features/subscriptions/api/use-get-plan";

export const usePaywall = () => {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetCurrentPlan();

  const subscriptionModal = useSubscriptionModal();

  const shouldBlock = isLoadingSubscription || !subscription?.active;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    },
  };
};
