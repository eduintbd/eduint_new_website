import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";
import { VISA_REQUIREMENTS } from "./visa-requirements";
import { COST_DATA } from "./cost-data";
import { convertGPA } from "./gpa-scales";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `You are an AI education counselor for EDUINTBD (Education International Bangladesh), a trusted education consultancy helping Bangladeshi students study abroad. You have expertise in:

- University admissions across Australia, Canada, USA, UK, Germany, and Ireland
- Scholarship opportunities and financial planning
- Visa requirements and application processes
- IELTS, TOEFL, GRE, and GMAT preparation guidance
- Statement of Purpose (SOP) writing tips
- Country-specific study and living information

Be helpful, encouraging, and concrete. Use the provided tools to look up programs, scholarships, eligibility, costs, and visa details whenever the student asks specifics — never guess figures you can look up. When you recommend actions, prefer the EDUINTBD in-app tools (/eligibility, /scholarships, /tools/cost-calculator, /tools/sop-review, /tools/visa-mock, /book) over external links.

Always be honest about requirements and realistic about chances.`;

// ─── Basic (non-agentic) response used by matching engine ───────────────

export async function getChatResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? "I'm sorry, I couldn't generate a response.";
}

// ─── Tool definitions ───────────────────────────────────────────────────

type ToolSpec = Anthropic.Messages.Tool;

const TOOLS: ToolSpec[] = [
  {
    name: "searchPrograms",
    description:
      "Search EDUINTBD's program database. Filters are optional. Returns up to 8 matches with name, university, country, level, field, and tuition.",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string", description: "ISO country code (AU, CA, US, UK, DE, IE)" },
        level: { type: "string", description: "BACHELOR, MASTER, PHD, or DIPLOMA" },
        field: { type: "string", description: "Field keyword e.g. Computer Science, Business" },
        maxTuition: { type: "number", description: "Maximum tuition per year in USD" },
      },
    },
  },
  {
    name: "findScholarships",
    description:
      "Search scholarships EDUINTBD has catalogued. Returns up to 8 matches with name, amount, country, level, deadline.",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string", description: "ISO country code or GLOBAL" },
        level: { type: "string", description: "BACHELOR, MASTER, PHD, or ANY" },
        field: { type: "string" },
        minAmount: { type: "number", description: "Minimum USD amount" },
      },
    },
  },
  {
    name: "checkEligibility",
    description:
      "Assess whether a student's GPA + IELTS is likely, borderline, or unlikely to be admitted in a given country. Use when the student provides GPA/IELTS numbers.",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string" },
        gpa: { type: "number" },
        gpaScale: {
          type: "string",
          description: "SCALE_4, SCALE_5, SCALE_10, or PERCENTAGE",
        },
        ielts: { type: "number" },
      },
      required: ["country", "gpa", "gpaScale"],
    },
  },
  {
    name: "getCountryCosts",
    description:
      "Return ballpark annual cost ranges (tuition, accommodation, living, insurance, upfront proof) for a destination.",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string" },
      },
      required: ["country"],
    },
  },
  {
    name: "getVisaInfo",
    description:
      "Return document checklist, fees, processing time, and common rejection reasons for a student visa.",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string" },
      },
      required: ["country"],
    },
  },
  {
    name: "getUserProfile",
    description:
      "Look up the logged-in student's stored profile — academic record, test scores, preferred countries. Use this before making personalised recommendations.",
    input_schema: { type: "object", properties: {} },
  },
];

// ─── Tool implementations ───────────────────────────────────────────────

async function toolSearchPrograms(input: {
  country?: string;
  level?: string;
  field?: string;
  maxTuition?: number;
}) {
  const where: Record<string, unknown> = {};
  if (input.country) where.country = input.country.toUpperCase();
  if (input.level) where.level = input.level.toUpperCase();
  if (input.field) where.field = { contains: input.field };
  if (input.maxTuition) where.tuitionFee = { lte: input.maxTuition };
  const rows = await db.program.findMany({
    where,
    include: { university: true },
    take: 8,
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    university: p.university.name,
    country: p.country,
    level: p.level,
    field: p.field,
    tuitionFee: p.tuitionFee,
    scholarshipAvailable: p.scholarshipAvailable,
  }));
}

async function toolFindScholarships(input: {
  country?: string;
  level?: string;
  field?: string;
  minAmount?: number;
}) {
  const where: Record<string, unknown> = {};
  if (input.country) where.country = input.country.toUpperCase();
  if (input.level && input.level !== "ANY") where.level = input.level.toUpperCase();
  if (input.field && input.field !== "ANY") where.field = input.field.toUpperCase();
  if (input.minAmount) where.amountValue = { gte: input.minAmount };
  const rows = await db.scholarship.findMany({
    where,
    orderBy: [{ featured: "desc" }, { amountValue: "desc" }],
    take: 8,
  });
  return rows.map((s) => ({
    name: s.name,
    provider: s.provider,
    country: s.country,
    level: s.level,
    amount: s.amount,
    deadline: s.deadline,
    link: s.link,
  }));
}

function toolCheckEligibility(input: {
  country: string;
  gpa: number;
  gpaScale: string;
  ielts?: number;
}) {
  const country = input.country.toUpperCase();
  const rules: Record<
    string,
    { minGpa4: number; borderlineGpa4: number; minIelts: number; borderlineIelts: number }
  > = {
    AU: { minGpa4: 3.0, borderlineGpa4: 2.7, minIelts: 6.5, borderlineIelts: 6.0 },
    CA: { minGpa4: 3.0, borderlineGpa4: 2.7, minIelts: 6.5, borderlineIelts: 6.0 },
    US: { minGpa4: 3.0, borderlineGpa4: 2.5, minIelts: 6.5, borderlineIelts: 6.0 },
    UK: { minGpa4: 2.8, borderlineGpa4: 2.5, minIelts: 6.5, borderlineIelts: 6.0 },
    DE: { minGpa4: 2.8, borderlineGpa4: 2.5, minIelts: 6.0, borderlineIelts: 5.5 },
    IE: { minGpa4: 3.0, borderlineGpa4: 2.7, minIelts: 6.5, borderlineIelts: 6.0 },
  };
  const rule = rules[country];
  if (!rule) return { verdict: "unknown", reason: "No rule for this country." };
  const gpa4 = convertGPA(input.gpa, input.gpaScale, "SCALE_4");
  let verdict: "likely" | "borderline" | "unlikely" = "likely";
  if (gpa4 < rule.borderlineGpa4) verdict = "unlikely";
  else if (gpa4 < rule.minGpa4) verdict = "borderline";
  if (input.ielts !== undefined) {
    if (input.ielts < rule.borderlineIelts) verdict = "unlikely";
    else if (input.ielts < rule.minIelts && verdict === "likely")
      verdict = "borderline";
  }
  return { verdict, gpa4: Number(gpa4.toFixed(2)), minGpa4: rule.minGpa4, minIelts: rule.minIelts };
}

function toolGetCountryCosts(input: { country: string }) {
  const data = COST_DATA[input.country.toUpperCase()];
  if (!data) return { error: "Unknown country" };
  return data;
}

function toolGetVisaInfo(input: { country: string }) {
  const data = VISA_REQUIREMENTS[input.country.toUpperCase()];
  if (!data) return { error: "Unknown country" };
  return data;
}

async function toolGetUserProfile(userId: string | undefined) {
  if (!userId) return { error: "Not signed in" };
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { academicProfile: true },
  });
  if (!user) return { error: "User not found" };
  return {
    name: user.name,
    nationality: user.nationality,
    phone: user.phone,
    academicProfile: user.academicProfile,
  };
}

async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: { userId?: string }
): Promise<unknown> {
  try {
    switch (name) {
      case "searchPrograms":
        return await toolSearchPrograms(input as never);
      case "findScholarships":
        return await toolFindScholarships(input as never);
      case "checkEligibility":
        return toolCheckEligibility(input as never);
      case "getCountryCosts":
        return toolGetCountryCosts(input as never);
      case "getVisaInfo":
        return toolGetVisaInfo(input as never);
      case "getUserProfile":
        return await toolGetUserProfile(ctx.userId);
      default:
        return { error: `Unknown tool ${name}` };
    }
  } catch (err) {
    return { error: (err as Error).message };
  }
}

// ─── Agentic loop ───────────────────────────────────────────────────────

export async function getAgenticResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  ctx: { userId?: string } = {}
): Promise<string> {
  // Build the initial message list. Prior history is plain text; let Claude
  // decide which tools (if any) to call, then synthesise the final answer.
  const msgs: Anthropic.Messages.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Cap tool-use loops to avoid runaway
  for (let step = 0; step < 5; step++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: msgs,
    });

    if (response.stop_reason !== "tool_use") {
      const text = response.content
        .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return text || "I couldn't generate a response — please try rephrasing.";
    }

    // Collect tool_use blocks and execute them in parallel
    const toolUses = response.content.filter(
      (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use"
    );
    const results = await Promise.all(
      toolUses.map(async (u) => ({
        type: "tool_result" as const,
        tool_use_id: u.id,
        content: JSON.stringify(
          await runTool(u.name, u.input as Record<string, unknown>, ctx)
        ),
      }))
    );

    msgs.push({ role: "assistant", content: response.content });
    msgs.push({ role: "user", content: results });
  }
  return "I gathered a lot of info but ran out of steps — please ask a more specific question.";
}

// ─── Matching analysis (unchanged) ──────────────────────────────────────

export async function getMatchingAnalysis(
  profile: {
    gpa?: number;
    gpaScale?: string;
    fieldOfStudy?: string;
    preferredLevel?: string;
    preferredCountries?: string;
    budgetMax?: number;
    ieltsScore?: number;
    toeflScore?: number;
  },
  programs: {
    id: string;
    name: string;
    university: string;
    country: string;
    level: string;
    field: string;
    tuitionFee: number;
    requirements?: string;
  }[]
) {
  const prompt = `Analyze the following student profile and rank the programs by compatibility. Return a JSON array of objects with programId, score (0-100), and reasons (array of strings).

Student Profile:
- GPA: ${profile.gpa ?? "N/A"} (${profile.gpaScale ?? "N/A"})
- Field of Study: ${profile.fieldOfStudy ?? "N/A"}
- Preferred Level: ${profile.preferredLevel ?? "N/A"}
- Preferred Countries: ${profile.preferredCountries ?? "Any"}
- Budget: Up to $${profile.budgetMax ?? "N/A"}/year
- IELTS: ${profile.ieltsScore ?? "N/A"}
- TOEFL: ${profile.toeflScore ?? "N/A"}

Programs:
${programs.map((p) => `- ID: ${p.id}, ${p.name} at ${p.university} (${p.country}), ${p.level}, ${p.field}, $${p.tuitionFee}/year`).join("\n")}

Return ONLY valid JSON, no other text.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  try {
    return JSON.parse(textBlock?.text ?? "[]");
  } catch {
    return [];
  }
}

// ─── Specialised reviewers (Phase 3) ────────────────────────────────────

export async function reviewSOP(text: string): Promise<{
  overallScore: number;
  clarity: number;
  specificity: number;
  structure: number;
  grammar: number;
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
  suggestions: string[];
  summary: string;
}> {
  const prompt = `You are an admissions officer reviewing a Statement of Purpose from a Bangladeshi student applying abroad. Score strictly.

Respond with VALID JSON ONLY in this schema:
{
  "overallScore": 0-100,
  "clarity": 0-10,
  "specificity": 0-10,
  "structure": 0-10,
  "grammar": 0-10,
  "strengths": ["up to 4 bullets"],
  "weaknesses": ["up to 4 bullets"],
  "redFlags": ["cliches, generic phrases, unsubstantiated claims — up to 4"],
  "suggestions": ["concrete rewrites or additions — up to 5"],
  "summary": "one-paragraph plain-English verdict"
}

SOP TEXT:
"""
${text.slice(0, 6000)}
"""`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1600,
    messages: [{ role: "user", content: prompt }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  try {
    return JSON.parse(textBlock?.text ?? "{}");
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}

export async function scoreIeltsWriting(
  task: string,
  response: string
): Promise<{
  taskResponse: number;
  coherence: number;
  lexical: number;
  grammaticalRange: number;
  overallBand: number;
  feedback: string;
  improvements: string[];
}> {
  const prompt = `You are an IELTS examiner scoring an IELTS Writing Task 2 response. Use band descriptors strictly. Return ONLY JSON.

TASK PROMPT: ${task}

CANDIDATE RESPONSE:
"""
${response.slice(0, 4000)}
"""

Return JSON:
{
  "taskResponse": 0-9 (half bands allowed),
  "coherence": 0-9,
  "lexical": 0-9,
  "grammaticalRange": 0-9,
  "overallBand": 0-9 (rounded to nearest 0.5),
  "feedback": "1-paragraph comment",
  "improvements": ["3-5 specific improvements"]
}`;
  const r = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });
  const textBlock = r.content.find((b) => b.type === "text");
  try {
    return JSON.parse(textBlock?.text ?? "{}");
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}

// ─── Visa interview simulator ───────────────────────────────────────────

const VISA_OFFICER_SYSTEM = (country: string) => `You are a strict ${country} visa officer conducting a student visa interview with a Bangladeshi applicant. Speak briefly (1-2 sentences per turn). Ask probing questions about: choice of course, choice of country, finances, ties to home, post-study plans. Do NOT reveal you are an AI. Do NOT coach. If the applicant is silent or evasive, probe harder.
If the applicant says "/end" or after ~8 exchanges, stop asking and output a JSON verdict prefixed with <VERDICT>:
<VERDICT>{"outcome":"APPROVE|REFUSE|BORDERLINE","score":0-100,"redFlags":[...],"strongAnswers":[...],"summary":"..."}</VERDICT>`;

export async function runVisaInterview(
  country: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const r = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: VISA_OFFICER_SYSTEM(country),
    messages,
  });
  const textBlock = r.content.find((b) => b.type === "text");
  return textBlock?.text ?? "";
}
