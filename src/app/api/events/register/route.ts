import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/notify";

const schema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  try {
    const ev = await db.event.findUnique({ where: { id: parsed.data.eventId } });
    if (!ev)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const reg = await db.eventRegistration.upsert({
      where: {
        eventId_email: {
          eventId: parsed.data.eventId,
          email: parsed.data.email,
        },
      },
      update: { name: parsed.data.name, phone: parsed.data.phone },
      create: parsed.data,
    });

    sendEmail({
      to: parsed.data.email,
      subject: `You're registered — ${ev.title}`,
      html: `<p>Hi ${parsed.data.name},</p><p>You're confirmed for <strong>${ev.title}</strong> on ${ev.startAt.toLocaleString(
        "en-GB",
        { timeZone: "Asia/Dhaka" }
      )} (Dhaka).</p>${
        ev.meetingLink
          ? `<p>Join link: <a href="${ev.meetingLink}">${ev.meetingLink}</a></p>`
          : ""
      }`,
    }).catch(() => undefined);

    return NextResponse.json({ registration: reg }, { status: 201 });
  } catch (err) {
    console.error("Event register error:", err);
    return NextResponse.json(
      { error: "Could not register. Try again." },
      { status: 500 }
    );
  }
}
