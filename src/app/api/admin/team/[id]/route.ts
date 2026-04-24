import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";

const patchSchema = z.object({
  role: z.enum(["STUDENT", "COUNSELOR", "MANAGER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(32).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      createdAt: true,
    },
  });
  if (!user)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // KPIs (last 30d)
  const from = new Date();
  from.setDate(from.getDate() - 30);

  const [leadsAssigned, bookingsAssigned, leadsConverted, openReminders] =
    await Promise.all([
      db.lead.count({ where: { assignedToId: id, createdAt: { gte: from } } }),
      db.counselorBooking.count({
        where: { assignedToId: id, createdAt: { gte: from } },
      }),
      db.lead.count({
        where: {
          assignedToId: id,
          status: "CONVERTED",
          updatedAt: { gte: from },
        },
      }),
      db.reminder.count({
        where: { assignedToId: id, completed: false },
      }),
    ]);

  return NextResponse.json({
    user,
    kpis: { leadsAssigned, bookingsAssigned, leadsConverted, openReminders },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.manageTeam");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );

  const existing = await db.user.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.user.update({
    where: { id },
    data: parsed.data,
  });

  if (parsed.data.role && parsed.data.role !== existing.role) {
    await logActivity({
      entityType: "USER",
      entityId: id,
      action: "ROLE_CHANGED",
      actorId: sess.userId,
      metadata: { from: existing.role, to: parsed.data.role },
    });
  }
  if (
    parsed.data.isActive !== undefined &&
    parsed.data.isActive !== existing.isActive
  ) {
    await logActivity({
      entityType: "USER",
      entityId: id,
      action: parsed.data.isActive ? "REACTIVATED" : "DEACTIVATED",
      actorId: sess.userId,
    });
  }

  return NextResponse.json({ user: updated });
}
