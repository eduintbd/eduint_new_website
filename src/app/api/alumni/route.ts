import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ALUMNI_SEED } from "@/lib/alumni-seed";

async function ensureSeeded() {
  const count = await db.alumniStory.count();
  if (count === 0) {
    await db.alumniStory.createMany({ data: ALUMNI_SEED });
  }
}

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? undefined;
  const field = searchParams.get("field") ?? undefined;
  const level = searchParams.get("level") ?? undefined;
  const gpaStr = searchParams.get("gpa");
  const gpa4 = gpaStr ? Number(gpaStr) : undefined;

  const where: Record<string, unknown> = {};
  if (country) where.country = country.toUpperCase();
  if (field && field !== "ANY") where.field = field.toUpperCase();
  if (level && level !== "ANY") where.level = level.toUpperCase();

  let stories = await db.alumniStory.findMany({ where, take: 20 });
  // If a GPA was provided, sort by proximity
  if (typeof gpa4 === "number" && !Number.isNaN(gpa4)) {
    stories = stories
      .map((s) => ({ s, d: Math.abs(s.gpa4 - gpa4) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6)
      .map((x) => x.s);
  } else {
    stories = stories.slice(0, 6);
  }
  return NextResponse.json({ stories });
}
