import Image from "next/image";
import {
  Sparkles,
  Palette,
  Wand2,
  BookOpen,
  Share2,
  Lock,
  Layers,
  Zap,
  Brain,
  Upload,
} from "lucide-react";

const features = [
  {
    name: "AI Story Generation",
    description:
      "Transform your ideas into complete stories with our advanced AI. Perfect for both children's tales and adult narratives.",
    icon: Sparkles,
    bgImage: "/images/features/ai-generation.png",
    imagePrompt:
      "Ethereal, magical writing desk with floating papers and glowing AI particles, soft purple and blue lighting, papers transforming into story scenes, minimalist, dreamy atmosphere, 8k render, trending on artstation",
  },
  {
    name: "Custom Characters",
    description:
      "Create and customize unique characters that bring your stories to life with our intuitive character builder.",
    icon: Palette,
    bgImage: "/images/features/characters.jpeg",
    imagePrompt:
      "Character design sketches floating in a creative space, color palettes, character expressions, soft watercolor style, gentle pastels, artistic workspace, clean minimal design, 8k render",
  },
  {
    name: "Custom AI Training",
    description:
      "Train AI models with your own illustration style. Upload your artwork and create stories that match your unique visual identity.",
    icon: Brain,
    bgImage: "/images/features/ai-training.png",
    imagePrompt:
      "Neural network visualization with artist illustrations flowing into AI training model, artistic style transfer process, floating artwork samples, soft purple and blue tech elements, professional 3D render, 8k quality, trending on artstation",
  },
  {
    name: "Smart Editor",
    description:
      "Professional-grade editing tools made simple. Perfect for both beginners and experienced storytellers.",
    icon: Wand2,
    bgImage: "/images/features/editor.png",
    imagePrompt:
      "Modern minimal editing interface with magical elements, floating text blocks, gentle glowing tools, clean workspace with soft shadows, professional yet magical atmosphere, 8k render",
  },
  {
    name: "Rich Templates",
    description:
      "Start with beautiful pre-designed templates for any genre or create your own from scratch.",
    icon: Layers,
    bgImage: "/images/features/templates.jpeg",
    imagePrompt:
      "Elegant storybook layouts floating in space, multiple design styles overlapping, soft gradient backgrounds, minimal geometric patterns, professional template showcase, 8k render",
  },
  {
    name: "Easy Sharing",
    description:
      "Share your stories instantly with family, friends, or publish them to our community.",
    icon: Share2,
    bgImage: "/images/features/sharing.jpeg",
    imagePrompt:
      "Connected story pages floating between devices, gentle connection lines, soft glowing sharing icons, community interaction visualization, warm and inviting atmosphere, 8k render",
  },
  {
    name: "Multi-Language",
    description:
      "Create stories in multiple languages and reach readers worldwide with our translation features.",
    icon: BookOpen,
    bgImage: "/images/features/languages.jpeg",
    imagePrompt:
      "World languages flowing through an open book, typography in different scripts, global connection visualization, soft cultural elements, clean minimal design, 8k render",
  },
  {
    name: "Fast Export",
    description:
      "Export your stories in multiple formats including PDF, ePub, and print-ready files.",
    icon: Zap,
    bgImage: "/images/features/export.jpeg",
    imagePrompt:
      "Multiple file format icons transforming from a story page, speed lines, clean minimal design, professional export visualization, soft tech elements, 8k render",
  },
];

export function FeaturesSection() {
  return (
    <div className="relative isolate bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Stories That Matter
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            All the tools you need to transform your imagination into beautiful,
            engaging stories. From AI-powered writing assistance to custom style
            training and professional design tools.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="group relative">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                  {/* Feature Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={feature.bgImage}
                      alt={feature.name}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10">
                      <feature.icon
                        className="h-6 w-6 text-brand-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <dt className="mt-4 font-semibold text-gray-900">
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-sm text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* New AI Training Highlight Section */}
        <div className="mt-24 rounded-3xl bg-gray-900 px-6 py-20 sm:mt-32 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Train AI with Your Style
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Upload your illustrations, train custom AI models, and create
                stories that perfectly match your unique artistic style. Perfect
                for illustrators, publishers, and brands wanting to maintain
                visual consistency.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "15 minutes", label: "Average Training Time" },
                { value: "100%", label: "Style Match Accuracy" },
                { value: "Unlimited", label: "Style Variations" },
                { value: "One-Click", label: "Style Transfer" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-y-4 rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <dt className="text-sm font-medium text-gray-400">
                    {stat.label}
                  </dt>
                  <dd className="text-4xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
