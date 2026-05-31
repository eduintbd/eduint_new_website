"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

export default function Destinations() {
  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="eyebrow text-sm text-gray-500 dark:text-gray-400 mb-3">Destinations</p>
          <h2 className="display-title text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Study Destinations
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-gray-400">
            Explore programs across the world&apos;s top study destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES.map((country) => (
            <Link
              key={country.code}
              href={`/destinations/${country.code.toLowerCase()}`}
              className="group p-6 rounded-none border border-gray-200 dark:border-gray-800 hover:border-[#E0FE9C] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{country.flagEmoji}</span>
                <div>
                  <h3 className="font-display uppercase text-base font-semibold tracking-wide text-gray-900 dark:text-white transition-colors">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {country.popularFields.slice(0, 3).join(", ")}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {country.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Avg. Tuition: {country.avgTuition}</span>
                <ArrowRight className="h-4 w-4 text-black dark:text-[#E0FE9C] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
