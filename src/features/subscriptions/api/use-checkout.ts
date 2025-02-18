import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.checkout)["$post"],
  200
>;

export const useCheckout = () => {
  return useMutation({
    mutationFn: async (priceId: string) => {
      const response = await client.api.subscriptions.checkout.$post({
        json: { priceId },
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { data: checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    },
    onError: (error) => {
      toast.error("Failed to create checkout session");
      console.error(error);
    },
  });
};
