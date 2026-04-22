// Seed data for the Scholarship table. Loaded once by /api/scholarships if
// the table is empty. Keep amounts approximate in USD.

export const SCHOLARSHIPS_SEED = [
  // Australia
  { name: "Australia Awards Scholarship", provider: "DFAT (Govt. of Australia)", country: "AU", level: "MASTER", field: "ANY", amount: "Full tuition + stipend + travel", amountValue: 60000, deadline: "April 30", eligibility: "Bangladeshi citizens, career commitment to return.", link: "https://www.dfat.gov.au/people-to-people/australia-awards", featured: true },
  { name: "Melbourne International Scholarship", provider: "Univ. of Melbourne", country: "AU", level: "MASTER", field: "ANY", amount: "AUD 10,000 - 50% tuition", amountValue: 18000, deadline: "Oct 31", eligibility: "Merit-based, offer holders only.", link: "https://scholarships.unimelb.edu.au" },
  { name: "Sydney Scholars Award", provider: "Univ. of Sydney", country: "AU", level: "BACHELOR", field: "ANY", amount: "AUD 10,000/year", amountValue: 7000, deadline: "Jan 15", eligibility: "International undergrads with 90%+.", link: "https://www.sydney.edu.au/scholarships" },

  // Canada
  { name: "Vanier Canada Graduate Scholarships", provider: "Govt. of Canada", country: "CA", level: "PHD", field: "ANY", amount: "CAD 50,000/year for 3 years", amountValue: 110000, deadline: "Nov 1", eligibility: "PhD students in STEM, social sciences, or health.", link: "https://vanier.gc.ca", featured: true },
  { name: "Lester B. Pearson International Scholarship", provider: "Univ. of Toronto", country: "CA", level: "BACHELOR", field: "ANY", amount: "Full tuition + living", amountValue: 80000, deadline: "Nov 30", eligibility: "Top 20 students worldwide annually.", link: "https://future.utoronto.ca/pearson/" },
  { name: "UBC International Leader of Tomorrow", provider: "Univ. of British Columbia", country: "CA", level: "BACHELOR", field: "ANY", amount: "Variable, needs-based", amountValue: 40000, deadline: "Dec 1", eligibility: "Demonstrated financial need + merit.", link: "https://you.ubc.ca/financial-planning/international-students/" },

  // USA
  { name: "Fulbright Foreign Student Program", provider: "US Dept. of State", country: "US", level: "MASTER", field: "ANY", amount: "Full tuition + stipend + travel", amountValue: 50000, deadline: "May 31", eligibility: "Bangladeshi graduates, 2-year home residence requirement.", link: "https://foreign.fulbrightonline.org", featured: true },
  { name: "Knight-Hennessy Scholars", provider: "Stanford University", country: "US", level: "MASTER", field: "ANY", amount: "Full tuition + stipend", amountValue: 100000, deadline: "Oct 9", eligibility: "Graduate admits, any Stanford school.", link: "https://knight-hennessy.stanford.edu" },
  { name: "MIT Graduate Fellowships", provider: "MIT", country: "US", level: "MASTER", field: "ENGINEERING", amount: "Full tuition + stipend", amountValue: 90000, deadline: "Dec 15", eligibility: "STEM grad admits.", link: "https://gradadmissions.mit.edu" },

  // UK
  { name: "Chevening Scholarship", provider: "UK Govt.", country: "UK", level: "MASTER", field: "ANY", amount: "Full tuition + stipend", amountValue: 45000, deadline: "Nov 7", eligibility: "2+ yrs work experience, leadership potential.", link: "https://www.chevening.org", featured: true },
  { name: "Commonwealth Scholarship", provider: "UK FCDO", country: "UK", level: "MASTER", field: "ANY", amount: "Full tuition + stipend + flights", amountValue: 50000, deadline: "Oct 15", eligibility: "Commonwealth citizens, development focus.", link: "https://cscuk.fcdo.gov.uk" },
  { name: "GREAT Scholarship", provider: "British Council", country: "UK", level: "MASTER", field: "ANY", amount: "£10,000", amountValue: 12500, deadline: "Varies by uni", eligibility: "BD students, specific participating universities.", link: "https://study-uk.britishcouncil.org/scholarships/great-scholarships" },
  { name: "Edinburgh Global Scholarship", provider: "Univ. of Edinburgh", country: "UK", level: "MASTER", field: "ANY", amount: "£5,000", amountValue: 6300, deadline: "June 2", eligibility: "PG admits with strong academics.", link: "https://www.ed.ac.uk/student-funding" },

  // Germany
  { name: "DAAD Scholarship for Development-Related PG", provider: "DAAD", country: "DE", level: "MASTER", field: "ANY", amount: "€934/month + tuition", amountValue: 15000, deadline: "Varies", eligibility: "2+ yrs work experience in developing country.", link: "https://www.daad.de", featured: true },
  { name: "Deutschland Stipendium", provider: "German Govt.", country: "DE", level: "BACHELOR", field: "ANY", amount: "€300/month", amountValue: 3800, deadline: "Varies by uni", eligibility: "Merit-based, ~300 participating universities.", link: "https://www.deutschlandstipendium.de" },
  { name: "Heinrich Böll Foundation Scholarship", provider: "Heinrich Böll Stiftung", country: "DE", level: "MASTER", field: "ANY", amount: "€934/month", amountValue: 12000, deadline: "March 1 / Sept 1", eligibility: "Socially/politically engaged students.", link: "https://www.boell.de/en/scholarships" },

  // Ireland
  { name: "Government of Ireland Intl. Education Scholarships", provider: "Higher Education Authority (IE)", country: "IE", level: "MASTER", field: "ANY", amount: "€10,000 + fee waiver", amountValue: 12500, deadline: "March 25", eligibility: "Merit-based, non-EU students.", link: "https://hea.ie/funding-governance-performance/funding/student-finance/scholarships-for-international-students/", featured: true },
  { name: "Walsh Fellowship (Teagasc)", provider: "Teagasc", country: "IE", level: "PHD", field: "SCIENCE", amount: "€24,000/year", amountValue: 28000, deadline: "Rolling", eligibility: "Agri/food sciences PhD.", link: "https://www.teagasc.ie" },
  { name: "Trinity College Dublin Global Excellence", provider: "TCD", country: "IE", level: "MASTER", field: "ANY", amount: "€5,000 - €10,000", amountValue: 8000, deadline: "June 30", eligibility: "Admits from selected countries incl. BD.", link: "https://www.tcd.ie/study/fees-funding/postgraduate/scholarships/" },

  // Global / Merit
  { name: "Aga Khan Foundation International Scholarship", provider: "AKF", country: "GLOBAL", level: "MASTER", field: "ANY", amount: "50% grant + 50% loan", amountValue: 40000, deadline: "March 31", eligibility: "Outstanding students from developing countries.", link: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme", featured: true },
  { name: "Women in STEM Scholarship Programme", provider: "British Council", country: "UK", level: "MASTER", field: "ENGINEERING", amount: "Full tuition + stipend", amountValue: 40000, deadline: "April 30", eligibility: "Women, STEM fields, from South Asia.", link: "https://study-uk.britishcouncil.org/scholarships/women-in-stem" },
  { name: "Erasmus Mundus Joint Masters", provider: "European Commission", country: "GLOBAL", level: "MASTER", field: "ANY", amount: "Full tuition + €1,400/month", amountValue: 49000, deadline: "Varies by program", eligibility: "Joint program across 2+ EU universities.", link: "https://erasmus-plus.ec.europa.eu", featured: true },
  { name: "OFID Scholarship", provider: "OPEC Fund", country: "GLOBAL", level: "MASTER", field: "ANY", amount: "USD 50,000 max", amountValue: 50000, deadline: "March 31", eligibility: "Developing country students, development fields.", link: "https://opecfund.org" },

  // BD-specific merit (by bracket)
  { name: "Western University President's Entrance Scholarship", provider: "Western University (Canada)", country: "CA", level: "BACHELOR", field: "ANY", amount: "CAD 20,000 - 70,000", amountValue: 25000, deadline: "Feb 28", eligibility: "90%+ average.", link: "https://registrar.uwo.ca" },
  { name: "TU Munich Merit Scholarship", provider: "TU Munich", country: "DE", level: "MASTER", field: "ENGINEERING", amount: "€1,500/semester", amountValue: 3500, deadline: "Varies", eligibility: "Top 2% of cohort.", link: "https://www.tum.de/en/" },
  { name: "RWTH Aachen International Award", provider: "RWTH Aachen", country: "DE", level: "MASTER", field: "ENGINEERING", amount: "€300/month", amountValue: 3800, deadline: "Jan 15", eligibility: "High-performing international students.", link: "https://www.rwth-aachen.de" },
  { name: "UCL Global Masters Scholarship", provider: "UCL", country: "UK", level: "MASTER", field: "ANY", amount: "£15,000", amountValue: 18800, deadline: "May 31", eligibility: "BD among eligible nationalities.", link: "https://www.ucl.ac.uk/scholarships/" },
  { name: "Lakehead International Scholarship", provider: "Lakehead University (Canada)", country: "CA", level: "BACHELOR", field: "ANY", amount: "CAD 30,000", amountValue: 22000, deadline: "Rolling", eligibility: "International admits with 85%+.", link: "https://www.lakeheadu.ca" },
  { name: "Government of Bangladesh Overseas Scholarship", provider: "Ministry of Education, GoB", country: "GLOBAL", level: "MASTER", field: "ANY", amount: "Partial tuition + stipend", amountValue: 20000, deadline: "Varies", eligibility: "Govt. employees / teachers nominated.", link: "https://moedu.gov.bd" },
  { name: "Rhodes Scholarship (Bangladesh)", provider: "Rhodes Trust", country: "UK", level: "MASTER", field: "ANY", amount: "Full tuition + stipend", amountValue: 70000, deadline: "July 31", eligibility: "Top BD candidates (age 18-25).", link: "https://www.rhodeshouse.ox.ac.uk", featured: true },
  { name: "Gates Cambridge Scholarship", provider: "Univ. of Cambridge", country: "UK", level: "MASTER", field: "ANY", amount: "Full tuition + stipend", amountValue: 70000, deadline: "Dec 3", eligibility: "PG admits demonstrating leadership + commitment to others.", link: "https://www.gatescambridge.org" },
];
