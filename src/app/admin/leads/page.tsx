"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Flame,
  KanbanSquare,
  Loader2,
  Search,
  TableProperties,
  Users,
} from "lucide-react";
import { can, type Role } from "@/lib/roles";
import { COUNTRIES } from "@/lib/countries";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredCountry: string | null;
  source: string;
  status: string;
  stage: string;
  priority: string;
  tags: string | null;
  createdAt: string;
  lastContactedAt: string | null;
  nextActionAt: string | null;
  assignedToId: string | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
};

type User = { id: string; name: string | null; email: string; role: string };

const STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "COUNSELING",
  "APPLYING",
  "OFFER",
  "VISA",
  "ENROLLED",
  "LOST",
];

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH"];

const STAGE_COLORS: Record<string, string> = {
  NEW: "bg-gray-100 dark:bg-gray-800",
  CONTACTED: "bg-blue-100 dark:bg-blue-900/30",
  QUALIFIED: "bg-sky-100 dark:bg-sky-900/30",
  COUNSELING: "bg-indigo-100 dark:bg-indigo-900/30",
  APPLYING: "bg-violet-100 dark:bg-violet-900/30",
  OFFER: "bg-amber-100 dark:bg-amber-900/30",
  VISA: "bg-purple-100 dark:bg-purple-900/30",
  ENROLLED: "bg-green-100 dark:bg-green-900/30",
  LOST: "bg-rose-100 dark:bg-rose-900/30",
};

export default function AdminLeadsPage() {
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
  const canAssign = can(role, "admin.assignLeads");
  const canViewAll = can(role, "admin.viewAllLeads");

  const [view, setView] = useState<"list" | "kanban">("list");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [priority, setPriority] = useState("");
  const [country, setCountry] = useState("");
  const [assignedTo, setAssignedTo] = useState(canViewAll ? "all" : "me");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (stageFilter) params.set("stage", stageFilter);
    if (priority) params.set("priority", priority);
    if (country) params.set("country", country);
    if (assignedTo) params.set("assignedTo", assignedTo);
    const res = await fetch(`/api/admin/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, stageFilter, priority, country, assignedTo]);

  useEffect(() => {
    if (canAssign) {
      fetch("/api/admin/team")
        .then((r) => (r.ok ? r.json() : { users: [] }))
        .then((d) => setUsers(d.users ?? []))
        .catch(() => undefined);
    }
  }, [canAssign]);

  async function quickUpdate(id: string, patch: Partial<Lead>) {
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
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...lead, assignedTo: l.assignedTo } : l)));
  }

  async function quickAssign(id: string, userId: string | null) {
    const res = await fetch(`/api/admin/leads/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: userId }),
    });
    if (!res.ok) {
      toast.error("Assign failed");
      return;
    }
    const { lead } = await res.json();
    const assignee = userId ? users.find((u) => u.id === userId) : null;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, assignedToId: lead.assignedToId, assignedTo: assignee ?? null } : l
      )
    );
  }

  const kanbanColumns = useMemo(() => {
    return STAGES.map((s) => ({
      stage: s,
      items: leads.filter((l) => l.stage === s),
    }));
  }, [leads]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {canViewAll
              ? `${leads.length} total · managing the full team pipeline`
              : `${leads.length} assigned to you`}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900 w-fit">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${view === "list" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
          >
            <TableProperties className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${view === "kanban" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
          >
            <KanbanSquare className="h-3.5 w-3.5" /> Pipeline
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          <div className="relative col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / phone / email"
              className="w-full pl-8 pr-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="">All status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="">Any priority</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="">Any country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </select>
          {canViewAll && (
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 col-span-2"
            >
              <option value="all">Anyone</option>
              <option value="me">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
              {users
                .filter((u) => u.id !== session?.user?.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : view === "list" ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
              <tr>
                <th className="text-left px-3 py-2">When</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Country</th>
                <th className="text-left px-3 py-2">Stage</th>
                <th className="text-left px-3 py-2">Priority</th>
                <th className="text-left px-3 py-2">Assigned to</th>
                <th className="text-left px-3 py-2">Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/admin/leads/${l.id}`} className="hover:text-blue-600">
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <div>{l.phone}</div>
                    {l.email && <div className="text-[10px] text-gray-500">{l.email}</div>}
                  </td>
                  <td className="px-3 py-2">{l.preferredCountry ?? "—"}</td>
                  <td className="px-3 py-2">
                    <select
                      value={l.stage}
                      onChange={(e) => quickUpdate(l.id, { stage: e.target.value })}
                      className={`text-[10px] px-1.5 py-0.5 rounded border-0 font-medium ${STAGE_COLORS[l.stage] ?? ""}`}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={l.priority}
                      onChange={(e) => quickUpdate(l.id, { priority: e.target.value })}
                      className={`text-[10px] px-1.5 py-0.5 rounded border-0 ${l.priority === "HIGH" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-semibold" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p === "HIGH" ? "🔥 HIGH" : p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    {canAssign ? (
                      <select
                        value={l.assignedToId ?? ""}
                        onChange={(e) => quickAssign(l.id, e.target.value || null)}
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
                      <span className="text-[10px]">{l.assignedTo?.name ?? "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-gray-500 max-w-[140px] truncate">
                    {l.source}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    <Users className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                    No leads match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
          {kanbanColumns.map(({ stage, items }) => (
            <div
              key={stage}
              className={`rounded-xl p-2 ${STAGE_COLORS[stage] ?? ""} min-h-[220px]`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase">{stage}</p>
                <span className="text-[10px] bg-white/70 dark:bg-black/20 px-1.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {items.map((l) => (
                  <Link
                    href={`/admin/leads/${l.id}`}
                    key={l.id}
                    className="block rounded-lg bg-white dark:bg-gray-900 p-2 shadow-sm hover:ring-1 hover:ring-blue-400"
                  >
                    <div className="flex items-center gap-1">
                      {l.priority === "HIGH" && (
                        <Flame className="h-3 w-3 text-rose-500" />
                      )}
                      <p className="text-xs font-medium line-clamp-1">{l.name}</p>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {l.phone}
                    </p>
                    {l.preferredCountry && (
                      <p className="text-[10px] text-gray-400">
                        {l.preferredCountry}
                      </p>
                    )}
                    {l.assignedTo && (
                      <p className="mt-1 inline-block text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1 rounded">
                        {l.assignedTo.name ?? l.assignedTo.email.split("@")[0]}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
