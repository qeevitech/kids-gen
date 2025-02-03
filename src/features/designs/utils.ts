import { v4 as uuidv4 } from "uuid";
import { fabric } from "fabric";
import type { RGBColor } from "react-color";

export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && item.type === "textbox";
    }
  });
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");

  anchorElement.href = file;
  anchorElement.download = `${uuidv4()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-text" || type === "textbox";
}

export function rgbaObjectToString(rgba: RGBColor | "transparent") {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}
