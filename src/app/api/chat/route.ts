import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAgenticResponse } from "@/lib/ai";
import { chatMessageSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = chatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { content, programId } = parsed.data;

    // Save user message
    await db.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "USER",
        content,
        programId,
      },
    });

    // Get previous messages for context
    const history = await db.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages = history.map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    }));

    // Get AI response (agentic — may use tools)
    let aiResponse: string;
    try {
      aiResponse = await getAgenticResponse(messages, {
        userId: session.user.id,
      });
    } catch {
      aiResponse = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact our team directly for assistance.";
    }

    // Save assistant message
    await db.chatMessage.create({
      data: {
        userId: session.user.id,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
