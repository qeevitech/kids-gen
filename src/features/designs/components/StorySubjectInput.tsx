import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { fieldData } from "../types";

interface StorySubjectInputProps {
  userSelection: (data: fieldData) => void;
}

export default function StorySubjectInput({
  userSelection,
}: StorySubjectInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="subject"
          className="text-2xl font-semibold text-primary"
        >
          Subject of the story
        </Label>
        <p className="text-sm text-muted-foreground">
          Describe what you want your story to be about
        </p>
      </div>

      <Textarea
        id="subject"
        placeholder="Once upon a time, there was a brave little dragon who loved to help others..."
        className="min-h-[200px] resize-none text-base"
        onChange={(e) =>
          userSelection({
            fieldValue: e.target.value,
            fieldName: "storySubject",
          })
        }
      />
    </div>
  );
}
