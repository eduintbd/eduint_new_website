"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { FileText, Upload, Trash2 } from "lucide-react";
import { DOCUMENT_TYPES } from "@/lib/utils";
import { toast } from "sonner";

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  status: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("PASSPORT");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        setDocuments(data.documents ?? []);
      } catch {
        toast.error("Failed to load documents");
      }
      setLoading(false);
    }
    if (session) load();
  }, [session]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please choose a file to upload");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", docType);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments((prev) => [data.document, ...prev]);
        setFile(null);
        toast.success("Document uploaded");
      } else {
        toast.error(data.error ?? "Failed to upload");
      }
    } catch {
      toast.error("Failed to upload");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusVariant = (s: string) => {
    switch (s) {
      case "VERIFIED": return "success";
      case "REJECTED": return "error";
      default: return "warning";
    }
  };

  if (status === "loading" || loading) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Documents</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Upload and manage your application documents
      </p>

      {/* Upload section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-600" /> Upload Document
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            options={DOCUMENT_TYPES.map((d) => ({ value: d.value, label: d.label }))}
            label="Document Type"
          />
          <div className="sm:col-span-2 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select file</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white file:hover:bg-blue-700 file:cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-1.5 px-2"
              />
              {file && (
                <p className="mt-1 text-xs text-gray-500">
                  {file.name} · {(file.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
            <Button onClick={handleUpload} loading={uploading}>
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {DOCUMENT_TYPES.find((d) => d.value === doc.type)?.label ?? doc.type}
                    {" "}&middot;{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant(doc.status)}>{doc.status}</Badge>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
