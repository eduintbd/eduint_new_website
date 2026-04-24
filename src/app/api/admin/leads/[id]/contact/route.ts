import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { sendEmail } from "@/lib/notify";

const schema = z.object({
  channel: z.enum(["WHATSAPP", "PHONE", "EMAIL"]),
  template: z
    .enum(["welcome_bn_en", "booking_confirmation", "follow_up_d3", "offer_nudge", "custom"])
    .optional(),
  body: z.string().max(2000).optional(),
  subject: z.string().max(200).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sess = await requirePermission("admin.access");
  if (sess instanceof NextResponse) return sess;
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let result: Record<string, unknown> = {};
  let action: "CONTACTED_WHATSAPP" | "CONTACTED_PHONE" | "CONTACTED_EMAIL" =
    "CONTACTED_PHONE";

  if (parsed.data.channel === "WHATSAPP") {
    action = "CONTACTED_WHATSAPP";
    const r = await sendWhatsAppTemplate({
      to: lead.phone,
      template: parsed.data.template ?? "custom",
      variables: { name: lead.name.split(" ")[0] },
      body: parsed.data.body,
      leadId: lead.id,
    });
    result = r;
  } else if (parsed.data.channel === "EMAIL") {
    action = "CONTACTED_EMAIL";
    if (!lead.email) {
      return NextResponse.json(
        { error: "Lead has no email on file" },
        { status: 400 }
      );
    }
    const r = await sendEmail({
      to: lead.email,
      subject: parsed.data.subject ?? "EDUINTBD — follow-up",
      html: `<p>${(parsed.data.body ?? "").replace(/\n/g, "<br>")}</p>`,
    });
    result = r;
  } else {
    action = "CONTACTED_PHONE";
    result = { logged: true };
  }

  await Promise.all([
    db.lead.update({
      where: { id },
      data: { lastContactedAt: new Date() },
    }),
    logActivity({
      entityType: "LEAD",
      entityId: id,
      action,
      actorId: sess.userId,
      metadata: {
        template: parsed.data.template,
        subject: parsed.data.subject,
        ...result,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, result });
}
