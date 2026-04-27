import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EDUINTBD. Visit our offices in Dhaka, Chittagong, or Sylhet, or chat with us on WhatsApp for free study-abroad guidance.",
  openGraph: {
    title: "Contact EDUINTBD",
    description:
      "Free study-abroad consultation. WhatsApp, email, or visit our offices.",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
