import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { COMMUNITY_SEED } from "@/lib/community-seed";

async function ensureSeeded() {
  const count = await db.communityPost.count();
  if (count > 0) return;
  // Seed using any admin user; fall back to first user.
  const admin =
    (await db.user.findFirst({ where: { role: "ADMIN" } })) ??
    (await db.user.findFirst({}));
  if (!admin) return;
  await db.communityPost.createMany({
    data: COMMUNITY_SEED.map((p) => ({ ...p, userId: admin.id })),
  });
}

const createSchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().min(10).max(5000),
  tag: z.string().max(50).optional(),
});

export async function GET() {
  await ensureSeeded();
  const posts = await db.communityPost.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: {
      replies: { select: { id: true } },
    },
  });
  // Hydrate author name
  const userIds = [...new Set(posts.map((p) => p.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      tag: p.tag,
      pinned: p.pinned,
      createdAt: p.createdAt,
      replyCount: p.replies.length,
      author: userMap[p.userId] ?? null,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  const post = await db.communityPost.create({
    data: { ...parsed.data, userId: session.user.id },
  });
  return NextResponse.json({ post }, { status: 201 });
}
