"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeadFunnel from "@/components/admin/charts/LeadFunnel";
import SourcePie from "@/components/admin/charts/SourcePie";
import LeadsTrend from "@/components/admin/charts/LeadsTrend";
import CounselorBar from "@/components/admin/charts/CounselorBar";

type ReportData = {
  summary: {
    leadsInRange: number;
    convertedInRange: number;
    conversionRate: number;
    bookingsToday: number;
    overdueReminders: number;
    rangeDays: number;
  };
  funnel: { stage: string; count: number }[];
  sources: { source: string; count: number }[];
  statuses: { status: string; count: number }[];
  counselors: { userId: string | null; name: string; count: number }[];
  trend: { date: string; count: number }[];
};

export default function AdminReportsPage() {
  const [range, setRange] = useState(30);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/reports?days=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Conversion funnel, sources, counselor KPIs
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900">
          {[7, 30, 90, 180].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3 py-1 text-xs font-medium rounded ${
                range === d
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label={`Leads (${range}d)`} value={data.summary.leadsInRange} />
            <Card label="Converted" value={data.summary.convertedInRange} />
            <Card
              label="Conversion rate"
              value={`${data.summary.conversionRate}%`}
            />
            <Card label="Overdue reminders" value={data.summary.overdueReminders} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadFunnel data={data.funnel} />
            <SourcePie data={data.sources} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadsTrend data={data.trend} />
            <CounselorBar data={data.counselors} />
          </div>
        </>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] uppercase text-gray-500 mt-1">{label}</p>
    </div>
  );
}
