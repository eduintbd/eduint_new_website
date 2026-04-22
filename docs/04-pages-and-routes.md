# Pages & Routes Reference

## Public Pages (No Auth Required)

### `/` — Landing Page
- **Components:** Hero, Stats, AIMatching, Services360, Testimonials, Partners, Destinations, FAQ, CTASection
- **Sections:**
  1. Hero: Gradient bg, search bar, "Get Started" + "Talk to AI Counselor" CTAs
  2. Stats: Animated counters (140,000+ programs, 1,500+ unis, 150+ nationalities, 95% acceptance)
  3. AI Matching: 4 feature cards (Smart Analysis, Precision Matching, Instant Results, Trusted Guidance)
  4. 360 Solutions: 6 service cards (Visa, GIC/Banking, Accommodation, Test Prep, Financial, Applications)
  5. Testimonials: 3 student stories with star ratings
  6. Partners: 6 featured university cards
  7. Destinations: 6 country cards with flag emoji, tuition, popular fields
  8. FAQ: 6 expandable questions
  9. CTA Section: 3 pathways (Students, Partners, Schools)

### `/programs` — Program Discovery
- Search bar with debounced query (300ms)
- Filter sidebar: Country, Level, Field, Max Budget, Scholarship Only
- Program grid (3 cols desktop, 2 tablet, 1 mobile)
- Pagination (12 per page)
- Cards are draggable (for chat)
- Save/bookmark toggle per card

### `/programs/[id]` — Program Detail
- Breadcrumb back to programs
- Badge chips (level, scholarship, featured)
- 4 info cards (Location, Duration, Tuition, Language)
- Description + Requirements sections
- Actions: Save, Compare, Ask AI
- Sidebar: University info, ranking, acceptance rate, intakes, deadline, Apply Now CTA
- Similar programs section (3 cards)

### `/compare?ids=id1,id2` — Program Comparison
- Side-by-side table
- 10 comparison criteria: University, Location, Level, Field, Duration, Tuition, Language, Scholarship, Acceptance Rate, Intake
- Remove individual programs

### `/gpa-converter` — GPA Converter Tool
- Input: GPA value + scale selector (4.0, 5.0, 10.0, Percentage)
- Output: All other scale conversions + letter grade
- Info box about GPA scales

### `/services` — 360 Solutions
- Stats bar (5,000+ students, 2 weeks processing, 50+ counselors, 95% success)
- 6 service sections with alternating layout (icon, title, description, 4 features each)
- CTA: "Ready to Start?" with contact link

### `/destinations` — Study Destinations
- 6 country cards: flag emoji, description, tuition, living cost, highlights
- Links to individual country pages

### `/destinations/[country]` — Country Detail
- Static params generated from COUNTRIES array
- Flag + country name header
- Overview, Key Highlights (checkmarks), Costs (tuition + living), Popular Fields
- CTAs: Browse Programs in [Country], Ask AI About [Country]

### `/partners` — Partner Institutions
- 12 featured partner cards (name, city, world ranking, program count)
- "And 1,480+ more" footer

### `/about` — About Us
- Company logo + tagline
- Story section with 4 stat cards
- 4 values (Student First, Integrity, Global Perspective, Excellence)
- Team section (4 members)
- CTA banner

### `/contact` — Contact Form
- Contact info sidebar (email, phone, office, hours)
- Form: Name, Email, Phone, Subject, Message
- Success state with checkmark animation

### `/login` — Sign In
- Google OAuth button
- Divider "or"
- Email + Password form with show/hide toggle
- Link to register

### `/register` — Create Account
- Google OAuth button
- Role selector (Student / Partner)
- Name, Email, Password form
- Auto sign-in after registration → redirects to /profile

---

## Protected Pages (Auth Required)

### `/chat` — AI Chat Assistant
- Unauthenticated: Sign-in prompt
- Authenticated: Full chat interface
  - Message history loaded from DB
  - 4 suggestion buttons for empty state
  - Streaming-style responses
  - Drag-and-drop program cards
  - "Thinking..." indicator

### `/profile` — User Profile
- Personal Info: Name, Phone, Nationality, Bio
- Academic Background: Degree, Institution, Field, Graduation Year, GPA, GPA Scale
- Test Scores: IELTS, TOEFL, GRE, GMAT
- Study Preferences: Preferred Level, Country, Budget Range
- Save button

### `/documents` — Document Management
- Upload section: Document Type dropdown + File Name input + Upload button
- Document list: File icon, name, type label, date, status badge, delete button
- Status badges: PENDING (yellow), VERIFIED (green), REJECTED (red)

### `/saved` — Saved Programs
- Grid of bookmarked programs
- Unsave removes from list immediately

---

## API Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET/POST | `/api/auth/[...nextauth]` | - | NextAuth handlers |
| POST | `/api/register` | No | Create account |
| GET | `/api/programs` | No | Search/filter programs (paginated) |
| GET | `/api/programs/[id]` | No | Program detail + similar |
| POST | `/api/programs/[id]/save` | Yes | Toggle bookmark |
| GET | `/api/chat` | Yes | Chat history (last 50) |
| POST | `/api/chat` | Yes | Send message, get AI reply |
| POST | `/api/match` | Yes | AI matching (needs academic profile) |
| GET | `/api/documents` | Yes | List user documents |
| POST | `/api/documents` | Yes | Upload document record |
| DELETE | `/api/documents?id=` | Yes | Delete document |
| POST | `/api/gpa` | No | GPA conversion |
| GET | `/api/profile` | Yes | Get profile + academic |
| PUT | `/api/profile` | Yes | Update profile + academic |
| POST | `/api/contact` | No | Submit contact form |
