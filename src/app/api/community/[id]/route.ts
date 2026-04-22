import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const replySchema = z.object({
  body: z.string().min(2).max(3000),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await db.communityPost.findUnique({
    where: { id },
    include: {
      replies: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!post)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const userIds = [
    post.userId,
    ...new Set(post.replies.map((r) => r.userId)),
  ];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  return NextResponse.json({
    post: {
      ...post,
      author: userMap[post.userId] ?? null,
      replies: post.replies.map((r) => ({
        ...r,
        author: userMap[r.userId] ?? null,
      })),
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = replySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  const reply = await db.communityReply.create({
    data: { postId: id, userId: session.user.id, body: parsed.data.body },
  });
  return NextResponse.json({ reply }, { status: 201 });
}
