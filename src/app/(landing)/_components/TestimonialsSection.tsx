"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    content:
      "I have heard of this platform from multiple youtubers actually and it has not put me down, not even once.",
    author: "Lara Stan",
    avatar: "/images/testimonials/avatar-1.jpeg",
    role: "Author",
    subscribers: "230k+ subscribers",
  },
  {
    content:
      "It's incredibly user-friendly, and the wide variety of templates available is fantastic.",
    author: "Tyler Goffinet",
    avatar: "/images/testimonials/avatar-2.jpeg",
    role: "Parent",
  },
  {
    content:
      "The extensive template library boosts creativity, allowing even beginners to produce stunning visuals.",
    author: "Rania Filo",
    avatar: "/images/testimonials/avatar-3.jpeg",
    role: "Educator",
  },
  {
    content:
      "This AI creative tool is AMAZING! All the style options and the ability to have multiple art boards is a MAJOR plus.",
    author: "Kyle Andrews",
    avatar: "/images/testimonials/avatar-4.jpeg",
    role: "Publisher",
  },
];

const featuredTestimonials = [
  {
    content:
      "Its awesome tool for parent like me. You can create complex stories very easily.",
    author: "James Smith",
    avatar: "/images/testimonials/rich-khan.jpeg",
    role: "Content Creator",
    subscribers: "230k+ subscribers",
    platform: "youtube",
  },
  {
    content: "I've really enjoyed creating some stunning stories!",
    author: "Aravind",
    avatar: "/images/testimonials/will-peterson.jpeg",
    role: "Designer",
    subscribers: "850k+ subscribers",
    platform: "youtube",
  },
  {
    content: "makes creating new stories super easy!",
    author: "John kerry",
    avatar: "/images/testimonials/odette-rockhead.jpeg",
    role: "Educator",
    subscribers: "1.22M+ subscribers",
    platform: "youtube",
  },
];

export function TestimonialsSection() {
  return (
    <div className="relative isolate bg-white py-24 sm:py-32">
      {/* World Map Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/world-map-dots.svg"
          alt="World Map"
          fill
          className="opacity-5"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 text-brand-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Over 1000+ users
          </p>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Generating unique stories daily
          </p>
        </div>

        {/* Floating Testimonials */}
        <div className="relative mx-auto mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-semibold leading-6 text-gray-900">
                    {testimonial.content}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-x-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full bg-gray-50"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.author}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Creators */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10"
            >
              <div className="flex items-center gap-x-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full bg-gray-50"
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
              <blockquote className="mt-6 text-gray-900">
                <p>{`"${testimonial.content}"`}</p>
              </blockquote>
              {testimonial.subscribers && (
                <div className="mt-6 flex items-center gap-x-2 border-t border-gray-900/10 pt-6">
                  <div className="flex items-center gap-x-2">
                    <div className="h-6 w-6 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600">
                      {testimonial.subscribers}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
