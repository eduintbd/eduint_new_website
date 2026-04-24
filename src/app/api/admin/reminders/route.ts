import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";
import { logActivity } from "@/lib/activity";

const createSchema = z.object({
  title: z.string().min(2).max(200),
  note: z.string().max(1000).optional(),
  dueAt: z.string().min(1),
  leadId: z.string().optional(),
  bookingId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "all"; // overdue | today | upcoming | all
  const mineOnly = searchParams.get("mine") !== "0";
  const countOnly = searchParams.get("countOnly") === "1";

  const now = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const where: Record<string, unknown> = { completed: false };
  if (mineOnly || !can(sess.role, "admin.viewAllLeads")) {
    where.assignedToId = sess.userId;
  }
  if (scope === "overdue") where.dueAt = { lt: now };
  else if (scope === "today") where.dueAt = { gte: now, lte: endOfToday };
  else if (scope === "upcoming") where.dueAt = { gt: endOfToday };

  if (countOnly) {
    const count = await db.reminder.count({ where });
    return NextResponse.json({ count });
  }

  const rows = await db.reminder.findMany({
    where,
    orderBy: { dueAt: "asc" },
    take: 200,
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      lead: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json({ reminders: rows });
}

export async function POST(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );

  // Counselors can only create reminders for themselves; managers/admins can assign
  const assignedToId =
    parsed.data.assignedToId && can(sess.role, "admin.assignLeads")
      ? parsed.data.assignedToId
      : sess.userId;

  const reminder = await db.reminder.create({
    data: {
      title: parsed.data.title,
      note: parsed.data.note,
      dueAt: new Date(parsed.data.dueAt),
      leadId: parsed.data.leadId,
      bookingId: parsed.data.bookingId,
      assignedToId,
      createdById: sess.userId,
    },
  });

  if (parsed.data.leadId) {
    await logActivity({
      entityType: "LEAD",
      entityId: parsed.data.leadId,
      action: "REMINDER_SET",
      actorId: sess.userId,
      metadata: { reminderId: reminder.id, dueAt: reminder.dueAt.toISOString() },
    });
  }

  return NextResponse.json({ reminder }, { status: 201 });
}
