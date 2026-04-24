import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/notify";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

/**
 * Vercel Cron endpoint. Fires 3×/day (see vercel.json).
 * Sends email + WhatsApp nudges for reminders that have become due and
 * haven't been notified yet. Uses `notifiedAt` to avoid re-sending.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await db.reminder.findMany({
    where: {
      completed: false,
      dueAt: { lte: now },
      notifiedAt: null,
    },
    take: 50,
    include: {
      assignedTo: { select: { email: true, phone: true, name: true } },
      lead: { select: { id: true, name: true } },
    },
  });

  let sent = 0;
  for (const r of due) {
    const who = r.assignedTo?.name ?? r.assignedTo?.email ?? "counselor";
    const subject = `⏰ Reminder: ${r.title}`;
    const leadPart = r.lead
      ? `<p>Linked lead: <a href="${process.env.NEXTAUTH_URL ?? ""}/admin/leads/${r.lead.id}">${r.lead.name}</a></p>`
      : "";
    if (r.assignedTo?.email) {
      await sendEmail({
        to: r.assignedTo.email,
        subject,
        html: `<p>Hi ${who},</p><p><strong>${r.title}</strong> was due ${r.dueAt.toLocaleString()}.</p>${leadPart}${r.note ? `<p>${r.note}</p>` : ""}`,
      });
    }
    if (r.assignedTo?.phone) {
      await sendWhatsAppTemplate({
        to: r.assignedTo.phone,
        template: "custom",
        body: `⏰ EDUINTBD reminder: ${r.title}${r.lead ? ` — lead ${r.lead.name}` : ""}. Due ${r.dueAt.toLocaleString()}.`,
      });
    }
    await db.reminder.update({
      where: { id: r.id },
      data: { notifiedAt: new Date() },
    });
    sent++;
  }

  return NextResponse.json({ processed: due.length, sent, at: now.toISOString() });
}
