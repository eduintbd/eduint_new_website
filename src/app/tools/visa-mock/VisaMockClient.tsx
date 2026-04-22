"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  Loader2,
  Mic,
  Send,
  User,
  XCircle,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { VISA_REQUIREMENTS } from "@/lib/visa-requirements";

type Msg = { role: "user" | "assistant"; content: string };
type Verdict = {
  outcome: "APPROVE" | "REFUSE" | "BORDERLINE";
  score: number;
  redFlags: string[];
  strongAnswers: string[];
  summary: string;
};

function extractVerdict(text: string): {
  clean: string;
  verdict: Verdict | null;
} {
  const m = text.match(/<VERDICT>([\s\S]+?)<\/VERDICT>/);
  if (!m) return { clean: text, verdict: null };
  try {
    const verdict = JSON.parse(m[1]) as Verdict;
    return { clean: text.replace(m[0], "").trim(), verdict };
  } catch {
    return { clean: text, verdict: null };
  }
}

const STARTER_BY_COUNTRY: Record<string, string> = {
  AU: "Good morning. Please state your full name and tell me which university offered you a place.",
  CA: "Good morning. Please have a seat. What program are you planning to study and at which Canadian institution?",
  US: "Good morning. Hand me your passport and I-20. What made you apply for a US student visa?",
  UK: "Good morning. Tell me about the course you are going to study in the UK and why that particular university.",
  DE: "Guten Tag. Welches Studienprogramm haben Sie in Deutschland gewählt? (Please answer in English.)",
  IE: "Good morning. Please tell me about your chosen programme in Ireland.",
};

export default function VisaMockClient() {
  const params = useSearchParams();
  const initialCountry = (params.get("country") ?? "CA").toUpperCase();
  const [country, setCountry] = useState(initialCountry);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kick off with the officer's opening question
    if (messages.length === 0) {
      const opener = STARTER_BY_COUNTRY[country] ?? STARTER_BY_COUNTRY.CA;
      setMessages([{ role: "assistant", content: opener }]);
    }
  }, [country, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, verdict]);

  async function send(userText: string) {
    const next: Msg[] = [...messages, { role: "user", content: userText }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/visa-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((p) => [
          ...p,
          {
            role: "assistant",
            content: "(interview paused — please try again)",
          },
        ]);
        return;
      }
      const { clean, verdict: v } = extractVerdict(data.reply);
      setMessages((p) => [...p, { role: "assistant", content: clean }]);
      if (v) setVerdict(v);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setMessages([]);
    setVerdict(null);
  }

  const countryMeta = COUNTRIES.find((c) => c.code === country);
  const allowedCountries = Object.keys(VISA_REQUIREMENTS);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-3">
          <Mic className="h-3.5 w-3.5" /> Visa Interview Simulator
        </div>
        <h1 className="text-3xl font-bold">
          Practice your {countryMeta?.name ?? "visa"} interview
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The AI officer will probe your choice of course, finances, ties, and
          post-study plans. Type <code>/end</code> when ready for scoring.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-xs text-gray-500">Country:</label>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            reset();
          }}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
        >
          {allowedCountries.map((c) => {
            const meta = COUNTRIES.find((x) => x.code === c);
            return (
              <option key={c} value={c}>
                {meta?.flagEmoji} {meta?.name ?? c}
              </option>
            );
          })}
        </select>
        <button
          onClick={reset}
          className="ml-auto text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center text-white ${
                m.role === "user" ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              {m.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 className="h-3 w-3 animate-spin" /> officer is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!verdict && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !busy) send(input.trim());
          }}
          className="mt-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your answer…"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}

      {verdict && (
        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            {verdict.outcome === "APPROVE" ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : verdict.outcome === "REFUSE" ? (
              <XCircle className="h-8 w-8 text-rose-500" />
            ) : (
              <Mic className="h-8 w-8 text-amber-500" />
            )}
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Mock outcome
              </p>
              <h2 className="text-2xl font-bold">
                {verdict.outcome} · {verdict.score}/100
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {verdict.summary}
          </p>
          {verdict.strongAnswers?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                Strong answers
              </p>
              <ul className="space-y-1 text-sm">
                {verdict.strongAnswers.map((s) => (
                  <li key={s}>✓ {s}</li>
                ))}
              </ul>
            </div>
          )}
          {verdict.redFlags?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
                Red flags
              </p>
              <ul className="space-y-1 text-sm">
                {verdict.redFlags.map((s) => (
                  <li key={s}>⚠ {s}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={reset}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Try again
            </button>
            <Link
              href={`/book?topic=${encodeURIComponent(
                `Visa interview prep for ${countryMeta?.name ?? country}`
              )}`}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
            >
              Book a human coach
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
