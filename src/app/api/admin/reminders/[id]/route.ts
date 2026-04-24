import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { requirePermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";

const patchSchema = z.object({
  completed: z.boolean().optional(),
  dueAt: z.string().optional(),
  title: z.string().min(2).max(200).optional(),
  note: z.string().max(1000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );

  const existing = await db.reminder.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Counselors only modify their own; managers/admins can modify any
  if (
    existing.assignedToId !== sess.userId &&
    existing.createdById !== sess.userId &&
    sess.role === "COUNSELOR"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title) data.title = parsed.data.title;
  if (parsed.data.note !== undefined) data.note = parsed.data.note;
  if (parsed.data.dueAt) data.dueAt = new Date(parsed.data.dueAt);
  if (parsed.data.completed !== undefined) {
    data.completed = parsed.data.completed;
    data.completedAt = parsed.data.completed ? new Date() : null;
  }

  const updated = await db.reminder.update({ where: { id }, data });

  if (existing.leadId) {
    if (parsed.data.completed === true) {
      await logActivity({
        entityType: "LEAD",
        entityId: existing.leadId,
        action: "REMINDER_DONE",
        actorId: sess.userId,
        metadata: { reminderId: id },
      });
    } else if (parsed.data.dueAt) {
      await logActivity({
        entityType: "LEAD",
        entityId: existing.leadId,
        action: "REMINDER_SNOOZED",
        actorId: sess.userId,
        metadata: { reminderId: id, until: parsed.data.dueAt },
      });
    }
  }

  return NextResponse.json({ reminder: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;
  const existing = await db.reminder.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: true });
  if (
    existing.assignedToId !== sess.userId &&
    existing.createdById !== sess.userId &&
    sess.role === "COUNSELOR"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.reminder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
