"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I use KidBooks for free?",
    answer:
      "Yes! You can start with our free plan which includes 2 AI story generations per month, unlimited basic designs, and access to essential templates and tools. Perfect for trying out the platform.",
  },
  {
    question: "Will my subscription automatically renew?",
    answer:
      "Yes, all paid plans automatically renew to ensure uninterrupted service. You'll be notified before any renewal, and you can cancel or change your plan at any time from your account settings.",
  },
  {
    question: "Can I really cancel anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time from your account dashboard. You'll continue to have access to your plan's features until the end of your current billing period.",
  },
  {
    question: "Does KidBooks offer discounts for students and teachers?",
    answer:
      "Yes! We offer special educational pricing for verified students and teachers. Contact our support team with your academic credentials to learn more about our education discounts.",
  },
  {
    question: "How can I learn more about how to use KidBooks?",
    answer:
      "We offer comprehensive tutorials, documentation, and video guides in our Help Center. Plus, our community forum is a great place to learn from other creators and share tips.",
  },
  {
    question: "Can I use KidBooks for commercial projects?",
    answer:
      "Yes! Our Pro and Expert plans include commercial usage rights. You can use the stories and illustrations you create for commercial purposes, including publishing and selling.",
  },
  {
    question: "What are credits?",
    answer:
      "Credits are used for AI-powered features like story generation and custom model training. Each plan includes a monthly allocation of credits, and you can purchase additional credits if needed.",
  },
  {
    question: "Do my credits roll over?",
    answer:
      "Credits reset at the beginning of each billing cycle and don't roll over. We recommend using your credits each month to make the most of your subscription.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-primary">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to know about our story creation platform
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Still have questions?
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here
            to help!
          </p>
          <div className="mt-6">
            <a
              href="mailto:support@storybook.com"
              className="text-sm font-semibold leading-6 text-brand-primary hover:text-brand-primary/80"
            >
              Contact our support team <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
