"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ProgramSearch from "@/components/programs/ProgramSearch";
import ProgramFilters from "@/components/programs/ProgramFilters";
import { SlidersHorizontal, Loader2 } from "lucide-react";

type FiltersState = {
  country: string;
  level: string;
  field: string;
  maxBudget: string;
  scholarshipOnly: boolean;
};

const EMPTY_FILTERS: FiltersState = {
  country: "",
  level: "",
  field: "",
  maxBudget: "",
  scholarshipOnly: false,
};

interface Props {
  initialSearch: string;
  initialFilters: FiltersState;
  children: React.ReactNode;
}

export default function ProgramsToolbar({ initialSearch, initialFilters, children }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [pending, startTransition] = useTransition();

  // Track values we just pushed so we don't overwrite local state
  // when those same values arrive back as new props.
  const expectedSearch = useRef(initialSearch);
  const expectedFilters = useRef(initialFilters);

  // External URL changes (browser back/forward, link clicks): sync local state.
  useEffect(() => {
    if (initialSearch !== expectedSearch.current) {
      setSearch(initialSearch);
      expectedSearch.current = initialSearch;
    }
  }, [initialSearch]);

  useEffect(() => {
    const f = initialFilters;
    const e = expectedFilters.current;
    if (
      f.country !== e.country ||
      f.level !== e.level ||
      f.field !== e.field ||
      f.maxBudget !== e.maxBudget ||
      f.scholarshipOnly !== e.scholarshipOnly
    ) {
      setFilters(f);
      expectedFilters.current = f;
    }
  }, [initialFilters]);

  const pushUrl = (nextSearch: string, nextFilters: FiltersState) => {
    expectedSearch.current = nextSearch;
    expectedFilters.current = nextFilters;
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextFilters.country) params.set("country", nextFilters.country);
    if (nextFilters.level) params.set("level", nextFilters.level);
    if (nextFilters.field) params.set("field", nextFilters.field);
    if (nextFilters.maxBudget) params.set("maxBudget", nextFilters.maxBudget);
    if (nextFilters.scholarshipOnly) params.set("scholarshipOnly", "true");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/programs?${qs}` : "/programs", { scroll: false });
    });
  };

  // Debounce search updates to the URL
  useEffect(() => {
    if (search === expectedSearch.current) return;
    const t = setTimeout(() => pushUrl(search, filters), 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFiltersChange = (next: FiltersState) => {
    setFilters(next);
    pushUrl(search, next);
  };

  const onReset = () => {
    setFilters(EMPTY_FILTERS);
    pushUrl(search, EMPTY_FILTERS);
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <ProgramSearch value={search} onChange={setSearch} />
          {pending && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-black dark:text-[#E0FE9C]" />
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-3 rounded-none border border-gray-200 dark:border-gray-700 text-sm font-medium"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-24 rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <ProgramFilters filters={filters} onChange={onFiltersChange} onReset={onReset} />
          </div>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
