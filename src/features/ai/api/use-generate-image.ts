import { useMutation } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/hono";

interface ImageResponse {
  url: string;
}

type RequestType = InferRequestType<
  (typeof client.api.ai)["generate-image"]["$post"]
>["json"];

export const useGenerateImage = () => {
  const mutation = useMutation<ImageResponse, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai["generate-image"].$post({ json });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
  });

  return mutation;
};
