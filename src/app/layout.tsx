import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MetaPixel from "@/components/MetaPixel";
import PublicChrome from "@/components/layout/PublicChrome";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: {
    default: "EDUINTBD - Your Global Study Partner",
    template: "%s | EDUINTBD",
  },
  description:
    "Education International Bangladesh - AI-powered study abroad consultancy. Find the perfect university program with our advanced matching technology.",
  keywords: ["study abroad", "education consultancy", "Bangladesh", "university matching", "AI education", "IELTS", "scholarship"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "EDUINTBD - Your Global Study Partner",
    description: "AI-powered study abroad consultancy helping Bangladeshi students find their perfect program.",
    url: "https://www.eduintbd.com",
    siteName: "EDUINTBD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <MetaPixel />
        <Providers>
          <PublicChrome>{children}</PublicChrome>
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
