"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, Phone } from "lucide-react";
import { describeAction } from "@/lib/activity";
import { useSession } from "next-auth/react";
import { can, roleLabel, type Role } from "@/lib/roles";

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
  createdAt: string;
  assignedTo: { id: string; name: string | null; email: string; role: string } | null;
  lead: { id: string; name: string; phone: string } | null;
};

type Activity = {
  id: string;
  action: string;
  metadata: string | null;
  createdAt: string;
  actor: { name: string | null; email: string } | null;
};

type User = { id: string; name: string | null; email: string; role: string };

const STATUSES = ["REQUESTED", "CONFIRMED", "DONE", "NO_SHOW", "CANCELLED"];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
  const canAssign = can(role, "admin.assignLeads");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notesDraft, setNotesDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/bookings/${id}`);
    if (!res.ok) {
      toast.error("Could not load");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setBooking(data.booking);
    setActivity(data.activity ?? []);
    setNotesDraft(data.booking?.adminNotes ?? "");
    setLinkDraft(data.booking?.meetingLink ?? "");
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
  }, [id]);

  async function patch(p: Record<string, unknown>) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...p }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    await load();
  }

  if (loading || !booking) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Counseling slot</p>
            <h1 className="text-xl font-bold mt-1">
              {new Date(booking.slot).toLocaleString([], {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {booking.topic ?? "No topic set"}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] uppercase text-gray-500">Student</p>
                <p className="font-medium">{booking.name}</p>
                <a
                  href={`tel:${booking.phone}`}
                  className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" /> {booking.phone}
                </a>
                <br />
                <a
                  href={`mailto:${booking.email}`}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" /> {booking.email}
                </a>
              </div>
              {booking.lead && (
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Linked lead</p>
                  <Link
                    href={`/admin/leads/${booking.lead.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {booking.lead.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-sm font-semibold mb-3">Timeline</h2>
            {activity.length === 0 ? (
              <p className="text-xs text-gray-500">No activity yet.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    <div>
                      <p>
                        <strong>{a.actor?.name ?? a.actor?.email ?? "System"}</strong>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {describeAction(a.action, a.metadata)}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 text-sm">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Status</label>
              <select
                value={booking.status}
                onChange={(e) => patch({ status: e.target.value })}
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Assigned</label>
              {canAssign ? (
                <select
                  value={booking.assignedToId ?? ""}
                  onChange={(e) => patch({ assignedToId: e.target.value || null })}
                  className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name ?? u.email} · {roleLabel(u.role)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs">
                  {booking.assignedTo
                    ? `${booking.assignedTo.name ?? booking.assignedTo.email}`
                    : "—"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Meeting link</label>
              <input
                value={linkDraft}
                onChange={(e) => setLinkDraft(e.target.value)}
                onBlur={() =>
                  linkDraft !== (booking.meetingLink ?? "") &&
                  patch({ meetingLink: linkDraft })
                }
                placeholder="https://zoom.us/…"
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Counselor notes</label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                onBlur={() =>
                  notesDraft !== (booking.adminNotes ?? "") &&
                  patch({ adminNotes: notesDraft })
                }
                rows={4}
                className="w-full p-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                placeholder="What to cover / outcome…"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
