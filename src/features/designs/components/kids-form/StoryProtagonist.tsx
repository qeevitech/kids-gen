import { useState } from "react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Rabbit, Wand2, Users } from "lucide-react";
import type { fieldData } from "../../types";

interface ProtagonistOption {
  label: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface StoryProtagonistProps {
  userSelection: (data: fieldData) => void;
}

const protagonists: ProtagonistOption[] = [
  {
    label: "Child Hero",
    description: "A brave adventurer",
    icon: <User className="h-5 w-5" />,
    bgColor: "bg-amber-500",
  },
  {
    label: "Friendly Animal",
    description: "A lovable creature",
    icon: <Rabbit className="h-5 w-5" />,
    bgColor: "bg-sky-500",
  },
  {
    label: "Magical Being",
    description: "A magical friend",
    icon: <Wand2 className="h-5 w-5" />,
    bgColor: "bg-purple-500",
  },
  {
    label: "Family Team",
    description: "Parents and children",
    icon: <Users className="h-5 w-5" />,
    bgColor: "bg-emerald-500",
  },
];

export default function StoryProtagonist({
  userSelection,
}: StoryProtagonistProps) {
  const [selectedOption, setSelectedOption] = useState<string>();

  const onSelect = (protagonist: ProtagonistOption) => {
    setSelectedOption(protagonist.label);
    userSelection({
      fieldName: "protagonist",
      fieldValue: protagonist.label,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-2xl font-semibold text-primary">
          Main Character
        </Label>
        <p className="text-sm text-muted-foreground">
          Who will be the hero of your story?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {protagonists.map((protagonist) => (
          <motion.div
            key={protagonist.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(protagonist)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 ${
              selectedOption === protagonist.label
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
            }`}
          >
            <div
              className={`flex h-[100px] w-full flex-col items-center justify-center p-4 text-white ${protagonist.bgColor}`}
            >
              <div className="mb-2">{protagonist.icon}</div>
              <p className="text-center text-sm font-semibold">
                {protagonist.label}
              </p>
              <p className="text-center text-xs text-white/80">
                {protagonist.description}
              </p>
            </div>

            {selectedOption === protagonist.label && (
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
