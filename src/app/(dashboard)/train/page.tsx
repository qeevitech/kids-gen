"use client";

import TrainModelForm from "@/features/designs/components/train-model-form";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TrainModelPage() {
  return (
    <div className="container max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-x-2 text-sm text-purple-600">
            <Sparkles className="h-4 w-4" />
            <p className="font-medium">AI Model Training</p>
          </div>

          <h1 className="text-3xl font-bold">Train Your Custom AI Model</h1>
          <p className="max-w-2xl text-muted-foreground">
            Upload photos to train a personalized AI model that can generate
            unique stories featuring you or your loved ones. Follow the
            guidelines below for best results.
          </p>
        </div>

        <TrainModelForm />
      </motion.div>
    </div>
  );
}
