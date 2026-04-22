# Components Reference

## UI Primitives (`src/components/ui/`)

### Button
```tsx
import Button from "@/components/ui/Button";

<Button variant="primary" size="md" loading={false} onClick={fn}>
  Click Me
</Button>
```
**Props:** variant (primary|secondary|outline|ghost|danger), size (sm|md|lg), loading, disabled, + all button HTML attrs

### Input
```tsx
import Input from "@/components/ui/Input";

<Input label="Email" type="email" error="Required" placeholder="you@example.com" />
```
**Props:** label, error, + all input HTML attrs

### Select
```tsx
import Select from "@/components/ui/Select";

<Select
  label="Country"
  placeholder="Select..."
  options={[{ value: "CA", label: "Canada" }]}
/>
```
**Props:** label, error, options (array of {value, label}), placeholder

### Card
```tsx
import Card, { CardHeader, CardContent, CardFooter } from "@/components/ui/Card";

<Card hover>
  <CardHeader>Title</CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```
**Props:** hover (adds shadow on hover)

### Modal
```tsx
import Modal from "@/components/ui/Modal";

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  Content here
</Modal>
```
**Props:** open, onClose, title, className

### Badge
```tsx
import Badge from "@/components/ui/Badge";

<Badge variant="success">Verified</Badge>
```
**Props:** variant (default|success|warning|error|info)

### Accordion
```tsx
import Accordion from "@/components/ui/Accordion";

<Accordion items={[{ title: "Question?", content: "Answer." }]} />
```
**Props:** items (array of {title, content}), className

### Spinner
```tsx
import Spinner from "@/components/ui/Spinner";

<Spinner size="lg" />
```
**Props:** size (sm|md|lg), className

---

## Layout Components

### Navbar (`src/components/layout/Navbar.tsx`)
- Sticky, glass effect
- Logo + nav links + theme toggle + auth buttons/profile dropdown
- Mobile hamburger menu
- Nav links: Programs, Services, Destinations, GPA Converter, About, Contact
- Profile dropdown: Profile, Saved Programs, Documents, Sign Out

### Footer (`src/components/layout/Footer.tsx`)
- 4-column grid: Brand + Quick Links + Company + Resources
- Social icons: Facebook, LinkedIn, Instagram, YouTube
- Copyright line

### Providers (`src/components/Providers.tsx`)
- `SessionProvider` (NextAuth)
- `ThemeProvider` (custom context with localStorage)
- `Toaster` (Sonner, top-right, richColors)
- Hook: `useTheme()` → `{ theme, toggleTheme }`

---

## Landing Page Components (`src/components/landing/`)

### Hero
- Gradient background with decorative blurred circles
- "AI-Powered University Matching" chip
- Headline: "Your Global Study Partner"
- Search bar → redirects to `/programs?search=...`
- Two CTAs: "Get Started Free" + "Talk to AI Counselor"

### Stats
- 4 animated counters using IntersectionObserver
- Values: 140,000+ / 1,500+ / 150+ / 95%
- Icons: BookOpen, Building2, Globe, TrendingUp

### AIMatching
- 4 feature cards: Brain, Target, Zap, Shield icons
- CTA: "Try AI Matching Free"

### Services360
- 6 service cards with colored icon backgrounds
- Each has icon, title, description
- CTA: "View All Services"

### Testimonials
- 3 testimonial cards with quote, stars, name, university

### Partners
- 6 featured university cards with Building2 icon
- CTA: "View All Partners"

### Destinations
- Maps through COUNTRIES array from lib/countries.ts
- Shows flag emoji, name, popular fields, avg tuition

### FAQ
- 6 items using Accordion component

### CTASection
- 3 pathway cards: Students (blue), Partners (emerald), Schools (purple)
- Each with gradient icon, title, description, CTA button

---

## Program Components (`src/components/programs/`)

### ProgramCard
- Draggable (sets "program" data on drag)
- Shows: level badge, scholarship badge, name, university, location, duration, field, tuition, acceptance rate
- Save/unsave toggle button

### ProgramGrid
- Responsive grid (1/2/3 cols)
- Loading state (Spinner), empty state message
- Maps ProgramCard for each program

### ProgramFilters
- Sidebar with: Country, Level, Field, Max Budget selects + Scholarship checkbox
- Clear all button

### ProgramSearch
- Search icon + text input

### ProgramCompare
- HTML table with header row (program names) + 10 comparison rows
- Boolean values show checkmark/x icons
- Remove button per program

### SaveButton
- Toggle button with Bookmark/BookmarkCheck icons

---

## Chat Components (`src/components/chat/`)

### ChatInterface
- Full-height chat (`100vh - 8rem`)
- Loads history on mount from `/api/chat`
- Empty state: AI icon + 4 suggestion buttons
- Handles drag-and-drop (program cards → generates contextual question)
- Auto-scrolls to bottom

### ChatMessage
- User: Blue bubble, right-aligned, User icon
- Assistant: Gray bubble, left-aligned, Bot icon

### ChatInput
- Textarea (auto-submit on Enter, Shift+Enter for newline)
- Send button (disabled when empty/loading)

### ProgramDragCard
- Small draggable card with GripVertical icon + program name/university

---

## GPA Component (`src/components/gpa/`)

### GPAConverter
- Input: GPA value + scale selector
- Button: "Convert"
- Results: Table of all other scale conversions + letter grade
