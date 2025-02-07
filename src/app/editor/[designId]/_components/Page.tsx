import { useEditor } from "@/hooks/use-editor";
import { DesignPage } from "@/types";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useEditorsStore } from "@/features/designs/stores/use-editors-store";

interface PageProps {
  page: DesignPage;
  index: number;
  width: number;
  height: number;
  currentPage: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  saveCallback: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
  clearSelectionCallback: () => void;
}

export function Page({
  page,
  index,
  width,
  height,
  currentPage,
  containerRef,
  saveCallback,
  clearSelectionCallback,
}: PageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const { setEditor, setPageId, setCurrentPage } = useEditorsStore();

  const { init, editor } = useEditor({
    defaultState: JSON.stringify(page.elements),
    defaultWidth: width,
    defaultHeight: height,
    clearSelectionCallback,
    saveCallback,
  });

  // Set editor and pageId in store when initialized
  useEffect(() => {
    if (editor) {
      setEditor(index, editor);
      setPageId(index, page.id);
    }
  }, [index, editor, page.id, setEditor, setPageId]);

  // Update current page in store when it changes
  useEffect(() => {
    if (currentPage === index) {
      setCurrentPage(index);
    }
  }, [currentPage, index, setCurrentPage]);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      controlsAboveOverlay: true,
    });

    fabricRef.current = canvas;

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current,
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [init, containerRef, page.id]);

  return <canvas ref={canvasRef} />;
}
