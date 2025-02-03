"use client";

import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetDesign } from "@/features/designs/api/use-get-design";

import { Button } from "@/components/ui/button";
import Editor from "./Editor";

const DesignPage = ({ designId }: { designId: string }) => {
  const { data, isLoading, isError } = useGetDesign(designId);

  if (isLoading || !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-5">
        <TriangleAlert className="text-muted-foreground size-6" />
        <p className="text-muted-foreground text-sm">Failed to fetch project</p>
        <Button asChild variant="secondary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={data} />;
};

export default DesignPage;
