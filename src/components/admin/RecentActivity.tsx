"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity as ActivityIcon, Loader2 } from "lucide-react";
import { describeAction } from "@/lib/activity";

type Item = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata: string | null;
  createdAt: string;
  actor: { id: string; name: string | null; email: string } | null;
  leadName: string | null;
};

export default function RecentActivity() {
  const [items, setItems] = useState<Item[]>([]);
  const [scope, setScope] = useState<"team" | "self">("team");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/activity?take=15")
      .then((r) => (r.ok ? r.json() : { items: [], scope: "self" }))
      .then((d) => {
        if (cancelled) return;
        setItems(d.items ?? []);
        setScope(d.scope ?? "self");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <ActivityIcon className="h-4 w-4 text-blue-600" />
          Recent activity
        </h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {scope === "team" ? "Team-wide" : "Your assigned leads"}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 py-4">
          {scope === "self"
            ? "No activity on your assigned leads yet."
            : "No activity yet."}
        </p>
      ) : (
        <ul className="space-y-2 text-xs">
          {items.map((item) => {
            const href =
              item.entityType === "LEAD"
                ? `/admin/leads/${item.entityId}`
                : item.entityType === "BOOKING"
                  ? `/admin/bookings/${item.entityId}`
                  : null;
            const label =
              item.leadName ?? `${item.entityType.toLowerCase()}…`;
            const inner = (
              <div className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <strong>{item.actor?.name ?? item.actor?.email ?? "System"}</strong>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {describeAction(item.action, item.metadata)}
                    </span>
                    {item.entityType === "LEAD" && (
                      <>
                        {" · "}
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {label}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
            return (
              <li
                key={item.id}
                className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
              >
                {href ? (
                  <Link href={href} className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-1 px-1 rounded">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
