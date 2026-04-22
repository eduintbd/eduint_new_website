import { NextRequest, NextResponse } from "next/server";
import { convertGPA, GPA_SCALES, getLetterGrade } from "@/lib/gpa-scales";

export async function POST(req: NextRequest) {
  try {
    const { value, fromScale } = await req.json();

    if (typeof value !== "number" || !fromScale) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const conversions = GPA_SCALES.filter((s) => s.code !== fromScale).map((scale) => ({
      scale: scale.name,
      code: scale.code,
      value: convertGPA(value, fromScale, scale.code),
      max: scale.max,
    }));

    const gpa4 = fromScale === "SCALE_4" ? value : convertGPA(value, fromScale, "SCALE_4");
    const letterGrade = getLetterGrade(gpa4);

    return NextResponse.json({ conversions, letterGrade });
  } catch (error) {
    console.error("GPA conversion error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
