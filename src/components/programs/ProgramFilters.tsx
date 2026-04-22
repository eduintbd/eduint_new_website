"use client";

import { COUNTRIES } from "@/lib/countries";
import { STUDY_LEVELS, STUDY_FIELDS } from "@/lib/utils";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

interface ProgramFiltersProps {
  filters: {
    country: string;
    level: string;
    field: string;
    maxBudget: string;
    scholarshipOnly: boolean;
  };
  onChange: (filters: ProgramFiltersProps["filters"]) => void;
  onReset: () => void;
}

export default function ProgramFilters({ filters, onChange, onReset }: ProgramFiltersProps) {
  const update = (key: string, value: string | boolean) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "" && v !== false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      <Select
        label="Country"
        value={filters.country}
        onChange={(e) => update("country", e.target.value)}
        placeholder="All Countries"
        options={[
          { value: "", label: "All Countries" },
          ...COUNTRIES.map((c) => ({ value: c.code, label: `${c.flagEmoji} ${c.name}` })),
        ]}
      />

      <Select
        label="Study Level"
        value={filters.level}
        onChange={(e) => update("level", e.target.value)}
        placeholder="All Levels"
        options={[
          { value: "", label: "All Levels" },
          ...STUDY_LEVELS.map((l) => ({ value: l.value, label: l.label })),
        ]}
      />

      <Select
        label="Field of Study"
        value={filters.field}
        onChange={(e) => update("field", e.target.value)}
        placeholder="All Fields"
        options={[
          { value: "", label: "All Fields" },
          ...STUDY_FIELDS.map((f) => ({ value: f.value, label: f.label })),
        ]}
      />

      <Select
        label="Max Budget (per year)"
        value={filters.maxBudget}
        onChange={(e) => update("maxBudget", e.target.value)}
        placeholder="No limit"
        options={[
          { value: "", label: "No limit" },
          { value: "10000", label: "Under $10,000" },
          { value: "20000", label: "Under $20,000" },
          { value: "30000", label: "Under $30,000" },
          { value: "50000", label: "Under $50,000" },
        ]}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.scholarshipOnly}
          onChange={(e) => update("scholarshipOnly", e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Scholarship available</span>
      </label>
    </div>
  );
}
