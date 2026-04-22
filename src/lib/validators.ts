import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "PARTNER"]).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export const academicProfileSchema = z.object({
  highestDegree: z.string().optional(),
  gpa: z.coerce.number().min(0).max(100).optional(),
  gpaScale: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.coerce.number().min(1990).max(2030).optional(),
  institution: z.string().optional(),
  ieltsScore: z.coerce.number().min(0).max(9).optional(),
  toeflScore: z.coerce.number().min(0).max(120).optional(),
  greScore: z.coerce.number().min(130).max(340).optional(),
  gmatScore: z.coerce.number().min(200).max(800).optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  preferredLevel: z.string().optional(),
  preferredCountries: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  programId: z.string().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(7, "Phone is required")
    .max(20, "Phone is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  preferredCountry: z.string().optional(),
  intake: z.string().optional(),
  message: z.string().max(500).optional(),
  source: z.string().min(1, "Source is required"),
});

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required").max(20),
  email: z.string().email("Invalid email"),
  slot: z.string().min(1, "Please pick a date and time"),
  topic: z.string().max(200).optional(),
  leadId: z.string().optional(),
});

export const eligibilitySchema = z.object({
  country: z.string().min(1, "Country is required"),
  level: z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA"]),
  gpa: z.coerce.number().min(0),
  gpaScale: z.enum(["SCALE_4", "SCALE_5", "SCALE_10", "PERCENTAGE"]),
  ielts: z.coerce.number().min(0).max(9).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AcademicProfileInput = z.infer<typeof academicProfileSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type EligibilityInput = z.infer<typeof eligibilitySchema>;
