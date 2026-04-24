import { db } from "./db";

export type EntityType = "LEAD" | "BOOKING" | "APPLICATION" | "USER" | "REMINDER";

export type ActivityAction =
  | "CREATED"
  | "STATUS_CHANGED"
  | "STAGE_CHANGED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "REMINDER_SET"
  | "REMINDER_DONE"
  | "REMINDER_SNOOZED"
  | "CONTACTED_WHATSAPP"
  | "CONTACTED_PHONE"
  | "CONTACTED_EMAIL"
  | "NOTE_ADDED"
  | "TAG_ADDED"
  | "TAG_REMOVED"
  | "PRIORITY_CHANGED"
  | "MERGED"
  | "INVITED"
  | "ROLE_CHANGED"
  | "DEACTIVATED"
  | "REACTIVATED"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED";

export type LogPayload = {
  entityType: EntityType;
  entityId: string;
  action: ActivityAction;
  actorId: string;
  metadata?: Record<string, unknown>;
};

export async function logActivity(p: LogPayload): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        entityType: p.entityType,
        entityId: p.entityId,
        action: p.action,
        actorId: p.actorId,
        metadata: p.metadata ? JSON.stringify(p.metadata) : null,
      },
    });
  } catch (err) {
    // Never let logging failure break a write path
    console.error("activity-log:", err);
  }
}

export function describeAction(action: string, metadata?: string | null): string {
  let data: Record<string, unknown> = {};
  try {
    data = metadata ? JSON.parse(metadata) : {};
  } catch {
    data = {};
  }
  switch (action) {
    case "CREATED":
      return "Created";
    case "STATUS_CHANGED":
      return `Status → ${data.to ?? "?"}`;
    case "STAGE_CHANGED":
      return `Stage → ${data.to ?? "?"}`;
    case "ASSIGNED":
      return `Assigned to ${data.assigneeName ?? data.assigneeId ?? "counselor"}`;
    case "UNASSIGNED":
      return "Unassigned";
    case "REMINDER_SET":
      return `Reminder set${data.dueAt ? ` for ${new Date(String(data.dueAt)).toLocaleString()}` : ""}`;
    case "REMINDER_DONE":
      return "Reminder marked done";
    case "REMINDER_SNOOZED":
      return `Reminder snoozed ${data.until ? `to ${new Date(String(data.until)).toLocaleString()}` : ""}`;
    case "CONTACTED_WHATSAPP":
      return `WhatsApp sent${data.template ? ` (${data.template})` : ""}`;
    case "CONTACTED_PHONE":
      return "Called";
    case "CONTACTED_EMAIL":
      return `Email sent${data.subject ? ` — ${data.subject}` : ""}`;
    case "NOTE_ADDED":
      return "Note added";
    case "TAG_ADDED":
      return `Tag added: ${data.tag ?? ""}`;
    case "TAG_REMOVED":
      return `Tag removed: ${data.tag ?? ""}`;
    case "PRIORITY_CHANGED":
      return `Priority → ${data.to ?? "?"}`;
    case "MERGED":
      return `Merged from ${data.fromId ?? ""}`;
    case "INVITED":
      return `Invited ${data.email ?? "team member"}`;
    case "ROLE_CHANGED":
      return `Role → ${data.to ?? "?"}`;
    case "DEACTIVATED":
      return "Deactivated";
    case "REACTIVATED":
      return "Reactivated";
    default:
      return action;
  }
}
