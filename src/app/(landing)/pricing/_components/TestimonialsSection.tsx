"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "The AI story generation is amazing! My kids love seeing themselves in the stories.",
    author: "Sarah Chen",
    role: "Parent",
    avatar: "/images/testimonials/avatar-1.jpeg",
    rating: 5,
  },
  {
    content:
      "As an illustrator, the custom AI model training has been a game-changer. Now I can create stories in my style instantly.",
    author: "Marcus Rodriguez",
    role: "Professional Illustrator",
    avatar: "/images/testimonials/avatar-2.jpeg",
    rating: 5,
  },
  {
    content:
      "The platform made it so easy to create educational stories for my classroom. My students are more engaged than ever.",
    author: "Emily Thompson",
    role: "Elementary Teacher",
    avatar: "/images/testimonials/avatar-3.jpeg",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by storytellers worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10"
            >
              <div className="flex gap-x-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-14 w-14 rounded-full bg-gray-50"
                  width={56}
                  height={56}
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-primary text-brand-primary"
                  />
                ))}
              </div>

              <blockquote className="mt-4 text-gray-900">
                <p>{`"${testimonial.content}"`}</p>
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
