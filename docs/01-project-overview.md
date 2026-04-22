# EDUINTBD - Project Overview

## Company Info
- **Name:** Education International Bangladesh (EDUINTBD)
- **Website:** www.eduintbd.ai
- **Type:** AI-powered education consultancy / study abroad platform
- **Tagline:** "Your Global Study Partner"
- **Meta Pixel ID:** 1347454903743648

## Tech Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.6 | Framework (App Router) |
| React | 19.2.3 | UI Library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4 | Styling |
| Prisma ORM | 5.22.0 | Database (SQLite dev / PostgreSQL prod) |
| NextAuth | v5 beta.30 | Auth (credentials + Google OAuth) |
| Anthropic SDK | 0.39.0 | AI chat & matching (Claude API) |
| Lucide React | 0.575.0 | Icons |
| Sonner | 2.0.7 | Toast notifications |
| Zod | 4.3.6 | Form validation |
| React Hook Form | 7.71.2 | Form handling |
| clsx + tailwind-merge | - | Class utilities |
| date-fns | 4.1.0 | Date formatting |
| bcryptjs | 3.0.3 | Password hashing |

## Dev Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run setup        # Full DB setup (generate + push + seed)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio GUI
npm run lint         # Run ESLint
```

## Environment Variables (.env)
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ANTHROPIC_API_KEY=""
NEXT_PUBLIC_META_PIXEL_ID="1347454903743648"
```

## Test Accounts
| Email | Password | Role |
|-------|----------|------|
| admin@eduintbd.ai | admin123 | ADMIN |
| fatima@example.com | user123 | STUDENT (CS, GPA 3.7, IELTS 7.5) |
| arif@example.com | user123 | STUDENT (Business, GPA 3.4, IELTS 6.5) |
