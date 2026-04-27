import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Webinars",
  description:
    "Join university fairs, webinars, and admission sessions. Meet university representatives, learn about scholarships, and get visa guidance — all free.",
  openGraph: {
    title: "Study Abroad Events | EDUINTBD",
    description:
      "University fairs, scholarship webinars, and admission sessions.",
    type: "website",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
