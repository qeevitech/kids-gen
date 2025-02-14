"use client";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import type { fieldData } from "../../types";

interface StoryTypeOption {
  label: string;
  imageUrl: string;
  description: string;
  isFree: boolean;
}

interface StoryTypeProps {
  userSelection: (data: fieldData) => void;
}

const storyTypes: StoryTypeOption[] = [
  {
    label: "Adventure Story",
    imageUrl: "/storytypes/story.jpeg",
    description: "Epic quests and exciting journeys",
    isFree: true,
  },
  {
    label: "Bedtime Story",
    imageUrl: "/storytypes/bedstory.jpeg",
    description: "Cozy tales for sweet dreams",
    isFree: true,
  },
  {
    label: "Educational",
    imageUrl: "/storytypes/educational.jpeg",
    description: "Learning made fun",
    isFree: true,
  },
  {
    label: "Fantasy",
    imageUrl: "/storytypes/fantasy.jpeg",
    description: "Magical worlds and creatures",
    isFree: true,
  },
  {
    label: "Animal Tales",
    imageUrl: "/storytypes/animal.jpeg",
    description: "Stories with lovable creatures",
    isFree: true,
  },
  {
    label: "Mystery",
    imageUrl: "/storytypes/mystery.jpeg",
    description: "Solve puzzles and secrets",
    isFree: true,
  },
];

export default function StoryType({ userSelection }: StoryTypeProps) {
  const [selectedOption, setSelectedOption] = useState<string>();

  const onUserSelect = (item: StoryTypeOption) => {
    setSelectedOption(item.label);
    userSelection({
      fieldValue: item.label,
      fieldName: "storyType",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-2xl font-semibold text-primary">
          Story Type
        </Label>
        <p className="text-sm text-muted-foreground">
          Choose what kind of story you want to create
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {storyTypes.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 ${
              selectedOption === item.label
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
            } `}
            onClick={() => onUserSelect(item)}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-black/0" />

            <Image
              src={item.imageUrl}
              alt={item.label}
              width={300}
              height={300}
              className={`h-[100px] w-full object-cover transition-all duration-300 ${
                selectedOption === item.label
                  ? "brightness-100"
                  : "brightness-75 group-hover:brightness-90"
              } `}
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
              <p className="text-center text-sm font-semibold text-white">
                {item.label}
              </p>
            </div>

            {selectedOption === item.label && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2 top-2 z-20 h-4 w-4 rounded-full bg-primary"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
