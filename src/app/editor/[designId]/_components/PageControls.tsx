import { Plus } from "lucide-react";
import { DesignPage } from "@/types";
import { Button } from "@/components/ui/button";

interface PageControlsProps {
  pages: DesignPage[];
  currentPage: number;
  onChangePage: (index: number) => void;
}

export const PageControls = ({
  pages,
  currentPage,
  onChangePage,
}: PageControlsProps) => {
  return (
    <div className="w-[300px] border-l border-muted-foreground/20 p-4">
      <div className="space-y-4">
        {pages.map((page, index) => (
          <div
            key={page.id}
            onClick={() => onChangePage(index)}
            className={`cursor-pointer rounded-lg border p-2 transition-all hover:opacity-70 ${currentPage === index ? "border-primary" : "border-muted-foreground/20"}`}
          >
            <div className="aspect-[1/1] w-full bg-white">
              {/* TODO: Add page thumbnail */}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Page {index + 1}
            </p>
          </div>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            /* TODO: Add new page */
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add page
        </Button>
      </div>
    </div>
  );
};
