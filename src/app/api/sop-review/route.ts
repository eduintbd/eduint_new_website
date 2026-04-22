import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reviewSOP } from "@/lib/ai";

const schema = z.object({
  text: z.string().min(100, "Please paste at least 100 characters."),
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
    const review = await reviewSOP(parsed.data.text);
    return NextResponse.json({ review });
  } catch (err) {
    console.error("SOP review error:", err);
    return NextResponse.json(
      { error: "Could not review SOP — try again in a moment." },
      { status: 500 }
    );
  }
}
