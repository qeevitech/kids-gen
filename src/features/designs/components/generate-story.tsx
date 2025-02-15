import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTrainedModels } from "../api/use-get-models";
import { ActiveTool } from "@/features/designs/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { KidsStoryForm } from "./kids-story";
import { GrownUpStoryForm } from "./grown-up-story";

const kidsStorySchema = z.object({
  model: z.string(),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  ageGroup: z.enum(["3-5", "6-8", "9-12"]),
  genre: z.enum(["adventure", "fantasy", "educational", "bedtime"]),
});

const grownUpsStorySchema = z.object({
  model: z.string(),
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  genre: z.enum(["fiction", "non-fiction", "mystery", "romance", "thriller"]),
  tone: z.enum(["casual", "formal", "humorous", "serious"]),
});

type KidsStoryForm = z.infer<typeof kidsStorySchema>;
type GrownUpsStoryForm = z.infer<typeof grownUpsStorySchema>;

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
  const { data } = useGetTrainedModels();

  const trainedModels = data?.pages.flatMap((page) => page.models) ?? [];
  const hasTrainedModels = trainedModels.length > 0;

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
