# Deploying EDUINTBD to eduintbd.com

A step-by-step runbook to go from the current GitHub repo to a live production
site at **https://eduintbd.com** on Vercel, backed by Neon Postgres.

Expected total time: **20-30 minutes** end-to-end.

---

## 0. Prerequisites (5 min)

You should have these in hand before you start:

- Access to the **eduintbd** GitHub account (repo is at `github.com/eduintbd/eduint_new_website`).
- A Vercel account signed in with the same GitHub account.
- A Neon account (sign up at https://neon.tech — free tier is enough).
- DNS access at the registrar where **eduintbd.com** is registered.
- These secrets:
  - `ANTHROPIC_API_KEY` (console.anthropic.com)
  - `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (console.cloud.google.com)
  - `RESEND_API_KEY` (resend.com)
  - `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, e.g. `8801700000000`
  - `NEXT_PUBLIC_META_PIXEL_ID` — already `1347454903743648` if nothing changed

A fresh `NEXTAUTH_SECRET` is pre-generated in `.env.production.example`.

---

## 1. Create a Neon Postgres database (3 min)

1. Go to https://console.neon.tech → **New Project**.
2. Name it `eduintbd-prod`, region closest to your users (AWS `ap-south-1` or Azure India for BD).
3. After provisioning, open **Connection Details** → choose **Pooled connection**.
4. Copy the full connection string. It looks like:
   ```
   postgres://<user>:<pwd>@ep-xxxx-pooler.ap-south-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Save it somewhere — you'll paste it into Vercel in step 3.

---

## 2. Import the repo into Vercel (3 min)

1. Go to https://vercel.com/new.
2. **Import Git Repository** → select `eduintbd/eduint_new_website`.
3. Framework preset: **Next.js** (auto-detected). Root directory: `./`.
4. **Don't deploy yet** — click the **Environment Variables** dropdown first.

---

## 3. Paste environment variables (5 min)

Open `.env.production.example` in the repo for the full list. Paste each key into
Vercel's Environment Variables panel, one line at a time. Apply to all three
environments (Production, Preview, Development) unless noted.

| Key | Value |
|---|---|
| `DATABASE_URL` | Neon pooled string from step 1 |
| `NEXTAUTH_URL` | `https://eduintbd.com` |
| `NEXTAUTH_SECRET` | From `.env.production.example` (or generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `GOOGLE_CLIENT_ID` | From Google Cloud |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud |
| `ANTHROPIC_API_KEY` | From Anthropic Console |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `8801700000000` (digits only) |
| `WHATSAPP_INTERNAL_NUMBER` | same as above |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1347454903743648` |
| `RESEND_API_KEY` | From Resend |
| `EMAIL_FROM` | `EDUINTBD <notifications@eduintbd.com>` |
| `LEADS_EMAIL_TO` | `admissions@eduintbd.com` |
| `STORAGE_DRIVER` | `disabled` (v1 — cloud storage not yet wired) |

Now click **Deploy**. Vercel will:
- Run `prisma migrate deploy` (creates all tables on Neon using `prisma/migrations/0_init/migration.sql`)
- Run `prisma generate`
- Run `next build`

First deploy takes ~3-5 minutes.

---

## 4. Add Google OAuth redirect (1 min)

1. Go to https://console.cloud.google.com → **APIs & Services → Credentials**.
2. Open your OAuth 2.0 client.
3. Add to **Authorised redirect URIs**:
   ```
   https://eduintbd.com/api/auth/callback/google
   https://www.eduintbd.com/api/auth/callback/google
   ```
4. Save.

---

## 5. Seed the production database (3 min)

Once the first deploy succeeds, populate Neon with the 26 countries, 614
universities, and 1,462 programs.

```bash
# From the repo root, locally:
npx vercel link            # links this folder to the Vercel project
npx vercel env pull .env.production.local
# Load the DATABASE_URL from .env.production.local, then:
DATABASE_URL="<paste-the-url>" npx tsx prisma/seed-prod.ts
```

You should see:
```
  countries: 26
  admin user: admin@eduintbd.com (ROTATE PASSWORD IMMEDIATELY)
  universities: +602 (614 total)
  programs: +1450
Totals → countries: 26, universities: 614, programs: 1462
```

---

## 6. Add the custom domain (5 min)

1. Vercel → **Settings → Domains** → **Add** → `eduintbd.com`.
2. Vercel shows you DNS records to add. Pick one of:
   - **Apex (`eduintbd.com`)**: add `A` record → `76.76.21.21`
   - **Subdomain `www`**: add `CNAME` → `cname.vercel-dns.com`
   - Add **both** rows.
3. At your domain registrar, open DNS settings and add the two records exactly as shown.
4. Wait for propagation (usually < 10 min, up to 1 hour). Vercel auto-issues
   the SSL cert and shows a green "Valid Configuration" badge.

Optional: set `www.eduintbd.com` to **redirect to apex** in Vercel's domain settings.

---

## 7. Rotate the admin password (1 min)

1. Visit `https://eduintbd.com/login`.
2. Sign in as `admin@eduintbd.com` / `admin123`.
3. Go to `/profile` → change the password (or do it via `/admin` once that flow is wired — for now use the DB directly if needed).

---

## 8. Smoke-test (3 min)

Hit these URLs to confirm everything works:

- `https://eduintbd.com/` — landing loads
- `https://eduintbd.com/destinations` — all 26 countries shown
- `https://eduintbd.com/programs?country=FR` — returns French programs
- `https://eduintbd.com/eligibility` — complete the 4-step wizard
- `https://eduintbd.com/chat` (signed in) — AI responds
- Submit a lead from the sticky form → check Neon Studio that the row exists and the Resend email arrived at `admissions@eduintbd.com`

---

## Known v1 limitations

1. **Document uploads return 503.** The `/documents/upload` route is intentionally
   disabled until we wire an S3/R2 driver in `src/lib/storage/index.ts`. Users
   are told to email/WhatsApp documents.
2. **Local dev now requires Postgres** (or a cloud Neon dev branch) since the
   schema moved to `provider = "postgresql"`. For quick local testing, create
   a second free Neon project named `eduintbd-dev` and point your local `.env`
   `DATABASE_URL` to that.
3. **Migrations directory** — future schema changes go through
   `npx prisma migrate dev --name <change>` so Vercel picks them up on deploy.

---

## Rollback

Vercel keeps every prior deploy. In **Deployments**, click a previous working
build and **Promote to Production**. Neon has 7-day point-in-time restore on
paid plans; on free tier, you can re-run `prisma/seed-prod.ts` (idempotent) to
rebuild reference data.
