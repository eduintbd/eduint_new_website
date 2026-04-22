"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProgramCompare from "@/components/programs/ProgramCompare";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ProgramWithUniversity } from "@/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/programs/${id}`);
            const data = await res.json();
            return data.program;
          })
        );
        setPrograms(results.filter(Boolean));
      } catch {
        console.error("Failed to load programs for comparison");
      }
      setLoading(false);
    }
    loadPrograms();
  }, [searchParams]);

  const handleRemove = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  return loading ? (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  ) : (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <ProgramCompare programs={programs} onRemove={handleRemove} />
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/programs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programs
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Programs</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Compare programs side by side to find your best fit
      </p>

      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
