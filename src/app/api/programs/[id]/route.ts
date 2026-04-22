import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await db.program.findUnique({
      where: { id },
      include: {
        university: true,
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Get similar programs
    const similar = await db.program.findMany({
      where: {
        id: { not: program.id },
        OR: [
          { field: program.field },
          { country: program.country },
        ],
      },
      include: {
        university: {
          select: { id: true, name: true, country: true, city: true, ranking: true, logoUrl: true, partnerStatus: true },
        },
      },
      take: 3,
    });

    return NextResponse.json({ program, similar });
  } catch (error) {
    console.error("Program fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}
