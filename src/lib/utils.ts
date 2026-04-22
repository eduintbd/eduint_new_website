import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const STUDY_LEVELS = [
  { value: "BACHELOR", label: "Bachelor's" },
  { value: "MASTER", label: "Master's" },
  { value: "PHD", label: "PhD" },
  { value: "DIPLOMA", label: "Diploma" },
] as const;

export const STUDY_FIELDS = [
  { value: "computer-science", label: "Computer Science & IT" },
  { value: "business", label: "Business & Management" },
  { value: "engineering", label: "Engineering" },
  { value: "medicine", label: "Medicine & Health" },
  { value: "arts", label: "Arts & Humanities" },
  { value: "science", label: "Natural Sciences" },
  { value: "law", label: "Law" },
  { value: "education", label: "Education" },
  { value: "social-science", label: "Social Sciences" },
  { value: "agriculture", label: "Agriculture" },
] as const;

export const DOCUMENT_TYPES = [
  { value: "PASSPORT", label: "Passport" },
  { value: "IELTS", label: "IELTS Score" },
  { value: "TOEFL", label: "TOEFL Score" },
  { value: "TRANSCRIPT", label: "Academic Transcript" },
  { value: "SOP", label: "Statement of Purpose" },
  { value: "INCOME", label: "Income Statement" },
  { value: "OTHER", label: "Other" },
] as const;
