import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EVENTS_SEED } from "@/lib/events-seed";

async function ensureSeeded() {
  const count = await db.event.count();
  if (count === 0) {
    await db.event.createMany({ data: EVENTS_SEED });
  }
}

export async function GET() {
  await ensureSeeded();
  const rows = await db.event.findMany({
    where: { startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    take: 30,
  });
  return NextResponse.json({ events: rows });
}
