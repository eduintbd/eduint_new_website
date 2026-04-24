"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CounselorBar({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <p className="text-sm font-semibold mb-3">Counselor leaderboard</p>
        <p className="text-xs text-gray-500">
          No assigned leads yet this period.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-sm font-semibold mb-3">Counselor leaderboard (leads assigned)</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis dataKey="name" fontSize={11} interval={0} tick={{ width: 60 }} />
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
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
