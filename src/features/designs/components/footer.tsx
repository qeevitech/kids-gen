import { Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { useEditorsStore } from "../stores/use-editors-store";
import { Editor } from "@/features/designs/types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface FooterProps {
  editor: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
  const editors = useEditorsStore((state) => state.editors);

  const handleAutoZoom = () => {
    // Auto zoom all editors
    Object.values(editors).forEach((editor) => {
      editor?.autoZoom();
    });
  };

  const handleZoomIn = () => {
    // Zoom in all editors
    Object.values(editors).forEach((editor) => {
      editor?.zoomIn();
    });
  };

  const handleZoomOut = () => {
    // Zoom out all editors
    Object.values(editors).forEach((editor) => {
      editor?.zoomOut();
    });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[49] flex h-[52px] w-full shrink-0 flex-row-reverse items-center gap-x-1 overflow-x-auto border-t bg-white p-2 px-4">
      <Hint label="Reset" side="top" sideOffset={10}>
        <Button
          onClick={handleAutoZoom}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <Minimize className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button
          onClick={handleZoomIn}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomIn className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button
          onClick={handleZoomOut}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomOut className="size-4" />
        </Button>
      </Hint>
    </footer>
  );
};
