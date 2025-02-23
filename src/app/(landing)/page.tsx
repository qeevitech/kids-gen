import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { UserBenefitsSection } from "./_components/UserBenefitsSection";
import { HowItWorksSection } from "./_components/HowItWorksSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { CTASection } from "./_components/CTASection";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <UserBenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
