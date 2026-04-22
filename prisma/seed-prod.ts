/**
 * Idempotent production seed. Safe to run multiple times.
 *
 * Loads: 26 countries, 614 universities, 1,462 programs, plus an admin user
 * (rotate the password immediately after first login).
 *
 * Usage locally against a Neon URL:
 *   DATABASE_URL='postgres://…' npx tsx prisma/seed-prod.ts
 *
 * Or via Vercel:
 *   vercel env pull .env.production
 *   DATABASE_URL=<from .env.production> npx tsx prisma/seed-prod.ts
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

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

async function main() {
  console.log("Seeding production database…");

  // ─── Countries ────────────────────────────────────────
  for (const [code, meta] of Object.entries(COUNTRY_META)) {
    await prisma.country.upsert({
      where: { code },
      update: {},
      create: { code, ...meta },
    });
  }
  console.log(`  countries: ${Object.keys(COUNTRY_META).length}`);

  // ─── Admin user ───────────────────────────────────────
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD ?? "admin123",
    12
  );
  await prisma.user.upsert({
    where: { email: "admin@eduintbd.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@eduintbd.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("  admin user: admin@eduintbd.com (ROTATE PASSWORD IMMEDIATELY)");

  // ─── Universities + Programs ─────────────────────────
  // Data files ship alongside this script when the repo is deployed.
  const dataDir = path.join(__dirname, "seed-data");
  const uniFile = path.join(dataDir, "universities.json");
  const progFile = path.join(dataDir, "programs.json");

  if (!fs.existsSync(uniFile) || !fs.existsSync(progFile)) {
    console.log(
      "  ⚠ seed-data/*.json not found — skipping universities + programs."
    );
    console.log(
      "    Generate them with: node tmp_extract/extract_all.cjs then copy to prisma/seed-data/"
    );
    return;
  }

  const universities: UniSeed[] = JSON.parse(
    fs.readFileSync(uniFile, "utf8")
  );
  const programs: ProgramSeed[] = JSON.parse(
    fs.readFileSync(progFile, "utf8")
  );

  // Upsert universities keyed by (country, name lowercase).
  const existing = await prisma.university.findMany();
  const uniIdMap = new Map(
    existing.map((u) => [`${u.country}|${u.name.toLowerCase()}`, u.id])
  );

  let created = 0;
  for (const u of universities) {
    const key = `${u.code}|${u.name.toLowerCase()}`;
    if (uniIdMap.has(key)) continue;
    const row = await prisma.university.create({
      data: {
        name: u.name,
        country: u.code,
        city: u.city ?? "",
        ranking: u.ranking ?? null,
        website: u.website ?? null,
        partnerStatus: "STANDARD",
      },
    });
    uniIdMap.set(key, row.id);
    created++;
  }
  console.log(`  universities: +${created} (${uniIdMap.size} total)`);

  // Dedupe programs by (uni, name, level) and batch-insert.
  const existingSig = new Set(
    (
      await prisma.program.findMany({
        select: { universityId: true, name: true, level: true },
      })
    ).map((p) => `${p.universityId}|${p.name.toLowerCase()}|${p.level}`)
  );

  const batch: Prisma.ProgramCreateManyInput[] = [];
  for (const p of programs) {
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
      currency: "USD",
      language: p.language ?? "English",
      intakeMonths: p.intake ?? null,
      description: null,
      requirements: p.requirements ?? null,
      scholarshipAvailable: !!p.scholarship,
      ranking: p.ranking ?? null,
      featured: !!(p.ranking && p.ranking <= 100),
    });
  }
  if (batch.length) {
    // createMany is faster and Postgres supports it.
    const res = await prisma.program.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`  programs: +${res.count}`);
  }

  const [c, u, p] = await Promise.all([
    prisma.country.count(),
    prisma.university.count(),
    prisma.program.count(),
  ]);
  console.log(`\nTotals → countries: ${c}, universities: ${u}, programs: ${p}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
