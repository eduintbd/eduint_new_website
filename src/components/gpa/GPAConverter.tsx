"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { GPA_SCALES } from "@/lib/gpa-scales";
import { ArrowRight } from "lucide-react";

interface Conversion {
  scale: string;
  code: string;
  value: number;
  max: number;
}

export default function GPAConverter() {
  const [value, setValue] = useState("");
  const [fromScale, setFromScale] = useState("SCALE_4");
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [letterGrade, setLetterGrade] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!value) return;
    setLoading(true);

    try {
      const res = await fetch("/api/gpa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: parseFloat(value), fromScale }),
      });
      const data = await res.json();
      setConversions(data.conversions ?? []);
      setLetterGrade(data.letterGrade ?? "");
    } catch {
      // Fallback client-side conversion
    }
    setLoading(false);
  };

  const currentScale = GPA_SCALES.find((s) => s.code === fromScale);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <Input
          label="Your GPA"
          type="number"
          step="0.01"
          min="0"
          max={currentScale?.max.toString()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`e.g., ${currentScale?.max === 4 ? "3.5" : currentScale?.max === 5 ? "4.2" : currentScale?.max === 10 ? "8.5" : "85"}`}
        />
        <Select
          label="GPA Scale"
          value={fromScale}
          onChange={(e) => setFromScale(e.target.value)}
          options={GPA_SCALES.map((s) => ({ value: s.code, label: s.name }))}
        />
        <Button onClick={handleConvert} loading={loading}>
          Convert <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {conversions.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-sm">
              Your GPA: <span className="text-blue-600">{value}</span> on {currentScale?.name}
              {letterGrade && (
                <span className="ml-2 text-gray-500">
                  (Letter Grade: <span className="font-bold text-gray-900 dark:text-white">{letterGrade}</span>)
                </span>
              )}
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversions.map((conv) => (
              <div key={conv.code} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{conv.scale}</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {conv.value} <span className="text-xs font-normal text-gray-400">/ {conv.max}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
