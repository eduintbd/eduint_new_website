"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

export default function Destinations() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="eyebrow text-ink mb-3">Study destinations</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Explore the world&apos;s top destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COUNTRIES.map((country) => (
            <Link
              key={country.code}
              href={`/destinations/${country.code.toLowerCase()}`}
              className="group p-7 bg-white border border-gray-200 hover:border-ink hover:shadow-[0_6px_20px_rgba(10,10,10,0.08)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{country.flagEmoji}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink group-hover:text-eduint-orange transition-colors">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {country.popularFields.slice(0, 3).join(", ")}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{country.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Avg. Tuition: {country.avgTuition}</span>
                <ArrowRight className="h-4 w-4 text-ink opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
