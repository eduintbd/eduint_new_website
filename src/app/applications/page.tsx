"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
} from "lucide-react";

type Stage =
  | "DRAFT"
  | "SUBMITTED"
  | "OFFER"
  | "VISA"
  | "ENROLLED"
  | "REJECTED";

type Application = {
  id: string;
  programId: string;
  stage: Stage;
  nextAction: string | null;
  deadline: string | null;
  notes: string | null;
  program?: {
    id: string;
    name: string;
    country: string;
    university: { name: string };
  } | null;
};

type ProgramLite = { id: string; name: string; country: string };

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "DRAFT", label: "Drafting", color: "bg-gray-100 dark:bg-gray-800" },
  {
    key: "SUBMITTED",
    label: "Submitted",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  { key: "OFFER", label: "Offer", color: "bg-amber-100 dark:bg-amber-900/30" },
  {
    key: "VISA",
    label: "Visa stage",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    key: "ENROLLED",
    label: "Enrolled",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    key: "REJECTED",
    label: "Not successful",
    color: "bg-rose-100 dark:bg-rose-900/30",
  },
];

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<Application[]>([]);
  const [programs, setPrograms] = useState<ProgramLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newProgramId, setNewProgramId] = useState("");
  const [newStage, setNewStage] = useState<Stage>("DRAFT");

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/applications").then((r) => r.json()),
      fetch("/api/programs?limit=100").then((r) => r.json()),
    ])
      .then(([a, p]) => {
        setApps(a.applications ?? []);
        setPrograms(
          (p.programs ?? []).map((pr: ProgramLite) => ({
            id: pr.id,
            name: pr.name,
            country: pr.country,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [status]);

  async function createApp() {
    if (!newProgramId) {
      toast.error("Pick a program");
      return;
    }
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId: newProgramId, stage: newStage }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed");
      return;
    }
    setApps((prev) => [data.application, ...prev]);
    setAdding(false);
    setNewProgramId("");
    setNewStage("DRAFT");
    toast.success("Application tracked");
    // re-fetch to hydrate program info
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setApps(d.applications ?? []));
  }

  async function moveStage(id: string, stage: Stage) {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage }),
    });
    if (!res.ok) {
      toast.error("Could not update");
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)));
  }

  async function remove(id: string) {
    if (!confirm("Remove this application from your tracker?")) return;
    const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not remove");
      return;
    }
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <h1 className="text-xl font-bold mb-2">Sign in to track applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your personal pipeline — from draft to enrolled.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My applications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag cards between stages as you progress.
          </p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Track a program
        </button>
      </div>

      {adding && (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={newProgramId}
              onChange={(e) => setNewProgramId(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            >
              <option value="">Pick a program…</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.country})
                </option>
              ))}
            </select>
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as Stage)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={createApp}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-3">No applications yet. Add your first one above.</p>
          <Link href="/programs" className="text-blue-600 hover:underline text-sm">
            Browse programs →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {STAGES.map((stage) => {
            const list = apps.filter((a) => a.stage === stage.key);
            return (
              <div
                key={stage.key}
                className={`rounded-xl p-3 ${stage.color} min-h-[200px]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    {stage.label}
                  </p>
                  <span className="text-[10px] bg-white/70 dark:bg-black/20 px-2 py-0.5 rounded-full">
                    {list.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {list.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-lg bg-white dark:bg-gray-900 p-3 shadow-sm"
                    >
                      <p className="text-sm font-medium line-clamp-2">
                        {a.program?.name ?? a.programId}
                      </p>
                      {a.program && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {a.program.university.name} · {a.program.country}
                        </p>
                      )}
                      {a.deadline && (
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(a.deadline).toLocaleDateString()}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        <select
                          value={a.stage}
                          onChange={(e) =>
                            moveStage(a.id, e.target.value as Stage)
                          }
                          className="flex-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 bg-transparent px-1.5 py-1"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        {a.program && (
                          <Link
                            href={`/programs/${a.program.id}`}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => remove(a.id)}
                          className="p-1 text-rose-500 hover:text-rose-600"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
