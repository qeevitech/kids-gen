import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { JSON_KEYS } from "../types";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
  canvasHistory,
  setHistoryIndex,
}: UseLoadStateProps) => {
  const initialized = useRef(false);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvas && canvas !== canvasRef.current) {
      canvasRef.current = canvas;
    }
  }, [canvas]);

  useEffect(() => {
    const loadCanvas = () => {
      if (!canvasRef.current || !initialState?.current) return;

      try {
        const data = JSON.parse(initialState.current);

        // Clear existing objects
        canvasRef.current.getObjects().forEach((obj) => {
          canvasRef.current?.remove(obj);
        });

        // Load new state
        canvasRef.current.loadFromJSON(data, () => {
          const currentState = JSON.stringify(
            canvasRef.current?.toJSON(JSON_KEYS),
          );
          canvasHistory.current = [currentState];
          setHistoryIndex(0);

          // Ensure canvas is rendered
          canvasRef.current?.requestRenderAll();
          autoZoom();
        });
      } catch (error) {
        console.error("Error loading canvas state:", error);
      }
    };

    if (!initialized.current && canvasRef.current && initialState?.current) {
      initialized.current = true;
      loadCanvas();
    } else if (
      initialized.current &&
      canvasRef.current &&
      initialState?.current
    ) {
      // Use setTimeout to ensure canvas is ready
      const timeoutId = setTimeout(loadCanvas, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [autoZoom, initialState, canvasHistory, setHistoryIndex]);

  return { canvasRef };
};
