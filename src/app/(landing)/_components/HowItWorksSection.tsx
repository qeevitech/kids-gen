"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Palette, BookOpen, Share2 } from "lucide-react";

const steps = [
  {
    title: "Choose Your Story Type",
    description:
      "Select from the free and pro templates or start with a blank canvas, or use AI to generate a custom story concept.",
    icon: Sparkles,
    image: "/images/how-it-works/ai-generation.png",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Customize & Create",
    description:
      "Use our intuitive editor to customize characters, plot, and settings. Add AI-generated illustrations that match your vision.",
    icon: Palette,
    image: "/images/how-it-works/customize.png",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Review & Enhance",
    description:
      "Preview your story, make adjustments, and let our AI enhance the narrative and visuals for maximum impact.",
    icon: BookOpen,
    image: "/images/how-it-works/review.png",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Download",
    description:
      "Export your story in multiple formats, share with your audience, or publish directly to your preferred platform.",
    icon: Share2,
    image: "/images/how-it-works/share.png",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
];

export function HowItWorksSection() {
  return (
    <div className="relative bg-white pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-primary">
            Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create and publish your stories in four simple steps. Our AI-powered
            platform makes the process smooth and enjoyable.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-lg font-semibold text-white"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  {/* <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${step.bgColor}`}
                  >
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </motion.div> */}

                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    className="mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <dt className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </dt>
                    <dd className="mt-4 text-base text-gray-600">
                      {step.description}
                    </dd>
                  </motion.div>

                  {/* Connector Line */}
                  {/* {index < steps.length - 1 && (
                    <div className="absolute right-0 top-32 hidden h-[2px] w-full translate-x-1/2 bg-gray-200 lg:block" />
                  )} */}
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
