import { Building2, Globe, Award, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Partner Institutions",
  description: "Explore our 600+ partner universities and institutions across 27 study destinations.",
};

const FEATURED_PARTNERS = [
  { name: "University of Toronto", country: "Canada", city: "Toronto", ranking: 21, programs: 700 },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", ranking: 33, programs: 400 },
  { name: "University College London", country: "United Kingdom", city: "London", ranking: 9, programs: 500 },
  { name: "Technical University of Munich", country: "Germany", city: "Munich", ranking: 37, programs: 180 },
  { name: "University of British Columbia", country: "Canada", city: "Vancouver", ranking: 35, programs: 350 },
  { name: "University of Sydney", country: "Australia", city: "Sydney", ranking: 19, programs: 400 },
  { name: "Imperial College London", country: "United Kingdom", city: "London", ranking: 6, programs: 300 },
  { name: "RWTH Aachen University", country: "Germany", city: "Aachen", ranking: 87, programs: 150 },
  { name: "University of Waterloo", country: "Canada", city: "Waterloo", ranking: 112, programs: 200 },
  { name: "Trinity College Dublin", country: "Ireland", city: "Dublin", ranking: 81, programs: 250 },
  { name: "MIT", country: "United States", city: "Cambridge", ranking: 1, programs: 150 },
  { name: "University of Queensland", country: "Australia", city: "Brisbane", ranking: 43, programs: 350 },
];

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-display uppercase tracking-tight">
          Partner <span className="text-gray-900 dark:text-white">Institutions</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          We partner with 600+ leading universities across 27 study destinations to bring you the best educational opportunities worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_PARTNERS.map((partner) => (
          <div
            key={partner.name}
            className="p-6 rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-none bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{partner.name}</h3>
                <p className="text-xs text-gray-500">{partner.city}, {partner.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>#{partner.ranking} World</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{partner.programs}+ Programs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          And 590+ more institutions across 27 study destinations
        </p>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E0FE9C] text-black font-medium rounded-none hover:bg-[#CDEE78] transition-colors uppercase tracking-wide font-semibold"
        >
          Browse All Programs <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
