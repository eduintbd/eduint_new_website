import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MapPin,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { VISA_REQUIREMENTS, getVisaForCountry } from "@/lib/visa-requirements";
import StickyLeadForm from "@/components/leads/StickyLeadForm";

export function generateStaticParams() {
  return Object.keys(VISA_REQUIREMENTS).map((code) => ({
    country: code.toLowerCase(),
  }));
}

export default async function VisaHubPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const code = slug.toUpperCase();
  const visa = getVisaForCountry(code);
  const countryMeta = COUNTRIES.find((c) => c.code === code);

  if (!visa || !countryMeta) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/destinations/${code.toLowerCase()}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> {countryMeta.name} overview
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{countryMeta.flagEmoji}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Visa Hub
          </p>
          <h1 className="text-3xl font-bold">
            {visa.country} student visa — everything you need
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <Clock className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Processing time</p>
          <p className="text-sm font-semibold">{visa.processingDays}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <DollarSign className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Government fees</p>
          <p className="text-sm font-semibold">{visa.fee}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <MapPin className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-xs text-gray-500">Apply from</p>
          <p className="text-sm font-semibold">Dhaka (BD)</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-5 mb-8">
        <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          {visa.notes}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Document checklist</h2>
        </div>
        <ul className="space-y-2">
          {visa.documents.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-semibold">Common rejection reasons</h2>
        </div>
        <ul className="space-y-2">
          {visa.rejections.map((r) => (
            <li
              key={r}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span className="text-rose-500 mt-1">●</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        <a
          href={visa.embassyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Official immigration site <ExternalLink className="h-4 w-4" />
        </a>
        {visa.appointmentUrl && (
          <a
            href={visa.appointmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Book appointment <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <StickyLeadForm
        source={`/destinations/${code.toLowerCase()}/visa`}
        defaultCountry={code}
        variant="card"
        title={`Get help with your ${visa.country} visa file`}
        subtitle="Free 30-minute review with a visa-trained counselor."
      />

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/tools/visa-mock?country=${code}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          Practice the visa interview →
        </Link>
        <span className="text-gray-400">·</span>
        <Link
          href={`/scholarships?country=${code}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          Scholarships for {visa.country}
        </Link>
      </div>
    </div>
  );
}
