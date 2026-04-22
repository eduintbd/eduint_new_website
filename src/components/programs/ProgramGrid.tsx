"use client";

import ProgramCard from "./ProgramCard";
import Spinner from "@/components/ui/Spinner";
import type { ProgramWithUniversity } from "@/types";

interface ProgramGridProps {
  programs: ProgramWithUniversity[];
  savedIds: Set<string>;
  onToggleSave?: (programId: string) => void;
  loading?: boolean;
  draggable?: boolean;
}

export default function ProgramGrid({ programs, savedIds, onToggleSave, loading, draggable }: ProgramGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No programs found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          saved={savedIds.has(program.id)}
          onToggleSave={onToggleSave}
          draggable={draggable}
        />
      ))}
    </div>
  );
}
