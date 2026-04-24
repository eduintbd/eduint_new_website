import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const apps = await db.application.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const programIds = [...new Set(apps.map((a) => a.programId))];
  const userIds = [...new Set(apps.map((a) => a.userId))];
  const [programs, users] = await Promise.all([
    db.program.findMany({
      where: { id: { in: programIds } },
      include: { university: true },
    }),
    db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    }),
  ]);
  const programMap = Object.fromEntries(programs.map((p) => [p.id, p]));
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {apps.length} student application{apps.length === 1 ? "" : "s"} tracked
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
            <tr>
              <th className="text-left px-3 py-2">Student</th>
              <th className="text-left px-3 py-2">Program</th>
              <th className="text-left px-3 py-2">Country</th>
              <th className="text-left px-3 py-2">Stage</th>
              <th className="text-left px-3 py-2">Deadline</th>
              <th className="text-left px-3 py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => {
              const u = userMap[a.userId];
              const p = programMap[a.programId];
              return (
                <tr
                  key={a.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-2 font-medium">
                    {u?.name ?? u?.email ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {p ? (
                      <Link
                        href={`/programs/${p.id}`}
                        className="hover:text-blue-600"
                      >
                        {p.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                    {p?.university && (
                      <p className="text-[10px] text-gray-500">
                        {p.university.name}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2">{p?.country ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {a.stage}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-gray-500">
                    {a.deadline ? new Date(a.deadline).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-gray-500">
                    {new Date(a.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {apps.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500 text-xs">
                  <ClipboardCheck className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                  No applications yet. Students create these from their own dashboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
