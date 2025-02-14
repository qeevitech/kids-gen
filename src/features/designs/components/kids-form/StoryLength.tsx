import { useState } from "react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import type { fieldData } from "../../types";

interface StoryLengthProps {
  userSelection: (data: fieldData) => void;
}

const lengths = [
  {
    label: "Short",
    description: "5-minute read",
    pages: "3-5 pages",
    icon: <Clock className="h-5 w-5" />,
    bgColor: "bg-amber-500",
  },
  {
    label: "Medium",
    description: "10-minute read",
    pages: "6-8 pages",
    icon: <BookOpen className="h-5 w-5" />,
    bgColor: "bg-sky-500",
  },
  {
    label: "Long",
    description: "15-minute read",
    pages: "9-12 pages",
    icon: <BookOpen className="h-5 w-5" />,
    bgColor: "bg-purple-500",
  },
];

export default function StoryLength({ userSelection }: StoryLengthProps) {
  const [selectedOption, setSelectedOption] = useState<string>();

  const onSelect = (length: (typeof lengths)[0]) => {
    setSelectedOption(length.label);
    userSelection({
      fieldName: "length",
      fieldValue: length.label,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-2xl font-semibold text-primary">
          Story Length
        </Label>
        <p className="text-sm text-muted-foreground">
          How long would you like your story to be?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {lengths.map((length) => (
          <motion.div
            key={length.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(length)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 ${
              selectedOption === length.label
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
            }`}
          >
            <div
              className={`flex h-[100px] w-full flex-col items-center justify-center p-4 text-white ${length.bgColor}`}
            >
              <div className="mb-2">{length.icon}</div>
              <p className="text-center text-sm font-semibold">
                {length.label}
              </p>
              <p className="text-center text-xs text-white/80">
                {length.description}
              </p>
              <p className="text-center text-xs text-white/60">
                {length.pages}
              </p>
            </div>

            {selectedOption === length.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2 top-2 z-20 h-4 w-4 rounded-full bg-white"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
