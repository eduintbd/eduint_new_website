# Data & Constants Reference

## Countries (`src/lib/countries.ts`)

| Code | Name | Flag | Avg Tuition | Living Cost |
|------|------|------|-------------|-------------|
| AU | Australia | 🇦🇺 | $20,000 - $45,000/yr | $21,000 - $30,000/yr |
| CA | Canada | 🇨🇦 | $15,000 - $35,000/yr | $15,000 - $20,000/yr |
| US | United States | 🇺🇸 | $25,000 - $55,000/yr | $15,000 - $25,000/yr |
| UK | United Kingdom | 🇬🇧 | £12,000 - £38,000/yr | £12,000 - £15,000/yr |
| DE | Germany | 🇩🇪 | €0 - €20,000/yr | €10,000 - €12,000/yr |
| IE | Ireland | 🇮🇪 | €10,000 - €25,000/yr | €10,000 - €15,000/yr |

Each country also has: description, highlights (3), popularFields (4)

## Study Levels (`src/lib/utils.ts`)
```
BACHELOR, MASTER, PHD, DIPLOMA
```

## Study Fields (`src/lib/utils.ts`)
```
computer-science, business, engineering, medicine, arts,
science, law, education, social-science, agriculture
```

## Document Types (`src/lib/utils.ts`)
```
PASSPORT, IELTS, TOEFL, TRANSCRIPT, SOP, INCOME, OTHER
```

## GPA Scales (`src/lib/gpa-scales.ts`)
| Code | Name | Max |
|------|------|-----|
| SCALE_4 | 4.0 Scale (US/Canada) | 4.0 |
| SCALE_5 | 5.0 Scale (Bangladesh/Nigeria) | 5.0 |
| SCALE_10 | 10.0 Scale (India/Europe) | 10.0 |
| PERCENTAGE | Percentage (0-100) | 100 |

## Letter Grades
```
A+ (4.0/97%), A (4.0/93%), A- (3.7/90%)
B+ (3.3/87%), B (3.0/83%), B- (2.7/80%)
C+ (2.3/77%), C (2.0/73%), C- (1.7/70%)
D+ (1.3/67%), D (1.0/63%), F (0.0/50%)
```

## Seed Universities (12)

| University | Country | City | Ranking | Status |
|-----------|---------|------|---------|--------|
| University of Toronto | CA | Toronto | 21 | FEATURED |
| University of Melbourne | AU | Melbourne | 33 | FEATURED |
| University College London | UK | London | 9 | FEATURED |
| Technical University of Munich | DE | Munich | 37 | FEATURED |
| University of British Columbia | CA | Vancouver | 35 | FEATURED |
| University of Sydney | AU | Sydney | 19 | FEATURED |
| MIT | US | Cambridge | 1 | FEATURED |
| Trinity College Dublin | IE | Dublin | 81 | STANDARD |
| Stanford University | US | Stanford | 2 | FEATURED |
| Lakehead University | CA | Thunder Bay | 500 | STANDARD |
| Western University | CA | London | 172 | STANDARD |
| RWTH Aachen University | DE | Aachen | 87 | STANDARD |

## Seed Programs (16)

| Program | University | Level | Tuition | Currency |
|---------|-----------|-------|---------|----------|
| MSc Computer Science | U of Toronto | MASTER | 32,000 | CAD |
| BBA | U of Toronto | BACHELOR | 52,000 | CAD |
| Master of Data Science | U of Melbourne | MASTER | 44,000 | AUD |
| BSc Engineering | U of Melbourne | BACHELOR | 48,000 | AUD |
| MSc Machine Learning | UCL | MASTER | 35,000 | GBP |
| LLM International Law | UCL | MASTER | 28,000 | GBP |
| MSc Informatics | TU Munich | MASTER | 500 | EUR |
| MSc Mechanical Engineering | TU Munich | MASTER | 500 | EUR |
| MSc Computer Science | UBC | MASTER | 9,600 | CAD |
| Bachelor of Nursing | U of Sydney | BACHELOR | 40,000 | AUD |
| MSc AI | MIT | MASTER | 58,000 | USD |
| MSc Computer Science | Trinity Dublin | MASTER | 18,000 | EUR |
| MBA | Stanford | MASTER | 75,000 | USD |
| BSc Computer Science | Lakehead | BACHELOR | 22,000 | CAD |
| MSc Data Analytics | Western | MASTER | 28,000 | CAD |
| MSc Electrical Engineering | RWTH Aachen | MASTER | 600 | EUR |

## Navbar Links
```
Programs → /programs
Services → /services
Destinations → /destinations
GPA Converter → /gpa-converter
About → /about
Contact → /contact
```

## Footer Links
```
Quick Links: Browse Programs, Our Services, Destinations, GPA Converter
Company: About Us, Contact, Partner Institutions
Resources: AI Assistant, Blog (#), Privacy Policy (#), Terms of Service (#)
```

## FAQ Questions (Landing Page)
1. How does the AI matching work?
2. Is the platform free to use?
3. Which countries can I study in?
4. How is EDUINTBD different from other consultancies?
5. What documents do I need to apply?
6. Can I get scholarship recommendations?

## AI System Prompt (src/lib/ai.ts)
The AI counselor is configured with expertise in:
- University admissions across 6 countries
- Scholarship opportunities
- Visa requirements
- IELTS, TOEFL, GRE, GMAT prep
- SOP writing tips
- Country-specific info

Model used: `claude-sonnet-4-20250514` (max 1024 tokens for chat, 2048 for matching)

## Landing Page Stats
- 140,000+ Global Programs
- 1,500+ Universities
- 150+ Nationalities Served
- 95% Acceptance Rate

## Services Page Stats
- 5,000+ Students trusted
- 2 Weeks avg processing
- 50+ Expert counselors
- 95% Success rate
