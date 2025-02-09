import { fabric } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    try {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      canvas.setWidth(width);
      canvas.setHeight(height);

      const center = canvas.getCenter();
      const zoomRatio = 0.85;

      // Find workspace and ensure it exists
      const localWorkspace = canvas
        .getObjects()
        .find((object) => object.name === "clip");

      if (!localWorkspace || !localWorkspace.width || !localWorkspace.height) {
        console.warn("Workspace not found or invalid dimensions");
        return;
      }

      // Type assertion for findScaleToFit
      const scale = (fabric.util as any).findScaleToFit(
        {
          width: localWorkspace.width,
          height: localWorkspace.height,
        },
        {
          width,
          height,
        },
      );

      if (typeof scale !== "number") {
        console.warn("Invalid scale value");
        return;
      }

      const zoom = zoomRatio * scale;

      canvas.setViewportTransform(fabric.iMatrix.concat());
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

      const workspaceCenter = localWorkspace.getCenterPoint();
      const viewportTransform = canvas.viewportTransform;

      if (!viewportTransform || !canvas.width || !canvas.height) {
        console.warn("Invalid canvas state");
        return;
      }

      viewportTransform[4] =
        canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
      viewportTransform[5] =
        canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

      canvas.setViewportTransform(viewportTransform);

      // Only clone if workspace exists
      localWorkspace.clone((cloned: fabric.Rect) => {
        if (canvas) {
          // Check if canvas still exists
          canvas.clipPath = cloned;
          canvas.requestRenderAll();
        }
      });
    } catch (error) {
      console.error("Error in autoZoom:", error);
    }
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        // Add delay to ensure canvas is ready
        setTimeout(() => {
          if (canvas && container) {
            autoZoom();
          }
        }, 100);
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
