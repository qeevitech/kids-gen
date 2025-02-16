"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Design } from "@/types";
import { Sidebar } from "@/features/designs/components/sidebar";
import { ShapeSidebar } from "@/features/designs/components/shape-sidebar";
import { FillColorSidebar } from "@/features/designs/components/fill-color-sidebar";
import { StrokeColorSidebar } from "@/features/designs/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/designs/components/stroke-width-sidebar";
import { OpacitySidebar } from "@/features/designs/components/opacity-sidebar";
import { TextSidebar } from "@/features/designs/components/text-sidebar";
import { FontSidebar } from "@/features/designs/components/font-sidebar";
import { ImageSidebar } from "@/features/designs/components/image-sidebar";
import { FilterSidebar } from "@/features/designs/components/filter-sidebar";
import { DrawSidebar } from "@/features/designs/components/draw-sidebar";
import { AiSidebar } from "@/features/designs/components/ai-sidebar";
import { TemplateSidebar } from "@/features/designs/components/template-sidebar";
import { RemoveBgSidebar } from "@/features/designs/components/remove-bg-sidebar";
import { SettingsSidebar } from "@/features/designs/components/settings-sidebar";
import { Toolbar } from "@/features/designs/components/toolbar";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActiveTool,
  JSON_KEYS,
  selectionDependentTools,
} from "@/features/designs/types";
import debounce from "lodash.debounce";
import { useUpdateDesign } from "@/features/designs/api/use-update-design";
import { Page } from "./Page";
import { Navbar } from "@/features/designs/components/navbar";
import { useEditorsStore } from "@/features/designs/stores/use-editors-store";
import { Hint } from "@/components/hint";
import { Footer } from "@/features/designs/components/footer";
import { TrainModel } from "@/features/designs/components/train-model";
import { GenerateStory } from "@/features/designs/components/generate-story";
import { cn } from "@/lib/utils";

interface EditorProps {
  initialData: Design;
}

const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateDesign(initialData.id);
  const editorStore = useEditorsStore();
  const isGenerating = useEditorsStore((state) => state.isGenerating);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);

  const containerRef = useRef<HTMLDivElement>(null);
  // Get fresh editors state
  const editors = useEditorsStore((state) => state.editors);

  // Initialize store with data
  useEffect(() => {
    editorStore.setInitialData(initialData);
  }, [initialData]);

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const debouncedSave = useCallback(
    debounce(() => {
      const editors = useEditorsStore.getState().editors;
      const activeEditors = Object.keys(editors).length;

      if (activeEditors === 0) {
        console.log("No active editors or canvases found");
        return;
      }

      const updatedPages = Object.entries(editors)
        .map(([index, editor]) => {
          const pageIndex = parseInt(index);
          const pageId = editorStore.getPageId(pageIndex);
          const canvas = editor.canvas;

          if (!pageId || !canvas) return;

          const currentState = canvas.toJSON(JSON_KEYS);
          const thumbnail = canvas.toDataURL();

          return {
            id: pageId,
            elements: currentState,
            thumbnail,
          };
        })
        .filter(
          (page): page is { id: string; elements: any; thumbnail: string } =>
            page !== undefined,
        );

      if (updatedPages.length > 0) {
        console.log(updatedPages);
        mutate({
          pages: updatedPages,
        });
      }
    }, 5000),
    [mutate],
  );

  const handlePageClick = (index: number) => {
    if (index === currentPage) {
      return;
    }
    // Clear selections on previous page
    const previousCanvas = editorStore.editors[currentPage]?.canvas;
    if (previousCanvas) {
      previousCanvas.discardActiveObject();
      previousCanvas.renderAll();
    }

    // Switch to new page
    setCurrentPage(index);
    const newCanvas = editorStore.editors[currentPage]?.canvas;
    if (newCanvas) {
      // Optional: If you want to clear selections on the new page too
      newCanvas.discardActiveObject();
      newCanvas.renderAll();
    }
  };

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    setActiveTool(tool);
  }, []);

  const getEditors = () => {
    const updatedPages = Object.entries(editors)
      .map(([pageIndex, editor]) => {
        const pageId = editorStore.getPageId(parseInt(pageIndex));
        const canvas = editor.canvas;

        if (!pageId || !canvas) return null;

        return {
          id: pageId,
          elements: canvas.toJSON(JSON_KEYS),
          thumbnail: canvas.toDataURL(),
        };
      })
      .filter(
        (page): page is { id: string; elements: any; thumbnail: string } =>
          page !== null,
      );

    return updatedPages;
  };

  const handleDuplicatePage = (index: number) => {
    const editors = useEditorsStore.getState().editors;

    // Get current canvas state
    const currentCanvas = editors[index]?.canvas;
    if (!currentCanvas) return;

    // Get current state of all pages
    const updatedPages = getEditors();

    // Create new page with current canvas state
    const newPage = {
      id: crypto.randomUUID(),
      elements: currentCanvas.toJSON(JSON_KEYS),
      thumbnail: currentCanvas.toDataURL(),
    };

    // Insert new page after the current one
    updatedPages.splice(index + 1, 0, newPage);

    // Update store and save to DB
    mutate({ pages: updatedPages });
    setCurrentPage(index + 1);
  };

  const handleDeletePage = (index: number) => {
    if (initialData.pages.length <= 1) return;

    // Get current state of all pages
    const updatedPages = getEditors();

    // Remove page at index
    updatedPages.splice(index, 1);

    // Update current page index
    if (index === currentPage) {
      setCurrentPage(index === 0 ? 0 : index - 1);
    } else if (index < currentPage) {
      setCurrentPage(currentPage - 1);
    }

    // Save to DB
    mutate({ pages: updatedPages });
  };

  const handleMovePageUp = (index: number) => {
    if (index === 0) return;

    // Get current state of all pages
    const updatedPages = getEditors();

    // Swap pages
    const temp = updatedPages[index];
    updatedPages[index] = updatedPages[index - 1];
    updatedPages[index - 1] = temp;

    // Update current page index
    if (index === currentPage) {
      setCurrentPage(currentPage - 1);
    } else if (index - 1 === currentPage) {
      setCurrentPage(currentPage + 1);
    }
    console.log(updatedPages);

    // Save to DB
    mutate({ pages: updatedPages });
  };

  const handleMovePageDown = (index: number) => {
    if (index === initialData.pages.length - 1) return;

    // Get current state of all pages
    const updatedPages = getEditors();

    // Swap pages
    const temp = updatedPages[index];
    updatedPages[index] = updatedPages[index + 1];
    updatedPages[index + 1] = temp;

    // Update current page index
    if (index === currentPage) {
      setCurrentPage(currentPage + 1);
    } else if (index + 1 === currentPage) {
      setCurrentPage(currentPage - 1);
    }

    // Save to DB
    mutate({ pages: updatedPages });
  };

  const handleAddPage = (index?: number) => {
    const newPage = {
      id: crypto.randomUUID(),
      elements: {
        objects: [
          {
            rx: 0,
            ry: 0,
            top: -286.5,
            fill: "white",
            left: 175.5,
            name: "clip",
            type: "rect",
            angle: 0,
            flipX: false,
            flipY: false,
            skewX: 0,
            skewY: 0,
            width: initialData.width,
            height: initialData.height,
            scaleX: 1,
            scaleY: 1,
            shadow: {
              blur: 5,
              color: "rgba(0,0,0,0.8)",
              offsetX: 0,
              offsetY: 0,
              nonScaling: false,
              affectStroke: false,
            },
            stroke: null,
            opacity: 1,
            originX: "left",
            originY: "top",
            version: "5.3.0",
            visible: true,
            fillRule: "nonzero",
            paintFirst: "fill",
            selectable: false,
            hasControls: false,
            strokeWidth: 1,
            strokeLineCap: "butt",
            strokeUniform: false,
            strokeLineJoin: "miter",
            backgroundColor: "",
            strokeDashArray: null,
            strokeDashOffset: 0,
            strokeMiterLimit: 4,
            globalCompositeOperation: "source-over",
          },
        ],
        version: "5.3.0",
      },
      thumbnail: "",
    };
    // Get current state of all pages
    const updatedPages = getEditors();

    const insertIndex = typeof index === "number" ? index : currentPage;
    updatedPages.splice(insertIndex + 1, 0, newPage);

    mutate({
      pages: updatedPages,
    });

    setCurrentPage(insertIndex + 1);
  };

  return (
    <div className="relative h-screen">
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Generating your story...
          </p>
        </div>
      )}

      <div
        className={cn(
          "flex h-full flex-col",
          isGenerating && "pointer-events-none opacity-50",
        )}
      >
        <Navbar
          id={initialData.id}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <div className="absolute top-[68px] flex h-[calc(100%-68px)] w-full">
          <Sidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />

          <TrainModel
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <GenerateStory
            designId={initialData.id}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <ShapeSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FillColorSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <StrokeColorSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <StrokeWidthSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <OpacitySidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <TextSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FontSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <ImageSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <TemplateSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FilterSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <AiSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <RemoveBgSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <DrawSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <SettingsSidebar
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />

          <main className="relative flex flex-1 flex-col overflow-auto bg-muted">
            <Toolbar
              activeTool={activeTool}
              onChangeActiveTool={onChangeActiveTool}
              key={JSON.stringify(
                editorStore.editors[currentPage]?.canvas.getActiveObject(),
              )}
            />
            <div
              className="h-[calc(100%-154px)] flex-1 bg-muted"
              ref={containerRef}
            >
              <div className="flex flex-col items-center p-8">
                {initialData.pages.map((page, index) => (
                  <div
                    key={page.id}
                    className={`relative cursor-pointer ${
                      currentPage === index ? "rounded-md" : ""
                    }`}
                  >
                    <div className="absolute left-0 top-4 z-10 flex w-full items-center justify-center px-4">
                      <span className="text-sm text-muted-foreground">
                        Page {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <Hint label="Move up" side="top" sideOffset={10}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovePageUp(index);
                            }}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint label="Move down" side="top" sideOffset={10}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovePageDown(index);
                            }}
                            disabled={index === initialData.pages.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint label="Duplicate" side="top" sideOffset={10}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicatePage(index);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint label="Delete" side="top" sideOffset={10}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePage(index);
                            }}
                            disabled={initialData.pages.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint label="Add page" side="top" sideOffset={10}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddPage(index);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </Hint>
                      </div>
                    </div>

                    <div onClick={() => handlePageClick(index)}>
                      <Page
                        page={page}
                        index={index}
                        width={initialData.width}
                        height={initialData.height}
                        currentPage={currentPage}
                        containerRef={containerRef}
                        saveCallback={debouncedSave}
                        clearSelectionCallback={onClearSelection}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="lg"
                  className="mb-10 mt-4 flex items-center gap-2"
                  onClick={() => handleAddPage()}
                >
                  <Plus className="h-4 w-4" />
                  Add Page
                </Button>
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Editor;
