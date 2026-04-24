"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function LeadsTrend({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-sm font-semibold mb-3">Daily lead volume</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 10 }}>
            <defs>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis
              dataKey="date"
              fontSize={10}
              tickFormatter={(d) => d.slice(5)}
            />
            <YAxis fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "rgba(24,24,27,0.95)",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                color: "white",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              fill="url(#leadsFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
