"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, MapPin, Users } from "lucide-react";
import EventRegisterButton from "@/components/events/EventRegisterButton";

type Event = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string | null;
  location: string;
  type: string;
  country: string | null;
  meetingLink: string | null;
  capacity: number | null;
  featured: boolean;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-black dark:text-[#E0FE9C]" />
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-medium mb-3">
          <Calendar className="h-3.5 w-3.5" /> Upcoming events & webinars
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Live sessions, fairs, and workshops
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Free to attend. Bring your questions — our counselors will answer
          them live.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Nothing scheduled yet — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((e) => (
            <div
              key={e.id}
              className={`rounded-none border p-5 ${
                e.featured
                  ? "border-black dark:border-[#E0FE9C] bg-gray-50 dark:bg-[#111111]"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-100 dark:bg-gray-800">
                  {e.type}
                </span>
                {e.featured && (
                  <span className="text-[10px] font-semibold text-black dark:text-[#E0FE9C]">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-lg">{e.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {e.description}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(e.startAt).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {e.location}
                </span>
                {e.capacity && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {e.capacity} seats
                  </span>
                )}
              </div>
              <div className="mt-4">
                <EventRegisterButton eventId={e.id} title={e.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
