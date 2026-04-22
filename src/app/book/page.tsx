import { Suspense } from "react";
import BookingClient from "./BookingClient";

export const metadata = {
  title: "Book Free Counseling",
  description:
    "Book a free 30-minute counseling session with an EDUINTBD expert. No cost, no obligation.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Loading…</div>}>
      <BookingClient />
    </Suspense>
  );
}
