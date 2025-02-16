"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useGetDesigns } from "@/features/designs/api/use-get-designs";
import { AlertTriangle, CopyIcon, Loader, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDuplicateDesign } from "@/features/designs/api/use-duplicate-design";
import { useDeleteDesign } from "@/features/designs/api/use-delete-design";
import { useConfirm } from "@/hooks/use-confirm";

export const DesignSection = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this design.",
  );
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetDesigns();

  const duplicateMutation = useDuplicateDesign();
  const removeMutation = useDeleteDesign();

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      removeMutation.mutate({ id });
    }
  };

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex h-32 flex-col items-center justify-center gap-y-4">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex h-32 flex-col items-center justify-center gap-y-4">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Failed to load projects
          </p>
        </div>
      </div>
    );
  }

  if (!data.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex h-32 flex-col items-center justify-center gap-y-4">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <h2 className="text-xl font-semibold">Your Stories</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.pages.flatMap((page) =>
          page.data.map((design) => (
            <Card
              key={design.id}
              className="group overflow-hidden transition-all hover:shadow-md"
            >
              <CardContent className="relative p-0">
                <Link href={`/editor/${design.id}`}>
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={
                        (design.pages as any[])?.[0]?.thumbnail ||
                        "/placeholder.png"
                      }
                      alt={design.name || "Design"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                </Link>
                <div className="flex justify-between p-4">
                  <div>
                    <Link
                      href={`/editor/${design.id}`}
                      className="cursor-pointer hover:underline"
                    >
                      <h3 className="font-medium">
                        {design.name || "Untitled"}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {design.createdAt &&
                        formatDistanceToNow(new Date(design.createdAt), {
                          addSuffix: true,
                        })}
                    </p>
                  </div>
                  <div className="">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={duplicateMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopy(design.id);
                          }}
                        >
                          <CopyIcon className="mr-2 size-4" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={removeMutation.isPending}
                          onClick={() => onDelete(design.id)}
                        >
                          <Trash className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )),
        )}
      </div>
      {hasNextPage && (
        <div className="flex w-full items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};
