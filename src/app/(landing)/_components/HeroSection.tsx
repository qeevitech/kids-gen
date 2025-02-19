import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative isolate pt-14">
      {/* Hero Background Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        <Image
          src="/images/stories-background.jpeg"
          alt="Background illustration of storybooks"
          fill
          priority
          className="object-cover opacity-15"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative flex items-center gap-x-1.5 rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <span>Now with AI Story Generation</span>
              <Sparkles className="text-brand-primary h-4 w-4" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create Magical Stories with{" "}
            <span className="text-brand-primary">AI-Powered</span> Storytelling
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Transform your ideas into beautiful storybooks in minutes. Perfect
            for authors, educators, and parents who want to create engaging
            stories with custom characters and AI-generated illustrations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/register" className="gap-x-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#examples">See Examples</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-x-8">
            <div className="flex items-center gap-x-2">
              <Zap className="text-brand-primary h-5 w-5" />
              <span className="text-sm text-gray-600">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <Sparkles className="text-brand-primary h-5 w-5" />
              <span className="text-sm text-gray-600">
                5 free stories per month
              </span>
            </div>
          </div>
        </div>

        {/* Preview Image */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <Image
              src="/images/stories-background.jpeg"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="from-brand-secondary to-brand-tertiary relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
