"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, UserCog } from "lucide-react";
import { useSession } from "next-auth/react";
import { can, roleLabel, type Role } from "@/lib/roles";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  isActive: boolean;
};

const ASSIGNABLE = ["COUNSELOR", "MANAGER", "ADMIN"] as const;

export default function AdminTeamPage() {
  const { data: session } = useSession();
  const role = (session?.user?.role as Role) ?? "COUNSELOR";
  const canManage = can(role, "admin.manageTeam");

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<(typeof ASSIGNABLE)[number]>("COUNSELOR");
  const [lastInvite, setLastInvite] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    if (res.ok) {
      const { users } = await res.json();
      setMembers(users);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function invite() {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error("Name and email required");
      return;
    }
    const res = await fetch("/api/admin/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        role: newRole,
        phone: newPhone || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Invite failed");
      return;
    }
    setLastInvite({ email: newEmail, tempPassword: data.tempPassword });
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("COUNSELOR");
    setInviteOpen(false);
    await load();
    toast.success("Invite email sent");
  }

  async function updateMember(id: string, patch: Partial<Member>) {
    const res = await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {members.length} active member{members.length === 1 ? "" : "s"}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setInviteOpen(!inviteOpen)}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" /> Invite member
          </button>
        )}
      </div>

      {inviteOpen && canManage && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h2 className="text-sm font-semibold mb-3">Invite new team member</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
            />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
            />
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Phone (optional, for WhatsApp nudges)"
              className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as (typeof ASSIGNABLE)[number])}
              className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm"
            >
              {ASSIGNABLE.map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setInviteOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={invite}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-medium"
            >
              Send invite
            </button>
          </div>
        </div>
      )}

      {lastInvite && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 p-3 text-xs text-amber-900 dark:text-amber-200">
          Invite sent to <strong>{lastInvite.email}</strong>. Temp password (also in the email):{" "}
          <code className="bg-white/50 px-1.5 rounded font-mono">
            {lastInvite.tempPassword}
          </code>{" "}
          — ask them to change it after first login.
          <button
            onClick={() => setLastInvite(null)}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Phone</th>
              <th className="text-left px-3 py-2">Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                <td className="px-3 py-2 font-medium">{m.name ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{m.email}</td>
                <td className="px-3 py-2">
                  {canManage ? (
                    <select
                      value={m.role}
                      onChange={(e) => updateMember(m.id, { role: e.target.value as Role })}
                      className="text-xs px-1.5 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent"
                    >
                      {ASSIGNABLE.map((r) => (
                        <option key={r} value={r}>
                          {roleLabel(r)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs">{roleLabel(m.role)}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">{m.phone ?? "—"}</td>
                <td className="px-3 py-2">
                  {canManage ? (
                    <button
                      onClick={() => updateMember(m.id, { isActive: !m.isActive })}
                      className={`text-[10px] px-2 py-0.5 rounded ${m.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}
                    >
                      {m.isActive ? "Active" : "Inactive"}
                    </button>
                  ) : (
                    <span className="text-[10px]">{m.isActive ? "Active" : "Inactive"}</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/admin/team/${m.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <UserCog className="h-3 w-3" /> Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
