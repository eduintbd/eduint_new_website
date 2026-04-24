import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { requirePermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";

const schema = z.object({
  assignedToId: z.string().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.assignLeads");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const assigneeId = parsed.data.assignedToId;
  let assigneeName: string | null = null;
  if (assigneeId) {
    const u = await db.user.findUnique({
      where: { id: assigneeId },
      select: { name: true, email: true, role: true, isActive: true },
    });
    if (!u || !u.isActive) {
      return NextResponse.json({ error: "Assignee not found or inactive" }, { status: 400 });
    }
    assigneeName = u.name ?? u.email;
  }

  const updated = await db.lead.update({
    where: { id },
    data: { assignedToId: assigneeId },
  });
  await logActivity({
    entityType: "LEAD",
    entityId: id,
    action: assigneeId ? "ASSIGNED" : "UNASSIGNED",
    actorId: sess.userId,
    metadata: { assigneeId, assigneeName },
  });
  return NextResponse.json({ lead: updated });
}
