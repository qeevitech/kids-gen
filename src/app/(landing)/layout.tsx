import { Header } from "@/components/layout/header";
import { FooterSection } from "./_components/FooterSection";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">{children}</main>
      <FooterSection />
    </div>
  );
}
