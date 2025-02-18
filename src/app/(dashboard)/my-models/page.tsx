"use client";

import { TrainedModels } from "@/features/designs/components/trained-models";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainModelForm from "@/features/designs/components/train-model-form";

export default function MyModelsPage() {
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
            <p className="font-medium">AI Models</p>
          </div>

          <h1 className="text-3xl font-bold">Your AI Models</h1>
          <p className="max-w-2xl text-muted-foreground">
            View and manage your trained AI models. You can train new models or
            delete existing ones.
          </p>
        </div>

        <TrainedModels />
      </motion.div>
    </div>
  );
}
