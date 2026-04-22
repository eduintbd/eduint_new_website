"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProgramSearch from "@/components/programs/ProgramSearch";
import ProgramFilters from "@/components/programs/ProgramFilters";
import ProgramGrid from "@/components/programs/ProgramGrid";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { SlidersHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ProgramWithUniversity } from "@/types";

const DEFAULT_FILTERS = {
  country: "",
  level: "",
  field: "",
  maxBudget: "",
  scholarshipOnly: false,
};

function ProgramsContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.country) params.set("country", filters.country);
    if (filters.level) params.set("level", filters.level);
    if (filters.field) params.set("field", filters.field);
    if (filters.maxBudget) params.set("maxBudget", filters.maxBudget);
    if (filters.scholarshipOnly) params.set("scholarshipOnly", "true");
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/programs?${params}`);
      const data = await res.json();
      setPrograms(data.programs ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load programs");
    }
    setLoading(false);
  }, [search, filters, page]);

  useEffect(() => {
    const timer = setTimeout(fetchPrograms, 300);
    return () => clearTimeout(timer);
  }, [fetchPrograms]);

  const handleToggleSave = async (programId: string) => {
    if (!session) {
      toast.error("Please sign in to save programs");
      return;
    }
    try {
      const res = await fetch(`/api/programs/${programId}/save`, { method: "POST" });
      const data = await res.json();
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(programId);
        else next.delete(programId);
        return next;
      });
      toast.success(data.saved ? "Program saved" : "Program removed");
    } catch {
      toast.error("Failed to save program");
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <ProgramSearch value={search} onChange={setSearch} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <ProgramFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <ProgramGrid
            programs={programs}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            loading={loading}
            draggable
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Programs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover 140,000+ programs across the world&apos;s top universities
        </p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <ProgramsContent />
      </Suspense>
    </div>
  );
}
