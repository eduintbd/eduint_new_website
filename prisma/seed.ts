import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Users ──────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@eduintbd.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@eduintbd.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "fatima@example.com" },
    update: {},
    create: {
      name: "Fatima Rahman",
      email: "fatima@example.com",
      password: userPassword,
      role: "STUDENT",
      nationality: "Bangladeshi",
      phone: "+8801700000001",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "arif@example.com" },
    update: {},
    create: {
      name: "Arif Hossain",
      email: "arif@example.com",
      password: userPassword,
      role: "STUDENT",
      nationality: "Bangladeshi",
      phone: "+8801700000002",
    },
  });

  // ─── Countries ──────────────────────────────────
  const countries = [
    { code: "AU", name: "Australia", flagEmoji: "🇦🇺", featured: true, description: "World-class education in a multicultural setting." },
    { code: "CA", name: "Canada", flagEmoji: "🇨🇦", featured: true, description: "Affordable tuition with welcoming immigration policies." },
    { code: "US", name: "United States", flagEmoji: "🇺🇸", featured: true, description: "Home to the world's top-ranked universities." },
    { code: "UK", name: "United Kingdom", flagEmoji: "🇬🇧", featured: true, description: "Rich academic heritage with shorter programs." },
    { code: "DE", name: "Germany", flagEmoji: "🇩🇪", featured: true, description: "Tuition-free public universities with strong STEM." },
    { code: "IE", name: "Ireland", flagEmoji: "🇮🇪", featured: true, description: "English-speaking tech hub of Europe." },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // ─── Universities ───────────────────────────────
  const unis = await Promise.all([
    prisma.university.create({ data: { name: "University of Toronto", country: "CA", city: "Toronto", ranking: 21, partnerStatus: "FEATURED", description: "Canada's top university, globally ranked #21." } }),
    prisma.university.create({ data: { name: "University of Melbourne", country: "AU", city: "Melbourne", ranking: 33, partnerStatus: "FEATURED", description: "Australia's #1 university." } }),
    prisma.university.create({ data: { name: "University College London", country: "UK", city: "London", ranking: 9, partnerStatus: "FEATURED", description: "Top 10 globally, heart of London." } }),
    prisma.university.create({ data: { name: "Technical University of Munich", country: "DE", city: "Munich", ranking: 37, partnerStatus: "FEATURED", description: "Germany's best technical university." } }),
    prisma.university.create({ data: { name: "University of British Columbia", country: "CA", city: "Vancouver", ranking: 35, partnerStatus: "FEATURED", description: "Global top 40, stunning Vancouver campus." } }),
    prisma.university.create({ data: { name: "University of Sydney", country: "AU", city: "Sydney", ranking: 19, partnerStatus: "FEATURED", description: "Australia's first university." } }),
    prisma.university.create({ data: { name: "MIT", country: "US", city: "Cambridge", ranking: 1, partnerStatus: "FEATURED", description: "World's #1 university for STEM." } }),
    prisma.university.create({ data: { name: "Trinity College Dublin", country: "IE", city: "Dublin", ranking: 81, partnerStatus: "STANDARD", description: "Ireland's top university." } }),
    prisma.university.create({ data: { name: "Stanford University", country: "US", city: "Stanford", ranking: 2, partnerStatus: "FEATURED", description: "World-class research university in Silicon Valley." } }),
    prisma.university.create({ data: { name: "Lakehead University", country: "CA", city: "Thunder Bay", ranking: 500, partnerStatus: "STANDARD", description: "Affordable Canadian university with strong community." } }),
    prisma.university.create({ data: { name: "Western University", country: "CA", city: "London", ranking: 172, partnerStatus: "STANDARD", description: "Leading Canadian research university." } }),
    prisma.university.create({ data: { name: "RWTH Aachen University", country: "DE", city: "Aachen", ranking: 87, partnerStatus: "STANDARD", description: "Top technical university in Germany." } }),
  ]);

  // ─── Programs ───────────────────────────────────
  const programs = [
    { name: "MSc Computer Science", universityId: unis[0].id, country: "CA", city: "Toronto", level: "MASTER", field: "computer-science", duration: "2 years", tuitionFee: 32000, currency: "CAD", intakeMonths: "September", description: "Advanced CS program with AI, ML, and systems research. Access to cutting-edge labs and industry partnerships.", requirements: "BSc in CS or related field. GPA 3.3+. IELTS 7.0 or TOEFL 100.", scholarshipAvailable: true, acceptanceRate: 15, ranking: 10, featured: true },
    { name: "Bachelor of Business Administration", universityId: unis[0].id, country: "CA", city: "Toronto", level: "BACHELOR", field: "business", duration: "4 years", tuitionFee: 52000, currency: "CAD", intakeMonths: "September", description: "Premier business program with co-op opportunities and global exchange.", requirements: "High school diploma. Strong academic record. IELTS 6.5.", scholarshipAvailable: true, acceptanceRate: 40, ranking: 15 },
    { name: "Master of Data Science", universityId: unis[1].id, country: "AU", city: "Melbourne", level: "MASTER", field: "computer-science", duration: "2 years", tuitionFee: 44000, currency: "AUD", intakeMonths: "February,July", description: "Comprehensive data science program covering ML, statistics, and big data.", requirements: "Bachelor's degree with quantitative background. IELTS 6.5.", scholarshipAvailable: true, acceptanceRate: 25, ranking: 20, featured: true },
    { name: "BSc Engineering", universityId: unis[1].id, country: "AU", city: "Melbourne", level: "BACHELOR", field: "engineering", duration: "4 years", tuitionFee: 48000, currency: "AUD", intakeMonths: "February,July", description: "World-class engineering program with industry placements.", requirements: "Strong maths and physics background. IELTS 6.5.", scholarshipAvailable: false, acceptanceRate: 30, ranking: 25 },
    { name: "MSc Machine Learning", universityId: unis[2].id, country: "UK", city: "London", level: "MASTER", field: "computer-science", duration: "1 year", tuitionFee: 35000, currency: "GBP", intakeMonths: "September", description: "Intensive 1-year ML program at a top-10 world university.", requirements: "First-class BSc in CS/Maths. IELTS 7.0.", scholarshipAvailable: true, acceptanceRate: 10, ranking: 5, featured: true },
    { name: "LLM International Law", universityId: unis[2].id, country: "UK", city: "London", level: "MASTER", field: "law", duration: "1 year", tuitionFee: 28000, currency: "GBP", intakeMonths: "September", description: "Prestigious law program covering international and comparative law.", requirements: "Law degree. IELTS 7.5.", scholarshipAvailable: false, acceptanceRate: 20, ranking: 8 },
    { name: "MSc Informatics", universityId: unis[3].id, country: "DE", city: "Munich", level: "MASTER", field: "computer-science", duration: "2 years", tuitionFee: 500, currency: "EUR", intakeMonths: "October", description: "Nearly tuition-free CS program at Germany's top technical university.", requirements: "BSc in CS. GPA 2.5 (German) or equivalent. English B2.", scholarshipAvailable: false, acceptanceRate: 20, ranking: 15, featured: true },
    { name: "MSc Mechanical Engineering", universityId: unis[3].id, country: "DE", city: "Munich", level: "MASTER", field: "engineering", duration: "2 years", tuitionFee: 500, currency: "EUR", intakeMonths: "October,April", description: "Top-ranked mechanical engineering with automotive industry ties.", requirements: "BSc in Engineering. German B1 preferred.", scholarshipAvailable: false, acceptanceRate: 25, ranking: 12 },
    { name: "MSc Computer Science", universityId: unis[4].id, country: "CA", city: "Vancouver", level: "MASTER", field: "computer-science", duration: "2 years", tuitionFee: 9600, currency: "CAD", intakeMonths: "September,January", description: "Research-focused CS program with strong AI and HCI groups.", requirements: "BSc in CS. GPA 3.3. IELTS 7.0.", scholarshipAvailable: true, acceptanceRate: 12, ranking: 22 },
    { name: "Bachelor of Nursing", universityId: unis[5].id, country: "AU", city: "Sydney", level: "BACHELOR", field: "medicine", duration: "3 years", tuitionFee: 40000, currency: "AUD", intakeMonths: "February", description: "Accredited nursing program with clinical placements across Sydney hospitals.", requirements: "High school with science subjects. IELTS 7.0.", scholarshipAvailable: false, acceptanceRate: 35, ranking: 30 },
    { name: "MSc Artificial Intelligence", universityId: unis[6].id, country: "US", city: "Cambridge", level: "MASTER", field: "computer-science", duration: "2 years", tuitionFee: 58000, currency: "USD", intakeMonths: "September", description: "World's premier AI program with access to groundbreaking research.", requirements: "BSc in CS/Math. GRE 330+. TOEFL 100+.", scholarshipAvailable: true, acceptanceRate: 5, ranking: 1, featured: true },
    { name: "MSc Computer Science", universityId: unis[7].id, country: "IE", city: "Dublin", level: "MASTER", field: "computer-science", duration: "1 year", tuitionFee: 18000, currency: "EUR", intakeMonths: "September", description: "CS program in Europe's tech hub with strong industry connections.", requirements: "BSc in CS. 2:1 or equivalent. IELTS 6.5.", scholarshipAvailable: true, acceptanceRate: 30, ranking: 50 },
    { name: "MBA", universityId: unis[8].id, country: "US", city: "Stanford", level: "MASTER", field: "business", duration: "2 years", tuitionFee: 75000, currency: "USD", intakeMonths: "September", description: "World's most prestigious MBA program in the heart of Silicon Valley.", requirements: "Bachelor's degree. GMAT 730+. Strong work experience.", scholarshipAvailable: true, acceptanceRate: 6, ranking: 1, featured: true },
    { name: "Bachelor of Computer Science", universityId: unis[9].id, country: "CA", city: "Thunder Bay", level: "BACHELOR", field: "computer-science", duration: "4 years", tuitionFee: 22000, currency: "CAD", intakeMonths: "September,January,May", description: "Affordable CS program with small class sizes and co-op options.", requirements: "High school diploma. Math background. IELTS 6.0.", scholarshipAvailable: true, acceptanceRate: 70, ranking: 300 },
    { name: "MSc Data Analytics", universityId: unis[10].id, country: "CA", city: "London", level: "MASTER", field: "computer-science", duration: "16 months", tuitionFee: 28000, currency: "CAD", intakeMonths: "September", description: "Applied data analytics program with industry capstone project.", requirements: "Bachelor's with quantitative background. IELTS 6.5.", scholarshipAvailable: false, acceptanceRate: 40, ranking: 100 },
    { name: "MSc Electrical Engineering", universityId: unis[11].id, country: "DE", city: "Aachen", level: "MASTER", field: "engineering", duration: "2 years", tuitionFee: 600, currency: "EUR", intakeMonths: "October,April", description: "Top-ranked EE program, tuition-free, with strong research output.", requirements: "BSc in EE. German helpful but not required.", scholarshipAvailable: false, acceptanceRate: 30, ranking: 50 },
  ];

  for (const p of programs) {
    await prisma.program.create({ data: p });
  }

  // ─── Academic Profiles ──────────────────────────
  await prisma.academicProfile.create({
    data: {
      userId: student1.id,
      highestDegree: "BACHELOR",
      gpa: 3.7,
      gpaScale: "SCALE_4",
      fieldOfStudy: "computer-science",
      graduationYear: 2024,
      institution: "University of Dhaka",
      ieltsScore: 7.5,
      budgetMin: 10000,
      budgetMax: 35000,
      preferredLevel: "MASTER",
      preferredCountries: "CA,AU",
    },
  });

  await prisma.academicProfile.create({
    data: {
      userId: student2.id,
      highestDegree: "BACHELOR",
      gpa: 3.4,
      gpaScale: "SCALE_4",
      fieldOfStudy: "business",
      graduationYear: 2023,
      institution: "BRAC University",
      ieltsScore: 6.5,
      toeflScore: 90,
      budgetMin: 15000,
      budgetMax: 50000,
      preferredLevel: "MASTER",
      preferredCountries: "US,UK",
    },
  });

  console.log("Database seeded successfully!");
  console.log(`
  Test Accounts:
  ┌────────────────────────────┬──────────────┐
  │ Email                      │ Password     │
  ├────────────────────────────┼──────────────┤
  │ admin@eduintbd.com          │ admin123     │
  │ fatima@example.com         │ user123      │
  │ arif@example.com           │ user123      │
  └────────────────────────────┴──────────────┘
  `);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
