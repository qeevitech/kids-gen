import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Inter, Outfit, Gaegu } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Modals } from "@/components/modals";
import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const gaegu = Gaegu({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-gaegu",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${outfit.variable} ${gaegu.variable} font-body`}
        >
          <Providers>
            <Toaster />
            <Modals />
            <SubscriptionAlert />
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
