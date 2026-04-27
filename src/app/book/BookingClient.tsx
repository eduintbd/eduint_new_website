"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validators";

function nextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 5 && day !== 6) days.push(new Date(d)); // skip Fri/Sat (BD weekend)
  }
  return days;
}

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function formatDayLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function BookingClient() {
  const params = useSearchParams();
  const prefillTopic = params.get("topic") ?? "";
  const prefillCountry = params.get("country") ?? "";

  const days = useMemo(() => nextBusinessDays(10), []);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      topic: prefillTopic,
      slot: "",
    },
  });

  async function onSubmit(values: BookingInput) {
    const [h, m] = selectedTime.split(":").map(Number);
    const slot = new Date(selectedDay);
    slot.setHours(h, m, 0, 0);
    const payload: BookingInput = {
      ...values,
      slot: slot.toISOString(),
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const { error } = await res
        .json()
        .catch(() => ({ error: "Booking failed" }));
      toast.error(error);
      return;
    }
    setSubmitted(true);
    toast.success("Booking requested!");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">You're booked in</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          A counselor will confirm your slot by phone or email within 24 hours.
          Check WhatsApp too — we often reply there fastest.
        </p>
        <p className="mt-4 text-sm font-medium">
          {formatDayLabel(selectedDay)} at {selectedTime} (Dhaka time)
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Book free counseling</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          30-minute session with a licensed counselor. No cost. No obligation.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            Pick a day
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const isActive =
                d.toDateString() === selectedDay.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelectedDay(d)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {formatDayLabel(d)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Clock className="h-4 w-4 text-blue-600" />
            Pick a time (Dhaka)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedTime === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="book-name" className="sr-only">Full name</label>
              <input
                id="book-name"
                autoComplete="name"
                {...register("name")}
                placeholder="Full name"
                aria-invalid={errors.name ? "true" : "false"}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="book-phone" className="sr-only">Phone number</label>
              <input
                id="book-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
                placeholder="Phone (+8801...)"
                aria-invalid={errors.phone ? "true" : "false"}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="book-email" className="sr-only">Email address</label>
            <input
              id="book-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Email"
              aria-invalid={errors.email ? "true" : "false"}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="book-topic" className="sr-only">Discussion topic (optional)</label>
            <input
              id="book-topic"
              {...register("topic")}
              placeholder={
                prefillCountry
                  ? `What would you like to discuss? (pre-filled for ${prefillCountry})`
                  : "What would you like to discuss? (optional)"
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input type="hidden" {...register("slot")} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm booking — {formatDayLabel(selectedDay)} at {selectedTime}
          </button>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
            We'll call to confirm. You can reschedule anytime by replying on
            WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}
