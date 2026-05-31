"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

const STATS = [
  { value: 600, suffix: "+", label: "Partner Universities", note: "Across 27 study destinations" },
  { value: 27, suffix: "", label: "Study Destinations", note: "AU, CA, US, UK, DE, IE, MY & 20 more" },
  { value: 3, suffix: "", label: "AI Tools Built-in", note: "Matching · Eligibility · GPA Converter" },
  { value: 0, suffix: "৳", label: "Counseling Fee", note: "First consultation is always free", isStatic: true },
];

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
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
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Stats() {
  return (
    <section className="py-20 bg-lime">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="eyebrow text-ink">Trusted by students across Bangladesh</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-ink max-w-2xl">
            No inflated numbers. Just honest guidance.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((stat) => {
            const { count, ref } = useCountUp(stat.value);
            const displayed = stat.isStatic ? stat.value : count;
            return (
              <div key={stat.label} ref={ref}>
                <div className="w-[34px] h-[5px] bg-ink mb-4" />
                <p className="text-5xl font-semibold tracking-tight text-ink leading-none">
                  {stat.suffix === "৳" ? `${stat.suffix}${displayed.toLocaleString()}` : `${displayed.toLocaleString()}${stat.suffix}`}
                </p>
                <p className="text-base font-semibold text-ink mt-3">{stat.label}</p>
                <p className="text-sm text-ink/60 mt-1">{stat.note}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-7 border-t border-black/20 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-ink">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Registered Bangladeshi consultancy</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> No upfront student fees</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Direct university partnerships</span>
        </div>
      </div>
    </section>
  );
}
