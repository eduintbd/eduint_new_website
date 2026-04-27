"use client";

import { Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

const PARTNERS = [
  {
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto, Ontario",
    description: "A global leader in research and teaching, consistently ranked among the world's top 25 universities.",
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne, Victoria",
    description: "Australia's #1 university with world-class programs and a vibrant international community.",
  },
  {
    name: "University College London",
    country: "United Kingdom",
    city: "London",
    description: "A leading multidisciplinary university in the heart of London, known for pioneering research.",
  },
  {
    name: "Technical University of Munich",
    country: "Germany",
    city: "Munich, Bavaria",
    description: "Germany's top technical university offering tuition-free programs with global recognition.",
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    city: "Vancouver, BC",
    description: "A global center for teaching and research, consistently ranked among top 40 universities worldwide.",
  },
  {
    name: "University of Sydney",
    country: "Australia",
    city: "Sydney, NSW",
    description: "Australia's first university, renowned for academic excellence and graduate employability.",
  },
];

export default function Partners() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Partner <span className="gradient-text">Institutions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            We work with 600+ leading universities across 26 study destinations to bring you the best opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{partner.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{partner.city}, {partner.country}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{partner.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View All Partners <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
