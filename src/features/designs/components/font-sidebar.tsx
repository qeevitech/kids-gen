import { useEffect } from "react";
import { ActiveTool, Editor, fonts } from "@/features/designs/types";
import { ToolSidebarClose } from "@/features/designs/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/designs/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEditorsStore } from "../stores/use-editors-store";

interface FontSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontSidebar = ({
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const editor = useEditorsStore((state) => state.getCurrentEditor());
  const value = editor?.getActiveFontFamily();

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      fonts.map((font) => font.replace(/ /g, "+")).join("&family=");
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "font" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="Font" description="Change the text font" />
      <ScrollArea>
        <div className="space-y-1 border-b p-4">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="lg"
              className={cn(
                "h-16 w-full justify-start text-left",
                value === font && "border-2 border-blue-500",
              )}
              style={{
                fontFamily: font,
                fontSize: "24px",
                padding: "8px 16px",
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
