import Link from "next/link";
import { CheckCircle2, Stamp } from "lucide-react";

type Story = {
  initials: string;
  destination: string;
  flag: string;
  program: string;
  university: string;
  year: number;
  note: string;
};

const STORIES: Story[] = [
  {
    initials: "F.R.",
    destination: "Canada",
    flag: "🇨🇦",
    program: "MSc Computer Science",
    university: "Univ. of Toronto",
    year: 2025,
    note: "Got a $12,000 scholarship.",
  },
  {
    initials: "A.H.",
    destination: "Australia",
    flag: "🇦🇺",
    program: "Master of Business Analytics",
    university: "Univ. of Melbourne",
    year: 2025,
    note: "Visa approved in 21 days.",
  },
  {
    initials: "T.K.",
    destination: "UK",
    flag: "🇬🇧",
    program: "MSc Data Science",
    university: "UCL",
    year: 2025,
    note: "2-year Graduate Route visa.",
  },
  {
    initials: "S.M.",
    destination: "Germany",
    flag: "🇩🇪",
    program: "MSc Mechanical Engineering",
    university: "TU Munich",
    year: 2024,
    note: "Zero tuition, blocked account cleared.",
  },
  {
    initials: "N.I.",
    destination: "Ireland",
    flag: "🇮🇪",
    program: "MSc Pharmaceutical Sciences",
    university: "Trinity College Dublin",
    year: 2024,
    note: "Stay Back visa for 2 years.",
  },
  {
    initials: "R.A.",
    destination: "USA",
    flag: "🇺🇸",
    program: "MS in Information Systems",
    university: "Stanford",
    year: 2024,
    note: "Full OPT eligibility on STEM degree.",
  },
];

export default function VisaSuccessWall() {
  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#E0FE9C] text-black text-xs font-semibold uppercase tracking-wide mb-4">
            <Stamp className="h-3.5 w-3.5" /> Real visa stamps · real students
          </div>
          <h2 className="display-title text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Bangladeshis we've helped succeed
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Initials shown to protect privacy. Counselors can share full case
            details on request.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STORIES.map((s) => (
            <div
              key={`${s.initials}-${s.destination}-${s.year}`}
              className="rounded-none border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] p-5 hover:border-[#E0FE9C] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-none bg-[#E0FE9C] text-black flex items-center justify-center text-sm font-bold">
                  {s.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    <span className="mr-1">{s.flag}</span> {s.destination}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {s.university} · {s.year}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-[#CDEE78]" />
              </div>
              <p className="mt-3 text-sm font-medium">{s.program}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {s.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E0FE9C] text-black text-sm font-semibold uppercase tracking-wide rounded-none hover:bg-[#CDEE78] transition-colors"
          >
            Book a counselor — hear your match story
          </Link>
        </div>
      </div>
    </section>
  );
}
