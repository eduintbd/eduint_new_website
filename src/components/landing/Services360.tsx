"use client";

import Link from "next/link";
import { Plane, Building, Home, BookOpen, Banknote, FileCheck } from "lucide-react";

const SERVICES = [
  { icon: Plane, title: "Visa Assistance", description: "Complete visa application support from documentation to interview preparation." },
  { icon: Building, title: "GIC & Banking", description: "GIC account setup, foreign exchange, and international banking guidance." },
  { icon: Home, title: "Accommodation", description: "Find student housing, dorms, and off-campus accommodation in your destination." },
  { icon: BookOpen, title: "Test Preparation", description: "IELTS, TOEFL, GRE, and GMAT preparation resources and coaching guidance." },
  { icon: Banknote, title: "Financial Planning", description: "Scholarship search, education loans, and budget planning for your studies." },
  { icon: FileCheck, title: "Application Processing", description: "End-to-end application management from SOP writing to submission tracking." },
];

export default function Services360() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="eyebrow text-ink mb-3">What we offer</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">360° Solutions</h2>
          <p className="max-w-2xl text-gray-600 text-lg mt-4">
            From program discovery to landing in your dream university — we handle everything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="group p-7 border border-gray-200 hover:border-ink hover:shadow-[0_6px_20px_rgba(10,10,10,0.08)] transition-all">
                <div className="h-12 w-12 bg-lime flex items-center justify-center text-ink mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-4 border-[1.5px] border-gray-300 text-ink text-sm font-semibold uppercase tracking-wide hover:border-ink transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
