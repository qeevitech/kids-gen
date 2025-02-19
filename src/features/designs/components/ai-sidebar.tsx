import { useState, useEffect } from "react";
import { ActiveTool } from "@/features/designs/types";
import { ToolSidebarClose } from "@/features/designs/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/designs/components/tool-sidebar-header";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useGetCredits } from "@/features/subscriptions/api/use-get-credits";
import { useCreditsStore } from "@/features/designs/stores/use-credits-store";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { toast } from "sonner";
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
  const imageGenerationCount = useCreditsStore(
    (state) => state.imageGenerationCount,
  );
  const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useGenerateImage();
  const { data: credits } = useGetCredits();
  const { setImageGenerationCount, decrementImageGenerationCount } =
    useCreditsStore();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (credits?.image_generation_count) {
      setImageGenerationCount(credits.image_generation_count);
    }
  }, [credits, setImageGenerationCount]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (shouldBlock) {
      triggerPaywall();
      return;
    }
    if (imageGenerationCount === 0) {
      toast.error("No credits remaining");
      return;
    }

    mutation.mutate(
      { prompt: value },
      {
        onSuccess: ({ url }) => {
          editor?.addImage(url);
          decrementImageGenerationCount();
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
          <div className="space-y-2">
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-full"
            >
              Generate
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {imageGenerationCount ?? 0} generations remaining
            </p>
          </div>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
