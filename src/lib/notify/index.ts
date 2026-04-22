// Lightweight notification layer.
// - Email: uses Resend if RESEND_API_KEY is set; otherwise logs to console.
// - WhatsApp: builds a wa.me deep link. Swap with WhatsApp Business Cloud API
//   once a number is onboarded.

type EmailArgs = {
  to: string;
  subject: string;
  html: string;
};

type WhatsAppArgs = {
  to?: string; // full number with country code, digits only
  message: string;
};

export async function sendEmail({ to, subject, html }: EmailArgs): Promise<
  { ok: true; provider: string } | { ok: false; error: string }
> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[notify:email:dev]", { to, subject });
    return { ok: true, provider: "stub" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "EDUINTBD <notifications@eduintbd.com>",
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    return { ok: true, provider: "resend" };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function buildWhatsAppLink({ to, message }: WhatsAppArgs): string {
  const number =
    (to ?? process.env.WHATSAPP_INTERNAL_NUMBER ?? "").replace(/\D/g, "") ||
    (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function logWhatsAppIntent(args: WhatsAppArgs) {
  console.log("[notify:whatsapp:intent]", args);
}

export function leadEmailBody(lead: {
  name: string;
  phone: string;
  email?: string | null;
  preferredCountry?: string | null;
  intake?: string | null;
  message?: string | null;
  source: string;
}): string {
  return `
    <h2>New lead on EDUINTBD</h2>
    <p>A prospective student just submitted a callback request.</p>
    <ul>
      <li><strong>Name:</strong> ${lead.name}</li>
      <li><strong>Phone:</strong> ${lead.phone}</li>
      <li><strong>Email:</strong> ${lead.email ?? "—"}</li>
      <li><strong>Preferred country:</strong> ${lead.preferredCountry ?? "—"}</li>
      <li><strong>Target intake:</strong> ${lead.intake ?? "—"}</li>
      <li><strong>Source page:</strong> ${lead.source}</li>
      <li><strong>Message:</strong> ${lead.message ?? "—"}</li>
    </ul>
    <p>Reach out within 24 hours.</p>
  `;
}

export function bookingEmailBody(b: {
  name: string;
  phone: string;
  email: string;
  slot: Date;
  topic?: string | null;
}): string {
  return `
    <h2>Counseling booked</h2>
    <p>${b.name} booked a 30-minute slot for <strong>${b.slot.toLocaleString(
    "en-GB",
    { timeZone: "Asia/Dhaka" }
  )} (Dhaka)</strong>.</p>
    <ul>
      <li><strong>Phone:</strong> ${b.phone}</li>
      <li><strong>Email:</strong> ${b.email}</li>
      <li><strong>Topic:</strong> ${b.topic ?? "—"}</li>
    </ul>
  `;
}
