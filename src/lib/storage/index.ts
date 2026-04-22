import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

export type StoredFile = {
  url: string;       // public URL
  key: string;       // storage key (for delete)
  size: number;
  contentType: string;
};

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export class UploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/**
 * Local filesystem driver — good for dev & small self-host.
 * For serverless (Vercel) the filesystem is read-only, so we fail fast with a
 * clear 503 until an S3/R2 driver is wired in. See DEPLOY.md.
 */
export async function saveUpload(
  file: File,
  opts: { userId: string; folder?: string } = { userId: "anon" }
): Promise<StoredFile> {
  if (process.env.VERCEL === "1" || process.env.STORAGE_DRIVER === "disabled") {
    throw new UploadError(
      "Document uploads are temporarily disabled while we migrate to cloud storage. Please email your documents to admissions@eduintbd.com or WhatsApp us.",
      503
    );
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("File exceeds 10 MB limit.");
  }
  if (!ALLOWED.has(file.type)) {
    throw new UploadError(
      "Unsupported file type. Allowed: PDF, JPG, PNG, WEBP, DOC, DOCX."
    );
  }

  const ext = path.extname(file.name) || "";
  const rnd = crypto.randomBytes(8).toString("hex");
  const safeFolder = (opts.folder ?? "misc").replace(/[^a-z0-9_-]/gi, "_");
  const relPath = path.join("uploads", opts.userId, safeFolder, `${rnd}${ext}`);
  const absPath = path.join(process.cwd(), "public", relPath);

  await fs.mkdir(path.dirname(absPath), { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(absPath, buf);

  return {
    url: `/${relPath.split(path.sep).join("/")}`,
    key: relPath,
    size: file.size,
    contentType: file.type,
  };
}

export async function deleteUpload(key: string): Promise<void> {
  const absPath = path.join(process.cwd(), "public", key);
  try {
    await fs.unlink(absPath);
  } catch {
    // best-effort; file may already be gone
  }
}
