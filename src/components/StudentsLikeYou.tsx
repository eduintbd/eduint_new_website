"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

type Story = {
  id: string;
  initials: string;
  country: string;
  program: string;
  university: string;
  field: string;
  level: string;
  gpa4: number;
  ielts: number | null;
  year: number;
  scholarship: string | null;
  quote: string;
};

type Props = {
  country?: string;
  field?: string;
  level?: string;
  gpa4?: number;
  title?: string;
};

export default function StudentsLikeYou({
  country,
  field,
  level,
  gpa4,
  title = "Bangladeshi students like you",
}: Props) {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (field) params.set("field", field);
    if (level) params.set("level", level);
    if (typeof gpa4 === "number") params.set("gpa", String(gpa4));
    fetch(`/api/alumni?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setStories(d.stories ?? []));
  }, [country, field, level, gpa4]);

  if (stories.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-blue-600" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {stories.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-gray-100 dark:border-gray-800 p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
                {s.initials}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {s.country} · {s.year}
                </p>
                <p className="text-xs text-gray-500">
                  GPA {s.gpa4.toFixed(2)}/4.0
                  {s.ielts ? ` · IELTS ${s.ielts}` : ""}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium">{s.program}</p>
            <p className="text-xs text-gray-500">{s.university}</p>
            {s.scholarship && (
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                🏆 {s.scholarship}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              "{s.quote}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
