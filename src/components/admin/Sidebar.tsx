"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  FolderCheck,
  BellRing,
  PartyPopper,
  BarChart3,
  Settings2,
  LogOut,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { can, type Role } from "@/lib/roles";

type Props = {
  role: Role;
  userName: string | null;
  userEmail: string;
};

const BASE_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, perm: "admin.access" as const },
  { href: "/admin/leads", label: "Leads", icon: Users, perm: "admin.access" as const },
  { href: "/admin/students", label: "Students", icon: GraduationCap, perm: "admin.access" as const },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar, perm: "admin.access" as const },
  { href: "/admin/applications", label: "Applications", icon: ClipboardCheck, perm: "admin.access" as const },
  { href: "/admin/documents", label: "Documents", icon: FolderCheck, perm: "admin.access" as const },
  { href: "/admin/reminders", label: "Reminders", icon: BellRing, perm: "admin.access" as const, badgeKey: "overdue" as const },
  { href: "/admin/events", label: "Events", icon: PartyPopper, perm: "admin.access" as const },
  { href: "/admin/team", label: "Team", icon: Users, perm: "admin.manageTeam" as const },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, perm: "admin.viewReports" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings2, perm: "admin.settings" as const },
];

export default function Sidebar({ role, userName, userEmail }: Props) {
  const pathname = usePathname();
  const [overdue, setOverdue] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/reminders?scope=overdue&mine=1&countOnly=1")
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d) => {
        if (!cancelled) setOverdue(Number(d.count ?? 0));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const items = BASE_ITEMS.filter((it) => can(role, it.perm));

  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <GraduationCap className="h-6 w-6 text-blue-600" />
        <div>
          <Link href="/" className="text-sm font-bold tracking-tight">
            EDUINTBD
          </Link>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Admin · {role.toLowerCase()}
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 text-sm">
        {items.map((it) => {
          const Icon = it.icon;
          const active =
            it.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(it.href);
          const badge = it.badgeKey === "overdue" && overdue > 0 ? overdue : null;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                active
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{it.label}</span>
              {badge != null && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-semibold">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 text-xs">
        <p className="font-medium truncate">{userName ?? userEmail}</p>
        <p className="text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
        <div className="mt-2 flex items-center gap-2">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            <MessageSquare className="h-3 w-3" /> AI chat
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-auto inline-flex items-center gap-1 text-rose-600 hover:underline"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
