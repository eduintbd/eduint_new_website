"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BellRing,
  Calendar,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import LeadFunnel from "@/components/admin/charts/LeadFunnel";
import SourcePie from "@/components/admin/charts/SourcePie";
import LeadsTrend from "@/components/admin/charts/LeadsTrend";
import CounselorBar from "@/components/admin/charts/CounselorBar";
import RecentActivity from "@/components/admin/RecentActivity";
import { can, type Role } from "@/lib/roles";

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
  upcomingBookings: {
    id: string;
    name: string;
    slot: string;
    status: string;
    topic: string | null;
  }[];
  _scope: "team" | "self";
};

const RANGES = [
  { days: 7, label: "7d" },
  { days: 30, label: "30d" },
  { days: 90, label: "90d" },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?._scope === "self"
              ? "Your assigned leads and bookings"
              : "Team-wide view"}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1 text-xs font-medium rounded ${
                range === r.days
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {r.label}
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
          {/* Number cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Users}
              label={`Leads (${range}d)`}
              value={data.summary.leadsInRange}
              href="/admin/leads"
              color="text-blue-600"
            />
            <StatCard
              icon={TrendingUp}
              label="Conversion rate"
              value={`${data.summary.conversionRate}%`}
              href="/admin/leads?status=CONVERTED"
              color="text-emerald-600"
            />
            <StatCard
              icon={Calendar}
              label="Bookings today"
              value={data.summary.bookingsToday}
              href="/admin/bookings"
              color="text-purple-600"
            />
            <StatCard
              icon={BellRing}
              label="Overdue reminders"
              value={data.summary.overdueReminders}
              href="/admin/reminders?scope=overdue"
              color="text-rose-600"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadFunnel data={data.funnel} />
            <SourcePie data={data.sources} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadsTrend data={data.trend} />
            {can(role, "admin.viewReports") && (
              <CounselorBar data={data.counselors} />
            )}
          </div>

          {/* Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Upcoming bookings</h2>
                <Link href="/admin/bookings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {data.upcomingBookings.length === 0 ? (
                <p className="text-xs text-gray-500 py-4">
                  No upcoming bookings.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.upcomingBookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                    >
                      <div>
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="font-medium hover:text-blue-600"
                        >
                          {b.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {new Date(b.slot).toLocaleString()}
                          {b.topic ? ` · ${b.topic}` : ""}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                          b.status === "CONFIRMED"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : b.status === "REQUESTED"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Lead status breakdown</h2>
                <Link href="/admin/leads" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.statuses.map((s) => (
                  <div
                    key={s.status}
                    className="rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
                  >
                    <p className="text-xs text-gray-500">{s.status}</p>
                    <p className="text-lg font-semibold">{s.count}</p>
                  </div>
                ))}
                {data.statuses.length === 0 && (
                  <p className="text-xs text-gray-500 col-span-2 py-4">
                    No leads yet in this range.
                  </p>
                )}
              </div>
            </div>
          </div>

          <RecentActivity />
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-blue-400 transition-colors"
    >
      <div className="flex items-center justify-between">
        <Icon className={`h-4 w-4 ${color}`} />
        <ArrowRight className="h-3 w-3 text-gray-300" />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </Link>
  );
}
