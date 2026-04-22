"use client";

import Link from "next/link";
import { MapPin, Clock, GraduationCap, Bookmark, BookmarkCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { ProgramWithUniversity } from "@/types";

interface ProgramCardProps {
  program: ProgramWithUniversity;
  saved?: boolean;
  onToggleSave?: (programId: string) => void;
  draggable?: boolean;
}

export default function ProgramCard({ program, saved = false, onToggleSave, draggable = false }: ProgramCardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        if (draggable) {
          e.dataTransfer.setData("program", JSON.stringify({ id: program.id, name: program.name, university: program.university.name }));
        }
      }}
      className="group relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <Badge variant={program.scholarshipAvailable ? "success" : "default"}>
            {program.level}
          </Badge>
          {program.scholarshipAvailable && (
            <Badge variant="info">Scholarship</Badge>
          )}
        </div>
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(program.id);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/programs/${program.id}`} className="flex-1 p-4 pt-2">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
          {program.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {program.university.name}
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{program.city}, {program.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            <span>{program.field}</span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(program.tuitionFee, program.currency)}
          <span className="text-xs font-normal text-gray-500">/year</span>
        </p>
        {program.acceptanceRate && (
          <span className="text-xs text-gray-500">
            {program.acceptanceRate}% acceptance
          </span>
        )}
      </div>
    </div>
  );
}
