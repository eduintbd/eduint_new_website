import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";

// List registered students (role = STUDENT). Any staff member can read this;
// it surfaces user accounts created via email/password or Google sign-up,
// which are otherwise only visible in the database.
export async function GET(req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const nationality = searchParams.get("nationality")?.trim();

  const where: Record<string, unknown> = { role: "STUDENT" };
  if (nationality) where.nationality = nationality;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  const students = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      phone: true,
      nationality: true,
      password: true,
      createdAt: true,
      _count: { select: { savedPrograms: true, documents: true } },
      accounts: { select: { provider: true } },
    },
  });

  // Application has no relation back to User (standalone model), so count via groupBy.
  const appCounts = await db.application.groupBy({
    by: ["userId"],
    where: { userId: { in: students.map((s) => s.id) } },
    _count: { _all: true },
  });
  const appCountByUser = new Map(
    appCounts.map((a) => [a.userId, a._count._all])
  );

  const result = students.map((s) => {
    const providers = s.accounts.map((a) => a.provider);
    const method = providers.includes("google")
      ? "Google"
      : s.password
        ? "Email"
        : "—";
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      emailVerified: !!s.emailVerified,
      phone: s.phone,
      nationality: s.nationality,
      method,
      createdAt: s.createdAt,
      savedCount: s._count.savedPrograms,
      documentCount: s._count.documents,
      applicationCount: appCountByUser.get(s.id) ?? 0,
    };
  });

  return NextResponse.json({ students: result, total: result.length });
}
