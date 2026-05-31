"use client";

import Link from "next/link";
import { Brain, Target, Zap, Shield } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "Smart Profile Analysis", description: "Our AI analyzes your GPA, test scores, budget, and career goals to understand your unique profile." },
  { icon: Target, title: "Precision Matching", description: "Get ranked program recommendations based on compatibility score and acceptance probability." },
  { icon: Zap, title: "Instant Results", description: "Receive personalized recommendations in seconds, not weeks. Skip the manual research." },
  { icon: Shield, title: "Trusted Guidance", description: "Every recommendation is backed by real data from 600+ partner universities across 27 study destinations." },
];

export default function AIMatching() {
  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow text-lime mb-4">The matching engine</p>
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
            AI-Powered University Matching
          </h2>
          <p className="max-w-2xl text-white/65 text-lg mt-5">
            Our AI matching system analyzes your profile against 1,400+ programs from 600+ universities to find your perfect fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="p-7 border border-white/15 h-full">
                <div className="h-12 w-12 bg-lime flex items-center justify-center text-ink mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-7 py-4 bg-lime text-ink text-sm font-semibold uppercase tracking-wide hover:bg-lime-deep transition-colors"
          >
            Try AI Matching Free
          </Link>
        </div>
      </div>
    </section>
  );
}
