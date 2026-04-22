import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SCHOLARSHIPS_SEED } from "@/lib/scholarships-seed";

async function ensureSeeded() {
  const count = await db.scholarship.count();
  if (count === 0) {
    await db.scholarship.createMany({ data: SCHOLARSHIPS_SEED });
  }
}

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? undefined;
  const level = searchParams.get("level") ?? undefined;
  const field = searchParams.get("field") ?? undefined;
  const minAmount = Number(searchParams.get("minAmount") ?? 0);

  const where: Record<string, unknown> = {};
  if (country && country !== "ALL") where.country = country;
  if (level && level !== "ANY") where.level = level;
  if (field && field !== "ANY") where.field = field;
  if (minAmount > 0) where.amountValue = { gte: minAmount };

  const rows = await db.scholarship.findMany({
    where,
    orderBy: [{ featured: "desc" }, { amountValue: "desc" }],
  });
  return NextResponse.json({ scholarships: rows });
}
