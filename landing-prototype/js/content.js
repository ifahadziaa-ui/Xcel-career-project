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
  finalEyebrow: "Staffing request",
  finalLines: ["One nurse.", "Or 120+ staff."],
  finalLead: "Tell us the role, the shifts, the pay range and the license, certification or clearance it needs. We screen, verify and send you a short list of vetted candidates.",
  finalButton: "Request staff",
  finalSecondary: "Capability statement",
  finalTrust: "Maryland MBE · DBE · SBE No. 19-286 · CAGE 89AK6",
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

/* Flight tiles: no longer used by the prototype (its tile flight was removed on 13 Nov 2026),
   kept because superconscious/xcelcareers.html still imports it. */
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

/* ---------- 05 Open roles (SAMPLE until the ATS feed is connected [CONFIRM which ATS]) ----------
   The landing page shows the first five as a card fan; jobs.html lists them all.
   need: the one requirement that matters most for the role [label, value].
   Descriptions describe the role only: no pay, no client names, nothing invented. */
export const JOBS = [
  { id: "case-manager-hhs", fn: "Healthcare", title: "Case Manager · Health & Human Services", where: "Maryland", need: ["Setting", "County HHS"], type: "Contract", art: "Case manager with a resident",
    desc: "Coordinate services for residents in a county health and human services program: assessments, care plans, referrals and follow-up.", reqs: ["Case management experience in health or human services", "Background check and references"] },
  { id: "ehr-admin", fn: "IT", title: "EHR Systems Administrator", where: "Washington, DC", need: ["Setting", "Hospital system"], type: "Contract-to-hire", art: "EHR administrator at work",
    desc: "Administer and support the electronic health record platform for clinical and business users: access, configuration, upgrades and issue resolution.", reqs: ["EHR administration experience", "Background check and references"] },
  { id: "rn-behavioral", fn: "Healthcare", title: "Registered Nurse · Behavioral Health", where: "Maryland", need: ["License", "Active RN"], type: "Contract", art: "RN with a patient",
    desc: "Provide nursing care in a behavioral health setting. Shifts and pay range are confirmed on the first call.", reqs: ["Active RN license valid in Maryland", "Health screening, background check and references"] },
  { id: "revenue-cycle", fn: "Finance", title: "Revenue Cycle Specialist", where: "Remote", need: ["Setting", "Health system"], type: "Direct hire", art: "Billing team at work",
    desc: "Work claims from charge to payment for a health system: billing, follow-up, denials and reporting.", reqs: ["Healthcare revenue cycle or billing experience"] },
  { id: "cyber-engineer", fn: "Cyber", title: "Cybersecurity Engineer", where: "Virginia", need: ["Clearance", "TS/SCI + FSP"], type: "Contract", art: "Security operations floor",
    desc: "Engineer and monitor security controls for a cleared government program.", reqs: ["Active TS/SCI with Full Scope Poly", "Cybersecurity engineering experience"] },
  { id: "lpn-ltc", fn: "Healthcare", title: "Licensed Practical Nurse · Long-Term Care", where: "Maryland", need: ["License", "Active LPN"], type: "Contract", art: "LPN in long-term care",
    desc: "Provide nursing care to long-term care residents under the direction of the RN team.", reqs: ["Active LPN license valid in Maryland", "Health screening, background check and references"] },
  { id: "cna", fn: "Healthcare", title: "Certified Nursing Assistant", where: "Maryland", need: ["Certification", "Active CNA"], type: "Contract", art: "CNA with a resident",
    desc: "Support residents and patients with daily care, mobility and observation, reporting to the nursing team.", reqs: ["Active CNA certification", "Health screening, background check and references"] },
  { id: "medical-assistant", fn: "Healthcare", title: "Medical Assistant · Outpatient Clinic", where: "Washington, DC", need: ["Setting", "Clinic"], type: "Contract-to-hire", art: "Medical assistant in a clinic",
    desc: "Room patients, take vitals, update records and support providers in an outpatient clinic.", reqs: ["Medical assistant certification or equivalent experience", "Background check and references"] },
  { id: "billing-coding", fn: "Finance", title: "Medical Billing & Coding Specialist", where: "Remote", need: ["Certification", "Coding credential"], type: "Contract", art: "Billing and coding team",
    desc: "Code encounters and prepare clean claims for a healthcare provider.", reqs: ["Medical coding credential", "Billing experience"] },
  { id: "budget-analyst", fn: "Finance", title: "Budget Analyst · County Government", where: "Maryland", need: ["Setting", "County agency"], type: "Contract", art: "Budget analyst in a county office",
    desc: "Prepare, track and report on program budgets for a county agency.", reqs: ["Public-sector budget or financial analysis experience", "Background check"] },
  { id: "network-admin", fn: "IT", title: "Network Administrator", where: "Maryland", need: ["Setting", "County IT"], type: "Contract", art: "Network administrator at work",
    desc: "Maintain and secure network infrastructure for a public-sector IT department.", reqs: ["Network administration experience", "Background check"] },
  { id: "business-analyst", fn: "IT", title: "Business Analyst · Health and Human Services", where: "Remote", need: ["Setting", "Government program"], type: "Contract", art: "Business analyst in a workshop",
    desc: "Gather requirements, map processes and support delivery for a government health and human services program.", reqs: ["Business analysis experience on public-sector programs"] },
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
  { date: "2022", title: "Indeed", ref: "Technology", stamp: "Delivered", rot: 3 },
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

/* =====================================================================
   OTHER PAGES (jobs, healthcare, government, specialists, capability,
   about, contact, login, account). Same rules as above: questionnaire
   facts only; [CONFIRM] waits on the client.
   ===================================================================== */
export const NAV = [
  { href: "healthcare.html", label: "Healthcare" },
  { href: "government.html", label: "Government" },
  { href: "jobs.html", label: "Jobs" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" },
];

/* the three service pages share one layout: hero, intro, blocks, list, checks, terms, proof, ask */
export const SERVICE_PAGES = {
  healthcare: {
    eyebrow: "Healthcare staffing · our main focus",
    title: ["Credentialed people", "for every level of", "care"],
    intro: "We place clinical and non-clinical staff with hospitals, health systems, clinics, long-term care, behavioral health providers, and county and state health and human services departments. We handle the search, the screening, the credential checks and the compliance, so your teams stay focused on patients.",
    blocksTitle: "Who we staff for",
    blocks: [
      { t: "Hospitals & health systems", d: "Clinical and non-clinical staff, plus the EHR, revenue cycle and security specialists behind them." },
      { t: "Clinics", d: "Nurses, medical assistants and the support staff behind outpatient care." },
      { t: "Long-term care", d: "LPNs, CNAs and care staff for residents who need continuity." },
      { t: "Behavioral health", d: "Nurses, behavioral health and social services staff, and case managers." },
      { t: "County & state HHS", d: "Staff augmentation and contract staffing for health and human services programs." },
    ],
    listTitle: "Roles we fill", // [CONFIRM] the healthcare roles list with the client
    list: ["Registered nurses (RN)", "Licensed practical nurses (LPN)", "Certified nursing assistants (CNA)", "Medical assistants", "Behavioral health & social services staff", "Case managers", "Medical billing & coding", "EHR & systems administrators"],
    checksTitle: "Verified before you see a name",
    checks: ["Interview", "License", "Certification", "Health screening", "References", "Background check"],
    checksNote: "Every candidate we submit has been interviewed and checked. You interview the short list and make the hiring decision.",
    terms: [
      { t: "Contract", d: "We employ the worker: timesheets, payroll, license and certification renewals, and check-ins through the assignment." },
      { t: "Contract-to-hire", d: "Start on contract, then hire the person directly when you are ready." },
      { t: "Direct hire", d: "We find, screen and present the short list; you hire." },
      { t: "Staff augmentation", d: "From one nurse to a full team on a county or state program." },
    ],
    proof: [["120+", "personnel staffed for one task order in 45 days"], ["300K+", "candidate profiles on file"], ["125+", "years of combined experience"]],
    ask: { title: ["One nurse.", "Or a full team."], lead: "Tell us the role, the shifts, the pay range and the license or certification it needs. We send a short list of vetted candidates.", cta: "Request staff", href: "contact.html" },
  },
  government: {
    eyebrow: "Government contracting · local, state and federal",
    title: ["A certified", "small-business partner,", "ready to prime or sub"],
    intro: "XcelCareers supports local, state and federal government, and the prime contractors who serve them, with staff augmentation, contract staffing, task orders and consulting. Most of our work today is staff augmentation for county government, including health and human services, and hard-to-fill IT, finance and cleared roles.",
    blocksTitle: "What we deliver",
    blocks: [
      { t: "Staff augmentation", d: "Vetted people added to your team, from one specialist to 120+ personnel." },
      { t: "Contract staffing", d: "We employ the staff: timesheets, payroll, renewals and check-ins. You direct the work." },
      { t: "Task orders / IDIQ", d: "Prime or subcontractor on task orders and IDIQ vehicles." },
      { t: "Consulting", d: "Business analysis, project and program management, and talent management." },
    ],
    listTitle: "For prime contractors",
    list: ["A certified Maryland MBE, DBE and SBE partner", "A minority veteran-owned small business", "Cleared talent up to TS/SCI with Full Scope Poly", "Healthcare, IT, finance and cyber in one partner"],
    checksTitle: "Registered and certified",
    checks: ["MBE", "DBE", "SBE", "CAGE 89AK6", "UEI KQGDQLETUZ43"],
    checksNote: "Certified by the Maryland Department of Social and Economic Mobility, No. 19-286, since May 2019. Current certifications effective 9/4/2025.",
    terms: null,
    proof: [["120+", "personnel for one task order in 45 days"], ["600+", "placements for DoD and Intelligence Community clients"], ["400", "hires closed in 2018"]],
    ask: { title: ["Certifications, codes", "and past performance"], lead: "All on one page in the capability statement. Or request staff for a current requirement.", cta: "Capability statement", href: "capability.html" },
  },
  specialists: {
    eyebrow: "IT · Finance · Cyber · across healthcare and government",
    title: ["The specialists", "behind care and", "government"],
    intro: "Hospitals and agencies run on systems, budgets and security as much as on the people at the front line. We place the specialists who keep them running, including cleared talent for federal programs.",
    blocksTitle: "What we place",
    blocks: [
      { t: "Healthcare & government IT", d: "EHR and systems administrators, network administrators, service desk and cloud engineers." },
      { t: "Finance", d: "Financial, budget and cost analysts; revenue cycle and billing specialists." },
      { t: "Cybersecurity", d: "Cybersecurity and cloud engineers, cleared up to TS/SCI with Full Scope Poly." },
      { t: "Delivery", d: "Business analysts and project managers for health and government programs." },
    ],
    listTitle: "Where",
    list: ["Maryland", "Washington, DC", "Virginia", "Remote"],
    checksTitle: "Cleared and verified",
    checks: ["Interview", "Clearance", "Certifications", "References", "Background check"],
    checksNote: "Cleared roles up to TS/SCI with Full Scope Poly. 600+ placements for DoD and Intelligence Community clients.",
    terms: null,
    proof: [["600+", "DoD and IC placements"], ["TS/SCI", "with Full Scope Poly"], ["300K+", "candidate profiles on file"]],
    ask: { title: ["The specialist", "you need"], lead: "Tell us the role, the systems, and the clearance or certification it needs.", cta: "Request staff", href: "contact.html" },
  },
};

export const ABOUT = {
  eyebrow: "About XcelCareers",
  title: ["The people", "behind the", "care"],
  // the client's own description (questionnaire Q1)
  intro: "XcelCareers is a healthcare staffing and government contracting company. We find and place skilled people with hospitals, clinics and health agencies, and we support local, state and federal government through staffing, staff augmentation and contract work, with specialist expertise in IT, finance and cybersecurity. We handle the search, screening, credential checks and compliance so our clients can focus on their mission.",
  // the client's one sentence (Q15), split into four reasons
  why: [
    { t: "Certified", d: "A minority veteran-owned small business, Maryland MBE, DBE and SBE certified (No. 19-286)." },
    { t: "Contract-ready", d: "Ready to contract at the local, state and federal level, as prime or subcontractor. CAGE 89AK6." },
    { t: "Both sides of care", d: "We understand patient care and the IT, finance and security behind it." },
    { t: "Vetted and fast", d: "Credentialed, compliant people, from one nurse to a 120+ person staff augmentation." },
  ],
  candidates: [
    "We match you to open healthcare roles, and to IT, finance and cyber roles in healthcare and government.",
    "We prepare you for interviews.",
    "We guide you through credentialing, licensing or clearance steps.",
    "We stay in contact after you are placed.",
    "It is always free for you.",
  ],
  // [CONFIRM] founding story, founder, year and veteran background: not shown until supplied
};

/* staffing request form: mirrors the intake call (Q5). Goes to Barry (not wired yet). */
export const REQUEST_FORM = {
  types: ["Nursing & clinical", "Behavioral health & social services", "Healthcare admin & billing", "IT", "Finance", "Cybersecurity", "Other"],
  locations: ["Maryland", "Washington, DC", "Virginia", "Remote"],
  contracts: ["Contract", "Contract-to-hire", "Direct hire", "Staff augmentation / task order"],
  headcount: ["1", "2–5", "6–20", "20+"],
};
