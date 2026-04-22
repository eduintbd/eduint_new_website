"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { GPA_SCALES } from "@/lib/gpa-scales";
import StudentsLikeYou from "@/components/StudentsLikeYou";

type Level = "BACHELOR" | "MASTER" | "PHD" | "DIPLOMA";
type Scale = "SCALE_4" | "SCALE_5" | "SCALE_10" | "PERCENTAGE";
type Verdict = "likely" | "borderline" | "unlikely";

type Result = {
  verdict: Verdict;
  gpa4: number;
  summary: string;
  reasons: string[];
  actions: string[];
};

const STEPS = ["Destination", "Study level", "Academic record", "English"];

const VERDICT_META: Record<
  Verdict,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  likely: {
    label: "Likely admissible",
    color: "text-green-700 dark:text-green-300",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    icon: CheckCircle2,
  },
  borderline: {
    label: "Borderline",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
  },
  unlikely: {
    label: "Needs strengthening",
    color: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
    icon: XCircle,
  },
};

export default function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState<Level | "">("");
  const [gpa, setGpa] = useState("");
  const [gpaScale, setGpaScale] = useState<Scale>("SCALE_4");
  const [ielts, setIelts] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canNext =
    (step === 0 && !!country) ||
    (step === 1 && !!level) ||
    (step === 2 && !!gpa && !!gpaScale) ||
    step === 3;

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          level,
          gpa: Number(gpa),
          gpaScale,
          ielts: ielts ? Number(ielts) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not compute eligibility");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setResult(null);
    setError(null);
  }

  if (result) {
    const meta = VERDICT_META[result.verdict];
    const Icon = meta.icon;
    const countryName =
      COUNTRIES.find((c) => c.code === country)?.name ?? country;
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl border p-6 ${meta.bg}`}>
          <div className="flex items-start gap-3">
            <Icon className={`h-8 w-8 flex-shrink-0 ${meta.color}`} />
            <div>
              <p className={`text-sm font-semibold uppercase tracking-wide ${meta.color}`}>
                {meta.label}
              </p>
              <h1 className="text-2xl font-bold mt-1">
                Your profile for {countryName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Equivalent GPA: <strong>{result.gpa4.toFixed(2)} / 4.0</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="font-semibold mb-2">What this means</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {result.summary}
          </p>
          <ul className="space-y-2 mb-4">
            {result.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <span className="text-gray-400 mt-1">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2 mt-4">Next steps</h3>
          <ul className="space-y-2">
            {result.actions.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/book?country=${country}&topic=${encodeURIComponent(
              `Eligibility review for ${countryName}`
            )}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm font-medium"
          >
            Book free counseling
          </Link>
          <Link
            href={`/register?country=${country}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Save my profile
          </Link>
        </div>

        <button
          onClick={reset}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Start over
        </button>

        <StudentsLikeYou
          country={country}
          level={level || undefined}
          gpa4={result.gpa4}
          title="Bangladeshi students with a similar profile"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Instant eligibility check</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          4 quick questions. No login. Know where you stand in 30 seconds.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6 text-xs">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`h-2 flex-1 rounded-full ${
                i <= step ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
            {i < STEPS.length - 1 && <div className="w-1" />}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 min-h-[280px]">
        {step === 0 && (
          <div>
            <h2 className="font-semibold mb-4">Which country are you targeting?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    country === c.code
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-1">{c.flagEmoji}</div>
                  <div className="text-sm font-medium">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-semibold mb-4">What level do you want to study?</h2>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { v: "BACHELOR", label: "Bachelor's" },
                  { v: "MASTER", label: "Master's" },
                  { v: "PHD", label: "PhD" },
                  { v: "DIPLOMA", label: "Diploma" },
                ] as const
              ).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setLevel(o.v)}
                  className={`p-4 rounded-xl border text-sm font-medium transition-colors ${
                    level === o.v
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold">What's your academic record?</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                GPA scale
              </label>
              <select
                value={gpaScale}
                onChange={(e) => setGpaScale(e.target.value as Scale)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              >
                {GPA_SCALES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Your GPA or percentage
              </label>
              <input
                type="number"
                step="0.01"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 3.5"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold">IELTS band score (optional)</h2>
            <p className="text-xs text-gray-500">
              Skip if you haven't taken IELTS yet — we'll still estimate.
            </p>
            <input
              type="number"
              step="0.5"
              min={0}
              max={9}
              value={ielts}
              onChange={(e) => setIelts(e.target.value)}
              placeholder="e.g. 6.5"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Check my eligibility
          </button>
        )}
      </div>
    </div>
  );
}
