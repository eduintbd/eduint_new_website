import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { can } from "@/lib/roles";

export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const { searchParams } = new URL(req.url);
  const take = Math.min(50, Math.max(1, Number(searchParams.get("take") ?? 20)));

  const viewAll = can(sess.role, "admin.viewAllLeads");

  // Counselors are restricted to LEAD activity for leads assigned to them.
  // Managers/Admins see the whole team feed.
  const where: Record<string, unknown> = viewAll
    ? {}
    : await (async () => {
        const myLeads = await db.lead.findMany({
          where: { assignedToId: sess.userId },
          select: { id: true },
        });
        return {
          entityType: "LEAD",
          entityId: { in: myLeads.map((l) => l.id) },
        };
      })();

  const rows = await db.activityLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      actor: { select: { id: true, name: true, email: true } },
    },
  });

  // Hydrate a lead-name lookup for LEAD entries so the UI can show context.
  const leadIds = Array.from(
    new Set(rows.filter((r) => r.entityType === "LEAD").map((r) => r.entityId))
  );
  const leads = leadIds.length
    ? await db.lead.findMany({
        where: { id: { in: leadIds } },
        select: { id: true, name: true },
      })
    : [];
  const leadNameById = new Map(leads.map((l) => [l.id, l.name]));

  const items = rows.map((r) => ({
    id: r.id,
    entityType: r.entityType,
    entityId: r.entityId,
    action: r.action,
    metadata: r.metadata,
    createdAt: r.createdAt,
    actor: r.actor,
    leadName: r.entityType === "LEAD" ? leadNameById.get(r.entityId) ?? null : null,
  }));

  return NextResponse.json({
    items,
    scope: viewAll ? "team" : "self",
  });
}
