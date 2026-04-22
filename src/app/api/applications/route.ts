import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  programId: z.string().min(1),
  stage: z
    .enum(["DRAFT", "SUBMITTED", "OFFER", "VISA", "ENROLLED", "REJECTED"])
    .default("DRAFT"),
  nextAction: z.string().max(300).optional(),
  deadline: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const updateSchema = createSchema.extend({
  id: z.string().min(1),
}).partial({ programId: true });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.application.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  // Hydrate program info for display
  const programIds = [...new Set(rows.map((r) => r.programId))];
  const programs = await db.program.findMany({
    where: { id: { in: programIds } },
    include: { university: true },
  });
  const programMap = Object.fromEntries(programs.map((p) => [p.id, p]));
  return NextResponse.json({
    applications: rows.map((r) => ({ ...r, program: programMap[r.programId] ?? null })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }
  const { deadline, ...rest } = parsed.data;
  const row = await db.application.create({
    data: {
      userId: session.user.id,
      ...rest,
      deadline: deadline ? new Date(deadline) : null,
    },
  });
  return NextResponse.json({ application: row }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }
  const { id, deadline, ...rest } = parsed.data;
  const existing = await db.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const row = await db.application.update({
    where: { id },
    data: {
      ...rest,
      deadline: deadline ? new Date(deadline) : undefined,
    },
  });
  return NextResponse.json({ application: row });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const existing = await db.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await db.application.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
