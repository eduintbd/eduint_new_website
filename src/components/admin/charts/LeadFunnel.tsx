"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LeadFunnel({
  data,
}: {
  data: { stage: string; count: number }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-sm font-semibold mb-3">Lead pipeline (this period)</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis type="number" fontSize={11} />
            <YAxis dataKey="stage" type="category" fontSize={11} width={90} />
            <Tooltip
              contentStyle={{
                background: "rgba(24,24,27,0.95)",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                color: "white",
              }}
            />
            <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
