"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProgramGrid from "@/components/programs/ProgramGrid";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import type { ProgramWithUniversity } from "@/types";

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [programs, setPrograms] = useState<ProgramWithUniversity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all programs and filter saved ones client-side
        // In production, you'd have a dedicated API endpoint
        const res = await fetch("/api/programs?limit=100");
        const data = await res.json();
        // For now, show all programs (saved functionality requires session)
        setPrograms(data.programs ?? []);
      } catch {
        toast.error("Failed to load saved programs");
      }
      setLoading(false);
    }
    if (session) load();
  }, [session]);

  const handleToggleSave = async (programId: string) => {
    try {
      const res = await fetch(`/api/programs/${programId}/save`, { method: "POST" });
      const data = await res.json();
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(programId);
        else next.delete(programId);
        return next;
      });
      if (!data.saved) {
        setPrograms((prev) => prev.filter((p) => p.id !== programId));
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Bookmark className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Saved Programs</h1>
        <p className="text-gray-500 mb-6">Sign in to save and manage your favorite programs</p>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Saved Programs</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Programs you&apos;ve bookmarked for later</p>

      <ProgramGrid
        programs={programs}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
        loading={loading}
      />
    </div>
  );
}
