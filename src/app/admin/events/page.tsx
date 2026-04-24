import Link from "next/link";
import { db } from "@/lib/db";
import { PartyPopper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { startAt: "asc" },
    take: 30,
    include: {
      registrations: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {events.length} scheduled
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase">
            <tr>
              <th className="text-left px-3 py-2">Title</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">Start</th>
              <th className="text-left px-3 py-2">Location</th>
              <th className="text-left px-3 py-2">Registered</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-t border-gray-100 dark:border-gray-800"
              >
                <td className="px-3 py-2 font-medium">
                  <Link href="/events" className="hover:text-blue-600">
                    {e.title}
                  </Link>
                </td>
                <td className="px-3 py-2">{e.type}</td>
                <td className="px-3 py-2 text-[10px]">
                  {new Date(e.startAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">{e.location}</td>
                <td className="px-3 py-2">
                  <span className="font-medium">{e.registrations.length}</span>
                  {e.capacity && (
                    <span className="text-[10px] text-gray-500"> / {e.capacity}</span>
                  )}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 text-xs">
                  <PartyPopper className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                  No events scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
