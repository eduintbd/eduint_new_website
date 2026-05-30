"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FolderCheck,
  GraduationCap,
  Loader2,
  Mail,
  Search,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

type Student = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  nationality: string | null;
  method: string;
  createdAt: string;
  savedCount: number;
  documentCount: number;
  applicationCount: number;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nationality, setNationality] = useState("");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (nationality) params.set("nationality", nationality);
    const res = await fetch(`/api/admin/students?${params}`);
    const data = await res.json();
    setStudents(data.students ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, nationality]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {students.length} registered account{students.length === 1 ? "" : "s"}{" "}
          · everyone who signed up on the website
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / email / phone"
              className="w-full pl-8 pr-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="py-1.5 px-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="">Any nationality</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flagEmoji} {c.name}
              </option>
            ))}
          </select>
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
                <th className="text-left px-3 py-2">Joined</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Nationality</th>
                <th className="text-left px-3 py-2">Sign-up</th>
                <th className="text-center px-3 py-2">Saved</th>
                <th className="text-center px-3 py-2">Docs</th>
                <th className="text-center px-3 py-2">Apps</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {s.name ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={`mailto:${s.email}`}
                      className="inline-flex items-center gap-1 hover:text-blue-600"
                    >
                      <Mail className="h-3 w-3 text-gray-400" />
                      {s.email}
                    </a>
                    {!s.emailVerified && (
                      <span className="ml-1.5 text-[9px] text-amber-600 dark:text-amber-400">
                        unverified
                      </span>
                    )}
                    {s.phone && (
                      <div className="text-[10px] text-gray-500">{s.phone}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">{s.nationality ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        s.method === "Google"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : s.method === "Email"
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      {s.method}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">{s.savedCount}</td>
                  <td className="px-3 py-2 text-center">
                    {s.documentCount > 0 ? (
                      <span className="inline-flex items-center gap-0.5">
                        <FolderCheck className="h-3 w-3 text-gray-400" />
                        {s.documentCount}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {s.applicationCount > 0 ? (
                      <span className="inline-flex items-center gap-0.5">
                        <FileText className="h-3 w-3 text-gray-400" />
                        {s.applicationCount}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    <GraduationCap className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                    No students match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Tip: leads from contact &amp; booking forms live under{" "}
        <Link href="/admin/leads" className="text-blue-600 hover:underline">
          Leads
        </Link>
        . This page shows people who created an account.
      </p>
    </div>
  );
}
