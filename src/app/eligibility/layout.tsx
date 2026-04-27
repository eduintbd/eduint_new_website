import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eligibility Checker",
  description:
    "Check your eligibility for studying abroad in 4 simple steps. Get instant feedback on academic requirements, English proficiency, and visa criteria.",
  openGraph: {
    title: "Free Eligibility Checker | EDUINTBD",
    description:
      "Check your study-abroad eligibility in 4 steps. Free, instant, no signup required.",
    type: "website",
  },
};

export default function EligibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
