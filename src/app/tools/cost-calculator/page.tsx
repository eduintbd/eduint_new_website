"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Info } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { COST_DATA } from "@/lib/cost-data";

const BDT_PER_USD = 120; // approximate — consultants should update quarterly

type Scenario = "low" | "mid" | "high";

function pick(range: [number, number], s: Scenario): number {
  const [lo, hi] = range;
  if (s === "low") return lo;
  if (s === "high") return hi;
  return Math.round((lo + hi) / 2);
}

function fmtUsd(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtBdt(usd: number) {
  return `৳${Math.round(usd * BDT_PER_USD).toLocaleString()}`;
}

export default function CostCalculatorPage() {
  const [country, setCountry] = useState("CA");
  const [scenario, setScenario] = useState<Scenario>("mid");
  const [years, setYears] = useState(2);
  const [scholarship, setScholarship] = useState(0);

  const data = COST_DATA[country];

  const breakdown = useMemo(() => {
    const tuition = pick(data.tuition, scenario) * years;
    const accommodation = pick(data.accommodation, scenario) * years;
    const living = pick(data.living, scenario) * years;
    const insurance = data.insurance * years;
    const upfrontProof = data.upfrontProof;
    const scholarshipAmount = scholarship;
    const subtotal = tuition + accommodation + living + insurance;
    const total = Math.max(0, subtotal - scholarshipAmount);
    return {
      tuition,
      accommodation,
      living,
      insurance,
      upfrontProof,
      scholarshipAmount,
      total,
    };
  }, [data, scenario, years, scholarship]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-3">
          <Calculator className="h-3.5 w-3.5" /> Study-cost estimator
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          How much will studying abroad actually cost?
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Approximate annual costs in USD with optional BDT conversion. Use
          scenario sliders to plan conservatively or generously.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Destination
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Program length (years)
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Scenario</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: "low", label: "Conservative" },
                  { v: "mid", label: "Mid-range" },
                  { v: "high", label: "Premium" },
                ] as const
              ).map((s) => (
                <button
                  key={s.v}
                  onClick={() => setScenario(s.v)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border ${
                    scenario === s.v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Scholarship you already have (USD)
            </label>
            <input
              type="number"
              min={0}
              value={scholarship}
              onChange={(e) =>
                setScholarship(Math.max(0, Number(e.target.value)))
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              placeholder="0"
            />
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-xs text-blue-900 dark:text-blue-200 flex gap-2">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{data.note}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="font-semibold mb-4">Total estimate</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Tuition", breakdown.tuition],
              ["Accommodation", breakdown.accommodation],
              ["Living costs", breakdown.living],
              ["Health insurance", breakdown.insurance],
            ].map(([label, val]) => (
              <div
                key={label as string}
                className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {label}
                </span>
                <span className="font-medium">{fmtUsd(val as number)}</span>
              </div>
            ))}
            {breakdown.scholarshipAmount > 0 && (
              <div className="flex justify-between pb-1 text-green-700 dark:text-green-400">
                <span>Less scholarship</span>
                <span>- {fmtUsd(breakdown.scholarshipAmount)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total over {years} year{years > 1 ? "s" : ""}
              </span>
              <div className="text-right">
                <p className="text-2xl font-bold">{fmtUsd(breakdown.total)}</p>
                <p className="text-xs text-gray-500">
                  ≈ {fmtBdt(breakdown.total)}
                </p>
              </div>
            </div>
          </div>

          {breakdown.upfrontProof > 0 && (
            <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-900 dark:text-amber-200">
              Plus you'll need to show <strong>{fmtUsd(breakdown.upfrontProof)}</strong>{" "}
              (≈ {fmtBdt(breakdown.upfrontProof)}) as a blocked account / GIC /
              maintenance proof at visa stage.
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href={`/scholarships?country=${country}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-medium"
            >
              Find scholarships
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Plan with a counselor
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-400">
        Estimates only. Actual fees vary by university and city. BDT conversion
        uses ৳{BDT_PER_USD}/USD.
      </p>
    </div>
  );
}
