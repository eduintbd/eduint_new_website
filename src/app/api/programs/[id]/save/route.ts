import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: programId } = await params;

    const existing = await db.savedProgram.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId,
        },
      },
    });

    if (existing) {
      // Unsave
      await db.savedProgram.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await db.savedProgram.create({
        data: {
          userId: session.user.id,
          programId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Save program error:", error);
    return NextResponse.json({ error: "Failed to save program" }, { status: 500 });
  }
}
