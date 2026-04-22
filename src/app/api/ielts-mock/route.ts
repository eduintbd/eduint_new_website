import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreIeltsWriting } from "@/lib/ai";

const schema = z.object({
  task: z.string().min(20),
  response: z.string().min(100, "Your response must be at least 100 characters."),
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
    const score = await scoreIeltsWriting(parsed.data.task, parsed.data.response);
    return NextResponse.json({ score });
  } catch (err) {
    console.error("IELTS scoring error:", err);
    return NextResponse.json(
      { error: "Scoring engine unavailable" },
      { status: 500 }
    );
  }
}
