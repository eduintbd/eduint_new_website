import { Suspense } from "react";
import VisaMockClient from "./VisaMockClient";

export const metadata = {
  title: "Visa Interview Simulator",
  description:
    "Practice your student visa interview with an AI officer. Get scored feedback instantly.",
};

export default function VisaMockPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-500">Loading…</div>
      }
    >
      <VisaMockClient />
    </Suspense>
  );
}
