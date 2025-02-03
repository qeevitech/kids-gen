"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { fabric } from "fabric";
import { Design } from "@/types";
import { useEditor } from "@/hooks/use-editor";
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
import { ChevronUp, ChevronDown, Copy, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActiveTool, selectionDependentTools } from "@/features/designs/types";
import debounce from "lodash.debounce";
import { useUpdateDesign } from "@/features/designs/api/use-update-design";
import { Page } from "./Page";
import { Navbar } from "@/features/designs/components/navbar";

interface EditorProps {
  initialData: Design;
}

const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateDesign(initialData.id);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState(100);
  const [editors, setEditors] = useState<{
    [key: number]: ReturnType<typeof useEditor>;
  }>({});
  const [canvases, setCanvases] = useState<{
    [key: number]: fabric.Canvas | null;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const debouncedSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      const currentPageElements = JSON.parse(values.json);
      const updatedPages = initialData.pages.map((page, index) => {
        if (index === currentPage) {
          return {
            ...page,
            elements: currentPageElements,
          };
        }
        return page;
      });

      mutate({
        width: values.width,
        height: values.height,
        pages: updatedPages,
      });
    }, 5000),
    [mutate, currentPage, initialData.pages],
  );

  const handleEditorInit = useCallback(
    (index: number, editor: ReturnType<typeof useEditor>) => {
      setEditors((prev) => ({ ...prev, [index]: editor }));
    },
    [],
  );

  const handleCanvasChange = useCallback(
    (index: number, canvas: fabric.Canvas | null) => {
      setCanvases((prev) => ({ ...prev, [index]: canvas }));
      if (index === currentPage) {
        setCanvas(canvas);
      }
    },
    [currentPage],
  );

  const handlePageClick = (index: number) => {
    if (index === currentPage) {
      return;
    }
    // Clear selections on previous page
    const previousCanvas = editors[currentPage]?.editor?.canvas;
    if (previousCanvas) {
      previousCanvas.discardActiveObject();
      previousCanvas.renderAll();
    }

    // Switch to new page
    setCurrentPage(index);
    const newCanvas = editors[currentPage]?.editor?.canvas;
    if (newCanvas) {
      setCanvas(newCanvas);
      // Optional: If you want to clear selections on the new page too
      newCanvas.discardActiveObject();
      newCanvas.renderAll();
    }
  };

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    setActiveTool(tool);
  }, []);

  const handleDuplicatePage = (index: number) => {
    const pageToDuplicate = initialData.pages[index];
    const newPage = {
      id: crypto.randomUUID(),
      elements: JSON.parse(JSON.stringify(pageToDuplicate.elements)), // Deep clone
    };

    const updatedPages = [...initialData.pages];
    updatedPages.splice(index + 1, 0, newPage);

    mutate({
      pages: updatedPages,
    });
  };

  const handleDeletePage = (index: number) => {
    if (initialData.pages.length <= 1) return;

    const updatedPages = initialData.pages.filter((_, i) => i !== index);

    // If deleting current page, switch to previous page or first page
    if (index === currentPage) {
      const newPageIndex = index === 0 ? 0 : index - 1;
      setCurrentPage(newPageIndex);
    } else if (index < currentPage) {
      // If deleting a page before current page, adjust current page index
      setCurrentPage(currentPage - 1);
    }

    mutate({
      pages: updatedPages,
    });
  };

  const handleMovePageUp = (index: number) => {
    if (index === 0) return;

    const updatedPages = [...initialData.pages];
    const temp = updatedPages[index];
    updatedPages[index] = updatedPages[index - 1];
    updatedPages[index - 1] = temp;

    // Update current page index if moving current page
    if (index === currentPage) {
      setCurrentPage(currentPage - 1);
    } else if (index - 1 === currentPage) {
      setCurrentPage(currentPage + 1);
    }

    mutate({
      pages: updatedPages,
    });
  };

  const handleMovePageDown = (index: number) => {
    if (index === initialData.pages.length - 1) return;

    const updatedPages = [...initialData.pages];
    const temp = updatedPages[index];
    updatedPages[index] = updatedPages[index + 1];
    updatedPages[index + 1] = temp;

    // Update current page index if moving current page
    if (index === currentPage) {
      setCurrentPage(currentPage + 1);
    } else if (index + 1 === currentPage) {
      setCurrentPage(currentPage - 1);
    }

    mutate({
      pages: updatedPages,
    });
  };

  const handleAddPage = () => {
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
    };

    const updatedPages = [...initialData.pages, newPage];

    mutate({
      pages: updatedPages,
    });

    // Switch to the new page
    setCurrentPage(updatedPages.length - 1);
  };

  return (
    <div className="flex h-full flex-col">
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
              editors[currentPage]?.editor?.canvas.getActiveObject(),
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddPage();
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div onClick={() => handlePageClick(index)}>
                    <Page
                      page={page}
                      index={index}
                      width={initialData.width}
                      height={initialData.height}
                      currentPage={currentPage}
                      onCanvasChange={handleCanvasChange}
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
                className="mt-4 flex items-center gap-2"
                onClick={handleAddPage}
              >
                <Plus className="h-4 w-4" />
                Add Page
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;
