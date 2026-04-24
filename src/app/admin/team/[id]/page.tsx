"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { roleLabel } from "@/lib/roles";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  phone: string | null;
  createdAt: string;
};

type KPIs = {
  leadsAssigned: number;
  bookingsAssigned: number;
  leadsConverted: number;
  openReminders: number;
};

export default function TeamMemberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/team/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setMember(d.user);
        setKpis(d.kpis);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !member) {
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
        <ArrowLeft className="h-4 w-4" /> Back to team
      </button>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center font-semibold">
            {(member.name ?? member.email)[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{member.name ?? "—"}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
            <p className="text-xs mt-1">
              {roleLabel(member.role)} ·{" "}
              {member.isActive ? "Active" : "Deactivated"} · joined{" "}
              {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Leads assigned (30d)" value={kpis.leadsAssigned} />
          <KpiCard label="Leads converted (30d)" value={kpis.leadsConverted} />
          <KpiCard label="Bookings (30d)" value={kpis.bookingsAssigned} />
          <KpiCard label="Open reminders" value={kpis.openReminders} />
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{label}</p>
    </div>
  );
}
