"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Upload, Wand2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useCreateDesign } from "@/features/designs/api/use-create-design";

export const Banner = () => {
  const router = useRouter();
  const mutation = useCreateDesign();

  const onClick = () => {
    mutation.mutate(
      {},
      {
        onSuccess: (data) => {
          router.push(`/editor/${data.id}`);
        },
      },
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2 text-sm text-purple-600">
            <Sparkles className="h-4 w-4" />
            <p className="font-medium">AI-Powered Story Generation</p>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Create Magical Stories with AI
          </h1>

          <p className="max-w-2xl text-muted-foreground">
            Transform photos into personalized stories for kids and adults.
            Train custom AI models with your photos and generate unique
            narratives featuring your loved ones.
          </p>

          <div className="mt-2 flex flex-wrap gap-4">
            <Button
              className="group"
              size="lg"
              disabled={mutation.isPending}
              onClick={onClick}
            >
              <BookOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Create Story
            </Button>
            <Link href="/train">
              <Button variant="outline" size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Train Model
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-x-2">
              <div className="rounded-full bg-purple-100 p-2">
                <Wand2 className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized AI Models
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full bg-purple-100 p-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Kids & Adult Stories
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full bg-purple-100 p-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Multiple Art Styles
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
