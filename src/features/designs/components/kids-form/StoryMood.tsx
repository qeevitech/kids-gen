import { useState } from "react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Heart, Sun, Cloud, Stars, Music } from "lucide-react";
import type { fieldData } from "../../types";

interface MoodOption {
  label: string;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
}

interface StoryMoodProps {
  userSelection: (data: fieldData) => void;
}

const moods: MoodOption[] = [
  {
    label: "Happy & Fun",
    icon: <Sun className="h-5 w-5" />,
    description: "Cheerful and playful",
    bgColor: "bg-amber-500",
  },
  {
    label: "Calm & Peaceful",
    icon: <Cloud className="h-5 w-5" />,
    description: "Gentle and soothing",
    bgColor: "bg-sky-500",
  },
  {
    label: "Magical & Wonder",
    icon: <Stars className="h-5 w-5" />,
    description: "Enchanting adventures",
    bgColor: "bg-purple-500",
  },
  {
    label: "Musical & Rhythmic",
    icon: <Music className="h-5 w-5" />,
    description: "Rhymes and songs",
    bgColor: "bg-emerald-500",
  },
];

export default function StoryMood({ userSelection }: StoryMoodProps) {
  const [selectedOption, setSelectedOption] = useState<string>();

  const onSelect = (mood: MoodOption) => {
    setSelectedOption(mood.label);
    userSelection({
      fieldName: "mood",
      fieldValue: mood.label,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-2xl font-semibold text-primary">
          Story Mood
        </Label>
        <p className="text-sm text-muted-foreground">
          What feeling should your story have?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => (
          <motion.div
            key={mood.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mood)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 ${
              selectedOption === mood.label
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
            }`}
          >
            <div
              className={`flex h-[100px] w-full flex-col items-center justify-center p-4 text-white ${mood.bgColor}`}
            >
              <div className="mb-2">{mood.icon}</div>
              <p className="text-center text-sm font-semibold">{mood.label}</p>
              <p className="text-center text-xs text-white/80">
                {mood.description}
              </p>
            </div>

            {selectedOption === mood.label && (
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
