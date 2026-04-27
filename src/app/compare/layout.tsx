import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Programs",
  description:
    "Compare up to 4 study-abroad programs side-by-side: tuition, scholarships, intake dates, language requirements, and post-study work options.",
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
