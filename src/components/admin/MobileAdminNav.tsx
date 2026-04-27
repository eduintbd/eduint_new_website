"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { can, type Role } from "@/lib/roles";

const ITEMS = [
  { href: "/admin", label: "Dashboard", perm: "admin.access" as const },
  { href: "/admin/leads", label: "Leads", perm: "admin.access" as const },
  { href: "/admin/bookings", label: "Bookings", perm: "admin.access" as const },
  { href: "/admin/reminders", label: "Reminders", perm: "admin.access" as const },
  { href: "/admin/team", label: "Team", perm: "admin.manageTeam" as const },
  { href: "/admin/reports", label: "Reports", perm: "admin.viewReports" as const },
  { href: "/admin/settings", label: "Settings", perm: "admin.settings" as const },
];

export default function MobileAdminNav({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = ITEMS.filter((it) => can(role, it.perm));
  return (
    <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-bold">EDUINTBD Admin</span>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-gray-200 dark:border-gray-800 px-2 py-2 space-y-1 text-sm">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg ${
                pathname === it.href
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
