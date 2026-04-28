import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import ProgramCardWithSave from "@/components/programs/ProgramCardWithSave";
import ProgramsToolbar from "./ProgramsToolbar";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    level?: string;
    field?: string;
    maxBudget?: string;
    scholarshipOnly?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 12;

export default async function ProgramsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const country = sp.country ?? "";
  const level = sp.level ?? "";
  const field = sp.field ?? "";
  const maxBudget = sp.maxBudget ?? "";
  const scholarshipOnly = sp.scholarshipOnly === "true";
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

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

  const session = await auth();
  const userId = session?.user?.id;

  const [programs, total] = await Promise.all([
    db.program.findMany({
      where,
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            ranking: true,
            logoUrl: true,
            partnerStatus: true,
          },
        },
      },
      orderBy: { featured: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.program.count({ where }),
  ]);

  let savedSet = new Set<string>();
  if (userId && programs.length > 0) {
    const programIds = programs.map((p) => p.id);
    const saved = await db.savedProgram.findMany({
      where: { userId, programId: { in: programIds } },
      select: { programId: true },
    });
    savedSet = new Set(saved.map((s) => s.programId));
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (level) params.set("level", level);
    if (field) params.set("field", field);
    if (maxBudget) params.set("maxBudget", maxBudget);
    if (scholarshipOnly) params.set("scholarshipOnly", "true");
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/programs?${qs}` : "/programs";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Browse Programs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover 1,400+ programs from 600+ partner universities across 27 study destinations
        </p>
      </div>

      <ProgramsToolbar
        initialSearch={search}
        initialFilters={{ country, level, field, maxBudget, scholarshipOnly }}
      >
        {programs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No programs found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((p) => (
              <ProgramCardWithSave
                key={p.id}
                program={p}
                initialSaved={savedSet.has(p.id)}
                draggable
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                scroll={false}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Previous
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                Previous
              </span>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                scroll={false}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Next
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                Next
              </span>
            )}
          </div>
        )}
      </ProgramsToolbar>
    </div>
  );
}
