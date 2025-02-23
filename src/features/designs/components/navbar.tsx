"use client";

import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useMutationState } from "@tanstack/react-query";
import {
  Download,
  Loader,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

import { UserButton } from "@/features/auth/components/user-button";

import { ActiveTool } from "@/features/designs/types";
import { Logo } from "@/features/designs/components/logo";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorsStore } from "../stores/use-editors-store";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useUpdateDesign } from "../api/use-update-design";

interface NavbarProps {
  id: string;
  initialName: string;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const exportOptions = [
  {
    id: "png",
    title: "PNG Format",
    description: "Best for sharing online",
    icon: "/icons/png-icon.svg",
  },
  {
    id: "jpg",
    title: "JPEG Format",
    description: "Best for printing",
    icon: "/icons/jpg-icon.svg",
  },
  {
    id: "svg",
    title: "SVG Format",
    description: "Best for editing",
    icon: "/icons/svg-icon.svg",
  },
];

export const Navbar = ({
  id,
  initialName,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const { mutate } = useUpdateDesign(id);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useEditorsStore((state) => state.getCurrentEditor());
  const data = useMutationState({
    filters: {
      mutationKey: ["design", { id }],
      exact: true,
    },
    select: (mutation) => mutation.state.status,
  });

  const currentStatus = data[data.length - 1];

  const isError = currentStatus === "error";
  const isPending = currentStatus === "pending";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (name !== initialName) {
      mutate({ name });
    }
  };

  // const { openFilePicker } = useFilePicker({
  //   accept: ".json",
  //   onFilesSuccessfullySelected: ({ plainFiles }: any) => {
  //     if (plainFiles && plainFiles.length > 0) {
  //       const file = plainFiles[0];
  //       const reader = new FileReader();
  //       reader.readAsText(file, "UTF-8");
  //       reader.onload = () => {
  //         editor?.loadJson(reader.result as string);
  //       };
  //     }
  //   },
  // });

  const editors = useEditorsStore((state) => state.editors);

  const handleExportAllPages = async (format: "png" | "jpg" | "svg") => {
    const zip = new JSZip();
    const exportPromises = Object.entries(editors).map(
      async ([pageIndex, editor]) => {
        if (!editor) return;

        const dataUrl =
          format === "svg"
            ? editor.saveSvg()
            : format === "jpg"
              ? editor.saveJpg()
              : editor.savePng();

        if (!dataUrl) return;

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        zip.file(`page-${Number(pageIndex) + 1}.${format}`, blob);
      },
    );

    await Promise.all(exportPromises);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `design-${id}.zip`);
  };

  return (
    <nav className="flex h-[68px] w-full items-center gap-x-8 border-b p-4 lg:pl-[34px]">
      <Logo />
      <div className="flex h-full w-full items-center gap-x-1">
        {/* <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={() => openFilePicker()}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <Separator orientation="vertical" className="mx-2" />
        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool("select")}
            className={cn(activeTool === "select" && "bg-gray-100")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>
        <Hint label="Undo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canUndo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onUndo()}
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>
        <Hint label="Redo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canRedo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onRedo()}
          >
            <Redo2 className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        {isPending && (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Saving...</div>
          </div>
        )}
        {!isPending && isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudSlash className="size-[20px] text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Failed to save</div>
          </div>
        )}
        {!isPending && !isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudCheck className="size-[20px] text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Saved</div>
          </div>
        )}
        {/* Design Name */}
        <div className="flex-1 text-center">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBlur();
                }
              }}
              className="mx-auto max-w-[200px] text-center"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mx-auto inline-flex items-center gap-x-2 text-sm hover:opacity-75"
            >
              <span className="border-b border-dashed border-muted-foreground">
                {name}
              </span>
              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-2 px-4 py-2 transition-all hover:bg-black/70"
              >
                <Download className="h-4 w-4" />
                <span>Export Story</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] p-2">
              <div className="p-2">
                <h4 className="mb-2 text-sm font-medium">Export Options</h4>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred format to download your story
                </p>
              </div>
              <div className="my-2 h-px bg-muted" />
              {exportOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() =>
                    handleExportAllPages(option.id as "png" | "jpg" | "svg")
                  }
                  className="group relative flex cursor-pointer select-none items-center gap-3 rounded-md p-3 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                    <Image
                      src={option.icon}
                      alt={option.title}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{option.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                  <Download className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </DropdownMenuItem>
              ))}
              <div className="my-2 h-px bg-muted" />
              <div className="p-2">
                <p className="text-xs text-muted-foreground">
                  All pages will be exported in a ZIP file
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
