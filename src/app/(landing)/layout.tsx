import { Header } from "@/components/layout/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  );
}
