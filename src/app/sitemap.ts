import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/countries";
import { BLOG_POSTS } from "@/data/blog-posts";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://eduintbd.com";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/destinations", changeFrequency: "weekly", priority: 0.9 },
  { path: "/programs", changeFrequency: "daily", priority: 0.9 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/scholarships", changeFrequency: "weekly", priority: 0.8 },
  { path: "/eligibility", changeFrequency: "monthly", priority: 0.8 },
  { path: "/gpa-converter", changeFrequency: "yearly", priority: 0.6 },
  { path: "/tools/cost-calculator", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tools/ielts-mock", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tools/sop-review", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tools/visa-mock", changeFrequency: "monthly", priority: 0.6 },
  { path: "/events", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/community", changeFrequency: "daily", priority: 0.6 },
  { path: "/offices", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/book", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const destinationEntries = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/destinations/${c.code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const visaEntries = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/destinations/${c.code.toLowerCase()}/visa`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogEntries = BLOG_POSTS.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...destinationEntries, ...visaEntries, ...blogEntries];
}
