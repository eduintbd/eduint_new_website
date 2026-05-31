import {
  Plane, Building, Home, BookOpen, Banknote, FileCheck,
  Shield, Clock, Users, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import StickyLeadForm from "@/components/leads/StickyLeadForm";

export const metadata = {
  title: "Our Services",
  description: "360-degree study abroad solutions - visa assistance, banking, accommodation, test preparation, and more.",
};

const SERVICES = [
  {
    icon: Plane,
    title: "Visa Assistance",
    description: "Our experienced visa consultants guide you through the entire visa application process.",
    features: ["Document checklist preparation", "Application form review", "Interview preparation coaching", "Visa tracking and follow-up"],
    color: "bg-black",
  },
  {
    icon: Building,
    title: "GIC & Banking",
    description: "Complete financial documentation and banking support for your study abroad journey.",
    features: ["GIC account opening guidance", "Foreign exchange assistance", "International wire transfers", "Bank statement preparation"],
    color: "bg-green-600",
  },
  {
    icon: Home,
    title: "Student Accommodation",
    description: "Find safe, comfortable, and affordable housing in your destination city.",
    features: ["On-campus dormitory booking", "Off-campus apartment search", "Homestay arrangement", "Airport pickup coordination"],
    color: "bg-purple-600",
  },
  {
    icon: BookOpen,
    title: "Test Preparation",
    description: "Expert guidance for standardized tests required for international admissions.",
    features: ["IELTS preparation & practice tests", "TOEFL coaching materials", "GRE/GMAT strategy sessions", "Score improvement plans"],
    color: "bg-orange-600",
  },
  {
    icon: Banknote,
    title: "Financial Planning",
    description: "Make studying abroad affordable with our financial guidance and loan support.",
    features: ["Scholarship search & applications", "Education loan assistance", "Budget planning tools", "Part-time work guidance"],
    color: "bg-emerald-600",
  },
  {
    icon: FileCheck,
    title: "Application Processing",
    description: "End-to-end application management from start to acceptance.",
    features: ["SOP & essay writing guidance", "Document verification", "Application submission tracking", "Offer letter negotiation"],
    color: "bg-rose-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-display uppercase tracking-tight">
          360&deg; <span className="text-gray-900 dark:text-white">Solutions</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          From discovering your dream program to landing in your destination — we handle every step of your study abroad journey.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Shield, label: "Trusted by 5,000+ Students", value: "5,000+" },
          { icon: Clock, label: "Average Processing Time", value: "2 Weeks" },
          { icon: Users, label: "Expert Counselors", value: "50+" },
          { icon: CheckCircle2, label: "Success Rate", value: "95%" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center p-4 rounded-none bg-gray-50 dark:bg-gray-800">
              <Icon className="h-6 w-6 text-black dark:text-[#E0FE9C] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Services grid */}
      <div className="space-y-8">
        {SERVICES.map((service, idx) => {
          const Icon = service.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={service.title}
              className={`flex flex-col md:flex-row gap-8 items-center ${!isEven ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-1">
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-none ${service.color} text-white mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full h-48 rounded-none bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon className="h-20 w-20 text-gray-300 dark:text-gray-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-16 p-8 rounded-none bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h2>
        <p className="text-gray-300 mb-6">Get a free consultation with our expert counselors today.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center px-6 py-3 bg-[#E0FE9C] text-black font-medium rounded-none hover:bg-[#CDEE78] transition-colors uppercase tracking-wide font-semibold"
          >
            Book Free Counseling
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-white/70 text-white font-medium rounded-none hover:bg-white/10 transition-colors uppercase tracking-wide font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Inline lead capture card */}
      <div className="mt-12 max-w-2xl mx-auto">
        <StickyLeadForm
          source="/services"
          variant="card"
          title="Talk to an expert counselor"
          subtitle="Free guidance on programs, visas, scholarships, and more."
        />
      </div>
    </div>
  );
}
