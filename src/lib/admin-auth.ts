import { NextResponse } from "next/server";
import { auth } from "./auth";
import { can, type Permission, type Role } from "./roles";

export type Session = {
  userId: string;
  role: Role;
};

/**
 * Require that the caller is authenticated with one of the staff roles
 * AND holds the given permission. Returns either the session or a Response
 * that the route handler must return directly.
 */
export async function requirePermission(
  perm: Permission
): Promise<Session | NextResponse> {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user?.id || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!can(role, perm)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { userId: session.user.id, role };
}

export async function getStaffSession(): Promise<Session | null> {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user?.id || !role) return null;
  if (!can(role, "admin.access")) return null;
  return { userId: session.user.id, role };
}
