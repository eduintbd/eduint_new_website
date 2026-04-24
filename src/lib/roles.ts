export type Role = "STUDENT" | "COUNSELOR" | "MANAGER" | "ADMIN";

export const STAFF_ROLES: Role[] = ["COUNSELOR", "MANAGER", "ADMIN"];

export type Permission =
  | "admin.access"
  | "admin.manageTeam"
  | "admin.viewAllLeads"
  | "admin.assignLeads"
  | "admin.viewReports"
  | "admin.whatsappSend"
  | "admin.settings";

const MATRIX: Record<Role, Permission[]> = {
  STUDENT: [],
  COUNSELOR: ["admin.access", "admin.whatsappSend"],
  MANAGER: [
    "admin.access",
    "admin.viewAllLeads",
    "admin.assignLeads",
    "admin.viewReports",
    "admin.whatsappSend",
  ],
  ADMIN: [
    "admin.access",
    "admin.manageTeam",
    "admin.viewAllLeads",
    "admin.assignLeads",
    "admin.viewReports",
    "admin.whatsappSend",
    "admin.settings",
  ],
};

export function can(role: Role | string | undefined, action: Permission): boolean {
  if (!role) return false;
  const perms = MATRIX[role as Role];
  return !!perms && perms.includes(action);
}

export function isStaff(role: Role | string | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role as Role);
}

export function roleLabel(role: Role | string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "MANAGER":
      return "Manager";
    case "COUNSELOR":
      return "Counselor";
    case "STUDENT":
      return "Student";
    default:
      return role ?? "—";
  }
}
