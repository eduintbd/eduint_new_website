import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const STAFF_ROLES = new Set(["COUNSELOR", "MANAGER", "ADMIN"]);

export default async function PostLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }

  const role = (session.user as { role?: string }).role;
  redirect(role && STAFF_ROLES.has(role) ? "/admin" : "/");
}
