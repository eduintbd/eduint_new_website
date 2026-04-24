// WhatsApp Business Cloud API wrapper.
// Falls back to `wa.me` deep-link URLs when credentials aren't configured —
// the same return shape so callers can always log something and decide UI.

type Template = "welcome_bn_en" | "booking_confirmation" | "follow_up_d3" | "offer_nudge" | "custom";

export type WhatsAppSendArgs = {
  to: string;                 // digits only, with country code e.g. "8801700000000"
  template: Template;
  variables?: Record<string, string>;
  body?: string;              // for template="custom" — sends plain text (session must exist)
  leadId?: string;
};

export type WhatsAppSendResult =
  | { ok: true; provider: "cloud-api"; messageId: string }
  | { ok: true; provider: "deep-link"; url: string }
  | { ok: false; error: string };

export function buildWhatsAppDeepLink(phone: string, text: string): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function fallbackBody({ template, variables, body }: Pick<WhatsAppSendArgs, "template" | "variables" | "body">): string {
  if (body && body.trim()) return body.trim();
  const name = variables?.name ?? "there";
  switch (template) {
    case "welcome_bn_en":
      return `Hi ${name}, welcome to EDUINTBD — your study abroad partner. A counselor will reach out within 24 hours.`;
    case "booking_confirmation":
      return `Hi ${name}, your free counseling session is confirmed for ${variables?.slot ?? "the requested time"}.`;
    case "follow_up_d3":
      return `Hi ${name}, just following up on your study-abroad enquiry. Any questions I can help with?`;
    case "offer_nudge":
      return `Hi ${name}, congratulations on your offer from ${variables?.university ?? "your chosen university"}! Let's plan the next steps.`;
    default:
      return `Hi ${name}, EDUINTBD here.`;
  }
}

export async function sendWhatsAppTemplate(args: WhatsAppSendArgs): Promise<WhatsAppSendResult> {
  const phoneId = process.env.META_WABA_PHONE_NUMBER_ID;
  const token = process.env.META_WABA_ACCESS_TOKEN;
  const toDigits = (args.to ?? "").replace(/\D/g, "");

  if (!phoneId || !token || !toDigits) {
    // Dev / not-yet-approved fallback — return a wa.me deep-link the UI can open.
    const url = buildWhatsAppDeepLink(toDigits || "", fallbackBody(args));
    return { ok: true, provider: "deep-link", url };
  }

  // Real Meta Graph API call
  const endpoint = `https://graph.facebook.com/v22.0/${phoneId}/messages`;
  const payload: Record<string, unknown> =
    args.template === "custom"
      ? {
          messaging_product: "whatsapp",
          to: toDigits,
          type: "text",
          text: { body: args.body ?? fallbackBody(args) },
        }
      : {
          messaging_product: "whatsapp",
          to: toDigits,
          type: "template",
          template: {
            name: args.template,
            language: { code: "en" },
            components: args.variables
              ? [
                  {
                    type: "body",
                    parameters: Object.values(args.variables).map((v) => ({
                      type: "text",
                      text: v,
                    })),
                  },
                ]
              : [],
          },
        };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };
    if (!res.ok) {
      return { ok: false, error: data.error?.message ?? `HTTP ${res.status}` };
    }
    return {
      ok: true,
      provider: "cloud-api",
      messageId: data.messages?.[0]?.id ?? "",
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export const WHATSAPP_TEMPLATES: { id: Template; label: string; vars: string[] }[] = [
  { id: "welcome_bn_en", label: "Welcome (BD new lead)", vars: ["name"] },
  { id: "booking_confirmation", label: "Booking confirmation", vars: ["name", "slot"] },
  { id: "follow_up_d3", label: "3-day follow-up nudge", vars: ["name"] },
  { id: "offer_nudge", label: "Offer received — next steps", vars: ["name", "university"] },
  { id: "custom", label: "Custom (free text)", vars: [] },
];
