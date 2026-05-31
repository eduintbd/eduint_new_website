"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function EventRegisterButton({
  eventId,
  title,
}: {
  eventId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
      } else {
        setDone(true);
      }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4" /> Registered — check your email.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-2 text-sm font-semibold uppercase tracking-wide"
      >
        Register — free
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Register for: {title}</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (optional)"
        className="w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-2 py-1.5 text-sm"
      />
      <button
        onClick={submit}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-1.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Confirm
      </button>
    </div>
  );
}
