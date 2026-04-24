import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
      bookings: { orderBy: { slot: "desc" }, take: 5 },
      reminders: {
        where: { completed: false },
        orderBy: { dueAt: "asc" },
        take: 5,
      },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const viewAll = can(sess.role, "admin.viewAllLeads");
  if (!viewAll && lead.assignedToId !== sess.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Recent activity — manual filter since ActivityLog is polymorphic
  const activity = await db.activityLog.findMany({
    where: { entityType: "LEAD", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ lead, activity });
}
