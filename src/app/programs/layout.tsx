import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Programs",
  description:
    "Browse 1,400+ undergraduate, master's, and PhD programs from 600+ partner universities across 26 study destinations. Filter by country, field, and budget.",
  openGraph: {
    title: "Browse Programs | EDUINTBD",
    description:
      "1,400+ programs from 600+ partner universities across 26 destinations.",
    type: "website",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
