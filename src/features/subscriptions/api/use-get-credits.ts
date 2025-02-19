import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type UserCredits = {
  id: string;
  user_id: string;
  image_generation_count: number;
  max_image_generation_count: number;
  model_training_count: number;
  max_model_training_count: number;
  created_at: string;
  updated_at: string;
};

export const useGetCredits = () => {
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const response = await client.api.subscriptions.credits.$get();
      if (!response.ok) throw new Error("Failed to fetch credits");
      return response.json() as Promise<UserCredits>;
    },
  });
};
