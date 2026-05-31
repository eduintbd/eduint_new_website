"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, FileCheck, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Review = {
  overallScore: number;
  clarity: number;
  specificity: number;
  structure: number;
  grammar: number;
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
  suggestions: string[];
  summary: string;
};

function ScoreBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 rounded-none bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SOPReviewPage() {
  const [text, setText] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (text.length < 100) {
      toast.error("Paste at least 100 characters of your SOP.");
      return;
    }
    setLoading(true);
    setReview(null);
    try {
      const res = await fetch("/api/sop-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Review failed");
      } else {
        setReview(data.review);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0FE9C] text-black text-xs font-medium mb-3">
          <Sparkles className="h-3.5 w-3.5" /> AI SOP Reviewer
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Get your Statement of Purpose reviewed in 30 seconds
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Paste your draft below. Our AI (trained on admissions standards)
          returns scores, strengths, weaknesses, red flags, and concrete
          rewrites.
        </p>
      </div>

      <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-5">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Paste your SOP draft (up to ~6,000 characters will be analysed)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Since childhood I have been fascinated by..."
          className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#E0FE9C]"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {text.length.toLocaleString()} characters
          </span>
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-5 py-2 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Review my SOP
          </button>
        </div>
      </div>

      {review && (
        <div className="mt-8 space-y-6">
          <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Overall verdict</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {review.summary}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{review.overallScore}</p>
                <p className="text-xs text-gray-500">/ 100</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreBar label="Clarity" value={review.clarity} />
              <ScoreBar label="Specificity" value={review.specificity} />
              <ScoreBar label="Structure" value={review.structure} />
              <ScoreBar label="Grammar" value={review.grammar} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-none border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <h3 className="text-sm font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-1.5 text-sm">
                {review.strengths.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-none border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Weaknesses</h3>
              </div>
              <ul className="space-y-1.5 text-sm">
                {review.weaknesses.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>

          {review.redFlags.length > 0 && (
            <div className="rounded-none border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/20 p-4">
              <h3 className="text-sm font-semibold mb-2 text-rose-700 dark:text-rose-300">
                Red flags to remove
              </h3>
              <ul className="space-y-1.5 text-sm">
                {review.redFlags.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="h-4 w-4 text-black dark:text-[#E0FE9C]" />
              <h3 className="text-sm font-semibold">Suggested rewrites</h3>
            </div>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              {review.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want a human review too? Book a free 30-min session with a
              counselor.
            </p>
            <Link
              href="/book?topic=SOP%20review"
              className="inline-flex items-center gap-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-2 text-sm font-semibold uppercase tracking-wide"
            >
              Book a human reviewer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
