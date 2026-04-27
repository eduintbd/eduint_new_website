"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import SaveButton from "./SaveButton";

interface Props {
  programId: string;
  initialSaved?: boolean;
}

export default function ProgramSaveButton({ programId, initialSaved = false }: Props) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!session) {
      toast.error("Please sign in to save programs");
      return;
    }
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/programs/${programId}/save`, { method: "POST" });
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

  return <SaveButton saved={saved} onClick={handleClick} />;
}
