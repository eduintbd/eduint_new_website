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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sky-200/30 dark:bg-sky-900/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          {t("hero.badge")}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {t("hero.title")}
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-10">
          {t("hero.subtitle")}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mx-auto max-w-xl mb-8">
          <div className="flex rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/eligibility"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("hero.ctaEligibility")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Sparkles className="h-4 w-4" /> {t("hero.ctaBook")}
          </Link>
        </div>
      </div>
    </section>
  );
}
