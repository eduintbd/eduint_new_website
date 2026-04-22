import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validators";
import {
  sendEmail,
  bookingEmailBody,
  logWhatsAppIntent,
} from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { slot, leadId, ...rest } = parsed.data;
    const slotDate = new Date(slot);

    if (Number.isNaN(slotDate.getTime())) {
      return NextResponse.json(
        { error: "Please pick a valid date and time." },
        { status: 400 }
      );
    }

    if (slotDate.getTime() < Date.now() - 60_000) {
      return NextResponse.json(
        { error: "Please choose a future time." },
        { status: 400 }
      );
    }

    const booking = await db.counselorBooking.create({
      data: {
        ...rest,
        slot: slotDate,
        leadId: leadId && leadId.length > 0 ? leadId : null,
      },
    });

    // Confirmation to student
    sendEmail({
      to: booking.email,
      subject: "Your counseling slot is booked",
      html: bookingEmailBody(booking),
    }).catch(() => undefined);

    // Internal notification
    const internalTo = process.env.LEADS_EMAIL_TO;
    if (internalTo) {
      sendEmail({
        to: internalTo,
        subject: `New booking: ${booking.name}`,
        html: bookingEmailBody(booking),
      }).catch(() => undefined);
    }

    logWhatsAppIntent({
      message: `New booking ${booking.name} on ${slotDate.toISOString()}`,
    });

    return NextResponse.json(
      {
        message: "Booking requested. We'll confirm by phone or email shortly.",
        id: booking.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Could not book. Please try again." },
      { status: 500 }
    );
  }
}
