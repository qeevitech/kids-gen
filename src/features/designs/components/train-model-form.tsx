"use client";
import React, { useId } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "../actions/actions";
import { useTrainModel } from "../api/use-train-model";
import { ScrollArea } from "@/components/ui/scroll-area";

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"];
const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45 MB

const formSchema = z.object({
  modelName: z.string({
    required_error: "Model name is required!",
  }),
  gender: z.enum(["man", "women", "boy", "girl"]),
  zipFile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please select a valid file")
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_ZIP_FILES.includes(files?.[0]?.type),
      "Only zip files are accepted!",
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size allowed is 45 mb.",
    ),
});

const TrainModelForm = () => {
  const toastId = useId();
  const mutation = useTrainModel();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      gender: "man",
    },
  });

  const fileRef = form.register("zipFile");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Uploading file...", { id: toastId });

    try {
      // Get presigned URL for upload
      const data = await getPresignedStorageUrl(values.zipFile[0].name);
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.signedUrl || !data.key) {
        throw new Error("Failed to generate upload URL");
      }

      // Upload file to R2
      const uploadResponse = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": values.zipFile[0].type,
        },
        body: values.zipFile[0],
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      toast.success("File uploaded successfully!", { id: toastId });

      // Start training
      mutation.mutate(
        {
          fileKey: data.key,
          modelName: values.modelName,
          gender: values.gender,
        },
        {
          onSuccess: () => {
            toast.success(
              "Training started! You'll receive a notification when it's complete.",
              { id: toastId },
            );
            form.reset();
          },
          onError: (error) => {
            toast.error(error.message, { id: toastId });
          },
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage, { id: toastId });
    }
  }

  return (
    <Form {...form}>
      <ScrollArea>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-12 space-y-24"
        >
          <fieldset className="grid max-w-5xl gap-6 rounded-lg border bg-background p-4 sm:p-8">
            <FormField
              control={form.control}
              name="modelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of your trained model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Please select the gender of the images</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="man" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="women" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="boy" />
                        </FormControl>
                        <FormLabel className="font-normal">Boy</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="girl" />
                        </FormControl>
                        <FormLabel className="font-normal">Girl</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipFile"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Training Data (Zip File) |{" "}
                    <span className="text-destructive">
                      Read the requirements below
                    </span>
                  </FormLabel>

                  <div className="mb-4 rounded-lg pb-4 text-card-foreground shadow-sm">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Upload 10-15 high-quality photos of yourself</li>
                      <li>• For best results with 12 photos, include:</li>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>
                          - 6 clear face photos (front view, good lighting)
                        </li>
                        <li>- 3 upper body shots (from head to waist)</li>
                        <li>- 3 full body photos (head to toe)</li>
                      </ul>
                      <li>• Photo requirements:</li>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>- Recent photos</li>
                        <li>
                          - Clear, well-lit photos with natural expressions
                        </li>
                        <li>
                          - Square format (1:1 ratio), minimum 1048x1048 pixels
                        </li>
                        <li>- Variety of outfits and simple backgrounds</li>
                        <li>- Solo photos only (no other people in frame)</li>
                        <li>- Avoid hats, sunglasses, or face coverings</li>
                      </ul>
                      <li className="text-destructive">
                        • Important: Package all photos in a single ZIP file
                        (max 45MB)
                      </li>
                    </ul>
                  </div>

                  <FormControl>
                    <Input type="file" accept=".zip" {...fileRef} />
                  </FormControl>
                  <FormDescription>
                    Upload a zip file containing your training images (max
                    45MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-fit">
              Submit
            </Button>
          </fieldset>
        </form>
      </ScrollArea>
    </Form>
  );
};

export default TrainModelForm;
