import { COUNTRIES } from "@/lib/countries";
import Link from "next/link";
import { ArrowLeft, MapPin, DollarSign, BookOpen, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyLeadForm from "@/components/leads/StickyLeadForm";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: code } = await params;
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase());
  if (!country) return { title: "Destination not found" };
  return {
    title: `Study in ${country.name}`,
    description: `${country.description} Tuition: ${country.avgTuition}. Living: ${country.livingCost}.`,
    openGraph: {
      title: `Study in ${country.name} | EDUINTBD`,
      description: country.description,
      type: "article",
    },
  };
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: code } = await params;
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase());

  if (!country) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/destinations"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All Destinations
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{country.flagEmoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Study in {country.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know about studying in {country.name}
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{country.description}</p>
      </div>

      {/* Key highlights */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
        <div className="space-y-3">
          {country.highlights.map((h) => (
            <div key={h} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{h}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Costs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-semibold mb-1">Average Tuition</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{country.avgTuition}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <MapPin className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-semibold mb-1">Living Costs</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{country.livingCost}</p>
        </div>
      </div>

      {/* Popular Fields */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Popular Fields of Study</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {country.popularFields.map((field) => (
            <span key={field} className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
              {field}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/programs?country=${country.code}`}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Programs in {country.name}
        </Link>
        <Link
          href={`/destinations/${country.code.toLowerCase()}/visa`}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {country.name} Visa Hub
        </Link>
      </div>

      {/* Lead capture */}
      <div className="mt-12">
        <StickyLeadForm
          source={`/destinations/${country.code.toLowerCase()}`}
          defaultCountry={country.code}
          variant="card"
          title={`Planning to study in ${country.name}?`}
          subtitle="Free counseling — visa, scholarship, and application guidance."
        />
      </div>
    </div>
  );
}
