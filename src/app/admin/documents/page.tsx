import { db } from "@/lib/db";
import { FolderCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const docs = await db.document.findMany({
    orderBy: { uploadedAt: "desc" },
    take: 100,
  });

  const userIds = [...new Set(docs.map((d) => d.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {docs.length} document{docs.length === 1 ? "" : "s"} · review queue
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
            <tr>
              <th className="text-left px-3 py-2">Student</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">File</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => {
              const u = userMap[d.userId];
              return (
                <tr
                  key={d.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-2 font-medium">{u?.name ?? u?.email ?? "—"}</td>
                  <td className="px-3 py-2">{d.type}</td>
                  <td className="px-3 py-2 text-[10px] truncate max-w-[200px]">{d.fileName}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                        d.status === "VERIFIED"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : d.status === "REJECTED"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-gray-500">
                    {new Date(d.uploadedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {docs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 text-xs">
                  <FolderCheck className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                  No documents uploaded yet. (Note: cloud storage not yet wired —
                  students are told to email documents in the v1 flow.)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
