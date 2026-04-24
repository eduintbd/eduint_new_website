import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";
import { logActivity } from "@/lib/activity";

export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const scope = searchParams.get("scope") ?? "upcoming";
  const viewAll = can(sess.role, "admin.viewAllLeads");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (!viewAll) where.assignedToId = sess.userId;
  if (scope === "upcoming") where.slot = { gte: new Date() };
  if (scope === "past")
    where.slot = { lt: new Date() };

  const rows = await db.counselorBooking.findMany({
    where,
    orderBy: { slot: scope === "past" ? "desc" : "asc" },
    take: 300,
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      lead: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json({ bookings: rows, scope: viewAll ? "team" : "self" });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z
    .enum(["REQUESTED", "CONFIRMED", "DONE", "NO_SHOW", "CANCELLED"])
    .optional(),
  adminNotes: z.string().max(2000).optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  assignedToId: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  const { id, ...rest } = parsed.data;

  const existing = await db.counselorBooking.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const viewAll = can(sess.role, "admin.viewAllLeads");
  if (!viewAll && existing.assignedToId !== sess.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    rest.assignedToId !== undefined &&
    !can(sess.role, "admin.assignLeads")
  ) {
    delete rest.assignedToId;
  }

  const updated = await db.counselorBooking.update({ where: { id }, data: rest });

  const promises: Promise<unknown>[] = [];
  if (rest.status && rest.status !== existing.status) {
    promises.push(
      logActivity({
        entityType: "BOOKING",
        entityId: id,
        action: "STATUS_CHANGED",
        actorId: sess.userId,
        metadata: { from: existing.status, to: rest.status },
      })
    );
  }
  if (
    rest.assignedToId !== undefined &&
    rest.assignedToId !== existing.assignedToId
  ) {
    const action = rest.assignedToId ? "ASSIGNED" : "UNASSIGNED";
    let assigneeName: string | null = null;
    if (rest.assignedToId) {
      const u = await db.user.findUnique({
        where: { id: rest.assignedToId },
        select: { name: true, email: true },
      });
      assigneeName = u?.name ?? u?.email ?? null;
    }
    promises.push(
      logActivity({
        entityType: "BOOKING",
        entityId: id,
        action,
        actorId: sess.userId,
        metadata: { assigneeId: rest.assignedToId, assigneeName },
      })
    );
  }
  await Promise.all(promises);

  return NextResponse.json({ booking: updated });
}
