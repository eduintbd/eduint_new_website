"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/Providers";
import { useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  MessageSquare,
  BookmarkCheck,
  FileText,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/context";

import type { DictKey } from "@/lib/i18n/dicts";

const NAV_LINKS: { href: string; key: DictKey }[] = [
  { href: "/programs", key: "nav.programs" },
  { href: "/eligibility", key: "nav.eligibility" },
  { href: "/services", key: "nav.services" },
  { href: "/destinations", key: "nav.destinations" },
  { href: "/blog", key: "nav.blog" },
  { href: "/about", key: "nav.about" },
];

export default function Navbar() {
  const { data: session } = useSession();
  // theme toggle wiring kept for compatibility; chrome stays brand-black
  useTheme();
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[88px] items-center justify-between">
          {/* Logo — the full picture mark */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/eduint-logo.png" alt="EDUINT — Your Global Intelligence Partner" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-lime transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === "en" ? "bn" : "en")}
              className="hidden sm:inline-flex items-center gap-1 p-2 text-white/70 hover:text-white transition-colors text-xs font-medium"
              aria-label="Toggle language"
              title={locale === "en" ? "Switch to Bangla" : "Switch to English"}
            >
              <Languages className="h-4 w-4" />
              {locale === "en" ? "বাংলা" : "EN"}
            </button>

            {session ? (
              <>
                <Link
                  href="/chat"
                  className="hidden sm:flex p-2 text-white/70 hover:text-white transition-colors"
                  aria-label="AI Chat"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-white/10 transition-colors"
                  >
                    <div className="h-9 w-9 bg-lime flex items-center justify-center text-ink text-sm font-bold">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link href="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <BookmarkCheck className="h-4 w-4" /> Saved Programs
                      </Link>
                      <Link href="/documents" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <FileText className="h-4 w-4" /> Documents
                      </Link>
                      <button onClick={() => signOut()} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-lime transition-colors">
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/book"
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-ink bg-lime hover:bg-lime-deep transition-colors whitespace-nowrap"
                >
                  {t("nav.book")}
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/80 hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-white/10 bg-black",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              {t(link.key)}
            </Link>
          ))}
          <button
            onClick={() => setLocale(locale === "en" ? "bn" : "en")}
            className="w-full text-left px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            {locale === "en" ? "🇧🇩 বাংলা" : "🇬🇧 English"}
          </button>
          {!session && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-white">
                Sign In
              </Link>
              <Link href="/book" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase tracking-wide text-ink bg-lime text-center">
                Book Free Call
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
