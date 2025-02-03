import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.designs)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.designs)["$post"]
>["json"];

interface DesignResponse {
  id: string;
  [key: string]: any;
}

const DEFAULT_DESIGN = {
  id: crypto.randomUUID(),
  name: "Instagram Carousel",
  thumbnail: "/templates/instagram-carousel.png",
  category: "social",
  width: 1080,
  height: 1080,
  isPublic: true,
  pages: [
    {
      id: uuidv4(),
      elements: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#f0f0f0",
          selectable: false,
        },
        {
          type: "textbox",
          left: 100,
          top: 100,
          width: 880,
          fontSize: 40,
          fontFamily: "Inter",
          fill: "#000000",
          text: "First Slide",
        },
      ],
    },
    {
      id: uuidv4(),
      elements: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#ffffff",
          selectable: false,
        },
        {
          type: "textbox",
          left: 100,
          top: 100,
          width: 880,
          fontSize: 40,
          fontFamily: "Inter",
          fill: "#000000",
          text: "Second Slide",
        },
      ],
    },
  ],
};

export const useCreateDesign = () => {
  const queryClient = useQueryClient();

  return useMutation<DesignResponse, Error, Partial<RequestType>>({
    mutationFn: async (data = {}) => {
      const response = await client.api.designs.$post({
        json: {
          ...DEFAULT_DESIGN,
          ...data,
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Design created");
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
    onError: () => {
      toast.error("Failed to create design");
    },
  });
};
