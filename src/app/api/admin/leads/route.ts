import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";
import { logActivity } from "@/lib/activity";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]).optional(),
  stage: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "COUNSELING",
      "APPLYING",
      "OFFER",
      "VISA",
      "ENROLLED",
      "LOST",
    ])
    .optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).optional(),
  tags: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  nextActionAt: z.string().optional(),
  nextActionNote: z.string().max(500).optional(),
  assignedToId: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status") ?? undefined;
  const stage = searchParams.get("stage") ?? undefined;
  const assignedToRaw = searchParams.get("assignedTo");
  const country = searchParams.get("country") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const take = Math.min(500, Math.max(1, Number(searchParams.get("take") ?? 200)));

  // Counselors can never see others' leads
  const viewAll = can(sess.role, "admin.viewAllLeads");
  const assignedTo = viewAll
    ? assignedToRaw === "me"
      ? sess.userId
      : assignedToRaw === "unassigned"
        ? null
        : assignedToRaw && assignedToRaw !== "all"
          ? assignedToRaw
          : undefined
    : sess.userId;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (stage) where.stage = stage;
  if (priority) where.priority = priority;
  if (country) where.preferredCountry = country;
  if (source) where.source = { contains: source };
  if (tag) where.tags = { contains: tag };
  if (assignedTo === null) where.assignedToId = null;
  else if (assignedTo !== undefined) where.assignedToId = assignedTo;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const rows = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return NextResponse.json({ leads: rows, scope: viewAll ? "team" : "self" });
}

export async function PATCH(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }
  const { id, ...rest } = parsed.data;

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Counselors can only edit leads assigned to them
  const viewAll = can(sess.role, "admin.viewAllLeads");
  if (!viewAll && existing.assignedToId !== sess.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: Record<string, unknown> = { ...rest };
  if (rest.nextActionAt) {
    data.nextActionAt = new Date(rest.nextActionAt);
  }
  // Only managers/admin can reassign
  if (rest.assignedToId !== undefined && !can(sess.role, "admin.assignLeads")) {
    delete data.assignedToId;
  }

  const updated = await db.lead.update({ where: { id }, data });

  // Log changes
  const promises: Promise<unknown>[] = [];
  if (rest.status && rest.status !== existing.status) {
    promises.push(
      logActivity({
        entityType: "LEAD",
        entityId: id,
        action: "STATUS_CHANGED",
        actorId: sess.userId,
        metadata: { from: existing.status, to: rest.status },
      })
    );
  }
  if (rest.stage && rest.stage !== existing.stage) {
    promises.push(
      logActivity({
        entityType: "LEAD",
        entityId: id,
        action: "STAGE_CHANGED",
        actorId: sess.userId,
        metadata: { from: existing.stage, to: rest.stage },
      })
    );
  }
  if (rest.priority && rest.priority !== existing.priority) {
    promises.push(
      logActivity({
        entityType: "LEAD",
        entityId: id,
        action: "PRIORITY_CHANGED",
        actorId: sess.userId,
        metadata: { from: existing.priority, to: rest.priority },
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
        entityType: "LEAD",
        entityId: id,
        action,
        actorId: sess.userId,
        metadata: { assigneeId: rest.assignedToId, assigneeName },
      })
    );
  }
  if (rest.notes && rest.notes !== existing.notes) {
    promises.push(
      logActivity({
        entityType: "LEAD",
        entityId: id,
        action: "NOTE_ADDED",
        actorId: sess.userId,
      })
    );
  }
  await Promise.all(promises);

  return NextResponse.json({ lead: updated });
}
