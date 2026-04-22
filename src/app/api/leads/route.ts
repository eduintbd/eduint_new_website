import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadSchema } from "@/lib/validators";
import {
  sendEmail,
  leadEmailBody,
  logWhatsAppIntent,
} from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, ...rest } = parsed.data;
    const lead = await db.lead.create({
      data: {
        ...rest,
        email: email && email.length > 0 ? email : null,
      },
    });

    const internalTo = process.env.LEADS_EMAIL_TO;
    if (internalTo) {
      sendEmail({
        to: internalTo,
        subject: `New lead: ${lead.name} (${lead.phone})`,
        html: leadEmailBody({ ...lead, email: lead.email ?? undefined }),
      }).catch(() => undefined);
    }
    logWhatsAppIntent({
      message: `New lead ${lead.name} (${lead.phone}) from ${lead.source}`,
    });

    return NextResponse.json(
      { message: "We'll reach out shortly.", id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Could not submit. Please try again." },
      { status: 500 }
    );
  }
}
