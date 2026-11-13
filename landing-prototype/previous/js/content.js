/* =====================================================================
   ALL EDITABLE CONTENT FOR THE PROTOTYPE LIVES HERE.
   Source: the client's completed questionnaire (9 Nov 2026); the readable
   copy deck is site-research/WEBSITE-CONTENT.md. Facts come from the
   questionnaire; "[CONFIRM]" waits on the client; "SAMPLE" is a stand-in.
   The chatbot answers from this file too, so keep facts here only.
   ===================================================================== */

/* ---------- who we are (used by the chatbot and page meta) ---------- */
export const BRAND = {
  name: "XcelCareers",
  what: "a healthcare staffing and government contracting company",
  short:
    "XcelCareers is a healthcare staffing and government contracting company. We place nurses and care staff with hospitals, clinics, long-term care, behavioral health providers and county and state health departments, and we support local, state and federal government with staff augmentation, contract staffing, task orders and consulting. Our specialists in IT, finance and cybersecurity work across both.",
};

/* ---------- 02 Certifications + customers (client: listed like TRECIG) ---------- */
export const CERT_LINE = {
  text: "Minority veteran-owned small business",
  id: "CAGE 89AK6",
};

export const CERTS = [
  { code: "MBE", name: "Minority Business Enterprise" },
  { code: "DBE", name: "Disadvantaged Business Enterprise" },
  { code: "SBE", name: "Small Business Enterprise" },
];

export const CREDENTIALS = {
  certifier: "Maryland Department of Social and Economic Mobility",
  certNo: "19-286",
  since: "May 2019",
  effective: "9/4/2025",
  cage: "89AK6",
  uei: "KQGDQLETUZ43",
  naics: [
    { code: "561311", name: "Employment Placement Agencies" },
    { code: "561320", name: "Temporary Help Services" },
    { code: "541330", name: "Engineering Services" },
    { code: "541511", name: "Custom Computer Programming Services" },
    { code: "541512", name: "Computer Systems Design Services" },
  ],
  pdf: "#capability", // [CONFIRM] link to the healthcare-focused capability statement PDF
};

/* status: "current" | "past"; years shown in the chatbot and ledger.
   [CONFIRM] logo permission, and whether NGA can be named publicly. */
export const CUSTOMERS = [
  { name: "Montgomery County Government", status: "current" },
  { name: "Prince George's County Government (OIT)", status: "current" },
  { name: "Raytheon Technologies", status: "past", years: "through 2024" },
  { name: "Pearson", status: "past", years: "2021–2023" },
  { name: "Capstone Corporation", status: "past", years: "2019–2021" },
  { name: "Indeed", status: "past", years: "2022" },
  { name: "NGA", status: "past", years: "2018" },
];

/* ---------- 03 Showreel (Prompt 1) ----------
   One story in six beats, each answering one question, in order:
   1 what do you deliver → 2 who do you place → 3 who is it for (01 employers,
   02 candidates, 03 the network) → 4 how big is the network (zoom through the
   mark's hub) → 5 what exactly do you staff → 6 what do I do now. */
export const SHOWREEL = {
  // 1 · opening card: the promise and the two doors. Line 2 stays short: it runs
  // beside the video slot, so a longer word would slide behind it.
  heroLines: ["Vetted. Credentialed.", "Ready."],
  heroLead:
    "We handle the search, the screening, the credential checks and the compliance, so you stay focused on patients and the mission.",
  heroButtons: [
    { label: "Request staff", href: "#contact", primary: true }, // audience #1 gets the primary button
    { label: "Find a job", href: "#jobs" },
  ],
  team: ["QN", "EF", "BK"], // leadership initials until headshots arrive: Quan Nguyen, Erika Finley, Barry Klasson
  avatarsLabel: "125+ years of combined experience",
  heroRight: "Maryland MBE · DBE · SBE certified. Prime or subcontractor at the local, state and federal level.",
  // the opening card becomes the first carousel card (photo: a recruiter with a candidate)
  heroRotated: "Both sides\nof every hire",

  // 2 · marquee behind the carousel: the people we place
  marquee: ["Nurses", "Care staff", "Human services", "Healthcare IT", "Revenue cycle", "Cybersecurity"],
  cta: "See how we staff",

  // 3 · carousel cards, numbered so they read in order: chip → headline → action
  cards: {
    employer: { n: "01", label: "For employers", title: "Your short list,", strong: "already vetted.", pillK: "Hospitals · clinics · counties", pillV: "Request staff", href: "#contact" },
    seeker: { n: "02", label: "For candidates", title: "Your next role,", strong: "never a fee.", q: "Registered Nurse · Maryland", href: "#jobs" },
    network: { n: "03", label: "Our network", title: "Every placement", strong: "starts here." },
  },

  // 4 · inside the network, reached by diving through the hub of the XcelCareers mark
  sphereTop: "300,000+",
  sphereBottom: ["profiles", "on file"],
  sphereBody: [
    "Nurses and care staff, human services teams, and IT, finance and cyber professionals, including cleared talent up to TS/SCI with Full Scope Poly.",
    "Every request is searched across it, plus job boards and referrals. Then we interview and verify licenses, certifications, health screenings, references and backgrounds.",
  ],

  // 6 · the ask (the phone number comes from CONTACT)
  finalLines: ["One nurse.", "Or 120+ staff."],
  finalLead: "Tell us the role, the shifts and the credentials it needs. We'll send a short list of vetted candidates.",
  finalButton: "Request staff",
  finalAlt: "or call",
};

/* 5 · the three lines of business, in the client's order of priority, as full-bleed
   background videos with text over them (client: moving people, healthcare first) */
export const FUNCTIONS = [
  {
    n: "01", kicker: "Main focus",
    title: "Healthcare",
    tags: ["Hospitals", "Clinics", "Long-term care", "Behavioral health", "County & state HHS"],
    line: "Clinical and non-clinical staff for hospitals, health systems, clinics, long-term care, behavioral health, and county and state health and human services departments.",
    video: "Nurses and care staff at work: a hospital ward, a clinic, a home visit",
    note: "Your clip · 10–15 s loop · muted · 16:9 · real staff, no stock look",
  },
  {
    n: "02", kicker: "Local · State · Federal",
    title: "Government",
    tags: ["Staff augmentation", "Contract staffing", "Task orders / IDIQ", "Consulting"],
    line: "Prime or subcontractor for staff augmentation, contract staffing, task orders and consulting in business analysis, project and program management, and talent management.",
    video: "County health and human services staff with residents; a public-sector team at work",
    note: "Your clip · 10–15 s loop · muted · 16:9",
  },
  {
    n: "03", kicker: "Across both",
    title: "IT · Finance · Cyber",
    tags: ["EHR & systems", "Revenue cycle", "Budget analysis", "Cleared to TS/SCI"],
    line: "EHR, systems and network administrators, revenue cycle and budget analysts, cybersecurity and cloud engineers, cleared up to TS/SCI with Full Scope Poly.",
    video: "Specialists at work: EHR systems, a billing team, a security operations floor",
    note: "Your clip · 10–15 s loop · muted · 16:9",
  },
];

/* 9 assets for the 14 tiles the camera flies through (healthcare first) */
export const FLIGHT = [
  { kind: "photo", what: "Registered nurse at the bedside, candid" },
  { kind: "video", what: "Case manager with a resident (short loop)" },
  { kind: "photo", what: "EHR systems administrator at work" },
  { kind: "photo", what: "CNA with a long-term care resident" },
  { kind: "video", what: "Budget analyst in a county office (short loop)" },
  { kind: "photo", what: "Recruiter on an intake call" },
  { kind: "photo", what: "Behavioral health counselor, hands only" },
  { kind: "video", what: "Cybersecurity analyst on an operations floor (short loop)" },
  { kind: "photo", what: "Medical billing and coding team" },
];

/* ---------- 04 How we staff (client's 7-step process, in 4 cards) ---------- */
export const STEPS = [
  {
    title: "Intake",
    text: "One call to define the role: shifts, pay range, and the licenses, certifications or clearance it needs.",
    stats: [["Defines", "shifts · pay · credentials"]],
  },
  {
    title: "Source & verify",
    text: "We search our database, job boards and referrals, then verify licenses, certifications, health screenings, references and background checks.",
    stats: [["Database", "300K+"]],
  },
  {
    title: "Shortlist",
    text: "You receive a short list of vetted candidates. You interview them and make the hiring decision.",
    stats: [["Decision", "yours"]],
  },
  {
    title: "Onboard",
    text: "We handle the offer, onboarding and compliance. For contract staff we're the employer of record: payroll, timesheets and credential renewals.",
    stats: [["Record", "120+ in 45 days"]],
  },
];
export const PROCESS_SPLIT =
  "You handle the final interview, the hiring decision, the work site and day-to-day supervision. We handle the rest.";

/* ---------- 05 Open roles: card fan (SAMPLE until the ATS feed is connected) ---------- */
// need: the one requirement that matters most for the role [label, value]
export const JOBS = [
  { fn: "Healthcare", title: "Case Manager · Health & Human Services", where: "Maryland", need: ["Setting", "County HHS"], type: "Contract", art: "Case manager with a resident" },
  { fn: "IT", title: "EHR Systems Administrator", where: "Washington, DC", need: ["Setting", "Hospital system"], type: "Contract-to-hire", art: "EHR administrator at work" },
  { fn: "Healthcare", title: "Registered Nurse · Behavioral Health", where: "Maryland", need: ["License", "Active RN"], type: "Contract", art: "RN with a patient" },
  { fn: "Finance", title: "Revenue Cycle Specialist", where: "Remote", need: ["Setting", "Health system"], type: "Direct hire", art: "Billing team at work" },
  { fn: "Cyber", title: "Cybersecurity Engineer", where: "Virginia", need: ["Clearance", "TS/SCI + FSP"], type: "Contract", art: "Security operations floor" },
];
/* which job the stats plate under the fan describes (the centre card) */
export const FEATURED_JOB = 2;
export const JOBS_NOTE =
  "Openings from the hospitals, agencies and prime contractors we staff. No match yet? Upload your résumé. Applying is always free.";

/* ---------- 06 Capability statement (replaces Transition Into Tech, on hold [CONFIRM]) ---------- */
export const CAPABILITY = {
  points: [
    "Maryland-certified MBE, DBE and SBE (No. 19-286). Minority veteran-owned. CAGE 89AK6 · UEI KQGDQLETUZ43.",
    "NAICS 561311, 561320, 541330, 541511, 541512. Prime or subcontractor at the local, state and federal level.",
  ],
  meta: ["PDF", "certs · NAICS · past performance"],
  art: "Capability statement cover: first page of the healthcare-focused PDF",
};

/* ---------- 07 On the record ---------- */
export const STICKERS = {
  paper: { label: "Years of combined experience", value: "125+" },
  accent: { label: "Candidates on file", value: "300K+" },
  dark: { label: "Staffed in 45 days", value: "120+" },
  ring: { label: "DoD & IC placements", value: "600+" },
};

export const LEDGER = [
  { date: "Current", title: "Montgomery County Government: health and human services staffing", ref: "Montgomery County, MD", stamp: "Active", rot: 6 },
  { date: "Current", title: "Prince George's County Government: Office of Information Technology", ref: "Prince George's County, MD", stamp: "Active", rot: -4 },
  { date: "45 days", title: "120+ personnel staffed for a single task order", ref: "Task order", stamp: "Staffed", rot: 4 },
  { date: "Through 2024", title: "Raytheon Technologies: Codex", ref: "Defense", stamp: "Delivered", rot: -6 },
  { date: "2022", title: "Indeed: market research for AI-ethics data scientists and ML engineers", ref: "Technology", stamp: "Delivered", rot: 3 },
  { date: "2021–2023", title: "Pearson", ref: "Education", stamp: "Delivered", rot: -3 },
  { date: "2019–2021", title: "Capstone Corporation", ref: "Contract", stamp: "Delivered", rot: 5 },
  { date: "2018", title: "400 hires closed in one year", ref: "Record year", stamp: "Closed", rot: -5 },
  { date: "2018", title: "NGA: National Geospatial-Intelligence Agency", ref: "Federal", stamp: "Delivered", rot: 4 }, // [CONFIRM] can be named
];

/* ---------- 08 FAQ (ids are used by the chatbot) ---------- */
export const FAQ = [
  { id: "roles", q: "Which healthcare roles do you fill?", a: "Registered nurses, LPNs, CNAs, medical assistants, behavioral health and social services staff, case managers, and medical billing and coding specialists, for hospitals, clinics, long-term care, behavioral health providers and county and state health departments." }, // [CONFIRM] list
  { id: "specialties", q: "Do you staff IT, finance and cybersecurity roles?", a: "Yes, for healthcare and government: EHR, systems and network administrators, service desk, cybersecurity and cloud engineers, financial, budget and cost analysts, revenue cycle specialists, business analysts and project managers. Cleared roles go up to TS/SCI with Full Scope Poly." },
  { id: "vetting", q: "How do you vet candidates?", a: "We interview every candidate we submit and verify licenses, certifications, health screenings, references and background checks before you see a name. You interview the short list and make the final call." },
  { id: "scale", q: "How quickly can you staff a large contract?", a: "We have staffed a task order that needed 120+ personnel in 45 days, and we scale from a single nurse to a full staff augmentation." },
  { id: "contracting", q: "Can you prime or subcontract on government work?", a: "Both. We are a minority veteran-owned small business, Maryland-certified MBE, DBE and SBE (No. 19-286), with CAGE 89AK6 and UEI KQGDQLETUZ43. We support local, state and federal contracts, including task orders and IDIQ." },
  { id: "employer", q: "Who employs contract staff?", a: "We do. We run timesheets and payroll, track license and certification renewals, and stay in touch through the assignment. You manage the work site and day-to-day supervision." },
  { id: "candidates", q: "Do candidates pay anything?", a: "Never. Our services are free for job seekers, including interview preparation and guidance through credentialing, licensing and clearance steps." },
  { id: "location", q: "Where do you work?", a: "We're based in Dayton, Maryland, and place people across Maryland, DC and Virginia, plus remote roles." },
];
export const FAQ_NOTE = "Still deciding? Call 240.579.0466 and we'll walk you through it, role by role.";

/* ---------- 09 Contact + footer (all website enquiries go to Barry) ---------- */
export const CONTACT = {
  phone: "240.579.0466",
  email: "bklasson@xcelcareers.com",
  name: "Barry Klasson",
  title: "Director of Business Development and Client Services",
  address: "6013 Bricker Rd, Dayton, MD 21036",
  legal: "© 2026 XcelCareers (XC), LLC",
  ids: "CAGE 89AK6 · UEI KQGDQLETUZ43 · MD MBE/DBE/SBE No. 19-286",
};

export const LEADERSHIP = [
  { name: "Quan Nguyen", role: "CEO" },
  { name: "Erika Finley", role: "Director of Operations and Contracts" },
  { name: "Barry Klasson", role: "Director of Business Development and Director of Client Services" },
];
