import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Connect with fellow Bangladeshi students studying abroad. Ask questions, share experiences, and get peer-reviewed advice.",
  robots: { index: false, follow: true },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
