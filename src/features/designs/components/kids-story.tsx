"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import StorySubjectInput from "./StorySubjectInput";
import StoryType from "./kids-form/StoryType";
import ImageStyle from "./kids-form/ImageStyle";
import AgeGroup from "./kids-form/AgeGroup";
import StoryMood from "./kids-form/StoryMood";
import StoryLength from "./kids-form/StoryLength";
import StoryProtagonist from "./kids-form/StoryProtagonist";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguages } from "../languages";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useGetTrainedModels } from "../api/use-get-models";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGetTemplates } from "../api/use-get-templates";
import { useGenerateStory } from "../api/use-generate-story";

const formSchema = z.object({
  storySubject: z.string().min(1, "Story subject is required"),
  storyType: z.enum([
    "Adventure Story",
    "Bedtime Story",
    "Educational",
    "Fantasy",
    "Animal Tales",
    "Mystery",
  ]),
  imageStyle: z.enum(["3D Cartoon", "Paper Cut", "Water Color", "Pixel Style"]),
  ageGroup: z.enum(["0-2 Years", "3-5 Years", "5-8 Years"]),
  mood: z.enum([
    "Happy & Fun",
    "Calm & Peaceful",
    "Magical & Wonder",
    "Musical & Rhythmic",
  ]),
  length: z.enum(["Short", "Medium", "Long"]),
  protagonist: z.enum([
    "Child Hero",
    "Friendly Animal",
    "Magical Being",
    "Family Team",
  ]),
  language: z.enum([
    "en",
    "hi",
    "kn",
    "ta",
    "te",
    "ml",
    "mr",
    "gu",
    "bn",
    "pa",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "ru",
    "ja",
    "ko",
    "zh",
  ]),
  setting: z.string().optional(),
  moralLesson: z.string().optional(),
  modelId: z.string().optional(),
  templateId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function KidsStoryForm({ designId }: { designId: string }) {
  const { mutate: generateStory, isPending: isLoading } = useGenerateStory();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storySubject: "",
      storyType: undefined,
      imageStyle: undefined,
      ageGroup: undefined,
      mood: undefined,
      length: undefined,
      protagonist: undefined,
      language: "en",
      setting: "",
      moralLesson: "",
      modelId: "",
      templateId: "",
    },
  });

  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetTemplates({ page: "1", limit: "4", category: "kids" });
  const { data: modelsData } = useGetTrainedModels();

  const trainedModels = modelsData?.pages.flatMap((page) => page.models) ?? [];
  const hasTrainedModels = trainedModels.length > 0;
  const templates = templatesData ?? [];

  const onSubmit = async (data: FormData) => {
    generateStory({
      ...data,
      designId,
      pageCount: data.length === "Short" ? 3 : data.length === "Medium" ? 5 : 7,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 overflow-y-auto p-2 pb-20"
      >
        <FormField
          control={form.control}
          name="storySubject"
          render={({ field }) => (
            <StorySubjectInput
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />
        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Character Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a character model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hasTrainedModels ? (
                    trainedModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.modelName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="flux-dev">
                      Default Story Model
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a character model for your story illustrations
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Template</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary",
                      field.value === template.id && "border-2 border-primary",
                    )}
                    onClick={() => field.onChange(template.id)}
                  >
                    <CardContent className="p-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                          src={template.thumbnail}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        {template.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <FormDescription>
                Choose a template to guide your story generation
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storyType"
          render={({ field }) => (
            <StoryType
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="imageStyle"
          render={({ field }) => (
            <ImageStyle
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <AgeGroup
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <StoryMood
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <StoryLength
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="protagonist"
          render={({ field }) => (
            <StoryProtagonist
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the language for your story
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Story"}
        </Button>
      </form>
    </Form>
  );
}
