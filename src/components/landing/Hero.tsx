"use client";

import Link from "next/link";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { t } = useLocale();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/programs?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Full-bleed photo + scrim. Replace /hero.jpg with your own image in /public. */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.jpg" alt="" className="h-full w-full object-cover opacity-40" style={{ objectPosition: "center 30%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.62) 100%)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-lime text-ink text-xs font-bold uppercase tracking-[0.12em] px-3 py-2 mb-6">
            <Sparkles className="h-4 w-4" /> {t("hero.badge")}
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.98] text-white">
            {t("hero.title")}
          </h1>

          <p className="max-w-xl text-lg text-white/85 mt-7 mb-9 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mb-7">
            <div className="flex bg-white border-[3px] border-lime overflow-hidden">
              <div className="flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-ink text-white text-sm font-semibold uppercase tracking-wide hover:bg-black transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-3 px-7 py-4 bg-lime text-ink text-sm font-semibold uppercase tracking-wide hover:bg-lime-deep transition-colors"
            >
              {t("hero.ctaEligibility")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-7 py-4 border-[1.5px] border-white/25 text-white text-sm font-semibold uppercase tracking-wide hover:border-lime hover:text-lime transition-colors"
            >
              <Sparkles className="h-4 w-4" /> {t("hero.ctaBook")}
            </Link>
          </div>
        </div>
      </div>

      {/* Lime ticker strip */}
      <div className="relative bg-lime overflow-hidden whitespace-nowrap">
        <div className="inline-block py-3 animate-ticker text-sm font-bold uppercase tracking-[0.08em] text-ink">
          {[0, 1].map((k) => (
            <span key={k}>
              {["600+ Partner Universities", "27 Study Destinations", "1,400+ Programs", "0৳ Counseling Fee", "AI Matching", "Visa Success"].map((s) => (
                <span key={s} className="mx-7">{s} <span className="text-eduint-orange">✦</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
