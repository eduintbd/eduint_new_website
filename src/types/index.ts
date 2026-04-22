export interface ProgramWithUniversity {
  id: string;
  name: string;
  universityId: string;
  country: string;
  city: string;
  level: string;
  field: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  language: string;
  intakeMonths: string | null;
  description: string | null;
  requirements: string | null;
  scholarshipAvailable: boolean;
  applicationDeadline: string | null;
  ranking: number | null;
  acceptanceRate: number | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  university: {
    id: string;
    name: string;
    country: string;
    city: string;
    ranking: number | null;
    logoUrl: string | null;
    partnerStatus: string;
  };
}

export interface ProgramFilters {
  search?: string;
  country?: string;
  level?: string;
  field?: string;
  minBudget?: number;
  maxBudget?: number;
  language?: string;
  scholarshipOnly?: boolean;
  sortBy?: "relevance" | "tuition-asc" | "tuition-desc" | "ranking" | "deadline";
  page?: number;
}

export interface MatchResultData {
  programId: string;
  score: number;
  reasons: string[];
}
