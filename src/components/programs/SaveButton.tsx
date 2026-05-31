"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  saved: boolean;
  onClick: () => void;
  className?: string;
}

export default function SaveButton({ saved, onClick, className }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-none border text-sm font-medium transition-colors",
        saved
          ? "border-[#E0FE9C] bg-[#E0FE9C] text-black"
          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        className
      )}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
