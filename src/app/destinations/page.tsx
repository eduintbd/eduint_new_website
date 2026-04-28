import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Study Destinations",
  description:
    "Explore 27+ study-abroad destinations — from Australia, Canada, USA, UK to Germany, Netherlands, Malaysia, South Korea, and more.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Study <span className="gradient-text">Destinations</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Explore the world&apos;s top study destinations and find the perfect country for your academic journey.
        </p>
      </div>

      <div className="space-y-6">
        {COUNTRIES.map((country) => (
          <Link
            key={country.code}
            href={`/destinations/${country.code.toLowerCase()}`}
            className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center py-8 md:py-0">
                <span className="text-6xl">{country.flagEmoji}</span>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {country.name}
                  </h2>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{country.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span>Avg. Tuition: {country.avgTuition}</span>
                  <span>Living: {country.livingCost}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {country.highlights.map((h) => (
                    <span key={h} className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
