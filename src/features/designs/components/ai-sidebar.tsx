import { useState } from "react";

import { ActiveTool, Editor } from "@/features/designs/types";
import { ToolSidebarClose } from "@/features/designs/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/designs/components/tool-sidebar-header";

import { useGenerateImage } from "@/features/ai/api/use-generate-image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorsStore } from "../stores/use-editors-store";

interface AiSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const editor = useEditorsStore((state) => state.getCurrentEditor());
  // const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useGenerateImage();

  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    mutation.mutate(
      { prompt: value },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data);
        },
      },
    );
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "ai" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="AI" description="Generate an image using AI" />
      <ScrollArea>
        <form onSubmit={onSubmit} className="space-y-6 p-4">
          <Textarea
            disabled={mutation.isPending}
            placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
          >
            Generate
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
