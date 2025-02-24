import Image from "next/image";
import { Check } from "lucide-react";

const benefits = [
  {
    userType: "For Parents",
    title: "Create lasting memories with personalized stories",
    description:
      "Transform everyday moments into magical tales. Create stories featuring your children, teach valuable lessons, and make bedtime reading more engaging.",
    image: "/images/benefits/parents-storytelling.jpeg",
    features: [
      "Personalize characters with your child's name and traits",
      "Choose from educational themes and moral lessons",
      "Create bilingual stories for language learning",
      "Save and print high-quality storybooks",
    ],
    imagePosition: "right",
  },
  {
    userType: "For Authors",
    title: "Streamline your creative process",
    description:
      "Focus on your storytelling while our AI assists with illustrations, formatting, and publishing-ready exports.",
    image: "/images/benefits/author-workspace.jpeg",
    features: [
      "AI-powered story development assistance",
      "Professional illustration generation",
      "Multiple format exports (ePub, PDF, Print)",
      "Version control and drafts management",
    ],
    imagePosition: "left",
  },
  {
    userType: "For Publishers",
    title: "Scale your content production efficiently",
    description:
      "Streamline your publishing workflow with AI-powered tools that maintain quality while reducing production time and costs.",
    image: "/images/benefits/publisher-dashboard.jpeg",
    features: [
      "Bulk story generation capabilities",
      "Brand consistency controls",
      "Team collaboration features",
      "Analytics and performance tracking",
    ],
    imagePosition: "right",
  },
  {
    userType: "For Educators",
    title: "Create engaging educational content",
    description:
      "Design custom learning materials that capture students' attention and make learning fun and interactive.",
    image: "/images/benefits/educator-tools.jpeg",
    features: [
      "Curriculum-aligned story templates",
      "Interactive learning elements",
      "Multi-language support",
      "Classroom sharing features",
    ],
    imagePosition: "left",
  },
];

export function UserBenefitsSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-primary">
            Built for everyone
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The perfect story creation tool for your needs
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          {benefits.map((benefit) => (
            <div
              key={benefit.userType}
              className={`relative isolate my-24 flex flex-col gap-12 lg:flex-row ${
                benefit.imagePosition === "left" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="relative lg:w-1/2 lg:self-center">
                <div className="lg:pr-16">
                  <span className="mb-2 inline-block text-sm font-semibold text-brand-primary">
                    {benefit.userType}
                  </span>
                  <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    {benefit.description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {benefit.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-x-3">
                        <Check className="h-5 w-5 flex-none text-brand-primary" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Image */}
              <div className="relative lg:w-1/2">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
