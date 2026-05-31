"use client";

import { Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

const PARTNERS = [
  { name: "University of Toronto", country: "Canada", city: "Toronto, Ontario", description: "A global leader in research and teaching, consistently ranked among the world's top 25 universities." },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne, Victoria", description: "Australia's #1 university with world-class programs and a vibrant international community." },
  { name: "University College London", country: "United Kingdom", city: "London", description: "A leading multidisciplinary university in the heart of London, known for pioneering research." },
  { name: "Technical University of Munich", country: "Germany", city: "Munich, Bavaria", description: "Germany's top technical university offering tuition-free programs with global recognition." },
  { name: "University of British Columbia", country: "Canada", city: "Vancouver, BC", description: "A global center for teaching and research, consistently ranked among top 40 universities worldwide." },
  { name: "University of Sydney", country: "Australia", city: "Sydney, NSW", description: "Australia's first university, renowned for academic excellence and graduate employability." },
];

export default function Partners() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="eyebrow text-ink mb-3">Partner institutions</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            600+ universities, 27 destinations
          </h2>
          <p className="max-w-2xl text-gray-600 text-lg mt-4">
            We work with 600+ leading universities across 27 study destinations to bring you the best opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="p-7 bg-white border border-gray-200 hover:border-ink hover:shadow-[0_6px_20px_rgba(10,10,10,0.08)] transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-11 w-11 bg-lime flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink leading-snug">{partner.name}</h3>
                  <p className="text-xs text-gray-500">{partner.city}, {partner.country}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-ink font-semibold text-sm border-b-2 border-lime pb-1 hover:gap-3 transition-all"
          >
            View All Partners <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
