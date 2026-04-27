import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import type { Role } from "@/lib/roles";

export const metadata = {
  title: "Admin · EDUINTBD",
  description: "EDUINTBD team console",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();
  if (!session) redirect("/login?next=/admin");

  const me = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!me || !me.isActive) redirect("/login?next=/admin");

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        role={me.role as Role}
        userName={me.name}
        userEmail={me.email}
      />
      <div className="flex-1 min-w-0">
        <MobileAdminNav role={me.role as Role} />
        <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
