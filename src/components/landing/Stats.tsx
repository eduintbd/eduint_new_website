"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Building2, Globe, ShieldCheck } from "lucide-react";

const STATS = [
  {
    icon: Building2,
    value: 600,
    suffix: "+",
    label: "Partner Universities",
    note: "Across 26 study destinations",
  },
  {
    icon: Globe,
    value: 26,
    suffix: "",
    label: "Study Destinations",
    note: "AU, CA, US, UK, DE, IE & 20 more",
  },
  {
    icon: Award,
    value: 3,
    suffix: "",
    label: "AI Tools Built-in",
    note: "Matching · Eligibility · GPA Converter",
  },
  {
    icon: ShieldCheck,
    value: 0,
    suffix: "৳",
    label: "Counseling Fee",
    note: "First consultation is always free",
    isStatic: true,
  },
];

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const inc = target / (duration / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= target) {
        setCount(target);
        clearInterval(t);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Stats() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Trusted by students across Bangladesh
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            No inflated numbers. Just honest guidance.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => {
            const { count, ref } = useCountUp(stat.value);
            const displayed = stat.isStatic ? stat.value : count;
            const Icon = stat.icon;
            return (
              <div key={stat.label} ref={ref} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.suffix === "৳"
                    ? `${stat.suffix}${displayed.toLocaleString()}`
                    : `${displayed.toLocaleString()}${stat.suffix}`}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {stat.note}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" /> Registered
            Bangladeshi consultancy
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" /> No upfront
            student fees
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" /> Direct university
            partnerships
          </span>
        </div>
      </div>
    </section>
  );
}
