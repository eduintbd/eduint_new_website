# File Structure

```
EDUINT APP/
│
├── .env / .env.example / .gitignore
├── package.json / tsconfig.json / next.config.ts
├── postcss.config.mjs / eslint.config.mjs
│
├── prisma/
│   ├── schema.prisma             # 13 database models
│   ├── seed.ts                   # Sample data (3 users, 12 unis, 16 programs, 6 countries)
│   └── dev.db                    # SQLite file (auto-created, gitignored)
│
├── public/images/                # Placeholder dirs for countries/, partners/, testimonials/
│
├── docs/                         # These documentation files
│
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout
    │   ├── page.tsx              # Landing page (9 sections)
    │   ├── globals.css           # Tailwind + animations + glass effect
    │   │
    │   ├── (auth)/login/page.tsx           # Login page
    │   ├── (auth)/register/page.tsx        # Register page
    │   ├── programs/page.tsx               # Program search & discovery
    │   ├── programs/[id]/page.tsx          # Program detail
    │   ├── compare/page.tsx                # Program comparison
    │   ├── saved/page.tsx                  # Saved programs (protected)
    │   ├── chat/page.tsx                   # AI chat (protected)
    │   ├── gpa-converter/page.tsx          # GPA converter tool
    │   ├── documents/page.tsx              # Document management (protected)
    │   ├── profile/page.tsx                # User profile (protected)
    │   ├── services/page.tsx               # 360 Solutions
    │   ├── destinations/page.tsx           # All countries
    │   ├── destinations/[country]/page.tsx # Country detail
    │   ├── partners/page.tsx               # Partner institutions
    │   ├── about/page.tsx                  # About us
    │   ├── contact/page.tsx                # Contact form
    │   │
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts # NextAuth handler
    │       ├── register/route.ts           # POST: registration
    │       ├── programs/route.ts           # GET: search programs
    │       ├── programs/[id]/route.ts      # GET: program + similar
    │       ├── programs/[id]/save/route.ts # POST: toggle bookmark
    │       ├── chat/route.ts               # GET: history, POST: message
    │       ├── match/route.ts              # POST: AI matching
    │       ├── documents/route.ts          # GET/POST/DELETE
    │       ├── gpa/route.ts                # POST: convert GPA
    │       ├── profile/route.ts            # GET/PUT profile
    │       └── contact/route.ts            # POST: contact form
    │
    ├── components/
    │   ├── Providers.tsx                   # Session + Theme + Toast
    │   ├── layout/Navbar.tsx               # Nav + theme + mobile menu
    │   ├── layout/Footer.tsx               # Links + social icons
    │   ├── layout/ThemeToggle.tsx           # Theme button
    │   ├── landing/Hero.tsx                # Hero + search
    │   ├── landing/Stats.tsx               # Animated counters
    │   ├── landing/AIMatching.tsx           # Feature showcase
    │   ├── landing/Services360.tsx          # 6 service cards
    │   ├── landing/Testimonials.tsx         # Student stories
    │   ├── landing/Partners.tsx             # University cards
    │   ├── landing/Destinations.tsx         # Country cards
    │   ├── landing/FAQ.tsx                  # Accordion FAQ
    │   ├── landing/CTASection.tsx           # 3 pathways
    │   ├── programs/ProgramCard.tsx         # Card (draggable)
    │   ├── programs/ProgramGrid.tsx         # Grid layout
    │   ├── programs/ProgramFilters.tsx      # Filter sidebar
    │   ├── programs/ProgramSearch.tsx       # Search input
    │   ├── programs/ProgramCompare.tsx      # Comparison table
    │   ├── programs/SaveButton.tsx          # Bookmark toggle
    │   ├── chat/ChatInterface.tsx           # Full chat UI
    │   ├── chat/ChatMessage.tsx             # Message bubble
    │   ├── chat/ChatInput.tsx               # Input + send
    │   ├── chat/ProgramDragCard.tsx         # Draggable mini-card
    │   ├── gpa/GPAConverter.tsx             # Conversion form
    │   └── ui/                             # Shared primitives
    │       ├── Button.tsx                  # 5 variants, 3 sizes
    │       ├── Input.tsx                   # Label + error
    │       ├── Card.tsx                    # Card + Header/Content/Footer
    │       ├── Modal.tsx                   # Overlay modal
    │       ├── Select.tsx                  # Styled select
    │       ├── Badge.tsx                   # 5 color variants
    │       ├── Accordion.tsx               # Expandable items
    │       └── Spinner.tsx                 # Loading (3 sizes)
    │
    ├── lib/
    │   ├── auth.ts                         # NextAuth config
    │   ├── db.ts                           # Prisma singleton
    │   ├── ai.ts                           # Claude API functions
    │   ├── utils.ts                        # Helpers + constants
    │   ├── countries.ts                    # 6 countries data
    │   ├── gpa-scales.ts                   # GPA conversion logic
    │   └── validators.ts                   # Zod schemas
    │
    └── types/
        ├── next-auth.d.ts                  # Session type extensions
        └── index.ts                        # Shared types
```
