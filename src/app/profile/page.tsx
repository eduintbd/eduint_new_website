"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { STUDY_LEVELS, STUDY_FIELDS } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import { GPA_SCALES } from "@/lib/gpa-scales";
import { toast } from "sonner";
import { User, GraduationCap, Target } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [personal, setPersonal] = useState({ name: "", phone: "", nationality: "", bio: "" });
  const [academic, setAcademic] = useState({
    highestDegree: "", gpa: "", gpaScale: "", fieldOfStudy: "", graduationYear: "",
    institution: "", ieltsScore: "", toeflScore: "", greScore: "", gmatScore: "",
    budgetMin: "", budgetMax: "", preferredLevel: "", preferredCountries: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.user) {
          setPersonal({
            name: data.user.name ?? "",
            phone: data.user.phone ?? "",
            nationality: data.user.nationality ?? "",
            bio: data.user.bio ?? "",
          });
          if (data.user.academicProfile) {
            const ap = data.user.academicProfile;
            setAcademic({
              highestDegree: ap.highestDegree ?? "",
              gpa: ap.gpa?.toString() ?? "",
              gpaScale: ap.gpaScale ?? "",
              fieldOfStudy: ap.fieldOfStudy ?? "",
              graduationYear: ap.graduationYear?.toString() ?? "",
              institution: ap.institution ?? "",
              ieltsScore: ap.ieltsScore?.toString() ?? "",
              toeflScore: ap.toeflScore?.toString() ?? "",
              greScore: ap.greScore?.toString() ?? "",
              gmatScore: ap.gmatScore?.toString() ?? "",
              budgetMin: ap.budgetMin?.toString() ?? "",
              budgetMax: ap.budgetMax?.toString() ?? "",
              preferredLevel: ap.preferredLevel ?? "",
              preferredCountries: ap.preferredCountries ?? "",
            });
          }
        }
      } catch {
        toast.error("Failed to load profile");
      }
      setLoading(false);
    }
    if (session) load();
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal,
          academic: {
            ...academic,
            gpa: academic.gpa ? parseFloat(academic.gpa) : undefined,
            graduationYear: academic.graduationYear ? parseInt(academic.graduationYear) : undefined,
            ieltsScore: academic.ieltsScore ? parseFloat(academic.ieltsScore) : undefined,
            toeflScore: academic.toeflScore ? parseFloat(academic.toeflScore) : undefined,
            greScore: academic.greScore ? parseInt(academic.greScore) : undefined,
            gmatScore: academic.gmatScore ? parseInt(academic.gmatScore) : undefined,
            budgetMin: academic.budgetMin ? parseFloat(academic.budgetMin) : undefined,
            budgetMax: academic.budgetMax ? parseFloat(academic.budgetMax) : undefined,
          },
        }),
      });
      if (res.ok) toast.success("Profile updated");
      else toast.error("Failed to update");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (status === "loading" || loading) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      {/* Personal Info */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
          <Input label="Phone" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
          <Input label="Nationality" value={personal.nationality} onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })} />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              value={personal.bio}
              onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={500}
            />
          </div>
        </div>
      </section>

      {/* Academic Info */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Academic Background</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Highest Degree" value={academic.highestDegree} onChange={(e) => setAcademic({ ...academic, highestDegree: e.target.value })} options={[{ value: "", label: "Select" }, { value: "HIGH_SCHOOL", label: "High School" }, ...STUDY_LEVELS.map((l) => ({ value: l.value, label: l.label }))]} />
          <Input label="Institution" value={academic.institution} onChange={(e) => setAcademic({ ...academic, institution: e.target.value })} />
          <Select label="Field of Study" value={academic.fieldOfStudy} onChange={(e) => setAcademic({ ...academic, fieldOfStudy: e.target.value })} options={[{ value: "", label: "Select" }, ...STUDY_FIELDS.map((f) => ({ value: f.value, label: f.label }))]} />
          <Input label="Graduation Year" type="number" value={academic.graduationYear} onChange={(e) => setAcademic({ ...academic, graduationYear: e.target.value })} />
          <Input label="GPA" type="number" step="0.01" value={academic.gpa} onChange={(e) => setAcademic({ ...academic, gpa: e.target.value })} />
          <Select label="GPA Scale" value={academic.gpaScale} onChange={(e) => setAcademic({ ...academic, gpaScale: e.target.value })} options={[{ value: "", label: "Select" }, ...GPA_SCALES.map((s) => ({ value: s.code, label: s.name }))]} />
        </div>
      </section>

      {/* Test Scores */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Scores</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input label="IELTS" type="number" step="0.5" max="9" value={academic.ieltsScore} onChange={(e) => setAcademic({ ...academic, ieltsScore: e.target.value })} />
          <Input label="TOEFL" type="number" max="120" value={academic.toeflScore} onChange={(e) => setAcademic({ ...academic, toeflScore: e.target.value })} />
          <Input label="GRE" type="number" max="340" value={academic.greScore} onChange={(e) => setAcademic({ ...academic, greScore: e.target.value })} />
          <Input label="GMAT" type="number" max="800" value={academic.gmatScore} onChange={(e) => setAcademic({ ...academic, gmatScore: e.target.value })} />
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Study Preferences</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Preferred Level" value={academic.preferredLevel} onChange={(e) => setAcademic({ ...academic, preferredLevel: e.target.value })} options={[{ value: "", label: "Select" }, ...STUDY_LEVELS.map((l) => ({ value: l.value, label: l.label }))]} />
          <Select label="Preferred Country" value={academic.preferredCountries} onChange={(e) => setAcademic({ ...academic, preferredCountries: e.target.value })} options={[{ value: "", label: "Any" }, ...COUNTRIES.map((c) => ({ value: c.code, label: c.name }))]} />
          <Input label="Min Budget ($/year)" type="number" value={academic.budgetMin} onChange={(e) => setAcademic({ ...academic, budgetMin: e.target.value })} />
          <Input label="Max Budget ($/year)" type="number" value={academic.budgetMax} onChange={(e) => setAcademic({ ...academic, budgetMax: e.target.value })} />
        </div>
      </section>

      <Button onClick={handleSave} loading={saving} size="lg">
        Save Profile
      </Button>
    </div>
  );
}
