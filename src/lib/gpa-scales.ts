export interface GPAScale {
  name: string;
  code: string;
  max: number;
  description: string;
}

export const GPA_SCALES: GPAScale[] = [
  { name: "4.0 Scale (US/Canada)", code: "SCALE_4", max: 4.0, description: "Standard North American GPA scale" },
  { name: "5.0 Scale (Bangladesh/Nigeria)", code: "SCALE_5", max: 5.0, description: "Common in South Asian countries" },
  { name: "10.0 Scale (India/Europe)", code: "SCALE_10", max: 10.0, description: "Used in India and some European countries" },
  { name: "Percentage (0-100)", code: "PERCENTAGE", max: 100, description: "Percentage-based grading" },
];

export const LETTER_GRADES = [
  { letter: "A+", gpa4: 4.0, percentage: 97 },
  { letter: "A", gpa4: 4.0, percentage: 93 },
  { letter: "A-", gpa4: 3.7, percentage: 90 },
  { letter: "B+", gpa4: 3.3, percentage: 87 },
  { letter: "B", gpa4: 3.0, percentage: 83 },
  { letter: "B-", gpa4: 2.7, percentage: 80 },
  { letter: "C+", gpa4: 2.3, percentage: 77 },
  { letter: "C", gpa4: 2.0, percentage: 73 },
  { letter: "C-", gpa4: 1.7, percentage: 70 },
  { letter: "D+", gpa4: 1.3, percentage: 67 },
  { letter: "D", gpa4: 1.0, percentage: 63 },
  { letter: "F", gpa4: 0.0, percentage: 50 },
];

export function convertGPA(value: number, fromScale: string, toScale: string): number {
  // First normalize to a 0-1 ratio
  const fromMax = GPA_SCALES.find((s) => s.code === fromScale)?.max;
  const toMax = GPA_SCALES.find((s) => s.code === toScale)?.max;

  if (!fromMax || !toMax) return 0;

  const ratio = value / fromMax;
  const converted = ratio * toMax;

  return Math.round(converted * 100) / 100;
}

export function getLetterGrade(gpa4: number): string {
  const grade = LETTER_GRADES.find((g) => gpa4 >= g.gpa4);
  return grade?.letter ?? "F";
}
