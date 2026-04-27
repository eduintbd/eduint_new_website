import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://eduintbd.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/auth", "/login", "/register", "/profile", "/saved", "/applications", "/documents", "/pay"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
