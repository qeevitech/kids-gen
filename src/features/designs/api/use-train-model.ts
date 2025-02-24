import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type RequestType = {
  modelName: string;
  gender: string;
  fileKey: string;
};

type ResponseType = {
  success: boolean;
  modelId: string;
  error?: string;
};

export const useTrainModel = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.train.$post({
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to start training");
      }

      const result = await response.json();

      return result;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start training");
    },
  });
};
