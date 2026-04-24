import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";

// Return the list of staff users (COUNSELOR/MANAGER/ADMIN) — used to power
// assignee dropdowns in Leads/Bookings pages. Any staff member can read this;
// admins can write via the /invite + /[id] routes.
export async function GET(_req: NextRequest) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;

  const users = await db.user.findMany({
    where: {
      role: { in: ["COUNSELOR", "MANAGER", "ADMIN"] },
      isActive: true,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
    },
  });
  return NextResponse.json({ users });
}
