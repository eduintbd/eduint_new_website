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

  const booking = await db.counselorBooking.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
      lead: { select: { id: true, name: true, phone: true } },
    },
  });
  if (!booking)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const viewAll = can(sess.role, "admin.viewAllLeads");
  if (!viewAll && booking.assignedToId !== sess.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const activity = await db.activityLog.findMany({
    where: { entityType: "BOOKING", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { actor: { select: { name: true, email: true } } },
  });
  return NextResponse.json({ booking, activity });
}
