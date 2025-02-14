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

  plotElements: z
    .array(z.string())
    .min(1, "At least one plot element is required"),
  characterDescription: z.string().min(1, "Character description is required"),
  themes: z.array(z.string()).min(1, "At least one theme is required"),
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
  modelId: z.string().min(1, "Model selection is required"),
  templateId: z.string().min(1, "Template selection is required"),
  additionalNotes: z.string().optional(),
  pageCount: z
    .number()
    .min(3, "Story must be at least 3 pages")
    .max(20, "Story cannot exceed 20 pages"),
});

type FormData = z.infer<typeof formSchema>;

export function GrownUpStoryForm() {
  const [isLoading, setIsLoading] = useState(false);
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
    },
  });

  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetTemplates({ page: "1", limit: "4", category: "grown-ups" });
  const { data: modelsData } = useGetTrainedModels();

  const trainedModels = modelsData?.pages.flatMap((page) => page.models) ?? [];
  const hasTrainedModels = trainedModels.length > 0;
  const templates = templatesData ?? [];

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      console.log("Form data:", data);
      // TODO: Implement story generation
      toast.success("Story generation started");
    } catch (error) {
      toast.error("Failed to generate story");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
              <FormLabel>Main Character Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your main character's personality, background, and motivations..."
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
              <FormLabel>Key Plot Elements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List major plot points, conflicts, or events (one per line)..."
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
              <FormLabel>Story Themes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List main themes (one per line)..."
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Story"}
        </Button>
      </form>
    </Form>
  );
}
