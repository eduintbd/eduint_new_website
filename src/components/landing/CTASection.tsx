"use client";

import Link from "next/link";
import { GraduationCap, Handshake, Building2 } from "lucide-react";

const PATHWAYS = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Create your free profile, get AI-powered program matches, and start your study abroad journey today.",
    cta: "Get Started Free",
    href: "/register",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: Handshake,
    title: "Recruitment Partners",
    description: "Access our AI matching technology to connect students with the perfect programs efficiently.",
    cta: "Partner With Us",
    href: "/contact",
    color: "from-emerald-600 to-emerald-700",
  },
  {
    icon: Building2,
    title: "Partner Schools",
    description: "Connect with qualified international students actively seeking programs at your institution.",
    cta: "List Your School",
    href: "/contact",
    color: "from-purple-600 to-purple-700",
  },
];

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Whether you&apos;re a student, recruitment partner, or institution — we have the right solution for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <div
                key={pathway.title}
                className="text-center p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br ${pathway.color} text-white mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {pathway.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {pathway.description}
                </p>
                <Link
                  href={pathway.href}
                  className={`inline-flex items-center px-5 py-2.5 bg-gradient-to-r ${pathway.color} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
                >
                  {pathway.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
