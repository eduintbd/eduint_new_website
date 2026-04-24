"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  CalendarClock,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import { can, type Role } from "@/lib/roles";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  slot: string;
  topic: string | null;
  status: string;
  meetingLink: string | null;
  adminNotes: string | null;
  assignedToId: string | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
  lead: { id: string; name: string } | null;
};
type User = { id: string; name: string | null; email: string; role: string };

const STATUSES = ["REQUESTED", "CONFIRMED", "DONE", "NO_SHOW", "CANCELLED"];

export default function AdminBookingsPage() {
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
  const canAssign = can(role, "admin.assignLeads");
  const canViewAll = can(role, "admin.viewAllLeads");

  const [scope, setScope] = useState<"upcoming" | "past" | "all">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const q = scope === "all" ? "" : `scope=${scope}`;
    const res = await fetch(`/api/admin/bookings?${q}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (canAssign) {
      fetch("/api/admin/team")
        .then((r) => (r.ok ? r.json() : { users: [] }))
        .then((d) => setUsers(d.users ?? []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, canAssign]);

  async function update(id: string, patch: Partial<Booking>) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    const { booking } = await res.json();
    const assignee = patch.assignedToId
      ? users.find((u) => u.id === patch.assignedToId) ?? null
      : patch.assignedToId === null
        ? null
        : bookings.find((b) => b.id === id)?.assignedTo ?? null;
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...booking, assignedTo: assignee } : b))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {canViewAll
              ? `${bookings.length} total · all counselors`
              : `${bookings.length} assigned to you`}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900 w-fit">
          {(["upcoming", "past", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize ${
                scope === s ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
              <tr>
                <th className="text-left px-3 py-2">Slot</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Topic</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Assigned</th>
                <th className="text-left px-3 py-2">Meeting link</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <CalendarClock className="inline h-3 w-3 mr-1 text-gray-400" />
                    {new Date(b.slot).toLocaleString([], {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="hover:text-blue-600"
                    >
                      {b.name}
                    </Link>
                    {b.lead && (
                      <Link
                        href={`/admin/leads/${b.lead.id}`}
                        className="ml-1 text-[10px] text-blue-600 hover:underline"
                      >
                        (lead)
                      </Link>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={`tel:${b.phone}`}
                      className="text-blue-600 inline-flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {b.phone}
                    </a>
                    <a
                      href={`mailto:${b.email}`}
                      className="block text-[10px] text-gray-500 hover:underline"
                    >
                      <Mail className="inline h-3 w-3 mr-0.5" />
                      {b.email}
                    </a>
                  </td>
                  <td className="px-3 py-2 max-w-[180px] truncate">{b.topic ?? "—"}</td>
                  <td className="px-3 py-2">
                    <select
                      value={b.status}
                      onChange={(e) => update(b.id, { status: e.target.value })}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    {canAssign ? (
                      <select
                        value={b.assignedToId ?? ""}
                        onChange={(e) =>
                          update(b.id, { assignedToId: e.target.value || null })
                        }
                        className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent"
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name ?? u.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px]">
                        {b.assignedTo?.name ?? b.assignedTo?.email ?? "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={b.meetingLink ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (b.meetingLink ?? "") &&
                        update(b.id, { meetingLink: e.target.value })
                      }
                      placeholder="https://zoom.us/…"
                      className="w-52 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    No bookings in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
