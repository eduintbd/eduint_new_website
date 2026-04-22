import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMatchingAnalysis } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's academic profile
    const profile = await db.academicProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Please complete your academic profile first" },
        { status: 400 }
      );
    }

    // Get programs to match against
    const programs = await db.program.findMany({
      include: { university: true },
      take: 50,
    });

    const programsForAI = programs.map((p) => ({
      id: p.id,
      name: p.name,
      university: p.university.name,
      country: p.country,
      level: p.level,
      field: p.field,
      tuitionFee: p.tuitionFee,
      requirements: p.requirements ?? undefined,
    }));

    // Get AI matching analysis
    let results;
    try {
      results = await getMatchingAnalysis(
        {
          gpa: profile.gpa ?? undefined,
          gpaScale: profile.gpaScale ?? undefined,
          fieldOfStudy: profile.fieldOfStudy ?? undefined,
          preferredLevel: profile.preferredLevel ?? undefined,
          preferredCountries: profile.preferredCountries ?? undefined,
          budgetMax: profile.budgetMax ?? undefined,
          ieltsScore: profile.ieltsScore ?? undefined,
          toeflScore: profile.toeflScore ?? undefined,
        },
        programsForAI
      );
    } catch {
      return NextResponse.json(
        { error: "AI matching is temporarily unavailable" },
        { status: 503 }
      );
    }

    // Save match results
    if (Array.isArray(results)) {
      for (const result of results.slice(0, 10)) {
        await db.matchResult.create({
          data: {
            userId: session.user.id,
            programId: result.programId,
            score: result.score,
            reasons: JSON.stringify(result.reasons),
          },
        });
      }
    }

    // Return matches with full program data
    const matchedPrograms = Array.isArray(results)
      ? results.slice(0, 10).map((r: { programId: string; score: number; reasons: string[] }) => {
          const prog = programs.find((p) => p.id === r.programId);
          return {
            program: prog,
            score: r.score,
            reasons: r.reasons,
          };
        }).filter((m) => m.program)
      : [];

    return NextResponse.json({ matches: matchedPrograms });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 });
  }
}
