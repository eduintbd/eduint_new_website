"use client";

import Link from "next/link";
import {
  Plane,
  Building,
  Home,
  BookOpen,
  Banknote,
  FileCheck,
} from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Visa Assistance",
    description: "Complete visa application support from documentation to interview preparation.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  },
  {
    icon: Building,
    title: "GIC & Banking",
    description: "GIC account setup, foreign exchange, and international banking guidance.",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600",
  },
  {
    icon: Home,
    title: "Accommodation",
    description: "Find student housing, dorms, and off-campus accommodation in your destination.",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  },
  {
    icon: BookOpen,
    title: "Test Preparation",
    description: "IELTS, TOEFL, GRE, and GMAT preparation resources and coaching guidance.",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
  },
  {
    icon: Banknote,
    title: "Financial Planning",
    description: "Scholarship search, education loans, and budget planning for your studies.",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
  },
  {
    icon: FileCheck,
    title: "Application Processing",
    description: "End-to-end application management from SOP writing to submission tracking.",
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600",
  },
];

export default function Services360() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            360&deg; <span className="gradient-text">Solutions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            From program discovery to landing in your dream university — we handle everything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
              >
                <div className={`h-12 w-12 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
