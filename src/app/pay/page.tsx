import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  FileCheck,
  Sparkles,
  Video,
} from "lucide-react";
import StickyLeadForm from "@/components/leads/StickyLeadForm";

export const metadata = {
  title: "Premium Services",
  description:
    "Paid consulting, SOP review, and visa coaching — available soon.",
};

const PACKAGES = [
  {
    icon: Video,
    name: "Deep-dive counseling",
    price: "৳2,500",
    pitch:
      "90-minute 1-on-1 with a senior counselor. Your full profile analysed, 10-program shortlist, funding plan.",
    bullets: [
      "Senior counselor, not a junior",
      "Written shortlist delivered after",
      "Free 15-min follow-up in 30 days",
    ],
  },
  {
    icon: FileCheck,
    name: "SOP package (3 drafts)",
    price: "৳4,500",
    pitch:
      "We review and rewrite your Statement of Purpose across 3 rounds. Admissions-grade output.",
    bullets: [
      "Ex-admissions officer reviewer",
      "3 round revision, track changes",
      "Final polished version in 5 days",
    ],
  },
  {
    icon: Sparkles,
    name: "Visa interview coaching",
    price: "৳3,000",
    pitch:
      "Two 45-min mock interview sessions with country-specific questions. Guaranteed rehearsal of red-flag topics.",
    bullets: [
      "Country-specific officer role-play",
      "Recording + written feedback",
      "Covers finances, ties, post-study plan",
    ],
  },
  {
    icon: BadgeCheck,
    name: "End-to-end application",
    price: "৳15,000+",
    pitch:
      "Full retainer: shortlisting, applications, SOP, LORs, visa file, and pre-departure — all handled.",
    bullets: [
      "Single point of contact",
      "Document preparation & review",
      "Visa file + embassy prep included",
    ],
  },
];

export default function PayPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-3">
          <Clock className="h-3.5 w-3.5" /> Paid services launching soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Premium counseling — opt-in only
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Free counseling covers 90% of what most students need. For those who
          want more, we offer these paid packages. Register interest below —
          we'll launch with pricing in your currency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {PACKAGES.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">from</p>
                  <p className="text-xl font-bold">{p.price}</p>
                </div>
              </div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {p.pitch}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <StickyLeadForm
        source="/pay"
        variant="card"
        title="Reserve your seat — notify me at launch"
        subtitle="We'll email you the day pricing goes live (expected Q3 2026). No charges now."
      />

      <p className="mt-4 text-center text-xs text-gray-400">
        Paid services will use SSLCommerz / bKash / card at launch. Until then,{" "}
        <Link href="/book" className="text-blue-600 hover:underline">
          free counseling
        </Link>{" "}
        is still the best way to get started.
      </p>
    </div>
  );
}
