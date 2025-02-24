"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveTool } from "@/features/designs/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { TrainedModels } from "./trained-models";
import TrainModelForm from "./train-model-form";

interface TrainModelProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TrainModel = ({
  activeTool,
  onChangeActiveTool,
}: TrainModelProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "train" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Train Model"
        description="Train and manage your AI models"
      />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="train" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="train">Train New</TabsTrigger>
              <TabsTrigger value="models">My Models</TabsTrigger>
            </TabsList>
            <TabsContent value="train">
              <TrainModelForm />
            </TabsContent>
            <TabsContent value="models">
              <TrainedModels />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
