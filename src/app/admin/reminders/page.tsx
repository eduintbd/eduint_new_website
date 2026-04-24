"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BellRing, CalendarClock, CheckCircle2, Clock, Loader2 } from "lucide-react";

type Reminder = {
  id: string;
  title: string;
  note: string | null;
  dueAt: string;
  completed: boolean;
  lead: { id: string; name: string } | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
};

const SCOPES = [
  { key: "overdue", label: "Overdue", color: "text-rose-600" },
  { key: "today", label: "Today", color: "text-blue-600" },
  { key: "upcoming", label: "Upcoming", color: "text-gray-600" },
] as const;

export default function AdminRemindersPage() {
  const [grouped, setGrouped] = useState<Record<string, Reminder[]>>({
    overdue: [],
    today: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [overdue, today, upcoming] = await Promise.all([
      fetch("/api/admin/reminders?scope=overdue").then((r) => r.json()),
      fetch("/api/admin/reminders?scope=today").then((r) => r.json()),
      fetch("/api/admin/reminders?scope=upcoming").then((r) => r.json()),
    ]);
    setGrouped({
      overdue: overdue.reminders ?? [],
      today: today.reminders ?? [],
      upcoming: upcoming.reminders ?? [],
    });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function complete(id: string) {
    const res = await fetch(`/api/admin/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    if (!res.ok) {
      toast.error("Failed");
      return;
    }
    toast.success("Reminder completed");
    load();
  }

  async function snooze(id: string, hours: number) {
    const dueAt = new Date();
    dueAt.setHours(dueAt.getHours() + hours);
    const res = await fetch(`/api/admin/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueAt: dueAt.toISOString() }),
    });
    if (!res.ok) {
      toast.error("Failed");
      return;
    }
    toast.success(`Snoozed ${hours}h`);
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const total =
    grouped.overdue.length + grouped.today.length + grouped.upcoming.length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Reminders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} open · attach reminders from any lead's detail page.
        </p>
      </div>

      {SCOPES.map((s) => (
        <section key={s.key}>
          <h2 className={`text-sm font-semibold mb-2 ${s.color}`}>
            {s.label} · {grouped[s.key].length}
          </h2>
          <div className="space-y-2">
            {grouped[s.key].length === 0 ? (
              <p className="text-xs text-gray-500 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                {s.key === "overdue" ? "Nothing overdue — you're caught up." : "Nothing here."}
              </p>
            ) : (
              grouped[s.key].map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500 inline-flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {new Date(r.dueAt).toLocaleString()}
                      {r.lead && (
                        <>
                          {" · "}
                          <Link
                            href={`/admin/leads/${r.lead.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {r.lead.name}
                          </Link>
                        </>
                      )}
                    </p>
                    {r.note && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{r.note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <button
                      onClick={() => snooze(r.id, 1)}
                      className="text-[10px] px-1.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      +1h
                    </button>
                    <button
                      onClick={() => snooze(r.id, 24)}
                      className="text-[10px] px-1.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      +1d
                    </button>
                    <button
                      onClick={() => snooze(r.id, 24 * 7)}
                      className="text-[10px] px-1.5 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      +1w
                    </button>
                    <button
                      onClick={() => complete(r.id)}
                      className="text-[10px] px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ))}

      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-xs text-blue-900 dark:text-blue-200">
        <p className="flex items-center gap-1">
          <BellRing className="h-3 w-3" />
          A daily cron at 03:00 / 07:00 / 13:00 (Dhaka) nudges overdue reminders to your email + WhatsApp.
        </p>
      </div>
    </div>
  );
}
