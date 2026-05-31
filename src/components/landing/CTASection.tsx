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
  },
  {
    icon: Handshake,
    title: "Recruitment Partners",
    description: "Access our AI matching technology to connect students with the perfect programs efficiently.",
    cta: "Partner With Us",
    href: "/contact",
  },
  {
    icon: Building2,
    title: "Partner Schools",
    description: "Connect with qualified international students actively seeking programs at your institution.",
    cta: "List Your School",
    href: "/contact",
  },
];

export default function CTASection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="eyebrow text-ink mb-3">Get started</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-4">
            Ready to get started?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Whether you&apos;re a student, recruitment partner, or institution — we have the right solution for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <div
                key={pathway.title}
                className="flex flex-col items-start p-9 bg-white border border-gray-200 hover:border-ink hover:shadow-[0_6px_20px_rgba(10,10,10,0.08)] transition-all"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 bg-ink text-lime mb-5">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3">{pathway.title}</h3>
                <p className="text-sm text-gray-600 mb-7 flex-1">{pathway.description}</p>
                <Link
                  href={pathway.href}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-lime text-ink text-sm font-semibold uppercase tracking-wide hover:bg-lime-deep transition-colors"
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
