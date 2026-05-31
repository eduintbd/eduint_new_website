"use client";

import Link from "next/link";
import { Brain, Target, Zap, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Smart Profile Analysis",
    description: "Our AI analyzes your GPA, test scores, budget, and career goals to understand your unique profile.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Get ranked program recommendations based on compatibility score and acceptance probability.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Receive personalized recommendations in seconds, not weeks. Skip the manual research.",
  },
  {
    icon: Shield,
    title: "Trusted Guidance",
    description: "Every recommendation is backed by real data from 600+ partner universities across 27 study destinations.",
  },
];

export default function AIMatching() {
  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="eyebrow text-sm text-gray-500 dark:text-gray-400 mb-3">AI Matching</p>
          <h2 className="display-title text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            AI-Powered University Matching
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-gray-400">
            Our AI matching system analyzes your profile against 1,400+ programs from 600+ universities to find your perfect fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-none bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 hover:border-[#E0FE9C] transition-colors"
              >
                <div className="h-11 w-11 rounded-none bg-[#E0FE9C] flex items-center justify-center text-black mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display uppercase text-base font-semibold tracking-wide text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E0FE9C] text-black text-sm font-semibold uppercase tracking-wide rounded-none hover:bg-[#CDEE78] transition-colors"
          >
            Try AI Matching Free
          </Link>
        </div>
      </div>
    </section>
  );
}
