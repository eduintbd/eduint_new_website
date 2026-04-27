import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Programs",
  description: "Your saved/bookmarked study-abroad programs.",
  robots: { index: false, follow: false },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
