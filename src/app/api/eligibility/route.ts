import { NextRequest, NextResponse } from "next/server";
import { eligibilitySchema } from "@/lib/validators";
import { convertGPA } from "@/lib/gpa-scales";

type Verdict = "likely" | "borderline" | "unlikely";

type CountryRule = {
  minGpa4: number; // on a 4.0 scale
  borderlineGpa4: number;
  minIelts: number;
  borderlineIelts: number;
  notes: string;
};

const RULES: Record<string, CountryRule> = {
  AU: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Most Australian universities ask for a 6.5 IELTS (no band under 6.0) and a credit-level academic record.",
  },
  CA: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Canadian universities typically require IELTS 6.5 overall; designated learning institutions may accept 6.0 with conditions.",
  },
  US: {
    minGpa4: 3.0,
    borderlineGpa4: 2.5,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "US admissions weight GPA and standardised tests together; strong SOPs and LORs can offset a weaker score.",
  },
  UK: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "UK Masters usually require a 2:1 (≈ 3.0 / 4.0). IELTS 6.5 with 6.0 in each band is standard for most programs.",
  },
  DE: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Public universities in Germany have no tuition, but require a recognised bachelor and proof of finance (~€11,200 blocked account).",
  },
  IE: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Ireland accepts IELTS 6.5 for most Masters; the Stay Back visa allows 2 years post-study work.",
  },
  NZ: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "New Zealand universities accept IELTS 6.0-6.5 depending on program. GTE-style questioning on finances and study plan.",
  },
  FR: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "French business schools and grandes écoles have their own cut-offs; public universities accept 2nd-class bachelor's and B2 English/French.",
  },
  FI: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Finnish universities weight academic merit heavily and often run an entrance test or interview in addition to IELTS.",
  },
  NL: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Dutch Master's typically need a 75%+ bachelor (≈ 3.0/4.0) plus IELTS 6.5. Some need GRE / GMAT.",
  },
  ES: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Most Spanish Masters accept IELTS 6.0-6.5; business schools (IE, IESE, ESADE) require 6.5+ and GMAT.",
  },
  HU: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Most Hungarian universities accept IELTS 6.0 and a solid bachelor's. Stipendium Hungaricum has its own selection criteria.",
  },
  CY: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Cyprus universities are open to a wide GPA range with IELTS 5.5-6.0. Mandatory medical tests apply at arrival.",
  },
  CH: {
    minGpa4: 3.3,
    borderlineGpa4: 3.0,
    minIelts: 7.0,
    borderlineIelts: 6.5,
    notes:
      "ETH and EPFL are highly selective — expect top GPA and strong research profile. Hospitality schools are more accessible.",
  },
  SE: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Swedish Master's typically require IELTS 6.5 with 5.5 in each band and a recognised bachelor's.",
  },
  IT: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Universitaly pre-enrolment is gating. Public universities accept 2.5 GPA; Bocconi / Politecnico require 3.2+.",
  },
  CN: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Most Chinese English-taught programs ask IELTS 6.0 and a recognised bachelor's. CSC prefers high-GPA candidates.",
  },
  LT: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Lithuanian universities are accessible for a wide GPA band with IELTS 5.5-6.0.",
  },
  VN: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 5.5,
    borderlineIelts: 5.0,
    notes:
      "Vietnamese partner-university programs typically accept IELTS 5.5 and a solid high-school / bachelor record.",
  },
  DK: {
    minGpa4: 3.0,
    borderlineGpa4: 2.7,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "Danish Master's are competitive — a 2:1 equivalent and IELTS 6.5 are baseline; many programs require an essay.",
  },
  BE: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.5,
    borderlineIelts: 6.0,
    notes:
      "KU Leuven and Ghent ask IELTS 6.5 with 6.0 in each band. Annex-32 financial guarantor form is mandatory.",
  },
  AT: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Austrian public universities have low tuition but require German B2 for most non-business programs.",
  },
  MT: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 6.0,
    borderlineIelts: 5.5,
    notes:
      "Malta is English-medium and accepts a wide GPA range. Part-time work rights after 13 weeks of study.",
  },
  PL: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 5.5,
    borderlineIelts: 5.0,
    notes:
      "Polish universities are accessible with IELTS 5.5 and a recognised bachelor's or secondary certificate.",
  },
  RU: {
    minGpa4: 2.5,
    borderlineGpa4: 2.3,
    minIelts: 5.5,
    borderlineIelts: 5.0,
    notes:
      "Russian universities emphasise the invitation-letter step — budget 4-8 weeks before visa application.",
  },
  KR: {
    minGpa4: 2.8,
    borderlineGpa4: 2.5,
    minIelts: 5.5,
    borderlineIelts: 5.0,
    notes:
      "Korean universities accept TOPIK Level 3+ for Korean-medium programs or IELTS 5.5-6.0 for English-medium.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eligibilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { country, gpa, gpaScale, ielts } = parsed.data;
    const rule = RULES[country];
    if (!rule) {
      return NextResponse.json(
        { error: "We don't yet have rules for this country." },
        { status: 400 }
      );
    }

    const gpa4 = convertGPA(gpa, gpaScale, "SCALE_4");

    let verdict: Verdict = "likely";
    const reasons: string[] = [];
    const actions: string[] = [];

    if (gpa4 >= rule.minGpa4) {
      reasons.push(
        `Your academic record (equivalent ${gpa4.toFixed(
          2
        )}/4.0) meets the typical bar for ${country}.`
      );
    } else if (gpa4 >= rule.borderlineGpa4) {
      verdict = "borderline";
      reasons.push(
        `Your GPA (equivalent ${gpa4.toFixed(
          2
        )}/4.0) is borderline for most universities in ${country}.`
      );
      actions.push(
        "Target universities ranked 100+ or programs with flexible GPA entry."
      );
    } else {
      verdict = "unlikely";
      reasons.push(
        `Your GPA (equivalent ${gpa4.toFixed(
          2
        )}/4.0) is below the typical threshold for ${country}.`
      );
      actions.push(
        "Consider foundation / diploma pathways, or strengthen with work experience and a strong SOP."
      );
    }

    if (ielts !== undefined && ielts > 0) {
      if (ielts >= rule.minIelts) {
        reasons.push(`IELTS ${ielts} is above the typical requirement.`);
      } else if (ielts >= rule.borderlineIelts) {
        if (verdict === "likely") verdict = "borderline";
        reasons.push(
          `IELTS ${ielts} is borderline — several universities will accept with a pre-sessional English course.`
        );
        actions.push(
          "Retake IELTS or add a pre-sessional English course to strengthen your file."
        );
      } else {
        verdict = "unlikely";
        reasons.push(
          `IELTS ${ielts} is below the common minimum — most universities will not issue an offer.`
        );
        actions.push(
          "Plan to retake IELTS; target 6.5+ overall with no band under 6.0."
        );
      }
    } else {
      actions.push(
        "You haven't entered an IELTS score — book a test or take our mock to estimate your band."
      );
    }

    if (verdict === "likely") {
      actions.unshift(
        "Shortlist 6-8 programs (2 reach, 4 match, 2 safety) and start applications."
      );
    }

    return NextResponse.json({
      verdict,
      gpa4: Number(gpa4.toFixed(2)),
      summary: rule.notes,
      reasons,
      actions,
    });
  } catch (error) {
    console.error("Eligibility error:", error);
    return NextResponse.json(
      { error: "Could not compute eligibility." },
      { status: 500 }
    );
  }
}
