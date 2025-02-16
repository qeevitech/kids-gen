import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Template } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateSelectorProps {
  templates: Template[];
  value?: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  error?: boolean;
}

export function TemplateSelector({
  templates,
  value,
  onChange,
  isLoading,
  error,
}: TemplateSelectorProps) {
  if (isLoading) {
    return (
      <FormItem>
        <FormLabel>Template</FormLabel>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-video w-full" />
          ))}
        </div>
      </FormItem>
    );
  }

  if (error) {
    return (
      <FormItem>
        <FormLabel>Template</FormLabel>
        <FormDescription className="text-red-500">
          Failed to load templates
        </FormDescription>
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormLabel>Template</FormLabel>
      <FormControl>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                value === template.id && "border-2 border-primary",
              )}
              onClick={() => onChange(template.id)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={
                      template.thumbnail ||
                      template.pages?.[0]?.thumbnail ||
                      "/placeholder.png"
                    }
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-medium">{template.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FormControl>
      <FormDescription>Choose a template for your story</FormDescription>
    </FormItem>
  );
}
