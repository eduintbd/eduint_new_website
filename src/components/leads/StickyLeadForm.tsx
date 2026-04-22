"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronUp, Send, X } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validators";
import { COUNTRIES } from "@/lib/countries";

type Props = {
  source: string;
  defaultCountry?: string;
  variant?: "drawer" | "card";
  title?: string;
  subtitle?: string;
};

export default function StickyLeadForm({
  source,
  defaultCountry,
  variant = "drawer",
  title = "Get free expert guidance",
  subtitle = "A counselor will reach out within 24 hours.",
}: Props) {
  const [open, setOpen] = useState(variant === "card");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferredCountry: defaultCountry ?? "",
      intake: "",
      message: "",
      source,
    },
  });

  async function onSubmit(values: LeadInput) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: "Submission failed" }));
        toast.error(error);
        return;
      }
      toast.success("Thanks! We'll reach out shortly.");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  const formBody = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            {...register("name")}
            placeholder="Your name"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("phone")}
            placeholder="Phone (+8801...)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          {...register("email")}
          placeholder="Email (optional)"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          {...register("preferredCountry")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Preferred country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flagEmoji} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          {...register("intake")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Target intake</option>
          <option value="Jan 2026">Jan 2026</option>
          <option value="May 2026">May 2026</option>
          <option value="Sep 2026">Sep 2026</option>
          <option value="Jan 2027">Jan 2027</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
        <input
          {...register("message")}
          placeholder="Anything specific? (optional)"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-medium disabled:opacity-60 transition-colors"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Request callback"}
      </button>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
        By submitting you agree to be contacted about study-abroad options. No
        spam, ever.
      </p>
    </form>
  );

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {subtitle}
        </p>
        {submitted ? (
          <p className="text-sm text-green-600 font-medium">
            ✓ Got it. A counselor will be in touch.
          </p>
        ) : (
          formBody
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-sm w-[calc(100%-2rem)] sm:w-96">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 shadow-lg shadow-blue-600/30 transition-all"
        >
          <span className="text-sm font-medium">
            Talk to a counselor — free
          </span>
          <ChevronUp className="h-4 w-4" />
        </button>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {submitted ? (
            <p className="text-sm text-green-600 font-medium py-3">
              ✓ Got it. A counselor will be in touch.
            </p>
          ) : (
            formBody
          )}
        </div>
      )}
    </div>
  );
}
