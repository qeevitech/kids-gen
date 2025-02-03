import { fabric } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter();
    const zoomRatio = 0.85;
    const workspace = canvas
      .getObjects()
      .find((object) => object.name === "clip");

    if (!workspace) return;

    // @ts-ignore - findScaleToFit exists but is not in types
    const scale = fabric.util.findScaleToFit(workspace, {
      width: width,
      height: height,
    });

    const zoom = zoomRatio * scale;

    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

    const workspaceCenter = workspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (!viewportTransform) return;

    viewportTransform[4] =
      canvas.width! / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height! / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);
    canvas.requestRenderAll();
  }, [canvas, container]);

  useEffect(() => {
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      autoZoom();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
