// Lightweight dictionary-based i18n. Extend as UI grows. Keys stay English
// so code is grep-able; Bangla values come from translators.

export type Locale = "en" | "bn";

export const DICTS = {
  en: {
    "nav.programs": "Programs",
    "nav.eligibility": "Eligibility",
    "nav.services": "Services",
    "nav.destinations": "Destinations",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.book": "Book Free Call",
    "nav.signIn": "Sign In",
    "hero.badge": "AI-Powered University Matching",
    "hero.title": "Your Global Study Partner",
    "hero.subtitle":
      "Check your eligibility in 30 seconds, get AI-matched to the right programs, and book a free counseling call — all before you even sign up.",
    "hero.ctaEligibility": "Check Eligibility — Free",
    "hero.ctaBook": "Book Free Counseling",
    "hero.searchPlaceholder": "Search programs, universities, or fields...",
    "stats.kicker": "Trusted by students across Bangladesh",
    "stats.title": "No inflated numbers. Just honest guidance.",
    "stats.fee": "Counseling Fee",
    "stats.feeNote": "First consultation is always free",
    "whatsapp.cta": "Chat on WhatsApp",
    "lead.callback": "Request callback",
    "lead.ctaSmall": "Talk to a counselor — free",
    "lead.defaultTitle": "Get free expert guidance",
    "lead.defaultSubtitle": "A counselor will reach out within 24 hours.",
    "common.bookFreeCall": "Book Free Call",
  },
  bn: {
    "nav.programs": "প্রোগ্রাম",
    "nav.eligibility": "যোগ্যতা যাচাই",
    "nav.services": "সেবা",
    "nav.destinations": "দেশসমূহ",
    "nav.blog": "ব্লগ",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.book": "ফ্রি কনসাল্টেশন",
    "nav.signIn": "সাইন ইন",
    "hero.badge": "এআই-চালিত ইউনিভার্সিটি ম্যাচিং",
    "hero.title": "আপনার বিশ্বব্যাপী স্টাডি সঙ্গী",
    "hero.subtitle":
      "৩০ সেকেন্ডে যোগ্যতা যাচাই করুন, সঠিক প্রোগ্রামের সাথে AI ম্যাচিং পান, এবং সাইন আপ ছাড়াই ফ্রি কাউন্সেলিং কল বুক করুন।",
    "hero.ctaEligibility": "যোগ্যতা যাচাই করুন — ফ্রি",
    "hero.ctaBook": "ফ্রি কাউন্সেলিং বুক করুন",
    "hero.searchPlaceholder": "প্রোগ্রাম, বিশ্ববিদ্যালয় বা বিষয় খুঁজুন...",
    "stats.kicker": "বাংলাদেশের শিক্ষার্থীদের বিশ্বাসের জায়গা",
    "stats.title": "ভুয়া পরিসংখ্যান নয়, সৎ গাইডেন্স।",
    "stats.fee": "কাউন্সেলিং ফি",
    "stats.feeNote": "প্রথম কনসাল্টেশন সবসময়ই ফ্রি",
    "whatsapp.cta": "হোয়াটসঅ্যাপে চ্যাট করুন",
    "lead.callback": "কলব্যাক চান",
    "lead.ctaSmall": "একজন কাউন্সেলরের সাথে কথা বলুন — ফ্রি",
    "lead.defaultTitle": "ফ্রি বিশেষজ্ঞ পরামর্শ নিন",
    "lead.defaultSubtitle":
      "একজন কাউন্সেলর ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।",
    "common.bookFreeCall": "ফ্রি কল বুক করুন",
  },
} as const;

export type DictKey = keyof (typeof DICTS)["en"];
