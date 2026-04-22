import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 as const };
  if (session.user.role !== "ADMIN")
    return { error: "Forbidden", status: 403 as const };
  return { userId: session.user.id };
}

export async function GET() {
  const a = await requireAdmin();
  if ("error" in a)
    return NextResponse.json({ error: a.error }, { status: a.status });
  const rows = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ leads: rows });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"])
    .optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(req: NextRequest) {
  const a = await requireAdmin();
  if ("error" in a)
    return NextResponse.json({ error: a.error }, { status: a.status });
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  const { id, ...rest } = parsed.data;
  const updated = await db.lead.update({ where: { id }, data: rest });
  return NextResponse.json({ lead: updated });
}
