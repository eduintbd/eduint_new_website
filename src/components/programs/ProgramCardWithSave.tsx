"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import ProgramCard from "./ProgramCard";
import type { ProgramWithUniversity } from "@/types";

interface Props {
  program: ProgramWithUniversity;
  initialSaved: boolean;
  draggable?: boolean;
}

export default function ProgramCardWithSave({ program, initialSaved, draggable }: Props) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!session) {
      toast.error("Please sign in to save programs");
      return;
    }
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/programs/${program.id}/save`, { method: "POST" });
      if (!res.ok) {
        toast.error("Failed to save");
        return;
      }
      const data = await res.json();
      setSaved(data.saved);
      toast.success(data.saved ? "Program saved" : "Program removed from saved");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <ProgramCard
      program={program}
      saved={saved}
      onToggleSave={toggle}
      draggable={draggable}
    />
  );
}
