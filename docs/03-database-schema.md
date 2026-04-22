# Database Schema

## Models (13 total)

### User (auth)
```
id             String   @id @default(cuid())
name           String?
email          String   @unique
emailVerified  DateTime?
image          String?
password       String?
role           String   @default("STUDENT")  → STUDENT | PARTNER | ADMIN
phone          String?
nationality    String?
bio            String?
createdAt      DateTime @default(now())
updatedAt      DateTime @updatedAt
```
**Relations:** accounts, sessions, academicProfile, savedPrograms, documents, chatMessages, matchResults

### Account (NextAuth OAuth)
```
id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
```

### Session (NextAuth)
```
id, sessionToken (unique), userId, expires
```

### VerificationToken
```
identifier, token (unique), expires
```

### AcademicProfile (1:1 with User)
```
id               String  @id
userId           String  @unique
highestDegree    String?  → HIGH_SCHOOL | BACHELOR | MASTER | PHD
gpa              Float?
gpaScale         String?  → SCALE_4 | SCALE_5 | SCALE_10 | PERCENTAGE
fieldOfStudy     String?
graduationYear   Int?
institution      String?
ieltsScore       Float?   (0-9)
toeflScore       Float?   (0-120)
greScore         Int?     (130-340)
gmatScore        Int?     (200-800)
budgetMin        Float?
budgetMax        Float?
preferredLevel   String?  → BACHELOR | MASTER | PHD | DIPLOMA
preferredCountries String? → Comma-separated: "CA,AU"
```

### University
```
id             String   @id
name           String
country        String   → Country code (CA, AU, UK, etc.)
city           String
ranking        Int?     → World ranking
description    String?
website        String?
logoUrl        String?
partnerStatus  String   @default("STANDARD") → FEATURED | STANDARD
createdAt      DateTime
```
**Relations:** programs[]

### Program
```
id                    String   @id
name                  String
universityId          String   → FK to University
country               String
city                  String
level                 String   → BACHELOR | MASTER | PHD | DIPLOMA
field                 String   → computer-science, business, engineering, etc.
duration              String   → "2 years", "1 year", "4 semesters"
tuitionFee            Float
currency              String   @default("USD") → USD, CAD, AUD, GBP, EUR
language              String   @default("English")
intakeMonths          String?  → "September", "February,July"
description           String?
requirements          String?
scholarshipAvailable  Boolean  @default(false)
applicationDeadline   String?
ranking               Int?
acceptanceRate        Float?   → 0-100 percentage
imageUrl              String?
featured              Boolean  @default(false)
createdAt             DateTime
```
**Relations:** university, savedBy[], chatMessages[], matchResults[]

### SavedProgram
```
id        String   @id
userId    String
programId String
savedAt   DateTime @default(now())
@@unique([userId, programId])
```

### Document
```
id         String   @id
userId     String
type       String   → PASSPORT | IELTS | TOEFL | TRANSCRIPT | SOP | INCOME | OTHER
fileName   String
fileUrl    String
fileSize   Int?
status     String   @default("PENDING") → PENDING | VERIFIED | REJECTED
uploadedAt DateTime
```

### ChatMessage
```
id        String   @id
userId    String
role      String   → USER | ASSISTANT
content   String
programId String?  → Optional reference to a program
createdAt DateTime
```

### MatchResult
```
id        String   @id
userId    String
programId String
score     Float    → 0-100 compatibility score
reasons   String   → JSON string array of reasons
createdAt DateTime
```

### ContactMessage
```
id        String   @id
name      String
email     String
phone     String?
subject   String
message   String
createdAt DateTime
```

### Country
```
id          String   @id
code        String   @unique → AU, CA, US, UK, DE, IE
name        String
description String?
imageUrl    String?
flagEmoji   String?
featured    Boolean  @default(false)
```

## Seed Data Summary
- **Users:** 3 (1 admin + 2 students with academic profiles)
- **Universities:** 12 (across 6 countries, mix of FEATURED/STANDARD)
- **Programs:** 16 (various levels, fields, $500-$75,000 tuition range)
- **Countries:** 6 (AU, CA, US, UK, DE, IE)
