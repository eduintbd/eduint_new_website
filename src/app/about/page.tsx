import { GraduationCap, Globe, Users, Award, Heart, Target } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn about EDUINTBD - Education International Bangladesh, your trusted AI-powered study abroad partner.",
};

const TEAM = [
  { name: "Managing Director", role: "Founder & CEO", bio: "15+ years in international education consulting" },
  { name: "Head of Operations", role: "COO", bio: "Expert in visa processing and student services" },
  { name: "Lead AI Engineer", role: "CTO", bio: "Built the AI matching engine powering our platform" },
  { name: "Senior Counselor", role: "Head of Counseling", bio: "Helped 2,000+ students find their dream programs" },
];

const VALUES = [
  { icon: Target, title: "Student First", description: "Every decision we make starts with what's best for our students." },
  { icon: Heart, title: "Integrity", description: "Honest advice, transparent pricing, and genuine care for outcomes." },
  { icon: Globe, title: "Global Perspective", description: "We bring the world's opportunities to Bangladesh's doorstep." },
  { icon: Award, title: "Excellence", description: "We leverage AI technology to deliver the highest quality guidance." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About <span className="gradient-text">EDUINTBD</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Education International Bangladesh is a leading AI-powered education consultancy,
          dedicated to helping Bangladeshi students achieve their dreams of studying abroad.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Founded with a vision to democratize access to international education, EDUINTBD
              combines cutting-edge AI technology with deep industry expertise to help students
              navigate the complex world of study abroad.
            </p>
            <p>
              Our AI-powered matching system analyzes over 140,000 programs from 1,500+ universities
              across 6 countries, ensuring every student finds their perfect fit — not just any program,
              but the right program for their unique profile.
            </p>
            <p>
              From our headquarters in Dhaka, we&apos;ve helped thousands of students realize their
              academic dreams in Australia, Canada, USA, UK, Germany, and Ireland.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "5,000+", label: "Students Placed" },
            { value: "1,500+", label: "Partner Universities" },
            { value: "6", label: "Countries Covered" },
            { value: "95%", label: "Acceptance Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div key={member.role} className="text-center p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mx-auto mb-3">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-blue-600 mb-2">{member.role}</p>
              <p className="text-xs text-gray-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-2xl font-bold mb-3">Start Your Journey With Us</h2>
        <p className="text-blue-100 mb-6">Join thousands of students who found their dream programs through EDUINTBD.</p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Get Started Free
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
