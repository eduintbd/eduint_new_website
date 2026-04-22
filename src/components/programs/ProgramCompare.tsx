"use client";

import { formatCurrency } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { X, MapPin, Clock, GraduationCap, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import type { ProgramWithUniversity } from "@/types";

interface ProgramCompareProps {
  programs: ProgramWithUniversity[];
  onRemove: (id: string) => void;
}

const COMPARE_ROWS = [
  { label: "University", key: "university" as const },
  { label: "Location", key: "location" as const },
  { label: "Level", key: "level" as const },
  { label: "Field", key: "field" as const },
  { label: "Duration", key: "duration" as const },
  { label: "Tuition", key: "tuition" as const },
  { label: "Language", key: "language" as const },
  { label: "Scholarship", key: "scholarship" as const },
  { label: "Acceptance Rate", key: "acceptance" as const },
  { label: "Intake Months", key: "intake" as const },
];

function getCellValue(program: ProgramWithUniversity, key: string) {
  switch (key) {
    case "university": return program.university.name;
    case "location": return `${program.city}, ${program.country}`;
    case "level": return program.level;
    case "field": return program.field;
    case "duration": return program.duration;
    case "tuition": return formatCurrency(program.tuitionFee, program.currency) + "/year";
    case "language": return program.language;
    case "scholarship": return program.scholarshipAvailable;
    case "acceptance": return program.acceptanceRate ? `${program.acceptanceRate}%` : "N/A";
    case "intake": return program.intakeMonths ?? "N/A";
    default: return "N/A";
  }
}

export default function ProgramCompare({ programs, onRemove }: ProgramCompareProps) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No programs to compare</p>
        <p className="text-gray-400 text-sm mt-1">Add programs from the Programs page to compare them side by side</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-500 w-40">
              Criteria
            </th>
            {programs.map((p) => (
              <th key={p.id} className="p-4 bg-gray-50 dark:bg-gray-900 min-w-[200px]">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{p.name}</p>
                  </div>
                  <button onClick={() => onRemove(p.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.key} className="border-t border-gray-200 dark:border-gray-700">
              <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {row.label}
              </td>
              {programs.map((p) => {
                const val = getCellValue(p, row.key);
                return (
                  <td key={p.id} className="p-4 text-sm text-gray-900 dark:text-gray-100">
                    {typeof val === "boolean" ? (
                      val ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300" />
                      )
                    ) : (
                      val
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
