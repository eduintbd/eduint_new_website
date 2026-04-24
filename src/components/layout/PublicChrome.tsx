"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

/**
 * Wraps the public-facing page chrome (navbar + footer + WhatsApp FAB).
 * Hidden on /admin routes — the admin shell provides its own layout.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <WhatsAppFab />
    </>
  );
}
