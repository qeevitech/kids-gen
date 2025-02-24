import { useMutation } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/hono";

interface ImageResponse {
  url: string;
}

type RequestType = InferRequestType<
  (typeof client.api.ai)["remove-bg"]["$post"]
>["json"];

export const useRemoveBg = () => {
  const mutation = useMutation<ImageResponse, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai["remove-bg"].$post({ json });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
  });

  return mutation;
};
