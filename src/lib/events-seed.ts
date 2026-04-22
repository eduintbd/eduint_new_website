// Seed upcoming events. Dates are relative to today so they always look "upcoming".

function daysAhead(n: number, hour = 18): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export const EVENTS_SEED = [
  {
    title: "Canada Intake 2026: Programs, GIC & Visa Masterclass",
    description:
      "Everything you need to land in Canada for Sep 2026 — program shortlisting, SDS route, GIC vs blocked account, and top-10 visa rejection reasons. Live Q&A at the end.",
    startAt: daysAhead(7, 18),
    endAt: daysAhead(7, 19),
    location: "Zoom",
    type: "WEBINAR",
    country: "CA",
    meetingLink: "https://zoom.us/j/placeholder-ca",
    capacity: 200,
    featured: true,
  },
  {
    title: "UK Education Fair — Dhaka",
    description:
      "15 UK universities, on-the-spot CAS, scholarship negotiations, and IELTS mock booth. Bring your transcripts.",
    startAt: daysAhead(14, 11),
    endAt: daysAhead(14, 17),
    location: "Radisson Dhaka (Water Garden)",
    type: "FAIR",
    country: "UK",
    meetingLink: null,
    capacity: 500,
    featured: true,
  },
  {
    title: "SOP Writing Workshop — land a top-20 university",
    description:
      "A working session with an admissions officer. Bring a draft; leave with a rewritten first paragraph.",
    startAt: daysAhead(21, 16),
    endAt: daysAhead(21, 18),
    location: "Zoom",
    type: "WORKSHOP",
    country: null,
    meetingLink: "https://zoom.us/j/placeholder-sop",
    capacity: 80,
    featured: false,
  },
  {
    title: "Australia post-study work reality — alumni panel",
    description:
      "Four EDUINTBD alumni share how the AU post-study work visa landed them their first job and PR pathway.",
    startAt: daysAhead(28, 19),
    endAt: daysAhead(28, 20),
    location: "Zoom",
    type: "WEBINAR",
    country: "AU",
    meetingLink: "https://zoom.us/j/placeholder-au",
    capacity: 150,
    featured: false,
  },
  {
    title: "Germany APS & Blocked Account Clinic",
    description:
      "Step-by-step through APS submission for Bangladeshi students + Fintiba vs Expatrio blocked-account comparison.",
    startAt: daysAhead(35, 18),
    endAt: daysAhead(35, 19),
    location: "Zoom",
    type: "WORKSHOP",
    country: "DE",
    meetingLink: "https://zoom.us/j/placeholder-de",
    capacity: 100,
    featured: false,
  },
  {
    title: "IELTS 7.0+ in 6 Weeks — Strategy Session",
    description:
      "How our top scorers prepared. Weak spots in BD speaking + writing, scoring criteria demystified, and a mini-mock.",
    startAt: daysAhead(42, 17),
    endAt: daysAhead(42, 18),
    location: "Zoom",
    type: "WEBINAR",
    country: null,
    meetingLink: "https://zoom.us/j/placeholder-ielts",
    capacity: 300,
    featured: true,
  },
];
