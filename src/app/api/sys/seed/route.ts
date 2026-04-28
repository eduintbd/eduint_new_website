import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import universities from "../../../../../prisma/seed-data/universities.json";
import programs from "../../../../../prisma/seed-data/programs.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type UniSeed = {
  code: string;
  country: string;
  name: string;
  city: string | null;
  ranking: number | null;
  website: string | null;
};

type ProgramSeed = {
  uniKey: string;
  name: string;
  level: string;
  field: string;
  tuition: number | null;
  currency: string;
  duration: string | null;
  language: string;
  requirements: string | null;
  intake: string | null;
  scholarship: boolean;
  website: string | null;
  ranking: number | null;
};

const COUNTRY_META: Record<
  string,
  { name: string; flagEmoji: string; featured: boolean; description: string }
> = {
  AU: { name: "Australia", flagEmoji: "🇦🇺", featured: true, description: "World-class education in a multicultural setting." },
  CA: { name: "Canada", flagEmoji: "🇨🇦", featured: true, description: "Affordable tuition with welcoming immigration policies." },
  US: { name: "United States", flagEmoji: "🇺🇸", featured: true, description: "Home to the world's top-ranked universities." },
  UK: { name: "United Kingdom", flagEmoji: "🇬🇧", featured: true, description: "Rich academic heritage with shorter programs." },
  DE: { name: "Germany", flagEmoji: "🇩🇪", featured: true, description: "Tuition-free public universities with strong STEM." },
  IE: { name: "Ireland", flagEmoji: "🇮🇪", featured: true, description: "English-speaking tech hub of Europe." },
  NZ: { name: "New Zealand", flagEmoji: "🇳🇿", featured: true, description: "Top-ranked universities and a 3-year post-study work visa." },
  FR: { name: "France", flagEmoji: "🇫🇷", featured: false, description: "Grandes écoles, affordable public universities, 2-year job search visa." },
  FI: { name: "Finland", flagEmoji: "🇫🇮", featured: false, description: "Top education system with English-taught Master's." },
  NL: { name: "Netherlands", flagEmoji: "🇳🇱", featured: true, description: "Europe's widest English-taught catalogue." },
  ES: { name: "Spain", flagEmoji: "🇪🇸", featured: false, description: "Top business schools and low cost of living." },
  HU: { name: "Hungary", flagEmoji: "🇭🇺", featured: false, description: "Affordable EU medical and engineering routes." },
  CY: { name: "Cyprus", flagEmoji: "🇨🇾", featured: false, description: "English-speaking EU island with low tuition." },
  CH: { name: "Switzerland", flagEmoji: "🇨🇭", featured: false, description: "ETH/EPFL and top hospitality schools." },
  SE: { name: "Sweden", flagEmoji: "🇸🇪", featured: false, description: "Innovation-led Nordic universities." },
  IT: { name: "Italy", flagEmoji: "🇮🇹", featured: false, description: "World-leading design, engineering, and business schools." },
  CN: { name: "China", flagEmoji: "🇨🇳", featured: false, description: "CSC scholarships and fast-rising universities." },
  LT: { name: "Lithuania", flagEmoji: "🇱🇹", featured: false, description: "Low-tuition EU route with English-taught programs." },
  VN: { name: "Vietnam", flagEmoji: "🇻🇳", featured: false, description: "Affordable regional hub with growing partner campuses." },
  DK: { name: "Denmark", flagEmoji: "🇩🇰", featured: false, description: "Top Nordic universities with English-taught Master's." },
  BE: { name: "Belgium", flagEmoji: "🇧🇪", featured: false, description: "Top-200 research universities at the heart of the EU." },
  AT: { name: "Austria", flagEmoji: "🇦🇹", featured: false, description: "Affordable public tuition with Schengen access." },
  MT: { name: "Malta", flagEmoji: "🇲🇹", featured: false, description: "English-speaking EU island with a growing knowledge economy." },
  PL: { name: "Poland", flagEmoji: "🇵🇱", featured: false, description: "Affordable EU destination with strong IT + medical." },
  RU: { name: "Russia", flagEmoji: "🇷🇺", featured: false, description: "Affordable medical and engineering programs." },
  KR: { name: "South Korea", flagEmoji: "🇰🇷", featured: false, description: "Tech powerhouse with KGSP scholarships." },
  MY: { name: "Malaysia", flagEmoji: "🇲🇾", featured: true, description: "English-taught programs and branch campuses of top UK/AU universities." },
};

const FIELD_MAP: Record<string, string> = {
  "Computer Science": "computer-science",
  "Data Science": "computer-science",
  Cybersecurity: "computer-science",
  Engineering: "engineering",
  Business: "business",
  Hospitality: "hospitality",
  Health: "medicine",
  Science: "science",
  Architecture: "architecture",
  Design: "design",
  Arts: "arts",
  Law: "law",
  "Social Sciences": "social-sciences",
  Education: "education",
  General: "general",
};

function slugifyField(field: string | null | undefined) {
  if (!field) return "general";
  return String(field)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.SEED_TOKEN ?? "";
  if (expected.length < 24) return false;
  const provided =
    req.headers.get("x-seed-token") ??
    new URL(req.url).searchParams.get("token") ??
    "";
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function runSeed() {
  for (const [code, meta] of Object.entries(COUNTRY_META)) {
    await db.country.upsert({
      where: { code },
      update: {},
      create: { code, ...meta },
    });
  }

  const existingUnis = await db.university.findMany();
  const uniIdMap = new Map(
    existingUnis.map((u) => [`${u.country}|${u.name.toLowerCase()}`, u.id])
  );

  let createdU = 0;
  for (const u of universities as UniSeed[]) {
    const key = `${u.code}|${u.name.toLowerCase()}`;
    if (uniIdMap.has(key)) continue;
    const row = await db.university.create({
      data: {
        name: u.name,
        country: u.code,
        city: u.city ?? "",
        ranking: u.ranking ?? null,
        website: u.website ?? null,
        partnerStatus: u.ranking != null && u.ranking <= 100 ? "FEATURED" : "STANDARD",
      },
    });
    uniIdMap.set(key, row.id);
    createdU++;
  }

  const existingSig = new Set(
    (
      await db.program.findMany({
        select: { universityId: true, name: true, level: true },
      })
    ).map((p) => `${p.universityId}|${p.name.toLowerCase()}|${p.level}`)
  );

  const batch: Prisma.ProgramCreateManyInput[] = [];
  for (const p of programs as ProgramSeed[]) {
    const [code, name] = p.uniKey.split("|");
    const uniId = uniIdMap.get(`${code}|${name.toLowerCase()}`);
    if (!uniId) continue;
    const sig = `${uniId}|${p.name.toLowerCase()}|${p.level}`;
    if (existingSig.has(sig)) continue;
    existingSig.add(sig);
    batch.push({
      name: p.name,
      universityId: uniId,
      country: code,
      city: "",
      level: p.level ?? "MASTER",
      field: FIELD_MAP[p.field] ?? slugifyField(p.field),
      duration: p.duration ?? "",
      tuitionFee: p.tuition != null && p.tuition > 0 ? p.tuition : 0,
      currency: p.currency ?? "USD",
      language: p.language ?? "English",
      intakeMonths: p.intake ?? null,
      description: null,
      requirements: p.requirements ?? null,
      scholarshipAvailable: !!p.scholarship,
      ranking: p.ranking ?? null,
      featured: !!(p.ranking && p.ranking <= 100),
    });
  }

  let createdP = 0;
  if (batch.length) {
    const res = await db.program.createMany({ data: batch, skipDuplicates: true });
    createdP = res.count;
  }

  const [countries, totalUnis, totalProgs] = await Promise.all([
    db.country.count(),
    db.university.count(),
    db.program.count(),
  ]);

  return {
    added: { universities: createdU, programs: createdP },
    totals: { countries, universities: totalUnis, programs: totalProgs },
  };
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runSeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 }
    );
  }
}
