"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const storyDesigns = [
  {
    src: "/images/stories/story-1.jpeg",
    alt: "Fantasy story design",
  },
  {
    src: "/images/stories/story-2.jpeg",
    alt: "Adventure story design",
  },
  {
    src: "/images/stories/story-3.jpeg",
    alt: "Educational story",
  },
  {
    src: "/images/stories/story-4.jpeg",
    alt: "Children's tale",
  },
  {
    src: "/images/stories/story-5.jpeg",
    alt: "Mystery story",
  },
  {
    src: "/images/stories/story-6.jpeg",
    alt: "Sci-fi story",
  },
  {
    src: "/images/stories/story-7.jpeg",
    alt: "Historical tale",
  },
  {
    src: "/images/stories/story-8.jpeg",
    alt: "Adventure story",
  },
  {
    src: "/images/stories/story-9.jpeg",
    alt: "Fantasy story",
  },
  {
    src: "/images/stories/story-10.jpeg",
    alt: "Mystery tale",
  },
];

export function CTASection() {
  return (
    <div className="relative overflow-hidden rounded-[56px] bg-gray-900">
      {/* Main Content */}
      <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            EVERY STORY
            <br />
            DESERVES TO BE TOLD
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Turn your imagination into beautiful storybooks. Start creating your
            magical stories today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register" className="gap-x-2">
              <Button
                size="lg"
                className="gap-x-2 bg-white text-black hover:bg-white/90"
              >
                Start Writing Your Story
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Story Designs Grid */}
      <div className="relative">
        <div className="absolute inset-0 z-10 h-40 bg-gradient-to-b from-gray-900 to-transparent" />
        <div className="grid grid-cols-5 gap-4 px-4">
          {storyDesigns.map((design, index) => (
            <motion.div
              key={design.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={design.src}
                alt={design.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>
    </div>
  );
}
