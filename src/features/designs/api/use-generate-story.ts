import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";

interface GenerateStoryInput {
  designId: string;
  storySubject: string;
  modelId?: string;
  templateId?: string;
  modelName?: string;
  gender: "man" | "women" | "boy" | "girl";
  // Kids specific fields
  storyType?: string;
  imageStyle?: string;
  ageGroup?: string;
  mood?: string;
  length?: string;
  protagonist?: string;
  // Grown-ups specific fields
  genre?: string;
  tone?: string;
  plotElements?: string[];
  characterDescription?: string;
  themes?: string[];
  pageCount?: number;
  // Common fields
  language: string;
  setting?: string;
  moralLesson?: string;
}

export const useGenerateStory = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: GenerateStoryInput) => {
      const response = await client.api.generate.$post({
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Story generated successfully!");
        // router.push(`/story/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Failed to generate story");
    },
  });
};
