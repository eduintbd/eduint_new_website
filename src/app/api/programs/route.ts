import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const country = searchParams.get("country") ?? "";
    const level = searchParams.get("level") ?? "";
    const field = searchParams.get("field") ?? "";
    const maxBudget = searchParams.get("maxBudget");
    const scholarshipOnly = searchParams.get("scholarshipOnly") === "true";
    const sortBy = searchParams.get("sortBy") ?? "relevance";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 12;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { field: { contains: search } },
        { country: { contains: search } },
        { university: { name: { contains: search } } },
      ];
    }
    if (country) where.country = country;
    if (level) where.level = level;
    if (field) where.field = { contains: field };
    if (maxBudget) where.tuitionFee = { lte: parseFloat(maxBudget) };
    if (scholarshipOnly) where.scholarshipAvailable = true;

    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "tuition-asc": orderBy = { tuitionFee: "asc" }; break;
      case "tuition-desc": orderBy = { tuitionFee: "desc" }; break;
      case "ranking": orderBy = { ranking: "asc" }; break;
      default: orderBy = { featured: "desc" };
    }

    const [programs, total] = await Promise.all([
      db.program.findMany({
        where,
        include: {
          university: {
            select: { id: true, name: true, country: true, city: true, ranking: true, logoUrl: true, partnerStatus: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.program.count({ where }),
    ]);

    return NextResponse.json({
      programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Programs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}
