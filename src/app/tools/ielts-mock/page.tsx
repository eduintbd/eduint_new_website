"use client";

import { useEffect, useMemo, useState } from "react";
import { BookText, Loader2, Timer } from "lucide-react";
import { toast } from "sonner";

type Score = {
  taskResponse: number;
  coherence: number;
  lexical: number;
  grammaticalRange: number;
  overallBand: number;
  feedback: string;
  improvements: string[];
};

const TASKS = [
  "Some people believe that university students should be required to attend classes. Others believe that going to classes should be optional. Discuss both views and give your own opinion.",
  "In many countries, the amount of crime is increasing. What do you think are the main causes of this? What can be done to solve this problem?",
  "Some people think that international tourism is a good thing, while others think it causes problems. Discuss both views and give your opinion.",
  "Technology has made children less creative than they were in the past. To what extent do you agree or disagree?",
  "In the future, nobody will buy printed newspapers or books because they will be able to read everything they want online without paying. Do you agree or disagree?",
];

function useTimer(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    if (left <= 0) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running, left]);
  const mm = Math.floor(left / 60);
  const ss = left % 60;
  return { left, label: `${mm}:${ss.toString().padStart(2, "0")}` };
}

export default function IeltsMockPage() {
  const initialTask = useMemo(
    () => TASKS[Math.floor(Math.random() * TASKS.length)],
    []
  );
  const [task, setTask] = useState(initialTask);
  const [response, setResponse] = useState("");
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(false);
  const { left, label } = useTimer(40 * 60, started && !score);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  async function submit() {
    if (wordCount < 100) {
      toast.error("Write at least 100 words.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ielts-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, response }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Scoring failed");
      } else {
        setScore(data.score);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0FE9C] text-black text-xs font-medium mb-3">
          <BookText className="h-3.5 w-3.5" /> IELTS Writing Task 2 — AI scored
        </div>
        <h1 className="text-3xl font-bold">Practice. Submit. Get a band in seconds.</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Recommended time: 40 minutes, 250+ words. The AI scores TR / CC / LR
          / GRA and predicts your overall band.
        </p>
      </div>

      <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Task prompt
        </p>
        <p className="text-sm mb-3">{task}</p>
        <button
          onClick={() => {
            const next = TASKS[Math.floor(Math.random() * TASKS.length)];
            setTask(next);
            setResponse("");
            setScore(null);
            setStarted(false);
          }}
          className="text-xs text-black dark:text-[#E0FE9C] hover:underline"
        >
          Get a different prompt →
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setStarted(true)}
          disabled={started}
          className="inline-flex items-center gap-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-4 py-2 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
        >
          <Timer className="h-4 w-4" /> {started ? "Timer running" : "Start 40-min timer"}
        </button>
        <span
          className={`text-sm font-mono ${
            left <= 120 && started && !score ? "text-rose-600" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={16}
        placeholder="Start writing here — aim for 250+ words…"
        className="mt-4 w-full rounded-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111111] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#E0FE9C]"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {wordCount} words
          {wordCount < 250 && wordCount > 0 ? " (aim for 250+)" : ""}
        </span>
        <button
          onClick={submit}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-none bg-[#E0FE9C] hover:bg-[#CDEE78] text-black px-5 py-2 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Score my response
        </button>
      </div>

      {score && (
        <div className="mt-8 rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Predicted overall band
              </p>
              <p className="text-5xl font-bold">{score.overallBand.toFixed(1)}</p>
            </div>
            <div className="text-right space-y-1 text-sm">
              <p>Task Response: <strong>{score.taskResponse}</strong></p>
              <p>Coherence: <strong>{score.coherence}</strong></p>
              <p>Lexical: <strong>{score.lexical}</strong></p>
              <p>Grammar: <strong>{score.grammaticalRange}</strong></p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {score.feedback}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1">
            Improvements
          </p>
          <ul className="space-y-1 text-sm list-disc list-inside">
            {score.improvements.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
