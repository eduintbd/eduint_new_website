"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Clock, GraduationCap, Globe, DollarSign,
  Calendar, Award, Building2, ArrowLeft, MessageSquare, BarChart3,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SaveButton from "@/components/programs/SaveButton";
import ProgramCard from "@/components/programs/ProgramCard";
import Spinner from "@/components/ui/Spinner";
import StickyLeadForm from "@/components/leads/StickyLeadForm";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ProgramWithUniversity } from "@/types";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [program, setProgram] = useState<ProgramWithUniversity | null>(null);
  const [similar, setSimilar] = useState<ProgramWithUniversity[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/programs/${id}`);
        const data = await res.json();
        setProgram(data.program);
        setSimilar(data.similar ?? []);
      } catch {
        toast.error("Failed to load program");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!session) { toast.error("Please sign in"); return; }
    try {
      const res = await fetch(`/api/programs/${id}/save`, { method: "POST" });
      const data = await res.json();
      setSaved(data.saved);
      toast.success(data.saved ? "Program saved" : "Program removed");
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-32">
        <p className="text-xl text-gray-500">Program not found</p>
        <Link href="/programs" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <StickyLeadForm
        source={`/programs/${program.id}`}
        defaultCountry={program.country}
        title={`Interested in ${program.name}?`}
        subtitle="A counselor will help you apply. No cost, no obligation."
      />
      <Link
        href="/programs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Programs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{program.level}</Badge>
              {program.scholarshipAvailable && <Badge variant="success">Scholarship Available</Badge>}
              {program.featured && <Badge variant="info">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{program.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{program.university.name}</p>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <MapPin className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium">{program.city}, {program.country}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Clock className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium">{program.duration}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <DollarSign className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-xs text-gray-500">Tuition/Year</p>
              <p className="text-sm font-medium">{formatCurrency(program.tuitionFee, program.currency)}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Globe className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-xs text-gray-500">Language</p>
              <p className="text-sm font-medium">{program.language}</p>
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About This Program</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{program.description}</p>
            </div>
          )}

          {/* Requirements */}
          {program.requirements && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{program.requirements}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <SaveButton saved={saved} onClick={handleSave} />
            <Link href={`/compare?ids=${program.id}`}>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" /> Compare
              </Button>
            </Link>
            <Link href={`/chat?program=${program.id}`}>
              <Button variant="secondary">
                <MessageSquare className="h-4 w-4 mr-2" /> Ask AI About This
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar - University info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold">{program.university.name}</h3>
                <p className="text-xs text-gray-500">{program.university.city}, {program.university.country}</p>
              </div>
            </div>
            {program.university.ranking && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Award className="h-4 w-4" /> World Ranking: #{program.university.ranking}
              </div>
            )}
            {program.acceptanceRate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <BarChart3 className="h-4 w-4" /> Acceptance Rate: {program.acceptanceRate}%
              </div>
            )}
            {program.intakeMonths && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="h-4 w-4" /> Intakes: {program.intakeMonths}
              </div>
            )}
            {program.applicationDeadline && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" /> Deadline: {program.applicationDeadline}
              </div>
            )}
          </div>

          <Link
            href="/register"
            className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>

      {/* Similar programs */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similar.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
