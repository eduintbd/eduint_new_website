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
    description: "Every recommendation is backed by real data from 1,500+ partner universities worldwide.",
  },
];

export default function AIMatching() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered <span className="gradient-text">University Matching</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            The world&apos;s most advanced AI matching system analyzes your profile against 140,000+ programs to find your perfect fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try AI Matching Free
          </Link>
        </div>
      </div>
    </section>
  );
}
