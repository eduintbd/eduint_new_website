"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  BellPlus,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Tag as TagIcon,
  User as UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { can, roleLabel, type Role } from "@/lib/roles";
import { describeAction } from "@/lib/activity";

type Activity = {
  id: string;
  action: string;
  actorId: string;
  metadata: string | null;
  createdAt: string;
  actor: { id: string; name: string | null; email: string } | null;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredCountry: string | null;
  intake: string | null;
  message: string | null;
  source: string;
  status: string;
  stage: string;
  priority: string;
  tags: string | null;
  notes: string | null;
  nextActionAt: string | null;
  nextActionNote: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  assignedToId: string | null;
  assignedTo: { id: string; name: string | null; email: string; role: string } | null;
  bookings: { id: string; slot: string; status: string; topic: string | null }[];
  reminders: { id: string; title: string; dueAt: string; completed: boolean }[];
};

const STAGES = [
  "NEW","CONTACTED","QUALIFIED","COUNSELING","APPLYING","OFFER","VISA","ENROLLED","LOST",
];
const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH"];

type User = { id: string; name: string | null; email: string; role: string };

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
  const canAssign = can(role, "admin.assignLeads");

  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState("");
  const [waOpen, setWaOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("Follow up");
  const [reminderDate, setReminderDate] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/leads/${id}`);
    if (!res.ok) {
      toast.error("Could not load lead");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setLead(data.lead);
    setActivity(data.activity ?? []);
    setNotesDraft(data.lead?.notes ?? "");
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (canAssign) {
      fetch("/api/admin/team")
        .then((r) => (r.ok ? r.json() : { users: [] }))
        .then((d) => setUsers(d.users ?? []))
        .catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function patch(p: Record<string, unknown>) {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...p }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Update failed" }));
      toast.error(error);
      return;
    }
    await load();
  }

  async function assign(userId: string | null) {
    const res = await fetch(`/api/admin/leads/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: userId }),
    });
    if (!res.ok) {
      toast.error("Assign failed");
      return;
    }
    await load();
  }

  async function contact(channel: "WHATSAPP" | "PHONE" | "EMAIL", body?: string) {
    const res = await fetch(`/api/admin/leads/${id}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, body, template: channel === "WHATSAPP" ? "custom" : undefined }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Send failed");
      return;
    }
    if (channel === "WHATSAPP" && data.result?.url) {
      window.open(data.result.url, "_blank");
    }
    toast.success(
      channel === "WHATSAPP" ? "Logged + opened WhatsApp" : channel === "EMAIL" ? "Email sent + logged" : "Call logged"
    );
    await load();
  }

  async function addReminder() {
    if (!reminderDate) {
      toast.error("Pick a due date");
      return;
    }
    const res = await fetch("/api/admin/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: reminderTitle,
        dueAt: new Date(reminderDate).toISOString(),
        leadId: id,
      }),
    });
    if (!res.ok) {
      toast.error("Could not create reminder");
      return;
    }
    toast.success("Reminder created");
    setReminderOpen(false);
    setReminderTitle("Follow up");
    setReminderDate("");
    await load();
  }

  if (loading || !lead) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-xs text-gray-500">
          Created {new Date(lead.createdAt).toLocaleString()} · Source: {lead.source}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: contact card */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h1 className="text-xl font-bold">{lead.name}</h1>
            <div className="mt-3 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                  {lead.phone}
                </a>
              </p>
              {lead.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <LabelPair label="Country" value={lead.preferredCountry ?? "—"} />
              <LabelPair label="Intake" value={lead.intake ?? "—"} />
              <LabelPair label="Tags" value={lead.tags ?? "—"} />
              <LabelPair
                label="Last contact"
                value={lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : "—"}
              />
            </div>
            {lead.message && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Enquiry message</p>
                <p className="text-sm rounded bg-gray-50 dark:bg-gray-800/50 p-2 whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 text-sm">
            <Control label="Stage">
              <select
                value={lead.stage}
                onChange={(e) => patch({ stage: e.target.value })}
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Control>
            <Control label="Status">
              <select
                value={lead.status}
                onChange={(e) => patch({ status: e.target.value })}
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Control>
            <Control label="Priority">
              <select
                value={lead.priority}
                onChange={(e) => patch({ priority: e.target.value })}
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Control>
            <Control label="Assigned to">
              {canAssign ? (
                <select
                  value={lead.assignedToId ?? ""}
                  onChange={(e) => assign(e.target.value || null)}
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
                  {lead.assignedTo
                    ? `${lead.assignedTo.name ?? lead.assignedTo.email} · ${roleLabel(lead.assignedTo.role)}`
                    : "—"}
                </p>
              )}
            </Control>
            <Control label="Tags">
              <input
                defaultValue={lead.tags ?? ""}
                onBlur={(e) =>
                  e.target.value !== (lead.tags ?? "") && patch({ tags: e.target.value })
                }
                placeholder="e.g. scholarship,vip"
                className="w-full py-1 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </Control>
          </div>
        </div>

        {/* Middle: notes + activity */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Internal notes</h2>
              <button
                onClick={() => patch({ notes: notesDraft })}
                disabled={notesDraft === (lead.notes ?? "")}
                className="text-xs text-blue-600 hover:underline disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={4}
              className="w-full text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
              placeholder="Internal team notes…"
            />
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

        {/* Right: quick actions + bookings + reminders */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-sm font-semibold mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={Phone}
                label="Log call"
                color="bg-blue-50 dark:bg-blue-900/20 text-blue-700"
                onClick={() => contact("PHONE")}
              />
              <ActionButton
                icon={MessageCircle}
                label="WhatsApp"
                color="bg-green-50 dark:bg-green-900/20 text-green-700"
                onClick={() => setWaOpen(!waOpen)}
              />
              <ActionButton
                icon={Mail}
                label="Email"
                color="bg-purple-50 dark:bg-purple-900/20 text-purple-700"
                onClick={async () => {
                  if (!lead.email) {
                    toast.error("No email on file");
                    return;
                  }
                  const body = prompt("Email body:") ?? "";
                  if (!body) return;
                  await contact("EMAIL", body);
                }}
              />
              <ActionButton
                icon={BellPlus}
                label="Reminder"
                color="bg-amber-50 dark:bg-amber-900/20 text-amber-700"
                onClick={() => setReminderOpen(!reminderOpen)}
              />
            </div>

            {waOpen && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  rows={3}
                  placeholder="Hi, following up on your enquiry…"
                  className="w-full text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2"
                />
                <button
                  onClick={async () => {
                    if (!waMessage.trim()) {
                      toast.error("Write something first");
                      return;
                    }
                    await contact("WHATSAPP", waMessage);
                    setWaOpen(false);
                    setWaMessage("");
                  }}
                  className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-medium"
                >
                  Send via WhatsApp
                </button>
              </div>
            )}

            {reminderOpen && (
              <div className="mt-3 space-y-2">
                <input
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"
                />
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"
                />
                <button
                  onClick={addReminder}
                  className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-medium"
                >
                  Create reminder
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-sm font-semibold mb-2">Upcoming reminders</h2>
            {lead.reminders.length === 0 ? (
              <p className="text-xs text-gray-500">None set.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {lead.reminders.map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(r.dueAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-sm font-semibold mb-2">Bookings</h2>
            {lead.bookings.length === 0 ? (
              <p className="text-xs text-gray-500">None.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {lead.bookings.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="hover:text-blue-600 font-medium"
                    >
                      {new Date(b.slot).toLocaleString()}
                    </Link>
                    <p className="text-[10px] text-gray-500">
                      {b.status} {b.topic ? `· ${b.topic}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function LabelPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: typeof UserIcon;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium ${color}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
