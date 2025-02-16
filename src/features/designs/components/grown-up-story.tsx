"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetTrainedModels } from "../api/use-get-models";
import { useGetTemplates } from "../api/use-get-templates";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supportedLanguages } from "../languages";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import StorySubjectInput from "./StorySubjectInput";
import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { useGenerateStory } from "../api/use-generate-story";
import { TemplateSelector } from "./template-selector";
import { Template } from "@/types";

const formSchema = z.object({
  storySubject: z.string().min(1, "storySubject is required"),
  genre: z.enum([
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Thriller",
    "Historical Fiction",
    "Literary Fiction",
    "Horror",
  ]),
  tone: z.enum([
    "Serious",
    "Humorous",
    "Dark",
    "Inspirational",
    "Satirical",
    "Romantic",
    "Suspenseful",
  ]),

  plotElements: z.array(z.string()).optional(),
  characterDescription: z.string().optional(),
  themes: z.array(z.string()).optional(),
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
  modelId: z.string().optional(),
  templateId: z.string(),
  additionalNotes: z.string().optional(),
  pageCount: z
    .number()
    .min(3, "Story must be at least 3 pages")
    .max(20, "Story cannot exceed 20 pages"),
  imageStyle: z.enum([
    "Black and White",
    "Line Art",
    "Pencil Sketch",
    "Charcoal",
    "Ink Drawing",
    "Oil Painting",
    "Watercolor",
    "Acrylic",
    "Gouache",
    "Digital Art",
    "Vector Art",
    "Minimalist",
    "Art Deco",
    "Art Nouveau",
    "Impressionist",
    "Expressionist",
    "Film Noir",
    "Gothic",
    "Dark Fantasy",
    "Vintage Etching",
    "Woodcut",
  ]),
  modelName: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function GrownUpStoryForm({ designId }: { designId: string }) {
  const { mutate: generateStory, isPending: isLoading } = useGenerateStory();
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storySubject: "",
      genre: undefined,
      tone: undefined,
      plotElements: [],
      characterDescription: "",
      themes: [],
      language: "en",
      modelId: "",
      templateId: "",
      additionalNotes: "",
      pageCount: 3,
      imageStyle: undefined,
      modelName: undefined,
    },
  });

  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetTemplates({ page: "1", limit: "10", category: "grown-ups" });
  const { data: modelsData } = useGetTrainedModels();

  const trainedModels = modelsData?.pages.flatMap((page) => page.models) ?? [];
  const hasTrainedModels = trainedModels.length > 0;
  const templates = (templatesData as Template[]) ?? [];

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    let modelName = "";
    if (data.modelId) {
      const model = trainedModels.find((model) => model.id === data.modelId);
      modelName = `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/${model?.modelId}:${model?.version}`;
    }
    generateStory({
      ...data,
      designId,
      modelName,
      gender:
        trainedModels.find((model) => model.id === data.modelId)?.gender ||
        "man",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 overflow-y-auto p-2 pb-20"
      >
        {/* storySubject */}
        <FormField
          control={form.control}
          name="storySubject"
          render={({ field }) => (
            <StorySubjectInput
              userSelection={({ fieldValue }) => field.onChange(fieldValue)}
            />
          )}
        />
        {/* Model Selection */}
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

        {/* Template Selection */}
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <TemplateSelector
              templates={templates}
              value={field.value}
              onChange={field.onChange}
              isLoading={templatesLoading}
              error={templatesError}
            />
          )}
        />

        {/* Genre */}
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formSchema.shape.genre.options.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Tone */}
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formSchema.shape.tone.options.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Character Description */}
        <FormField
          control={form.control}
          name="characterDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Character Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Example: A resilient 30-year-old journalist with a sharp wit and troubled past, struggling with trust issues while pursuing a story that could change everything"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Plot Elements */}
        <FormField
          control={form.control}
          name="plotElements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Plot Elements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Examples (one per line):
- A mysterious letter arrives from a long-lost relative
- The protagonist discovers a hidden ability
- A betrayal threatens everything they've built
- An unexpected alliance forms in the face of danger"
                  className="min-h-[100px] resize-none"
                  onChange={(e) => {
                    const elements = e.target.value
                      .split("\n")
                      .filter((element) => element.trim() !== "");
                    field.onChange(elements);
                  }}
                  value={field.value?.join("\n") || ""}
                />
              </FormControl>
              <FormDescription>
                Enter each plot element on a new line
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Themes */}
        <FormField
          control={form.control}
          name="themes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Themes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Examples (one per line):
- Redemption and second chances
- The power of truth in a world of deception
- Family bonds tested by adversity
- Personal growth through challenges"
                  className="min-h-[100px] resize-none"
                  onChange={(e) => {
                    const themes = e.target.value
                      .split("\n")
                      .filter((theme) => theme.trim() !== "");
                    field.onChange(themes);
                  }}
                  value={field.value?.join("\n") || ""}
                />
              </FormControl>
              <FormDescription>Enter each theme on a new line</FormDescription>
            </FormItem>
          )}
        />

        {/* Language */}
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
            </FormItem>
          )}
        />

        {/* Additional Notes */}
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional details or special requests..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Page Count */}
        <FormField
          control={form.control}
          name="pageCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Pages</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select page count" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => i + 3).map(
                        (num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} pages
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="mt-0">
                  {field.value} page{field.value !== 1 ? "s" : ""}
                </FormDescription>
              </div>
              <FormDescription>
                Choose how many pages your story should be
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Style */}
        <FormField
          control={form.control}
          name="imageStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Illustration Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select illustration style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classic Styles</SelectLabel>
                    <SelectItem value="Black and White">
                      Black and White
                    </SelectItem>
                    <SelectItem value="Line Art">Line Art</SelectItem>
                    <SelectItem value="Pencil Sketch">Pencil Sketch</SelectItem>
                    <SelectItem value="Charcoal">Charcoal</SelectItem>
                    <SelectItem value="Ink Drawing">Ink Drawing</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Painting Styles</SelectLabel>
                    <SelectItem value="Oil Painting">Oil Painting</SelectItem>
                    <SelectItem value="Watercolor">Watercolor</SelectItem>
                    <SelectItem value="Acrylic">Acrylic</SelectItem>
                    <SelectItem value="Gouache">Gouache</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Modern Styles</SelectLabel>
                    <SelectItem value="Digital Art">Digital Art</SelectItem>
                    <SelectItem value="Vector Art">Vector Art</SelectItem>
                    <SelectItem value="Minimalist">Minimalist</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Artistic Styles</SelectLabel>
                    <SelectItem value="Art Deco">Art Deco</SelectItem>
                    <SelectItem value="Art Nouveau">Art Nouveau</SelectItem>
                    <SelectItem value="Impressionist">Impressionist</SelectItem>
                    <SelectItem value="Expressionist">Expressionist</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Atmospheric Styles</SelectLabel>
                    <SelectItem value="Film Noir">Film Noir</SelectItem>
                    <SelectItem value="Gothic">Gothic</SelectItem>
                    <SelectItem value="Dark Fantasy">Dark Fantasy</SelectItem>
                    <SelectItem value="Vintage Etching">
                      Vintage Etching
                    </SelectItem>
                    <SelectItem value="Woodcut">Woodcut</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the visual style for your story illustrations
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Story"}
        </Button>
      </form>
    </Form>
  );
}
