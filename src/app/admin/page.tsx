"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Phone, Mail, CalendarDays } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredCountry: string | null;
  intake: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  slot: string;
  topic: string | null;
  status: string;
  adminNotes: string | null;
  meetingLink: string | null;
};

const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];
const BOOKING_STATUSES = [
  "REQUESTED",
  "CONFIRMED",
  "DONE",
  "NO_SHOW",
  "CANCELLED",
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"leads" | "bookings">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role !== "ADMIN") {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch("/api/admin/leads").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
    ])
      .then(([l, b]) => {
        setLeads(l.leads ?? []);
        setBookings(b.bookings ?? []);
      })
      .finally(() => setLoading(false));
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <h1 className="text-xl font-bold mb-2">Admin access required</h1>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <h1 className="text-xl font-bold">Admins only</h1>
        <p className="text-sm text-gray-500 mt-2">
          Your account does not have the ADMIN role.
        </p>
      </div>
    );
  }

  async function updateLead(id: string, patch: Partial<Lead>) {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    const { lead } = await res.json();
    setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
  }

  async function updateBooking(id: string, patch: Partial<Booking>) {
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
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Admin CRM</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Leads and bookings from the student-facing site.
      </p>

      <div className="flex gap-2 mb-4">
        {(["leads", "bookings"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              tab === k
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {k === "leads" ? `Leads (${leads.length})` : `Bookings (${bookings.length})`}
          </button>
        ))}
      </div>

      {tab === "leads" ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2">When</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Country</th>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-medium">{l.name}</td>
                  <td className="px-3 py-2">
                    <a
                      href={`tel:${l.phone}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Phone className="h-3 w-3" /> {l.phone}
                    </a>
                    {l.email && (
                      <a
                        href={`mailto:${l.email}`}
                        className="block text-xs text-gray-500 hover:underline"
                      >
                        <Mail className="inline h-3 w-3 mr-0.5" /> {l.email}
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-2">{l.preferredCountry ?? "—"}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{l.source}</td>
                  <td className="px-3 py-2">
                    <select
                      value={l.status}
                      onChange={(e) =>
                        updateLead(l.id, { status: e.target.value })
                      }
                      className="rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={l.notes ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (l.notes ?? "") &&
                        updateLead(l.id, { notes: e.target.value })
                      }
                      placeholder="Add notes…"
                      className="w-full rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs"
                    />
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2">Slot</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Topic</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Meeting link</th>
                <th className="text-left px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <CalendarDays className="inline h-3 w-3 mr-1 text-gray-400" />
                    {new Date(b.slot).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-medium">{b.name}</td>
                  <td className="px-3 py-2">
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Phone className="h-3 w-3" /> {b.phone}
                    </a>
                    <a
                      href={`mailto:${b.email}`}
                      className="block text-xs text-gray-500 hover:underline"
                    >
                      <Mail className="inline h-3 w-3 mr-0.5" /> {b.email}
                    </a>
                  </td>
                  <td className="px-3 py-2">{b.topic ?? "—"}</td>
                  <td className="px-3 py-2">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        updateBooking(b.id, { status: e.target.value })
                      }
                      className="rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={b.meetingLink ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (b.meetingLink ?? "") &&
                        updateBooking(b.id, { meetingLink: e.target.value })
                      }
                      placeholder="https://zoom.us/…"
                      className="w-56 rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={b.adminNotes ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (b.adminNotes ?? "") &&
                        updateBooking(b.id, { adminNotes: e.target.value })
                      }
                      placeholder="Counselor notes…"
                      className="w-full rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs"
                    />
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No bookings yet.
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
