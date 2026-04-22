# Customization Guide

## Quick Changes

### Change Company Name/Branding
- **Logo text:** `src/components/layout/Navbar.tsx` → "EDUINTBD" text
- **Footer brand:** `src/components/layout/Footer.tsx` → brand name + description
- **Page titles:** `src/app/layout.tsx` → metadata.title
- **Hero tagline:** `src/components/landing/Hero.tsx` → h1 text
- **About page:** `src/app/about/page.tsx` → company story

### Change Colors
- **Primary blue:** Search for `blue-600` / `blue-700` across components
- **Gradient:** `src/app/globals.css` → `.gradient-text` and `:root` variables
- **Service card colors:** `src/components/landing/Services360.tsx` → color prop per service

### Change Countries
- **Edit:** `src/lib/countries.ts` → Add/remove/modify COUNTRIES array
- **Each needs:** code, name, flagEmoji, description, highlights, avgTuition, livingCost, popularFields
- **Also update:** `prisma/seed.ts` → countries section

### Add/Remove Nav Links
- **Edit:** `src/components/layout/Navbar.tsx` → NAV_LINKS array
- **Format:** `{ href: "/path", label: "Label" }`

### Change Footer Links
- **Edit:** `src/components/layout/Footer.tsx` → FOOTER_LINKS object

### Change Landing Page Sections
- **Edit:** `src/app/page.tsx` → Add/remove/reorder component imports
- **Each section is an independent component** in `src/components/landing/`

### Change FAQ Questions
- **Edit:** `src/components/landing/FAQ.tsx` → FAQ_ITEMS array

### Change Testimonials
- **Edit:** `src/components/landing/Testimonials.tsx` → TESTIMONIALS array
- **Each needs:** name, university, country, text, rating

### Change Partner Universities
- **Landing page:** `src/components/landing/Partners.tsx` → PARTNERS array
- **Partners page:** `src/app/partners/page.tsx` → FEATURED_PARTNERS array
- **Database:** `prisma/seed.ts` → unis array

### Change Services
- **Landing preview:** `src/components/landing/Services360.tsx` → SERVICES array
- **Full page:** `src/app/services/page.tsx` → SERVICES array (with features)

### Change Study Fields
- **Edit:** `src/lib/utils.ts` → STUDY_FIELDS array

### Change Document Types
- **Edit:** `src/lib/utils.ts` → DOCUMENT_TYPES array

### Change GPA Scales
- **Edit:** `src/lib/gpa-scales.ts` → GPA_SCALES array

---

## Adding New Pages

### 1. Create the page file
```
src/app/new-page/page.tsx
```

### 2. Add to navigation (if needed)
```tsx
// src/components/layout/Navbar.tsx → NAV_LINKS array
{ href: "/new-page", label: "New Page" }
```

### 3. Page template (server component)
```tsx
export const metadata = { title: "New Page" };

export default function NewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Page <span className="gradient-text">Title</span>
      </h1>
    </div>
  );
}
```

### 4. Page template (client component, if needs interactivity)
```tsx
"use client";

import { useState } from "react";

export default function NewPage() {
  const [data, setData] = useState(null);
  // ...
}
```

---

## Adding New API Routes

### Template
```tsx
// src/app/api/new-route/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";  // if auth needed
import { db } from "@/lib/db";      // if DB needed

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... your logic
  return NextResponse.json({ data });
}
```

---

## Adding New Database Models

### 1. Edit `prisma/schema.prisma`
```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

### 2. Push changes
```bash
npx prisma db push
npx prisma generate
```

### 3. Use in code
```tsx
import { db } from "@/lib/db";
const items = await db.newModel.findMany();
```

---

## Switching to PostgreSQL (Production)

### 1. Update `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Update `.env`
```
DATABASE_URL="postgresql://user:password@host:5432/eduintbd"
```

### 3. Regenerate
```bash
npx prisma generate
npx prisma db push
```

---

## Adding Real Images

### Country flags/images
Place in: `public/images/countries/au.webp`, `ca.webp`, etc.
Reference in: `src/lib/countries.ts` → add imageUrl property

### University logos
Place in: `public/images/partners/`
Update: `prisma/seed.ts` → logoUrl field

### Student testimonial photos
Place in: `public/images/testimonials/`
Update: `src/components/landing/Testimonials.tsx` → image field

---

## Key Files to Modify for Common Tasks

| Task | File(s) |
|------|---------|
| Change branding | Navbar.tsx, Footer.tsx, layout.tsx, Hero.tsx |
| Add country | lib/countries.ts, prisma/seed.ts |
| Add program | prisma/seed.ts (or via admin API) |
| Change AI behavior | lib/ai.ts (SYSTEM_PROMPT) |
| Change auth settings | lib/auth.ts |
| Add form field | lib/validators.ts + component + API route |
| Change theme colors | globals.css + search/replace color classes |
| Add new nav link | Navbar.tsx → NAV_LINKS |
| Modify program filters | ProgramFilters.tsx + api/programs/route.ts |
