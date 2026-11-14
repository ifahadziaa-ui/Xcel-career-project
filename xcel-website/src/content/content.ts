/* =====================================================================
   ALL EDITABLE CONTENT FOR THE WEBSITE LIVES HERE.

   Typed port of landing-prototype-clean/js/content.js (the verified, content-cleaned
   copy of the homepage). Wording and structure are the prototype's. Source of the
   facts: the client's completed questionnaire (9 Nov 2026); the readable copy deck is
   site-research/WEBSITE-CONTENT.md. "[CONFIRM]" waits on the client; examples are
   labelled as examples. Claim status: docs/CLAIMS-REGISTER.md.

   Server-safe: plain data and types, no imports, no browser APIs. Safe to import from
   Server Components, Client Components, route handlers and the chatbot (which answers
   from this file too, so keep facts here only).

   Not ported: FLIGHT (the placeholder tile list), which the clean prototype no longer uses.
   Hrefs ("capability.html", "contact.html", "#contact", ...) are the prototype's own and are
   mapped to routes when the inner pages exist (see docs/FOUNDATIONS.md).
   ===================================================================== */

/* ---------- types ---------- */
export interface Brand { name: string; what: string; short: string }
export interface CertLine { text: string; id: string }
export interface Cert { code: string; name: string }
export interface NaicsCode { code: string; name: string }
export interface Credentials {
  certifier: string; certNo: string; since: string; effective: string; cage: string; uei: string;
  naics: readonly NaicsCode[];
  pdf: string;
}
export interface Customer { name: string; status: "current" | "past"; years?: string }

export interface ShowreelButton { label: string; href: string; primary?: boolean }
export interface ShowreelCard {
  n: string; label: string; title: string; strong: string;
  pillK?: string; pillV?: string; q?: string; href?: string;
}
export interface Showreel {
  heroLines: readonly [string, string];
  heroLead: string;
  heroButtons: readonly ShowreelButton[];
  team: readonly string[];
  avatarsLabel: string;
  heroRight: string;
  heroRotated: string;
  marquee: readonly string[];
  cta: string;
  cards: { employer: ShowreelCard; seeker: ShowreelCard; network: ShowreelCard };
  sphereTop: string;
  sphereBottom: readonly [string, string];
  sphereBody: readonly [string, string];
  finalEyebrow: string;
  finalLines: readonly [string, string];
  finalLead: string;
  finalButton: string;
  finalSecondary: string;
  finalTrust: string;
  finalAlt: string;
}

export interface FunctionLine {
  n: string; kicker: string; title: string; tags: readonly string[]; line: string; video: string; note: string;
}
export interface Step { title: string; text: string; stats: ReadonlyArray<readonly [string, string]> }

export type JobFunction = "Healthcare" | "IT" | "Finance" | "Cyber";
export interface Job {
  id: string; fn: JobFunction; title: string; where: string;
  /** the one requirement that matters most: [label, value] */
  need: readonly [string, string];
  type: string; art: string; desc: string; reqs: readonly string[];
}

export interface Capability { points: readonly string[]; meta: readonly [string, string]; art: string }
export interface Sticker { label: string; value: string }
export type Stickers = Record<"paper" | "accent" | "dark" | "ring", Sticker>;
export interface LedgerEntry { date: string; title: string; ref: string; stamp: string; rot: number }
export interface FaqEntry { id: string; q: string; a: string; tags?: readonly string[] }
export interface Contact {
  phone: string; email: string; name: string; title: string; address: string; legal: string; ids: string;
}
export interface Leader { name: string; role: string }
export interface NavItem { href: string; label: string }

export type ServicePageId = "healthcare" | "government" | "specialists";
export interface TitledText { t: string; d: string }
export interface ServicePage {
  eyebrow: string;
  title: readonly string[];
  intro: string;
  blocksTitle: string;
  blocks: readonly TitledText[];
  listTitle: string;
  list: readonly string[];
  checksTitle: string;
  checks: readonly string[];
  checksNote: string;
  terms: readonly TitledText[] | null;
  proof: ReadonlyArray<readonly [string, string]>;
  ask: { title: readonly string[]; lead: string; cta: string; href: string };
}
export interface About {
  eyebrow: string;
  title: readonly string[];
  intro: string;
  why: readonly TitledText[];
  candidates: readonly string[];
}
export interface RequestForm {
  types: readonly string[]; locations: readonly string[]; contracts: readonly string[]; headcount: readonly string[];
}


/* ---------- who we are (used by the chatbot and page meta) ---------- */
export const BRAND: Brand = {
  name: "XcelCareers",
  what: "a healthcare staffing and government contracting company",
  short:
    "A healthcare staffing and government contracting company. We place nurses, care staff and IT, finance and cyber specialists with hospitals, clinics and government agencies.",
};

/* ---------- 02 Certifications + customers (client: listed like TRECIG) ---------- */
export const CERT_LINE: CertLine = {
  text: "Minority veteran-owned small business",
  id: "CAGE 89AK6",
};

export const CERTS: readonly Cert[] = [
  { code: "MBE", name: "Minority Business Enterprise" },
  { code: "DBE", name: "Disadvantaged Business Enterprise" },
  { code: "SBE", name: "Small Business Enterprise" },
];

export const CREDENTIALS: Credentials = {
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
  pdf: "capability.html", // the capability page; the PDF is not available yet
};

/* status: "current" | "past"; years shown in the chatbot and ledger.
   [CONFIRM] logo permission, and whether NGA can be named publicly. */
export const CUSTOMERS: readonly Customer[] = [
  { name: "Montgomery County Government", status: "current" },
  { name: "Prince George's County Government (OIT)", status: "current" },
  { name: "Raytheon Technologies", status: "past", years: "through 2024" },
  { name: "Pearson", status: "past", years: "2021–2023" },
  { name: "Capstone Corporation", status: "past", years: "2019–2021" },
  { name: "Indeed", status: "past", years: "2022" },
];

/* ---------- 03 Showreel (Prompt 1) ----------
   One story in six beats, each answering one question, in order:
   1 what do you deliver → 2 who do you place → 3 who is it for (01 employers,
   02 candidates, 03 the network) → 4 how big is the network (zoom through the
   mark's hub) → 5 what exactly do you staff → 6 what do I do now. */
export const SHOWREEL: Showreel = {
  // 1 · opening card: the promise and the two doors. Line 2 stays short: it runs
  // beside the video slot, so a longer word would slide behind it.
  heroLines: ["Vetted. Credentialed.", "Ready."],
  heroLead:
    "We handle the search, screening, credentials and compliance, so you focus on patients and the mission.",
  heroButtons: [
    { label: "Request staff", href: "#contact", primary: true }, // audience #1 gets the primary button
    { label: "Find a job", href: "#jobs" },
  ],
  team: ["QN", "EF", "BK"], // leadership initials until headshots arrive: Quan Nguyen, Erika Finley, Barry Klasson
  avatarsLabel: "125+ years of combined experience",
  heroRight: "Maryland MBE · DBE · SBE certified. Ready to contract, local to federal.",
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
    "Every request is searched across it, plus job boards and referrals.",
    "Then we interview and verify licenses, certifications, references and backgrounds.",
  ],

  // 6 · the ask (the phone number comes from CONTACT)
  finalEyebrow: "Staffing request",
  finalLines: ["One nurse.", "Or 120+ staff."],
  finalLead: "Tell us the role, the shifts and the credential. We send a short list of vetted candidates.",
  finalButton: "Request staff",
  finalSecondary: "Capability statement",
  finalTrust: "Maryland MBE · DBE · SBE No. 19-286 · CAGE 89AK6",
  finalAlt: "or call",
};

/* 5 · the three lines of business, in the client's order of priority, as full-bleed
   background videos with text over them (client: moving people, healthcare first) */
export const FUNCTIONS: readonly FunctionLine[] = [
  {
    n: "01", kicker: "Main focus",
    title: "Healthcare",
    tags: ["Hospitals", "Clinics", "Long-term care", "Behavioral health", "County & state HHS"],
    line: "Clinical and non-clinical staff for hospitals, clinics, long-term care and county health departments.",
    video: "Nurses and care staff at work: a hospital ward, a clinic, a home visit",
    note: "Your clip · 10–15 s loop · muted · 16:9 · real staff, no stock look",
  },
  {
    n: "02", kicker: "Local · State · Federal",
    title: "Government",
    tags: ["Staff augmentation", "Contract staffing", "Task orders / IDIQ", "Consulting"],
    line: "Staff augmentation, contract staffing, task orders and consulting for agencies and the primes that serve them.",
    video: "County health and human services staff with residents; a public-sector team at work",
    note: "Your clip · 10–15 s loop · muted · 16:9",
  },
  {
    n: "03", kicker: "Across both",
    title: "IT · Finance · Cyber",
    tags: ["EHR & systems", "Revenue cycle", "Budget analysis", "Cleared to TS/SCI"],
    line: "EHR, systems, revenue cycle, budget and cybersecurity specialists, including cleared roles up to TS/SCI.",
    video: "Specialists at work: EHR systems, a billing team, a security operations floor",
    note: "Your clip · 10–15 s loop · muted · 16:9",
  },
];

/* ---------- 04 How we staff (client's 7-step process, in 4 cards) ---------- */
export const STEPS: readonly Step[] = [
  {
    title: "Intake",
    text: "One call: shifts, pay range and required credentials.",
    stats: [["Defines", "shifts · pay · credentials"]],
  },
  {
    title: "Source & verify",
    text: "We search, then verify licenses, references and backgrounds.",
    stats: [["Database", "300K+"]],
  },
  {
    title: "Shortlist",
    text: "You get a vetted short list and make the hire.",
    stats: [["Decision", "yours"]],
  },
  {
    title: "Onboard",
    text: "We handle the offer, onboarding and compliance.",
    stats: [["Record", "120+ in 45 days"]],
  },
];
export const PROCESS_SPLIT: string =
  "You interview, decide and run the work site. We handle the rest.";

/* ---------- 05 Open roles (SAMPLE until the ATS feed is connected [CONFIRM which ATS]) ----------
   The landing page shows the first five as a card fan; jobs.html lists them all.
   need: the one requirement that matters most for the role [label, value].
   Descriptions describe the role only: no pay, no client names, nothing invented. */
export const JOBS: readonly Job[] = [
  { id: "case-manager-hhs", fn: "Healthcare", title: "Case Manager · Health & Human Services", where: "Maryland", need: ["Setting", "County HHS"], type: "Contract", art: "Case manager with a resident",
    desc: "Coordinate services for residents in a county health and human services program: assessments, care plans and referrals.", reqs: ["Case management experience in health or human services", "Background check and references"] },
  { id: "ehr-admin", fn: "IT", title: "EHR Systems Administrator", where: "Washington, DC", need: ["Setting", "Hospital system"], type: "Contract-to-hire", art: "EHR administrator at work",
    desc: "Administer and support the electronic health record platform: access, configuration, upgrades and issue resolution.", reqs: ["EHR administration experience", "Background check and references"] },
  { id: "rn-behavioral", fn: "Healthcare", title: "Registered Nurse · Behavioral Health", where: "Maryland", need: ["License", "Active RN"], type: "Contract", art: "RN with a patient",
    desc: "Nursing care in a behavioral health setting. Shifts and pay confirmed on the first call.", reqs: ["Active RN license valid in Maryland", "Health screening, background check and references"] },
  { id: "revenue-cycle", fn: "Finance", title: "Revenue Cycle Specialist", where: "Remote", need: ["Setting", "Health system"], type: "Direct hire", art: "Billing team at work",
    desc: "Work claims from charge to payment: billing, follow-up, denials and reporting.", reqs: ["Healthcare revenue cycle or billing experience"] },
  { id: "cyber-engineer", fn: "Cyber", title: "Cybersecurity Engineer", where: "Virginia", need: ["Clearance", "TS/SCI + FSP"], type: "Contract", art: "Security operations floor",
    desc: "Engineer and monitor security controls for a cleared government program.", reqs: ["Active TS/SCI with Full Scope Poly", "Cybersecurity engineering experience"] },
  { id: "lpn-ltc", fn: "Healthcare", title: "Licensed Practical Nurse · Long-Term Care", where: "Maryland", need: ["License", "Active LPN"], type: "Contract", art: "LPN in long-term care",
    desc: "Provide nursing care to long-term care residents under the direction of the RN team.", reqs: ["Active LPN license valid in Maryland", "Health screening, background check and references"] },
  { id: "cna", fn: "Healthcare", title: "Certified Nursing Assistant", where: "Maryland", need: ["Certification", "Active CNA"], type: "Contract", art: "CNA with a resident",
    desc: "Support residents and patients with daily care, mobility and observation.", reqs: ["Active CNA certification", "Health screening, background check and references"] },
  { id: "medical-assistant", fn: "Healthcare", title: "Medical Assistant · Outpatient Clinic", where: "Washington, DC", need: ["Setting", "Clinic"], type: "Contract-to-hire", art: "Medical assistant in a clinic",
    desc: "Room patients, take vitals, update records and support providers in an outpatient clinic.", reqs: ["Medical assistant certification or equivalent experience", "Background check and references"] },
  { id: "billing-coding", fn: "Finance", title: "Medical Billing & Coding Specialist", where: "Remote", need: ["Certification", "Coding credential"], type: "Contract", art: "Billing and coding team",
    desc: "Code encounters and prepare clean claims for a healthcare provider.", reqs: ["Medical coding credential", "Billing experience"] },
  { id: "budget-analyst", fn: "Finance", title: "Budget Analyst · County Government", where: "Maryland", need: ["Setting", "County agency"], type: "Contract", art: "Budget analyst in a county office",
    desc: "Prepare, track and report on program budgets for a county agency.", reqs: ["Public-sector budget or financial analysis experience", "Background check"] },
  { id: "network-admin", fn: "IT", title: "Network Administrator", where: "Maryland", need: ["Setting", "County IT"], type: "Contract", art: "Network administrator at work",
    desc: "Maintain and secure network infrastructure for a public-sector IT department.", reqs: ["Network administration experience", "Background check"] },
  { id: "business-analyst", fn: "IT", title: "Business Analyst · Health and Human Services", where: "Remote", need: ["Setting", "Government program"], type: "Contract", art: "Business analyst in a workshop",
    desc: "Gather requirements, map processes and support delivery for a government health program.", reqs: ["Business analysis experience on public-sector programs"] },
];
/* which job the stats plate under the fan describes (the centre card) */
export const FEATURED_JOB: number = 2;
export const JOBS_NOTE: string =
  "Examples, not current openings. Send your résumé and we'll match you to open roles.";

/* ---------- 06 Capability statement (replaces Transition Into Tech, on hold [CONFIRM]) ---------- */
export const CAPABILITY: Capability = {
  points: [
    "Maryland MBE · DBE · SBE No. 19-286. Minority veteran-owned. CAGE 89AK6.",
    "NAICS 561311, 561320, 541330, 541511, 541512. Ready to contract, local to federal.",
  ],
  meta: ["Certs", "codes · past performance"],
  art: "Capability statement cover: first page of the healthcare-focused PDF",
};

/* ---------- 07 On the record ---------- */
export const STICKERS: Stickers = {
  paper: { label: "Years of combined experience", value: "125+" },
  accent: { label: "Candidates on file", value: "300K+" },
  dark: { label: "Staffed in 45 days", value: "120+" },
  ring: { label: "DoD & IC placements", value: "600+" },
};

export const LEDGER: readonly LedgerEntry[] = [
  { date: "Current", title: "Montgomery County Government: health and human services staffing", ref: "Montgomery County, MD", stamp: "Active", rot: 6 },
  { date: "Current", title: "Prince George's County Government: Office of Information Technology", ref: "Prince George's County, MD", stamp: "Active", rot: -4 },
  { date: "45 days", title: "120+ personnel staffed for a single task order", ref: "Task order", stamp: "Staffed", rot: 4 },
  { date: "Through 2024", title: "Raytheon Technologies: Codex", ref: "Past customer", stamp: "Past", rot: -6 },
  { date: "2022", title: "Indeed", ref: "Past customer", stamp: "Past", rot: 3 },
  { date: "2021–2023", title: "Pearson", ref: "Past customer", stamp: "Past", rot: -3 },
  { date: "2019–2021", title: "Capstone Corporation", ref: "Past customer", stamp: "Past", rot: 5 },
  { date: "2018", title: "400 hires closed in one year", ref: "Record year", stamp: "Closed", rot: -5 },
];

/* ---------- 08 FAQ (ids are used by the chatbot) ---------- */
export const FAQ: readonly FaqEntry[] = [
  { id: "roles", q: "What healthcare staffing do you provide?", a: "Clinical and non-clinical staff for hospitals, clinics, long-term care, behavioral health and county health departments.", tags: ["Hospitals", "Clinics", "Long-term care", "Behavioral health", "County & state HHS"] },
  { id: "specialties", q: "Do you staff IT, finance and cybersecurity roles?", a: "Yes, for healthcare and government, including cleared roles up to TS/SCI with Full Scope Poly.", tags: ["EHR & systems", "Network", "Service desk", "Cyber & cloud", "Financial analysts", "Revenue cycle", "Business analysts", "Project managers"] },
  { id: "vetting", q: "How do you vet candidates?", a: "We interview every candidate and verify licenses, credentials, references and background checks before you see a name." },
  { id: "scale", q: "How quickly can you staff a large contract?", a: "We staffed a 120+ person task order in 45 days, and scale from one nurse to a full team." },
  { id: "contracting", q: "Do you work on government contracts?", a: "Yes. Staff augmentation, contract staffing, task orders and consulting for local, state and federal agencies and their prime contractors." },
  { id: "employer", q: "Who employs contract staff?", a: "We do: payroll, timesheets and credential renewals. You manage the work site and supervision." },
  { id: "candidates", q: "Do candidates pay anything?", a: "Never. Our services are free for job seekers, including interview preparation and credentialing guidance." },
  { id: "location", q: "Where do you work?", a: "Based in Dayton, Maryland. We place across Maryland, DC, Virginia and remote." },
];
export const FAQ_NOTE: string = "Call 240.579.0466 and we'll walk you through it.";

/* ---------- 09 Contact + footer (all website enquiries go to Barry) ---------- */
export const CONTACT: Contact = {
  phone: "240.579.0466",
  email: "bklasson@xcelcareers.com",
  name: "Barry Klasson",
  title: "Director of Business Development and Client Services",
  address: "6013 Bricker Rd, Dayton, MD 21036",
  legal: "© 2026 XcelCareers", // the registered legal name is not in the questionnaire: add it once the client confirms it
  ids: "CAGE 89AK6 · UEI KQGDQLETUZ43 · MD MBE/DBE/SBE No. 19-286",
};

export const LEADERSHIP: readonly Leader[] = [
  { name: "Quan Nguyen", role: "CEO" },
  { name: "Erika Finley", role: "Director of Operations and Contracts" },
  { name: "Barry Klasson", role: "Director of Business Development and Director of Client Services" },
];

/* =====================================================================
   OTHER PAGES (jobs, healthcare, government, specialists, capability,
   about, contact, login, account). Same rules as above: questionnaire
   facts only; [CONFIRM] waits on the client.
   ===================================================================== */
export const NAV: readonly NavItem[] = [
  { href: "healthcare.html", label: "Healthcare" },
  { href: "government.html", label: "Government" },
  { href: "jobs.html", label: "Jobs" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" },
];

/* the three service pages share one layout: hero, intro, blocks, list, checks, terms, proof, ask */
export const SERVICE_PAGES: Record<ServicePageId, ServicePage> = {
  healthcare: {
    eyebrow: "Healthcare staffing · our main focus",
    title: ["Credentialed people", "for the teams", "behind the care"],
    intro: "Clinical and non-clinical staff for hospitals, clinics and county health departments, screened, credentialed and compliant.",
    blocksTitle: "Who we staff for",
    blocks: [
      { t: "Hospitals & health systems", d: "Clinical and non-clinical staff, plus EHR and revenue cycle specialists." },
      { t: "Clinics", d: "Clinical and non-clinical staff for clinics." },
      { t: "Long-term care", d: "Clinical and non-clinical staff for long-term care." },
      { t: "Behavioral health", d: "Clinical and non-clinical staff for behavioral health providers." },
      { t: "County & state HHS", d: "Staff augmentation and contract staffing for HHS programs." },
    ],
    listTitle: "Specialists behind the care", // the clinical role list is withheld until the client confirms it (Q19)
    list: ["EHR and systems administrators", "Revenue cycle and billing specialists", "Financial and budget analysts", "Cybersecurity and cloud engineers"],
    checksTitle: "Verified before you see a name",
    checks: ["Interview", "License", "Certification", "Health screening", "References", "Background check"],
    checksNote: "Interviewed and checked. You interview the short list and decide.",
    terms: [
      { t: "Contract", d: "We employ the worker: payroll, timesheets and renewals." },
      { t: "Contract-to-hire", d: "Start on contract, hire directly when ready." },
      { t: "Direct hire", d: "We screen and present the short list; you hire." },
      { t: "Staff augmentation", d: "From one nurse to a full team." },
    ],
    proof: [["120+", "personnel staffed for one task order in 45 days"], ["300K+", "candidate profiles on file"], ["125+", "years of combined experience"]],
    ask: { title: ["One nurse.", "Or a full team."], lead: "Tell us the role, shifts and credential. We send a short list of vetted candidates.", cta: "Request staff", href: "contact.html" },
  },
  government: {
    eyebrow: "Government contracting · local, state and federal",
    title: ["A certified", "small-business partner", "for agencies and primes"],
    intro: "Staff augmentation, contract staffing and task orders for local, state and federal agencies, and the primes that serve them.",
    blocksTitle: "What we deliver",
    blocks: [
      { t: "Staff augmentation", d: "Vetted people added to your team, from one to 120+." },
      { t: "Contract staffing", d: "We employ the staff. You direct the work." },
      { t: "Task orders / IDIQ", d: "Staffing for task orders and IDIQ contracts." },
      { t: "Consulting", d: "Business analysis, project, program and talent management." },
    ],
    listTitle: "For prime contractors",
    list: ["A certified Maryland MBE, DBE and SBE partner", "A minority veteran-owned small business", "Cleared talent up to TS/SCI with Full Scope Poly", "Healthcare, IT, finance and cyber in one partner"],
    checksTitle: "Registered and certified",
    checks: ["MBE", "DBE", "SBE", "CAGE 89AK6", "UEI KQGDQLETUZ43"],
    checksNote: "Maryland-certified since May 2019 (No. 19-286). Current certifications effective 9/4/2025.",
    terms: null,
    proof: [["120+", "personnel for one task order in 45 days"], ["600+", "placements for DoD and Intelligence Community clients"], ["400", "hires closed in 2018"]],
    ask: { title: ["Certifications, codes", "and past performance"], lead: "All on one page. Or request staff for a current requirement.", cta: "Capability statement", href: "capability.html" },
  },
  specialists: {
    eyebrow: "IT · Finance · Cyber · across healthcare and government",
    title: ["The specialists", "behind care and", "government"],
    intro: "The IT, finance and cybersecurity specialists who keep care and government running, including cleared talent.",
    blocksTitle: "What we place",
    blocks: [
      { t: "Healthcare & government IT", d: "EHR, systems and network administrators; service desk and cloud engineers." },
      { t: "Finance", d: "Financial, budget and cost analysts; revenue cycle and billing." },
      { t: "Cybersecurity", d: "Cybersecurity and cloud engineers, cleared up to TS/SCI." },
      { t: "Delivery", d: "Business analysts and project managers." },
    ],
    listTitle: "Where",
    list: ["Maryland", "Washington, DC", "Virginia", "Remote"],
    checksTitle: "Cleared and verified",
    checks: ["Interview", "Clearance", "Certifications", "References", "Background check"],
    checksNote: "Cleared up to TS/SCI with Full Scope Poly. 600+ DoD and IC placements.",
    terms: null,
    proof: [["600+", "DoD and IC placements"], ["TS/SCI", "with Full Scope Poly"], ["300K+", "candidate profiles on file"]],
    ask: { title: ["The specialist", "you need"], lead: "Tell us the role, the systems, and the clearance or certification it needs.", cta: "Request staff", href: "contact.html" },
  },
};

export const ABOUT: About = {
  eyebrow: "About XcelCareers",
  title: ["The people", "behind the", "care"],
  // the client's own description (questionnaire Q1)
  intro: "A healthcare staffing and government contracting company. We handle search, screening and compliance, so clients focus on the mission.",
  // the client's one sentence (Q15), split into four reasons
  why: [
    { t: "Certified", d: "Maryland MBE · DBE · SBE, No. 19-286." },
    { t: "Contract-ready", d: "Ready to contract at the local, state and federal level. CAGE 89AK6." },
    { t: "Both sides of care", d: "We know patient care and the systems behind it." },
    { t: "Vetted and fast", d: "Credentialed people, from one nurse to 120+." },
  ],
  candidates: [
    "Matched to open healthcare, IT, finance and cyber roles.",
    "Interview preparation.",
    "Guidance through credentialing, licensing and clearance.",
    "Contact after you are placed.",
    "Always free.",
  ],
  // [CONFIRM] founding story, founder, year and veteran background: not shown until supplied
};

/* staffing request form: mirrors the intake call (Q5). Goes to Barry (not wired yet). */
export const REQUEST_FORM: RequestForm = {
  types: ["Nursing & clinical", "Behavioral health & social services", "Healthcare admin & billing", "IT", "Finance", "Cybersecurity", "Other"],
  locations: ["Maryland", "Washington, DC", "Virginia", "Remote"],
  contracts: ["Contract", "Contract-to-hire", "Direct hire", "Staff augmentation / task order"],
  headcount: ["1", "2–5", "6–20", "20+"],
};
