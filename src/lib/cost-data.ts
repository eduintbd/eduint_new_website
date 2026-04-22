// Ballpark annual cost data (USD) by destination. Used by /tools/cost-calculator.

export type CostBreakdown = {
  tuition: [number, number];
  accommodation: [number, number];
  living: [number, number];
  insurance: number;
  upfrontProof: number; // GIC / blocked account / maintenance
  note: string;
};

export const COST_DATA: Record<string, CostBreakdown> = {
  AU: {
    tuition: [20000, 45000],
    accommodation: [10000, 16000],
    living: [8000, 11000],
    insurance: 600,
    upfrontProof: 18000,
    note: "OSHC required. Outside Sydney/Melbourne can be 30% cheaper.",
  },
  CA: {
    tuition: [15000, 35000],
    accommodation: [8000, 14000],
    living: [6000, 9000],
    insurance: 800,
    upfrontProof: 20635, // SDS GIC current figure
    note: "SDS GIC of CAD 20,635 is held for your first year as living expenses.",
  },
  US: {
    tuition: [25000, 55000],
    accommodation: [9000, 15000],
    living: [6000, 10000],
    insurance: 2000,
    upfrontProof: 0,
    note: "Must show funds for at least one full year at the I-20 issuing school.",
  },
  UK: {
    tuition: [15000, 40000],
    accommodation: [8500, 14500],
    living: [6000, 10000],
    insurance: 900, // IHS
    upfrontProof: 14000,
    note: "Funds must be held in your (or parent's) account for 28 consecutive days.",
  },
  DE: {
    tuition: [0, 3000], // public uni tuition free
    accommodation: [4500, 7500],
    living: [4500, 6500],
    insurance: 1500,
    upfrontProof: 12500, // blocked account
    note: "Public-uni tuition is 0 but you need the blocked account and APS certification.",
  },
  IE: {
    tuition: [12000, 28000],
    accommodation: [8000, 14000],
    living: [6500, 9500],
    insurance: 700,
    upfrontProof: 10000,
    note: "Stay Back option makes ROI strong — 1-2 years post-study work.",
  },
  NZ: {
    tuition: [15000, 27000],
    accommodation: [7000, 12000],
    living: [6000, 9000],
    insurance: 700,
    upfrontProof: 12500, // NZD 20,000 maintenance
    note: "Post-study work visa up to 3 years. Cost varies significantly between Auckland and regional campuses.",
  },
  FR: {
    tuition: [3000, 20000],
    accommodation: [6000, 10000],
    living: [6000, 10000],
    insurance: 300,
    upfrontProof: 8200, // ~€7,380 annual minimum
    note: "Public universities charge €2,770-3,770/yr. Private business schools 10-25k. CAF housing support available.",
  },
  FI: {
    tuition: [7000, 18000],
    accommodation: [4000, 7000],
    living: [5000, 8000],
    insurance: 450,
    upfrontProof: 7500, // €6,720
    note: "Tuition waivers and 50%+ scholarships are common for top academic profiles.",
  },
  NL: {
    tuition: [9000, 20000],
    accommodation: [6000, 10000],
    living: [5000, 8500],
    insurance: 1500,
    upfrontProof: 14800, // €13,440
    note: "The institution files your MVV — start 3 months ahead. Orientation Year gives 12 months post-study work.",
  },
  ES: {
    tuition: [4000, 22000],
    accommodation: [4500, 9000],
    living: [5500, 9000],
    insurance: 700,
    upfrontProof: 7900, // €7,200/year IPREM
    note: "Apostille all academic and legal documents. Strong ROI for business schools (IE, IESE, ESADE).",
  },
  HU: {
    tuition: [3000, 8000],
    accommodation: [3000, 5500],
    living: [4500, 6500],
    insurance: 300,
    upfrontProof: 5500,
    note: "Stipendium Hungaricum scholarship covers tuition + stipend. Apply by January.",
  },
  CY: {
    tuition: [3500, 8000],
    accommodation: [3500, 6000],
    living: [4500, 6000],
    insurance: 350,
    upfrontProof: 8000,
    note: "English-medium programs on a Schengen path. Medical checks at arrival are mandatory.",
  },
  CH: {
    tuition: [1500, 20000],
    accommodation: [12000, 18000],
    living: [8000, 12000],
    insurance: 3600,
    upfrontProof: 23000, // CHF 21,000
    note: "Public university tuition is low but living costs are Europe's highest. Strong salary ROI.",
  },
  SE: {
    tuition: [9000, 16000],
    accommodation: [5500, 9000],
    living: [5500, 9000],
    insurance: 400,
    upfrontProof: 12000, // SEK 11,079/month × 10
    note: "Tuition applies only to non-EEA students. Generous SI scholarships available annually.",
  },
  IT: {
    tuition: [1000, 20000],
    accommodation: [4500, 9000],
    living: [5500, 9000],
    insurance: 400,
    upfrontProof: 6700, // €6,079
    note: "Public universities charge €1k-4k; private and business schools up to €25k. DSU scholarships cover tuition + stipend for low-income students.",
  },
  CN: {
    tuition: [3000, 10000],
    accommodation: [1500, 3500],
    living: [3500, 5500],
    insurance: 120,
    upfrontProof: 8000,
    note: "CSC (Chinese Scholarship Council) covers tuition + stipend + insurance — apply by March.",
  },
  LT: {
    tuition: [2500, 5500],
    accommodation: [2500, 4500],
    living: [4000, 6000],
    insurance: 250,
    upfrontProof: 6500, // €540/month × 12
    note: "One of the cheapest EU routes. Part-time work rights during study.",
  },
  VN: {
    tuition: [3000, 10000],
    accommodation: [2000, 4000],
    living: [2500, 4500],
    insurance: 150,
    upfrontProof: 5000,
    note: "Growing regional hub with English-taught programs at partner universities. Low living costs.",
  },
  DK: {
    tuition: [7000, 17000],
    accommodation: [6500, 10500],
    living: [6000, 9000],
    insurance: 400,
    upfrontProof: 11200, // DKK 76,992
    note: "Establishment Card post-study gives up to 3 years to find work.",
  },
  BE: {
    tuition: [4500, 13000],
    accommodation: [5500, 9000],
    living: [5500, 8500],
    insurance: 300,
    upfrontProof: 13900, // €12,600
    note: "Must submit the 'Annex 32' guarantor form. Top universities (KU Leuven, Ghent) are excellent value.",
  },
  AT: {
    tuition: [1500, 12000],
    accommodation: [6000, 10000],
    living: [6500, 9500],
    insurance: 700,
    upfrontProof: 13800, // €12,526
    note: "Apply 3-4 months ahead for the 'Aufenthaltsbewilligung — Student'. Public universities are affordable.",
  },
  MT: {
    tuition: [8000, 14000],
    accommodation: [4500, 7500],
    living: [5000, 7500],
    insurance: 350,
    upfrontProof: 7000,
    note: "English-speaking EU island. Part-time work and easy travel to mainland Europe.",
  },
  PL: {
    tuition: [2500, 6000],
    accommodation: [3500, 6000],
    living: [4000, 6000],
    insurance: 300,
    upfrontProof: 8500, // €701 × 12
    note: "Full-time work rights during summer, part-time during semester. Strong IT and medical programs.",
  },
  RU: {
    tuition: [3000, 8000],
    accommodation: [1500, 3500],
    living: [2500, 4500],
    insurance: 150,
    upfrontProof: 4000,
    note: "Affordable medical and engineering routes. Invitation letter must be secured 4-8 weeks before visa.",
  },
  KR: {
    tuition: [4000, 10000],
    accommodation: [2500, 5000],
    living: [5500, 9000],
    insurance: 400,
    upfrontProof: 10000,
    note: "KGSP scholarship is competitive but generous. D-2 visa allows 25 hrs/week work after 6 months.",
  },
};
