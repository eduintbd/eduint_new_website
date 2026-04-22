import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runVisaInterview } from "@/lib/ai";
import { VISA_REQUIREMENTS } from "@/lib/visa-requirements";

const schema = z.object({
  country: z.string().min(2),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }
    const country = parsed.data.country.toUpperCase();
    const meta = VISA_REQUIREMENTS[country];
    if (!meta) {
      return NextResponse.json({ error: "Unsupported country" }, { status: 400 });
    }
    const reply = await runVisaInterview(meta.country, parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Visa mock error:", err);
    return NextResponse.json(
      { error: "Interview engine unavailable" },
      { status: 500 }
    );
  }
}
