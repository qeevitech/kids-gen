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
      elements: {
        objects: [
          {
            rx: 0,
            ry: 0,
            top: -286.5,
            fill: "white",
            left: 175.5,
            name: "clip",
            type: "rect",
            angle: 0,
            flipX: false,
            flipY: false,
            skewX: 0,
            skewY: 0,
            width: 1080,
            height: 1080,
            scaleX: 1,
            scaleY: 1,
            shadow: {
              blur: 5,
              color: "rgba(0,0,0,0.8)",
              offsetX: 0,
              offsetY: 0,
              nonScaling: false,
              affectStroke: false,
            },
            stroke: null,
            opacity: 1,
            originX: "left",
            originY: "top",
            version: "5.3.0",
            visible: true,
            fillRule: "nonzero",
            paintFirst: "fill",
            selectable: false,
            hasControls: false,
            strokeWidth: 1,
            strokeLineCap: "butt",
            strokeUniform: false,
            strokeLineJoin: "miter",
            backgroundColor: "",
            strokeDashArray: null,
            strokeDashOffset: 0,
            strokeMiterLimit: 4,
            globalCompositeOperation: "source-over",
          },
        ],
        version: "5.3.0",
      },
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
