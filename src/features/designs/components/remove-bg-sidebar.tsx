import Image from "next/image";
import { AlertTriangle } from "lucide-react";

// import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { ActiveTool, Editor } from "@/features/designs/types";
import { ToolSidebarClose } from "@/features/designs/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/designs/components/tool-sidebar-header";

import { useRemoveBg } from "@/features/ai/api/use-remove-bg";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorsStore } from "../stores/use-editors-store";

interface RemoveBgSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const editor = useEditorsStore((state) => state.getCurrentEditor());
  // const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useRemoveBg();

  const selectedObject = editor?.selectedObjects[0];

  // @ts-ignore
  const imageSrc = selectedObject?._originalElement?.currentSrc;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = () => {
    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    mutation.mutate(
      {
        image: imageSrc,
      },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data);
        },
      },
    );
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "remove-bg" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Background removal"
        description="Remove background from image using AI"
      />
      {!imageSrc && (
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Feature not available for this object
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="space-y-4 p-4">
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-muted transition",
                mutation.isPending && "opacity-50",
              )}
            >
              <Image src={imageSrc} fill alt="Image" className="object-cover" />
            </div>
            <Button
              disabled={mutation.isPending}
              onClick={onClick}
              className="w-full"
            >
              Remove background
            </Button>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
