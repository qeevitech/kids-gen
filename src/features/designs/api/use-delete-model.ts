import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

export const useDeleteModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelId: string) => {
      const response = await client.api.train[":modelId"].$delete({
        param: {
          modelId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete model");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Model deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["trained-models"] });
    },
    onError: () => {
      toast.error("Failed to delete model");
    },
  });
};
