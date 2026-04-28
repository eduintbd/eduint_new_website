import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "Explore fully-funded scholarships, merit awards, and need-based grants for Bangladeshi students applying abroad. Filter by country, level, and amount.",
  openGraph: {
    title: "Scholarships for Bangladeshi Students | EDUINTBD",
    description:
      "Fully-funded scholarships and grants across 27 study destinations.",
    type: "website",
  },
};

export default function ScholarshipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
