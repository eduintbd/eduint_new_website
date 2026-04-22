import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveUpload, UploadError } from "@/lib/storage";

const VALID_TYPES = new Set([
  "PASSPORT",
  "IELTS",
  "TOEFL",
  "TRANSCRIPT",
  "SOP",
  "INCOME",
  "OTHER",
]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const docType = String(form.get("type") ?? "OTHER");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!VALID_TYPES.has(docType)) {
    return NextResponse.json(
      { error: "Invalid document type" },
      { status: 400 }
    );
  }

  try {
    const stored = await saveUpload(file, {
      userId: session.user.id,
      folder: docType.toLowerCase(),
    });
    const document = await db.document.create({
      data: {
        userId: session.user.id,
        type: docType,
        fileName: file.name,
        fileUrl: stored.url,
        fileSize: stored.size,
      },
    });
    return NextResponse.json({ document }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
