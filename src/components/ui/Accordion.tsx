"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("divide-y divide-gray-200 dark:divide-gray-700", className)}>
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="flex w-full items-center justify-between py-4 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="text-base font-medium text-gray-900 dark:text-white">
              {item.title}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96 pb-4" : "max-h-0"
            )}
          >
            <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
