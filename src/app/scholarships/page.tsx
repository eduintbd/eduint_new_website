"use client";

import { useEffect, useState } from "react";
import { Award, ExternalLink, Filter, Loader2, Star } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

type Scholarship = {
  id: string;
  name: string;
  provider: string;
  country: string;
  level: string;
  field: string | null;
  amount: string;
  amountValue: number | null;
  deadline: string | null;
  eligibility: string | null;
  link: string | null;
  featured: boolean;
};

const LEVELS = ["ANY", "BACHELOR", "MASTER", "PHD"];
const FIELDS = ["ANY", "ENGINEERING", "CS", "BUSINESS", "SCIENCE"];
const AMOUNT_TIERS = [
  { label: "Any amount", value: 0 },
  { label: "$5k+", value: 5000 },
  { label: "$20k+", value: 20000 },
  { label: "$50k+ (full rides)", value: 50000 },
];

export default function ScholarshipsPage() {
  const [country, setCountry] = useState("ALL");
  const [level, setLevel] = useState("ANY");
  const [field, setField] = useState("ANY");
  const [minAmount, setMinAmount] = useState(0);
  const [rows, setRows] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({
      country,
      level,
      field,
      minAmount: String(minAmount),
    });
    setLoading(true);
    fetch(`/api/scholarships?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setRows(d.scholarships ?? []))
      .finally(() => setLoading(false));
  }, [country, level, field, minAmount]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-3">
          <Award className="h-3.5 w-3.5" /> {rows.length}+ real scholarships
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Scholarships for Bangladeshi students
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Hand-picked funding opportunities across Australia, Canada, US, UK,
          Germany, Ireland, and global programs. Filter by amount, level, and
          country.
        </p>
      </div>

      <div className="mb-6 rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-medium text-gray-500">
          <Filter className="h-3.5 w-3.5" /> Filter
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm"
          >
            <option value="ALL">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
            <option value="GLOBAL">🌍 Global</option>
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l === "ANY" ? "Any level" : l}
              </option>
            ))}
          </select>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm"
          >
            {FIELDS.map((f) => (
              <option key={f} value={f}>
                {f === "ANY" ? "Any field" : f}
              </option>
            ))}
          </select>
          <select
            value={minAmount}
            onChange={(e) => setMinAmount(Number(e.target.value))}
            className="rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm"
          >
            {AMOUNT_TIERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-black dark:text-[#E0FE9C]" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-16">
          No scholarships match these filters. Try widening your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((s) => (
            <div
              key={s.id}
              className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {s.name}
                </h3>
                {s.featured && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {s.provider}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-none bg-[#E0FE9C] text-black">
                  {s.country}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-none bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {s.level}
                </span>
                {s.field && s.field !== "ANY" && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-none bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {s.field}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-green-700 dark:text-green-400">
                {s.amount}
              </p>
              {s.deadline && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Deadline: <strong>{s.deadline}</strong>
                </p>
              )}
              {s.eligibility && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {s.eligibility}
                </p>
              )}
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-black dark:text-[#E0FE9C] hover:underline"
                >
                  Official page <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
