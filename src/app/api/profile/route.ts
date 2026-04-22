import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema, academicProfileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { academicProfile: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { personal, academic } = body;

    // Update personal info
    if (personal) {
      const parsed = profileSchema.safeParse(personal);
      if (parsed.success) {
        await db.user.update({
          where: { id: session.user.id },
          data: parsed.data,
        });
      }
    }

    // Update academic profile
    if (academic) {
      const parsed = academicProfileSchema.safeParse(academic);
      if (parsed.success) {
        await db.academicProfile.upsert({
          where: { userId: session.user.id },
          create: { userId: session.user.id, ...parsed.data },
          update: parsed.data,
        });
      }
    }

    const updated = await db.user.findUnique({
      where: { id: session.user.id },
      include: { academicProfile: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
