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
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium mb-3">
            <Stamp className="h-3.5 w-3.5" /> Real visa stamps · real students
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Bangladeshis we've helped succeed
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Initials shown to protect privacy. Counselors can share full case
            details on request.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STORIES.map((s) => (
            <div
              key={`${s.initials}-${s.destination}-${s.year}`}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
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
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-3 text-sm font-medium">{s.program}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {s.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book a counselor — hear your match story
          </Link>
        </div>
      </div>
    </section>
  );
}
