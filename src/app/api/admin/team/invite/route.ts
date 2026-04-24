import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { sendEmail } from "@/lib/notify";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  role: z.enum(["COUNSELOR", "MANAGER", "ADMIN"]),
  phone: z.string().max(32).optional(),
});

export async function POST(req: NextRequest) {
  const sess = await requirePermission("admin.manageTeam");
  if (sess instanceof NextResponse) return sess;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 400 }
    );
  }

  // Random temp password — user resets on first login (currently: ask user to reset via /login; proper reset flow is a later task).
  const tempPassword = crypto.randomBytes(6).toString("hex");
  const hashed = await bcrypt.hash(tempPassword, 12);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: parsed.data.role,
      phone: parsed.data.phone,
    },
  });

  const base = process.env.NEXTAUTH_URL ?? "https://eduintbd.com";
  await sendEmail({
    to: parsed.data.email,
    subject: "You've been invited to the EDUINTBD admin console",
    html: `
      <p>Hi ${parsed.data.name},</p>
      <p>You've been added to the EDUINTBD team as a <strong>${parsed.data.role}</strong>.</p>
      <p>Sign in at <a href="${base}/login">${base}/login</a> with:</p>
      <ul>
        <li>Email: <strong>${parsed.data.email}</strong></li>
        <li>Temporary password: <strong>${tempPassword}</strong></li>
      </ul>
      <p>Please change your password from the profile page after first login.</p>
    `,
  });

  await logActivity({
    entityType: "USER",
    entityId: user.id,
    action: "INVITED",
    actorId: sess.userId,
    metadata: { email: user.email, role: user.role },
  });

  return NextResponse.json(
    { user: { id: user.id, email: user.email }, tempPassword },
    { status: 201 }
  );
}
