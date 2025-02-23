import { useState } from "react";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond, FaRectangleAd } from "react-icons/fa6";
import { FaCircle, FaSquare } from "react-icons/fa";
import { ChevronLeft } from "lucide-react";

import { ActiveTool } from "@/features/designs/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorsStore } from "../stores/use-editors-store";
import { ToolSidebarClose } from "./tool-sidebar-close";

const NEXT_R2_URL = process.env.NEXT_PUBLIC_R2_URL;

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

type Category =
  | "all"
  | "basic"
  | "masks"
  | "speech-bubbles"
  | "complex"
  | "text-boxes";

export const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const editor = useEditorsStore((state) => state.getCurrentEditor());
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showAll, setShowAll] = useState(false);

  const basicShapes = [
    {
      icon: FaSquare,
      onClick: () => editor?.addRectangle(),
      label: "Square",
    },
    { icon: FaCircle, onClick: () => editor?.addCircle(), label: "Circle" },
    {
      icon: IoTriangle,
      onClick: () => editor?.addTriangle(),
      label: "Triangle",
    },
    { icon: FaDiamond, onClick: () => editor?.addDiamond(), label: "Diamond" },
    {
      icon: FaRectangleAd,
      onClick: () => editor?.addSoftRectangle(),
      label: "Rectangle",
    },
  ];

  const masks = [
    { src: "/shapes/masks/landscape.png", label: "Landscape" },
    { src: "/shapes/masks/mountain.png", label: "Mountain" },
    { src: "/shapes/masks/wave.png", label: "Wave" },
  ];

  const speechBubbles = [
    { src: "/shapes/speech-bubbles/thought-cloud.png", label: "Thought Cloud" },
    { src: "/shapes/speech-bubbles/round-chat.png", label: "Round Chat" },
    { src: "/shapes/speech-bubbles/spiky-burst.png", label: "Spiky Burst" },
    { src: "/shapes/speech-bubbles/oval-dialog.png", label: "Oval Dialog" },
    {
      src: "/shapes/speech-bubbles/rectangle-chat-right.png",
      label: "Rectangle Chat Right",
    },
    {
      src: "/shapes/speech-bubbles/rectangle-chat-left.png",
      label: "Rectangle Chat Left",
    },
    { src: "/shapes/speech-bubbles/classic-comic.png", label: "Classic Comic" },

    { src: "/shapes/speech-bubbles/jagged-burst.png", label: "Jagged Burst" },
    { src: "/shapes/speech-bubbles/cloud-dialog.png", label: "Cloud Dialog" },
  ];

  const moreTextBoxes = [
    {
      src: "/shapes/text-boxes/scalloped-frame.png",
      label: "Scalloped Frame",
      // Prompt: "Decorative scalloped frame text box with black border, vintage style, UI element on white background"
    },
    {
      src: "/shapes/text-boxes/dotted-rect.png",
      label: "Dotted Rectangle",
      // Prompt: "Rectangle text box with dotted black border, minimal UI element on white background"
    },
    {
      src: "/shapes/text-boxes/notebook-paper.png",
      label: "Notebook Paper",
      // Prompt: "Notebook paper style text box with blue lines and red margin, nostalgic school paper look, UI element"
    },
    {
      src: "/shapes/text-boxes/wavy-banner.png",
      label: "Wavy Banner",
      // Prompt: "Wavy banner text box with gentle curves, playful design, UI element on white background"
    },
    {
      src: "/shapes/text-boxes/torn-paper.png",
      label: "Torn Paper",
      // Prompt: "Torn paper effect text box with rough edges, white background with subtle shadow, UI element"
    },
    {
      src: "/shapes/text-boxes/gradient-card.png",
      label: "Gradient Card",
      // Prompt: "Soft gradient background text card from purple to blue, rounded corners, modern UI element"
    },
  ];

  const textBoxes = [
    {
      src: "/shapes/text-boxes/yellow-sticky.png",
      label: "Yellow Sticky",
    },
    {
      src: "/shapes/text-boxes/yellow-sticky-long.png",
      label: "Yellow Banner",
    },
    {
      src: "/shapes/text-boxes/blue-scallop.png",
      label: "Blue Scallop",
    },
    {
      src: "/shapes/text-boxes/blue-scallop-large.png",
      label: "Large Scallop",
    },
    {
      src: "/shapes/text-boxes/black-outline.png",
      label: "Black Outline",
    },
    {
      src: "/shapes/text-boxes/black-outline-rounded.png",
      label: "Rounded Outline",
    },
    {
      src: "/shapes/text-boxes/black-jagged.png",
      label: "Jagged Edge",
    },
  ];

  const handleImageClick = (src: string) => {
    editor?.addImage(src);
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  /* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
  const getPreviewItems = <T extends any>(
    items: T[],
    count: number = 6,
  ): T[] => {
    return items.slice(0, count);
  };

  const renderCategory = (category: Category, isPreview: boolean = false) => {
    switch (category) {
      case "basic":
        const basicItems = isPreview
          ? getPreviewItems(basicShapes)
          : basicShapes;
        return (
          <div className="grid grid-cols-3 gap-4">
            {basicItems.map((shape, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 w-full p-4"
                onClick={shape.onClick}
              >
                <shape.icon className="h-full w-full" />
              </Button>
            ))}
          </div>
        );

      case "speech-bubbles":
        const bubbleItems = isPreview
          ? getPreviewItems(speechBubbles)
          : speechBubbles;
        return (
          <div className="grid grid-cols-3 gap-4">
            {bubbleItems.map((bubble, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 w-full p-2"
                onClick={() => handleImageClick(bubble.src)}
              >
                <img
                  src={`${NEXT_R2_URL}${bubble.src}` || "/placeholder.svg"}
                  alt={bubble.label}
                  className="h-full w-full object-contain"
                />
              </Button>
            ))}
          </div>
        );
      case "text-boxes":
        const textBoxItems = isPreview ? getPreviewItems(textBoxes) : textBoxes;
        return (
          <div className="grid grid-cols-3 gap-4">
            {textBoxItems.map((box, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 w-full p-2"
                onClick={() => handleImageClick(box.src)}
              >
                <img
                  src={`${NEXT_R2_URL}${box.src}` || "/placeholder.svg"}
                  alt={box.label}
                  className="h-full w-full object-contain"
                />
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      className={cn(
        "relative z-[40] flex h-full w-[360px] flex-col border-r bg-white",
        activeTool === "shapes" ? "visible" : "hidden",
      )}
    >
      <div className="flex items-center border-b p-4">
        {showAll ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAll(false)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <Input placeholder="Search shapes..." className="flex-1" />
      </div>

      <ScrollArea className="flex-1">
        {!showAll ? (
          <div className="space-y-6 p-4">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Basic Shapes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("basic");
                    setShowAll(true);
                  }}
                >
                  Show All
                </Button>
              </div>
              {renderCategory("basic", true)}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Speech Bubbles</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("speech-bubbles");
                    setShowAll(true);
                  }}
                >
                  Show All
                </Button>
              </div>
              {renderCategory("speech-bubbles", true)}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Text Boxes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("text-boxes");
                    setShowAll(true);
                  }}
                >
                  Show All
                </Button>
              </div>
              {renderCategory("text-boxes", true)}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold">
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}
            </h2>
            {renderCategory(selectedCategory, false)}
          </div>
        )}
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
