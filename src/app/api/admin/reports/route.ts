import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const { searchParams } = new URL(req.url);
  const rangeDays = Math.max(1, Math.min(365, Number(searchParams.get("days") ?? 30)));
  const from = daysAgo(rangeDays);

  // Counselors see only their own data
  const leadWhere =
    can(sess.role, "admin.viewAllLeads")
      ? { createdAt: { gte: from } }
      : { createdAt: { gte: from }, assignedToId: sess.userId };

  const bookingWhere =
    can(sess.role, "admin.viewAllLeads")
      ? {}
      : { assignedToId: sess.userId };

  // Parallel queries
  const [
    leadsRows,
    stageGroups,
    sourceGroups,
    statusGroups,
    bookingsToday,
    overdueReminders,
    totalLeads30d,
    convertedLeads30d,
    counselorLeaderboard,
    dailyTrend,
    upcomingBookings,
  ] = await Promise.all([
    db.lead.findMany({ where: leadWhere, select: { id: true, stage: true, source: true, createdAt: true } }),
    db.lead.groupBy({ by: ["stage"], where: leadWhere, _count: true }),
    db.lead.groupBy({ by: ["source"], where: leadWhere, _count: true, orderBy: { _count: { source: "desc" } }, take: 6 }),
    db.lead.groupBy({ by: ["status"], where: leadWhere, _count: true }),
    db.counselorBooking.count({
      where: {
        ...bookingWhere,
        slot: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    db.reminder.count({
      where: {
        assignedToId: sess.userId,
        completed: false,
        dueAt: { lt: new Date() },
      },
    }),
    db.lead.count({ where: leadWhere }),
    db.lead.count({ where: { ...leadWhere, status: "CONVERTED" } }),
    can(sess.role, "admin.viewReports")
      ? db.lead.groupBy({
          by: ["assignedToId"],
          where: {
            createdAt: { gte: from },
            assignedToId: { not: null },
          },
          _count: true,
          orderBy: { _count: { assignedToId: "desc" } },
          take: 5,
        })
      : Promise.resolve([] as { assignedToId: string | null; _count: number }[]),
    db.lead.findMany({
      where: leadWhere,
      select: { createdAt: true },
    }),
    db.counselorBooking.findMany({
      where: { ...bookingWhere, slot: { gte: new Date() } },
      orderBy: { slot: "asc" },
      take: 5,
      select: { id: true, name: true, slot: true, status: true, topic: true },
    }),
  ]);

  // Hydrate counselor names
  const counselorIds = counselorLeaderboard
    .map((r) => r.assignedToId)
    .filter((x): x is string => !!x);
  const counselors = counselorIds.length
    ? await db.user.findMany({
        where: { id: { in: counselorIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const counselorMap = Object.fromEntries(counselors.map((u) => [u.id, u]));

  // Ensure every stage appears (for a clean funnel chart)
  const stageCounts = STAGES.map((s) => ({
    stage: s,
    count: stageGroups.find((g) => g.stage === s)?._count ?? 0,
  }));

  // Daily trend: buckets by day
  const byDay = new Map<string, number>();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = daysAgo(i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of dailyTrend) {
    const k = r.createdAt.toISOString().slice(0, 10);
    if (byDay.has(k)) byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  const trend = [...byDay.entries()].map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    summary: {
      leadsInRange: totalLeads30d,
      convertedInRange: convertedLeads30d,
      conversionRate: totalLeads30d === 0 ? 0 : Math.round((convertedLeads30d / totalLeads30d) * 1000) / 10,
      bookingsToday,
      overdueReminders,
      rangeDays,
    },
    funnel: stageCounts,
    sources: sourceGroups.map((g) => ({ source: g.source, count: g._count })),
    statuses: statusGroups.map((g) => ({ status: g.status, count: g._count })),
    counselors: counselorLeaderboard.map((r) => ({
      userId: r.assignedToId,
      name: r.assignedToId ? counselorMap[r.assignedToId]?.name ?? counselorMap[r.assignedToId]?.email ?? "—" : "Unassigned",
      count: r._count,
    })),
    trend,
    upcomingBookings,
    _scope: can(sess.role, "admin.viewAllLeads") ? "team" : "self",
    _leadCount: leadsRows.length,
  });
}
