"use client";

import { GripVertical, GraduationCap } from "lucide-react";

interface ProgramDragCardProps {
  id: string;
  name: string;
  university: string;
}

export default function ProgramDragCard({ id, name, university }: ProgramDragCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("program", JSON.stringify({ id, name, university }));
      }}
      className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
    >
      <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <GraduationCap className="h-4 w-4 text-blue-600 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{university}</p>
      </div>
    </div>
  );
}
