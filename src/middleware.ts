import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// A lightweight NextAuth instance for middleware — no DB adapter so it runs
// on the Edge. Real auth (with DB) lives in src/lib/auth.ts.
const { auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({ credentials: {}, authorize: async () => null }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token as { role?: string }).role;
      }
      return session;
    },
  },
});

const STAFF_ROLES = new Set(["COUNSELOR", "MANAGER", "ADMIN"]);

export default auth((req) => {
  const role = (req.auth?.user as { role?: string } | undefined)?.role;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!role || !STAFF_ROLES.has(role)) {
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: role ? 403 : 401 }
        );
      }
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
