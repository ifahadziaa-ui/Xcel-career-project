/* =====================================================================
   Guided chat brain: intent matching and replies over content.ts.
   Ported from landing-prototype-clean/js/chat.js ("GUIDED BRAIN", CHIP, FLOW, START).
   Pure data and functions: no DOM, no browser APIs, safe to import anywhere.
   The optional live AI mode of the prototype is NOT ported (no /api/chat).
   Every sentence the bot says is the prototype's wording or assembled from content.ts.
   ===================================================================== */
import { BRAND, CERTS, CREDENTIALS, CUSTOMERS, FAQ, CONTACT, JOBS, STICKERS, type Job } from "@/content/content";

export type Chip = { label: string; act?: string };
export interface SummaryData { fn: string; clr: string; n: string; when: string; email: string }
export type Part =
  | { type: "jobs"; list: readonly Job[] }
  | { type: "certs" }
  | { type: "capability" }
  | { type: "contact" }
  | { type: "steps" }
  | { type: "customers" }
  | { type: "stats" }
  | { type: "summary"; d: SummaryData };
export interface Reply { say: string; parts?: Part[]; chips?: Chip[]; flow?: string }

export const esc = (s: unknown): string =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const TEL = CONTACT.phone.replace(/\D/g, "");

const norm = (s: string) =>
  " " + String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u2019']/g, "").replace(/[^a-z0-9/+&()]+/g, " ").trim() + " ";

type Spec = { strong: string[]; kw: string[] };
const INTENTS: Record<string, Spec> = {
  request: {
    strong: ["request staff", "staffing request", "request talent", "need staff", "need talent", "task order", "staff augmentation", "need candidates", "need people", "fill a role", "fill roles", "fill a position", "fill positions", "help us hire", "help me hire", "staff a ", "staff our", "staff my", "looking to hire", "want to hire", "need to hire", "hire a ", "hire an ", "hire some", "im hiring", "we are hiring for"],
    kw: ["hire", "hiring", "staffing", " staff ", "candidates", "recruit", "headcount", "employer", "contractor", "talent", "our team", "my team", "shift"],
  },
  jobs: {
    strong: ["find a job", "job openings", "open roles", "open positions", "are you hiring", "looking for a job", "looking for work", "apply", "job board", "current openings", "any jobs", "any openings", "need a job", "want a job", "get a job", "im looking for work", "upload my resume", "send my resume"],
    kw: [" job", "jobs", "opening", "position", "vacanc", "career", " roles", " work "],
  },
  certs: {
    strong: ["certif", " mbe", " dbe", " sbe", "veteran owned", "minority owned", "small business"],
    kw: ["minority", "diverse", "disadvantaged", " owned", "veteran"],
  },
  capability: {
    strong: ["capability", "naics", " cage", " uei", "prime contract", "subcontract", " sub ", "idiq", "contract vehicle", "teaming", "set aside", "setaside", "contracting officer"],
    kw: [" prime", " rfp", " rfq", "proposal", " bid", "government contract"],
  },
  licensing: {
    strong: ["license", "licens", "credential", "board of nursing", "nurse compact", "compact state", "renew my", "nclex"],
    kw: [" bls", " acls", " cpr", " ceu", "verification"],
  },
  clearance: {
    strong: ["clearance", "cleared", "ts/sci", " ts sci", "top secret", " secret", "polygraph", "public trust"],
    kw: [" dod", "intelligence", " poly "],
  },
  speed: {
    strong: ["how fast", "how quickly", "how long does", "how long will", "how long to", "time to fill", "turnaround", "how soon"],
    kw: [" fast", " quick", " days", " weeks", " speed", " urgent", " asap"],
  },
  contact: {
    strong: ["contact", "phone", "call you", "email", "reach you", "talk to someone", "talk to a recruiter", "speak to", "speak with", "human", "real person", "a recruiter", "book a call", "book a meeting", "consultation"],
    kw: [" call", " number", " reach", " talk", " meeting"],
  },
  location: {
    strong: ["where are you", " based", "located", "location", "address", " office", "headquarter", " hq "],
    kw: [" where", "maryland", "dayton", " dc ", "virginia", "remote"],
  },
  process: {
    strong: ["process", "how does it work", "how do you work", "steps", "how do you find", "vetting", "screening", "how do you screen", "how it works", "employer of record"],
    kw: [" screen", " match", " source", "onboard", "payroll", "timesheet"],
  },
  customers: {
    strong: ["customers", "clients", "worked with", "past performance", "who have you", "references", "montgomery", "prince george", "raytheon", "pearson", "capstone", "indeed", " nga "],
    kw: ["government", "agencies", "companies", "county"],
  },
  services: {
    strong: ["what do you do", "services", "what roles", "what kind of roles", "industries", "functions", "specialt", "what do you offer", "who are you", "about you", "about xc", "about xcel"],
    kw: ["healthcare", "cyber", "finance", " it ", "nursing", "nurses", "billing", "government"],
  },
  stats: {
    strong: ["how many", "numbers", "stats", "track record", "how big", "years in business", "how long have you"],
    kw: ["placed", "database", "experience", " years"],
  },
  pricing: {
    strong: ["price", "pricing", " cost", " rates", " fee", "how much", "salary", "salaries", " pay "],
    kw: ["budget", "markup", "bill rate"],
  },
  greet: { strong: [" hi ", " hello ", " hey ", " hiya ", " howdy ", "good morning", "good afternoon", "good evening", " yo "], kw: [] },
  thanks: { strong: [" thanks", " thank you", " thx", " cheers", " appreciate"], kw: [] },
};

function classify(text: string) {
  const t = norm(text);
  const words = t.trim().split(/\s+/).length;
  const s: Record<string, number> = {};
  for (const [id, spec] of Object.entries(INTENTS)) {
    let n = 0;
    for (const w of spec.strong) if (t.includes(w)) n += 3;
    for (const w of spec.kw) if (t.includes(w)) n += 1;
    s[id] = n;
  }
  if (words > 3) s.greet = 0;
  if (words > 6) s.thanks = 0;
  // "we need 5 cleared engineers" is a hiring request; "I need a job" is not
  if (/\b(need|looking for|want|hiring)\b.*\b(engineers?|nurses?|analysts?|developers?|technologists?|clinicians?|people|staff|candidates|talent|contractors?)\b/.test(t) && !/\bjobs?\b/.test(t)) s.request += 4;
  if (/\b(a|any|new) (job|role|position)\b/.test(t)) s.request = Math.max(0, s.request - 3);
  let best: string | null = null, top = 0;
  for (const [id, n] of Object.entries(s)) if (n > top) { best = id; top = n; }
  if (s.jobs >= 2 && (best === "clearance" || best === "services")) best = "jobs";
  if (best === "certs" && /(nurs| rn | lpn|cna| my |medical assist|bls|acls|cpr)/.test(t)) best = "licensing";
  return { id: best, t };
}

function fnOf(t: string): string {
  if (/(nurs| rn | lpn|cna|icu|health|clinic|medical|hospital|patient|behavioral|case manag|social work)/.test(t)) return "health";
  if (/(cyber|security|soc |infosec|pen ?test)/.test(t)) return "cyber";
  if (/(financ|budget|revenue|billing|accounting|cost analyst)/.test(t)) return "finance";
  if (/(cloud|aws|azure|devops|software|developer| it |data |network|ehr|systems admin|service desk|help desk)/.test(t)) return "it";
  return "";
}
const FN_LABEL: Record<string, string> = { health: "healthcare", cyber: "cybersecurity", it: "IT", finance: "finance", tech: "IT & cyber", cleared: "cleared" };
export function jobsFor(key: string): Job[] {
  if (key === "cleared") return JOBS.filter((j) => j.need[0] === "Clearance");
  const m = ({ health: ["Healthcare"], cyber: ["Cyber"], it: ["IT"], finance: ["Finance"], tech: ["IT", "Cyber"] } as Record<string, string[]>)[key];
  return m ? JOBS.filter((j) => m.includes(j.fn)) : JOBS.slice();
}

export const CHIP: Record<string, Chip> = {
  request: { label: "Request staff", act: "request" },
  jobs: { label: "See example roles", act: "jobs" },
  cleared: { label: "Cleared roles", act: "jobs:cleared" },
  health: { label: "Healthcare roles", act: "jobs:health" },
  tech: { label: "IT & cyber roles", act: "jobs:tech" },
  certs: { label: "Certifications", act: "certs" },
  capability: { label: "Capability statement", act: "capability" },
  contact: { label: "Talk to our team", act: "contact" },
  call: { label: "Call our team", act: "contact" },
  process: { label: "How it works", act: "process" },
  customers: { label: "Who you've worked with", act: "customers" },
  hiring: { label: "I'm hiring", act: "request" },
  seeking: { label: "I'm looking for work", act: "jobs" },
};
const clean = (s: string) => s.replace(/\s*\([^)]*\bclient\b[^)]*\)/gi, "");
const faqA = (id: string) => (FAQ.find((f) => f.id === id) || { a: "" }).a;
const CRED = CREDENTIALS;

function reply(id: string, t = " ", arg = ""): Reply | null {
  switch (id) {
    case "greet":
      return { say: "Hi, I'm the XcelCareers concierge. I can help put a staffing request together, show example roles, or answer questions about licensing, certifications and our CAGE code.", chips: [CHIP.request, CHIP.jobs, CHIP.capability] };
    case "thanks":
      return { say: `Anytime. If you'd rather talk to a person, call **${CONTACT.phone}**.`, chips: [CHIP.request, CHIP.jobs] };
    case "request":
      return { say: "Let's put your request together. Four quick taps and your email, then you can send it from the request form.", flow: fnOf(t) };
    case "jobs": {
      const key = arg || (/(clear|secret|ts\/sci| ts sci|polygraph)/.test(t) ? "cleared" : fnOf(t));
      let list = jobsFor(key), say: string;
      if (key && list.length) say = `Here are example ${FN_LABEL[key]} roles. They are examples, not current openings.`;
      else if (key) { list = JOBS.slice(); say = `No ${FN_LABEL[key]} examples to show, so here are all the example roles. They are not current openings.`; }
      else say = "Here are example roles. They are not current openings.";
      say += " Send your résumé and we'll match you to open roles. Applying is always free.";
      return { say, parts: [{ type: "jobs", list }], chips: key === "health" ? [CHIP.tech, CHIP.contact] : [CHIP.health, CHIP.contact] };
    }
    case "certs":
      return { say: `XcelCareers is certified in Maryland as an MBE, DBE and SBE (No. ${CRED.certNo}).`, parts: [{ type: "certs" }], chips: [CHIP.capability, CHIP.customers] };
    case "capability":
      return { say: "Here's what contracting officers usually ask for. We're ready to contract at the local, state and federal level.", parts: [{ type: "capability" }], chips: [CHIP.customers, CHIP.request] };
    case "licensing":
      return { say: "We guide candidates through credentialing, licensing and clearance steps as part of placement, at no cost. For the rules on your specific license, your state board has the final word, and a recruiter can tell you exactly what a role requires.", chips: [CHIP.health, CHIP.contact] };
    case "clearance":
      return { say: `We fill cleared IT and cyber roles up to **TS/SCI with Full Scope Poly**, and we've made ${STICKERS.ring.value} placements for DoD and Intelligence Community clients.`, chips: [CHIP.cleared, CHIP.request] };
    case "speed":
      return { say: faqA("scale"), chips: [CHIP.request, CHIP.process] };
    case "contact":
      return { say: "Here's how to reach our team directly:", parts: [{ type: "contact" }], chips: [CHIP.request] };
    case "location":
      return { say: faqA("location"), parts: [{ type: "contact" }], chips: [CHIP.request, CHIP.jobs] };
    case "process":
      return { say: "From open role to day one:", parts: [{ type: "steps" }], chips: [CHIP.request, CHIP.contact] };
    case "customers": {
      const names = (st: string) => CUSTOMERS.filter((c) => c.status === st).map((c) => c.name);
      const cur = names("current"), past = names("past");
      return { say: `Current customers include **${cur.join("** and **")}**. Past performance includes ${past.slice(0, -1).join(", ")} and ${past.at(-1)}.`, parts: [{ type: "customers" }], chips: [CHIP.capability, CHIP.request] };
    }
    case "services":
      return { say: `${BRAND.short}\n\nWhich side are you on?`, chips: [CHIP.hiring, CHIP.seeking] };
    case "stats":
      return { say: "The short version:", parts: [{ type: "stats" }], chips: [CHIP.customers, CHIP.request] };
    case "pricing":
      return { say: "Rates depend on the role, the shifts, the credentials and the contract type, so each request is quoted individually. For candidates, it's always free.", chips: [CHIP.request, CHIP.contact] };
    default:
      return null;
  }
}

export function guided(text: string): Reply {
  const { id, t } = classify(text);
  const r = id && reply(id, t);
  if (r) return r;
  // last try: overlap with the FAQ questions
  const stop = new Set(["the", "a", "an", "you", "your", "do", "does", "can", "i", "im", "is", "are", "to", "of", "for", "in", "what", "how", "me", "my", "we"]);
  const toks = new Set(t.trim().split(/\s+/).filter((w) => w.length > 2 && !stop.has(w)));
  let best: (typeof FAQ)[number] | null = null, hit = 0;
  for (const f of FAQ) {
    const n = norm(f.q).trim().split(/\s+/).filter((w) => toks.has(w)).length;
    if (n > hit) { hit = n; best = f; }
  }
  if (best && hit >= 2) return { say: clean(best.a) + (best.tags ? `\n\n${best.tags.join(" · ")}` : ""), chips: [CHIP.request, CHIP.jobs] };
  return {
    say: `I don't have that one on file. A recruiter can answer it directly: call **${CONTACT.phone}** or email **${CONTACT.email}**.`,
    chips: [CHIP.request, CHIP.jobs, CHIP.contact],
  };
}
export const replyAct = (act: string): Reply | null => { const [id, arg] = act.split(":"); return reply(id, " ", arg || ""); };

/* the staffing request: four taps and an email (mirrors the client's intake call) */
export type FlowStep = { key: string; ask: string; opts?: string[]; email?: boolean };
export const FLOW: readonly FlowStep[] = [
  { key: "fn", ask: "What kind of staff do you need?", opts: ["Nursing & clinical", "Behavioral health & social services", "Healthcare admin & billing", "IT · Finance · Cyber"] },
  { key: "clr", ask: "What does the role require?", opts: ["Active license", "Certification", "Security clearance", "Nothing specific"] },
  { key: "n", ask: "How many people?", opts: ["1", "2–5", "6–20", "20+ · staff augmentation"] },
  { key: "when", ask: "When should they start?", opts: ["ASAP", "Within 30 days", "1–3 months", "Planning ahead"] },
  { key: "email", ask: "Last one: what's the best email for our client services team to reach you?", email: true },
];
export const FLOW_FN: Record<string, string> = {
  health: "Nursing & clinical", behav: "Behavioral health & social services", admin: "Healthcare admin & billing",
  cyber: "IT · Finance · Cyber", it: "IT · Finance · Cyber", finance: "IT · Finance · Cyber", tech: "IT · Finance · Cyber",
};

export const START = [
  { act: "request", say: "I need to request staff", b: "Request staff", s: "For employers" },
  { act: "jobs", say: "Show me example roles", b: "Example roles", s: "For candidates" },
  { act: "capability", say: "Show me your capability statement", b: "Capability", s: "CAGE · UEI · NAICS" },
  { act: "certs", say: "What certifications do you hold?", b: "Certifications", s: "MBE · DBE · SBE" },
] as const;

export { CERTS };
