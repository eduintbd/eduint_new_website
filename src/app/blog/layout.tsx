import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Abroad Blog",
  description:
    "Visa guides, scholarship deep-dives, application tips, and destination breakdowns for Bangladeshi students planning to study abroad.",
  openGraph: {
    title: "EDUINTBD Blog — Study Abroad Insights",
    description:
      "Expert guides on visas, scholarships, and applications for Bangladeshi students.",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
