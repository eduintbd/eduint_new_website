"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const DEFAULT_NUMBER = "8801700000000";
const DEFAULT_TEMPLATE =
  "Hi EDUINTBD, I'd like to know more about studying abroad.";

function prefillForPath(pathname: string): string {
  if (pathname.startsWith("/programs/")) {
    return `Hi EDUINTBD, I'm interested in this program: ${
      typeof window !== "undefined" ? window.location.href : pathname
    }`;
  }
  if (pathname.startsWith("/destinations/")) {
    const slug = pathname.split("/").pop();
    return `Hi EDUINTBD, I'd like guidance about studying in ${slug}.`;
  }
  if (pathname.startsWith("/eligibility")) {
    return "Hi EDUINTBD, I just checked my eligibility and want to speak to a counselor.";
  }
  if (pathname.startsWith("/book")) {
    return "Hi EDUINTBD, I want to book a free counseling session.";
  }
  if (pathname.startsWith("/services")) {
    return "Hi EDUINTBD, I'd like to know about your services.";
  }
  return DEFAULT_TEMPLATE;
}

export default function WhatsAppFab() {
  const pathname = usePathname() ?? "/";
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    DEFAULT_NUMBER;
  const text = encodeURIComponent(prefillForPath(pathname));
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1ebe57] hover:shadow-xl transition-all sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">
        Chat on WhatsApp
      </span>
    </a>
  );
}
