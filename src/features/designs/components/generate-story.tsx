import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveTool } from "@/features/designs/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { KidsStoryForm } from "./kids-story";
import { GrownUpStoryForm } from "./grown-up-story";

interface GenerateStoryProps {
  designId: string;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const GenerateStory = ({
  designId,
  activeTool,
  onChangeActiveTool,
}: GenerateStoryProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };
  const [activeTab, setActiveTab] = useState<"kids" | "grown-ups">("kids");

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "generate-story" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Generate Story"
        description="Generate Story with your own prompt"
      />{" "}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kids">Kids Story</TabsTrigger>
              <TabsTrigger value="grown-ups">Grown-ups Story</TabsTrigger>
            </TabsList>

            <TabsContent value="kids">
              <KidsStoryForm designId={designId} />
            </TabsContent>

            <TabsContent value="grown-ups">
              <GrownUpStoryForm designId={designId} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
