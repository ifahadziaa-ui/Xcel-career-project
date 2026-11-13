/* =====================================================================
   XC CONCIERGE: the site chatbot.

   Two modes, same interface:
   - Guided (default): answers come from js/content.js through a small
     intent matcher, so the bot works on any static host with no keys.
   - Live AI: when serve.py reports /api/chat/status {ai: true}, replies
     stream from Claude. The model opens interface cards (jobs, contact,
     certifications, the talent request) through tool calls.

   Everything the bot says in guided mode is assembled from content.js,
   so updating that file updates the chatbot too.
   ===================================================================== */
import { spring, reduced, lockScroll, unlockScroll } from "./motion.js?v=3";
import { BRAND, CERTS, CREDENTIALS, CUSTOMERS, STEPS, JOBS, STICKERS, FAQ, CONTACT } from "./content.js?v=3";
import { esc } from "./ph.js?v=3";

const ICON = {
  mark: `<svg class="xc-mark" aria-hidden="true"><use href="#i-mark"/></svg>`, // XcelCareers mark (symbol in index.html)
  close: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  reset: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 8.4A5.4 5.4 0 1 0 4.3 4"/><path d="M2.4 1.9v3.3h3.3"/></svg>`,
  send: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3.2M3.6 7.4L8 3l4.4 4.4"/></svg>`,
  arrow: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12L12 4M5.6 4H12v6.4"/></svg>`,
  phone: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M5.6 2.2l1.3 3-1.4 1.1a8 8 0 0 0 4.2 4.2l1.1-1.4 3 1.3-.4 2.4c-.1.5-.5.8-1 .8C7 13.3 2.7 9 2.4 3.6c0-.5.3-.9.8-1z"/></svg>`,
  mail: `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5L8 9l5.5-4.5"/></svg>`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
const isPhone = () => matchMedia("(max-width: 639px)").matches;
const TEL = CONTACT.phone.replace(/\D/g, "");
const PHONE_RE = new RegExp(`\\b(${TEL.slice(0, 3)}[.\\s-]?${TEL.slice(3, 6)}[.\\s-]?${TEL.slice(6)})\\b`, "g");

/* ---------- light markdown: paragraphs, lists, **bold**, linked email/phone ---------- */
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\b([\w.+-]+@[\w-]+\.[\w.-]*\w)\b/g, '<a href="mailto:$1">$1</a>')
    .replace(PHONE_RE, `<a href="tel:${TEL}">$1</a>`);
}
function md(src) {
  const out = [];
  let para = [], list = [];
  const flushP = () => { if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`); para = []; };
  const flushL = () => { if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; };
  for (const raw of String(src).replace(/\r/g, "").split("\n")) {
    const line = raw.trim().replace(/^#{1,6}\s+/, "");
    const item = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (!line) { flushP(); flushL(); }
    else if (item) { flushP(); list.push(item[1]); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return out.join("");
}
/* while text is still arriving, close a dangling ** so it never flashes */
const closeBold = (s) => ((s.match(/\*\*/g) || []).length % 2 ? s + "**" : s);

/* =====================================================================
   GUIDED BRAIN: intent matching over content.js
   ===================================================================== */
const norm = (s) => " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[’']/g, "").replace(/[^a-z0-9/+&()]+/g, " ").trim() + " ";

const INTENTS = {
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

function classify(text) {
  const t = norm(text);
  const words = t.trim().split(/\s+/).length;
  const s = {};
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
  let best = null, top = 0;
  for (const [id, n] of Object.entries(s)) if (n > top) { best = id; top = n; }
  if (s.jobs >= 2 && (best === "clearance" || best === "services")) best = "jobs";
  if (best === "certs" && /(nurs| rn | lpn|cna| my |medical assist|bls|acls|cpr)/.test(t)) best = "licensing";
  return { id: best, t };
}

function fnOf(t) {
  if (/(nurs| rn | lpn|cna|icu|health|clinic|medical|hospital|patient|behavioral|case manag|social work)/.test(t)) return "health";
  if (/(cyber|security|soc |infosec|pen ?test)/.test(t)) return "cyber";
  if (/(financ|budget|revenue|billing|accounting|cost analyst)/.test(t)) return "finance";
  if (/(cloud|aws|azure|devops|software|developer| it |data |network|ehr|systems admin|service desk|help desk)/.test(t)) return "it";
  return "";
}
const FN_LABEL = { health: "healthcare", cyber: "cybersecurity", it: "IT", finance: "finance", tech: "IT & cyber", cleared: "cleared" };
function jobsFor(key) {
  if (key === "cleared") return JOBS.filter((j) => j.need[0] === "Clearance");
  const m = { health: ["Healthcare"], cyber: ["Cyber"], it: ["IT"], finance: ["Finance"], tech: ["IT", "Cyber"] }[key];
  return m ? JOBS.filter((j) => m.includes(j.fn)) : JOBS.slice();
}

const CHIP = {
  request: { label: "Request staff", act: "request" },
  jobs: { label: "See open roles", act: "jobs" },
  cleared: { label: "Cleared roles", act: "jobs:cleared" },
  health: { label: "Healthcare roles", act: "jobs:health" },
  tech: { label: "IT & cyber roles", act: "jobs:tech" },
  certs: { label: "Certifications", act: "certs" },
  capability: { label: "Capability statement", act: "capability" },
  contact: { label: "Talk to our team", act: "contact" },
  call: { label: "Book a short call", act: "contact" },
  process: { label: "How it works", act: "process" },
  customers: { label: "Who you've worked with", act: "customers" },
  hiring: { label: "I'm hiring", act: "request" },
  seeking: { label: "I'm looking for work", act: "jobs" },
};
const clean = (s) => s.replace(/\s*\([^)]*\bclient\b[^)]*\)/gi, "");
const faqA = (id) => (FAQ.find((f) => f.id === id) || { a: "" }).a;
const CRED = CREDENTIALS;

function reply(id, t = " ", arg = "") {
  switch (id) {
    case "greet":
      return { say: "Hi, I'm the XcelCareers concierge. I can start a staffing request, show open healthcare and government roles, or answer questions about licensing, certifications and our CAGE code.", chips: [CHIP.request, CHIP.jobs, CHIP.capability] };
    case "thanks":
      return { say: `Anytime. If you'd rather talk to a person, call **${CONTACT.phone}**.`, chips: [CHIP.request, CHIP.jobs] };
    case "request":
      return { say: "Let's get your request to our client services team. Four quick taps and an email, then we take it from there.", flow: fnOf(t) };
    case "jobs": {
      const key = arg || (/(clear|secret|ts\/sci| ts sci|polygraph)/.test(t) ? "cleared" : fnOf(t));
      let list = jobsFor(key), say;
      if (key && list.length) say = `Here are our open ${FN_LABEL[key]} roles.`;
      else if (key) { list = JOBS.slice(); say = `Nothing open in ${FN_LABEL[key]} right now, so here's everything on the board.`; }
      else say = "Here's what's open right now.";
      say += " Applying is always free.";
      return { say, parts: [{ type: "jobs", list }], chips: key === "health" ? [CHIP.tech, CHIP.contact] : [CHIP.health, CHIP.contact] };
    }
    case "certs":
      return { say: `XcelCareers is a **minority veteran-owned small business**, certified in Maryland as an MBE, DBE and SBE (No. ${CRED.certNo}).`, parts: [{ type: "certs" }], chips: [CHIP.capability, CHIP.customers] };
    case "capability":
      return { say: "Here's what contracting officers usually ask for. We work as prime or subcontractor at the local, state and federal level.", parts: [{ type: "capability" }], chips: [CHIP.customers, CHIP.request] };
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
      const names = (st) => CUSTOMERS.filter((c) => c.status === st).map((c) => c.name);
      const cur = names("current"), past = names("past");
      return { say: `Current customers include **${cur.join("** and **")}**. Past performance includes ${past.slice(0, -1).join(", ")} and ${past.at(-1)}.`, parts: [{ type: "customers" }], chips: [CHIP.capability, CHIP.request] };
    }
    case "services":
      return { say: `${BRAND.short}\n\nWhich side are you on?`, chips: [CHIP.hiring, CHIP.seeking] };
    case "stats":
      return { say: "The short version:", parts: [{ type: "stats" }], chips: [CHIP.customers, CHIP.request] };
    case "pricing":
      return { say: "Rates depend on the role, the shifts, the credentials and the contract type, so we quote each request. Start one and we'll come back with numbers. For candidates, it's always free.", chips: [CHIP.request, CHIP.contact] };
    default:
      return null;
  }
}

function guided(text) {
  const { id, t } = classify(text);
  const r = id && reply(id, t);
  if (r) return r;
  // last try: overlap with the FAQ questions
  const stop = new Set(["the", "a", "an", "you", "your", "do", "does", "can", "i", "im", "is", "are", "to", "of", "for", "in", "what", "how", "me", "my", "we"]);
  const toks = new Set(t.trim().split(/\s+/).filter((w) => w.length > 2 && !stop.has(w)));
  let best = null, hit = 0;
  for (const f of FAQ) {
    const n = norm(f.q).trim().split(/\s+/).filter((w) => toks.has(w)).length;
    if (n > hit) { hit = n; best = f; }
  }
  if (best && hit >= 2) return { say: clean(best.a), chips: [CHIP.request, CHIP.jobs] };
  return {
    say: `I don't have that one on file. A recruiter can answer it directly: call **${CONTACT.phone}** or email **${CONTACT.email}**.`,
    chips: [CHIP.request, CHIP.jobs, CHIP.contact],
  };
}
const replyAct = (act) => { const [id, arg] = act.split(":"); return reply(id, " ", arg || ""); };

/* =====================================================================
   CARDS
   ===================================================================== */
const placard = (rows, cls = "") => `<dl class="xc-placard ${cls}">${rows.map(([k, v, c = ""]) => `<dt>${esc(k)}</dt><dd class="${c}">${v}</dd>`).join("")}</dl>`;

function renderPart(p) {
  switch (p.type) {
    case "jobs":
      return `<p class="xc-card-label xc-mono xc-in">Open roles · ${p.list.length}</p>
      <div class="xc-rail xc-in" data-lenis-prevent>${p.list.map((j) => `
        <article class="xc-job">
          <div class="xc-job-top"><span class="fn xc-mono">${esc(j.fn)}</span>${ICON.mark.replace('class="xc-mark"', 'class="xc-mark mk"')}</div>
          <h4>${esc(j.title)}</h4>
          ${placard([["Location", esc(j.where)], [j.need[0], esc(j.need[1]), j.need[0] === "Clearance" ? "xc-red" : ""], ["Type", esc(j.type)]])}
          <a class="go xc-mono" href="#jobs">View role ${ICON.arrow}</a>
        </article>`).join("")}</div>`;
    case "certs":
      return `<div class="xc-seals xc-in">${CERTS.map((c) => `<div class="xc-seal"><span class="ring">${esc(c.code)}</span><small class="xc-mono">${esc(c.name)}</small></div>`).join("")}</div>
      <div class="xc-in">${placard([["Cert. No.", esc(CRED.certNo)], ["Since", esc(CRED.since)], ["Status", "Minority veteran-owned", "xc-red"]])}</div>`;
    case "capability":
      return `<div class="xc-in">${placard([
        ["CAGE", esc(CRED.cage), "xc-red"],
        ["UEI", esc(CRED.uei)],
        ["NAICS", CRED.naics.map((n) => esc(n.code)).join(" · "), "wrap"],
        ["Certified", `MD MBE · DBE · SBE · No. ${esc(CRED.certNo)}`, "wrap"],
        ["Role", "Prime or subcontractor"],
      ])}
      <div class="xc-actions"><a class="xc-btn xc-btn--red" href="${esc(CRED.pdf)}">${ICON.arrow}Capability PDF</a><a class="xc-btn" href="tel:${TEL}">${ICON.phone}Call</a></div></div>`;
    case "contact":
      return `<div class="xc-in">${placard([
        ["Contact", `${esc(CONTACT.name)}`],
        ["Phone", `<a href="tel:${TEL}">${esc(CONTACT.phone)}</a>`],
        ["Email", `<a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a>`],
        ["Office", esc(CONTACT.address), "wrap"],
      ])}
      <div class="xc-actions"><a class="xc-btn xc-btn--red" href="tel:${TEL}">${ICON.phone}Call</a><a class="xc-btn" href="mailto:${esc(CONTACT.email)}">${ICON.mail}Email</a></div></div>`;
    case "steps":
      return `<ol class="xc-steps xc-in">${STEPS.map((s, i) => `<li><span class="n xc-mono">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(s.title)}</b><p>${esc(s.text)}</p></div></li>`).join("")}</ol>`;
    case "customers": {
      const rank = { current: 0, past: 1, "": 2 };
      const list = CUSTOMERS.slice().sort((a, b) => rank[a.status] - rank[b.status]).slice(0, 12);
      return `<div class="xc-names xc-in">${list.map((c) => `<span class="xc-name xc-mono">${esc(c.name)}${c.status ? `<i>${esc(c.status)}</i>` : ""}</span>`).join("")}</div>`;
    }
    case "stats":
      return `<div class="xc-in">${placard([
        ["Experience", `${esc(STICKERS.paper.value)} years combined`],
        ["Database", `${esc(STICKERS.accent.value)} candidates`],
        ["Task order", `${esc(STICKERS.dark.value)} staffed in 45 days`, "xc-red"],
        ["DoD & IC", `${esc(STICKERS.ring.value)} placements`],
      ])}</div>`;
    case "ticket": {
      const d = p.d;
      return `<div class="xc-ticket xc-in">
        <div class="xc-ticket-top xc-mono"><span>Staffing request</span><span>${esc(p.id)}</span></div>
        ${placard([["Staff", esc(d.fn), "wrap"], ["Requires", esc(d.clr)], ["Headcount", esc(d.n)], ["Start", esc(d.when)], ["Contact", esc(d.email)], ["Status", "With client services", "xc-red"]])}
        <span class="xc-stamp">Received</span>
      </div>`;
    }
    default:
      return "";
  }
}
const chipsHTML = (chips) => `<div class="xc-chips xc-in">${chips.map((c) =>
  `<button type="button" class="xc-chip" data-say="${esc(c.label)}" data-act="${esc(c.act || "")}">${esc(c.label)}</button>`).join("")}</div>`;

/* the staffing request: four taps and an email (mirrors the client's intake call) */
const FLOW = [
  { key: "fn", ask: "What kind of staff do you need?", opts: ["Nursing & clinical", "Behavioral health & social services", "Healthcare admin & billing", "IT · Finance · Cyber"] },
  { key: "clr", ask: "What does the role require?", opts: ["Active license", "Certification", "Security clearance", "Nothing specific"] },
  { key: "n", ask: "How many people?", opts: ["1", "2–5", "6–20", "20+ · staff augmentation"] },
  { key: "when", ask: "When should they start?", opts: ["ASAP", "Within 30 days", "1–3 months", "Planning ahead"] },
  { key: "email", ask: "Last one: what's the best email for our client services team to reach you?", email: true },
];
const FLOW_FN = {
  health: "Nursing & clinical", behav: "Behavioral health & social services", admin: "Healthcare admin & billing",
  cyber: "IT · Finance · Cyber", it: "IT · Finance · Cyber", finance: "IT · Finance · Cyber", tech: "IT · Finance · Cyber",
};

/* =====================================================================
   UI
   ===================================================================== */
const START = [
  { act: "request", say: "I need to request staff", b: "Request staff", s: "For employers" },
  { act: "jobs", say: "Show me open roles", b: "Open roles", s: "For candidates" },
  { act: "capability", say: "Show me your capability statement", b: "Capability", s: "CAGE · UEI · NAICS" },
  { act: "certs", say: "What certifications do you hold?", b: "Certifications", s: "MBE · DBE · SBE" },
];

const WELCOME = `
  <div class="xc-hello">
    <p class="xc-specimen xc-mono"><span class="xc-dot"></span>Concierge · Healthcare &amp; government staffing</p>
    <h2 class="xc-title"><span>Ask us</span><span class="xc-accent">anything.</span></h2>
    <p class="xc-lede">Staffing requests, open roles, licensing questions, or our certifications and CAGE code.</p>
    ${placard([
      ["Focus", "Healthcare staffing"],
      ["Contracts", "Local · State · Federal"],
      ["Database", "300,000+ candidates"],
      ["Status", "Online now", "xc-red"],
    ])}
    <div class="xc-starts">${START.map((x, i) => `
      <button type="button" class="xc-start" data-act="${x.act}" data-say="${esc(x.say)}">
        <span class="n xc-mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(x.b)}</b><small class="xc-mono">${esc(x.s)}</small>${ICON.arrow}
      </button>`).join("")}</div>
  </div>`;

const TEMPLATE = `
  <button class="xc-launch" type="button" aria-expanded="false" aria-controls="xc-panel" aria-label="Open chat with XcelCareers">
    <span class="xc-launch-copy" aria-hidden="true">
      <span class="xc-launch-top xc-mono"><span class="xc-dot xc-dot--pulse"></span>Ask XcelCareers</span>
      <span class="xc-launch-sub xc-mono">Staffing · jobs · certifications</span>
    </span>
    <span class="xc-orb">${ICON.mark}</span>
  </button>
  <section class="xc-panel" id="xc-panel" role="dialog" aria-label="Chat with XcelCareers" data-lenis-prevent>
    <header class="xc-head">
      <p class="xc-brand xc-mono"><span>XcelCareers<span class="xc-reg">®</span></span><span class="xc-slash">/</span><span id="xc-title">Concierge</span></p>
      <span class="xc-status xc-mono"><span class="xc-dot xc-dot--pulse"></span>Online</span>
      <button class="xc-icon" type="button" data-x="reset" aria-label="Start over" title="Start over">${ICON.reset}</button>
      <button class="xc-icon" type="button" data-x="close" aria-label="Close chat" title="Close">${ICON.close}</button>
    </header>
    <div class="xc-meta-row xc-mono"><span>Client services · Dayton, MD</span><span class="xc-mode">Guided</span></div>
    <div class="xc-log" aria-live="polite"></div>
    <form class="xc-compose" autocomplete="off">
      <label class="sr-only" for="xc-input">Message</label>
      <textarea id="xc-input" rows="1" placeholder="Ask about staffing, jobs, licensing…" enterkeyhint="send"></textarea>
      <button class="xc-send" type="submit" aria-label="Send" disabled>${ICON.send}</button>
    </form>
    <p class="xc-fine xc-mono"></p>
  </section>`;

export function initChat({ lenis } = {}) {
  const root = document.createElement("div");
  root.className = "xc";
  root.innerHTML = TEMPLATE;
  document.body.append(root);

  const $ = (s) => root.querySelector(s);
  const launch = $(".xc-launch"), panel = $(".xc-panel"), log = $(".xc-log");
  const form = $(".xc-compose"), input = $("#xc-input"), sendBtn = $(".xc-send");
  const modeEl = $(".xc-mode"), fine = $(".xc-fine");
  const hero = document.querySelector(".hx-hero"), track = document.getElementById("sr-track");

  let mode = "guided", open = false, busy = false, flow = null, locked = false;
  let convo = []; // [{role, content}] sent to the AI endpoint

  /* ---------- mode ---------- */
  const setMode = (m) => {
    mode = m;
    modeEl.textContent = m === "ai" ? "AI · Live" : "Guided";
    modeEl.classList.toggle("is-ai", m === "ai");
    fine.innerHTML = m === "ai"
      ? `AI answers can be wrong · Confirm on <a href="tel:${TEL}">${esc(CONTACT.phone)}</a>`
      : `Guided answers from xcelcareers.com · <a href="tel:${TEL}">${esc(CONTACT.phone)}</a>`;
  };
  setMode("guided");
  fetch("/api/chat/status", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((s) => { if (s && s.ai) setMode("ai"); })
    .catch(() => {});

  /* ---------- launcher visibility + open/close springs ---------- */
  let shownV = 0, openV = 0, shown = false;
  const apply = () => {
    const lv = Math.max(0, shownV * (1 - Math.min(1, openV)));
    launch.style.opacity = lv;
    launch.style.transform = `translateY(${(1 - shownV) * 140}%) scale(${0.86 + 0.14 * (1 - Math.min(1, openV))})`;
    launch.style.visibility = lv > 0.01 ? "visible" : "hidden";
    launch.style.pointerEvents = lv > 0.6 ? "auto" : "none";
    panel.style.opacity = Math.min(1, openV);
    panel.style.transform = isPhone()
      ? `translateY(${(1 - openV) * 100}%)`
      : `translateY(${(1 - openV) * 18}px) scale(${0.94 + 0.06 * openV})`;
    panel.style.visibility = openV > 0.005 ? "visible" : "hidden";
    panel.style.pointerEvents = open ? "auto" : "none";
  };
  const showS = spring({ from: 0, to: 0, tension: 240, friction: 26, onUpdate: (v) => { shownV = v; apply(); } });
  const openS = spring({ from: 0, to: 0, tension: 300, friction: 28, onUpdate: (v) => { openV = Math.max(0, v); apply(); } });

  const check = () => {
    // hidden over the hero (its placard owns that corner); just the orb while the showreel plays
    const heroGone = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.4 : true;
    const tr = track?.getBoundingClientRect();
    const inReel = tr ? tr.top <= 1 && tr.bottom >= innerHeight - 1 : false;
    root.classList.toggle("is-compact", inReel && !open);
    const s = heroGone || open;
    if (s !== shown) { shown = s; showS.set(s ? 1 : 0); }
  };
  addEventListener("scroll", check, { passive: true });
  addEventListener("resize", check);
  check();

  function setOpen(o) {
    if (o === open) return;
    open = o;
    root.classList.toggle("is-open", o);
    launch.setAttribute("aria-expanded", String(o));
    openS.set(o ? 1 : 0);
    check();
    if (o) {
      if (isPhone()) { lockScroll(lenis); locked = true; }
      else setTimeout(() => input.focus({ preventScroll: true }), 160);
    } else {
      if (locked) { unlockScroll(lenis); locked = false; }
      launch.focus({ preventScroll: true });
    }
  }
  launch.addEventListener("click", () => setOpen(true));
  $('[data-x="close"]').addEventListener("click", () => setOpen(false));
  $('[data-x="reset"]').addEventListener("click", () => { if (!busy) reset(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && open) setOpen(false); });

  /* ---------- log helpers ---------- */
  const stick = (force = false) => {
    if (force || log.scrollHeight - log.scrollTop - log.clientHeight < 160) log.scrollTop = log.scrollHeight;
  };
  // once a reply is complete: scroll to its end, but never past its first line
  const reveal = (m) => {
    const bottom = log.scrollHeight - log.clientHeight;
    log.scrollTo({ top: Math.min(bottom, m.offsetTop - 14), behavior: reduced() ? "auto" : "smooth" });
  };
  function addUser(text) {
    log.insertAdjacentHTML("beforeend", `<div class="xc-msg xc-msg--me xc-in"><div class="xc-bubble">${esc(text)}</div></div>`);
    stick(true);
  }
  function botMsg() {
    const m = document.createElement("div");
    m.className = "xc-msg xc-msg--bot xc-in";
    m.innerHTML = `<div class="xc-by xc-mono"><span class="xc-dot"></span>XC · ${clock()}</div><div class="xc-text"><span class="xc-typing" role="status" aria-label="XC is typing"><i></i><i></i><i></i></span></div>`;
    log.append(m);
    stick(true);
    return { m, t: m.querySelector(".xc-text") };
  }
  async function typeOut(t, text) {
    if (reduced()) { t.innerHTML = md(text); stick(); return; }
    t.classList.add("is-streaming");
    const bits = text.split(/(\s+)/);
    let acc = "";
    for (let i = 0; i < bits.length; i++) {
      acc += bits[i];
      if (i % 2 === 0) { t.innerHTML = md(closeBold(acc)); stick(); await sleep(12 + Math.random() * 20); }
    }
    t.innerHTML = md(text);
    t.classList.remove("is-streaming");
    stick();
  }
  async function deliver(m, t, r, record = true) {
    await typeOut(t, r.say);
    if (record) convo.push({ role: "assistant", content: r.say });
    for (const p of r.parts || []) m.insertAdjacentHTML("beforeend", renderPart(p));
    if (r.chips?.length) m.insertAdjacentHTML("beforeend", chipsHTML(r.chips));
    reveal(m);
    if (r.flow !== undefined) await startFlow(r.flow);
  }
  async function say(r, record = true) {
    const { m, t } = botMsg();
    await sleep(reduced() ? 0 : 380 + Math.random() * 380);
    await deliver(m, t, r, record);
  }

  /* ---------- talent request flow ---------- */
  const resetInput = () => { input.placeholder = "Ask about staffing, jobs, licensing…"; input.removeAttribute("inputmode"); };
  async function startFlow(fn) {
    flow = { i: 0, data: {} };
    const pre = FLOW_FN[fn];
    if (pre) { flow.data.fn = pre; flow.i = 1; }
    await askStep(pre ? `Noted: **${pre}**. ` : "");
  }
  async function askStep(prefix = "") {
    const s = FLOW[flow.i];
    if (s.email) { input.placeholder = "you@company.com"; input.setAttribute("inputmode", "email"); }
    await say({ say: prefix + s.ask, chips: (s.opts || []).map((o) => ({ label: o })) }, false);
    if (s.email && !isPhone()) input.focus({ preventScroll: true });
  }
  async function flowInput(text) {
    if (/^(cancel|stop|never ?mind|quit|exit)\b/i.test(text.trim())) {
      flow = null; resetInput();
      return say({ say: "No problem, request cancelled. Anything else I can help with?", chips: [CHIP.jobs, CHIP.contact] }, false);
    }
    const s = FLOW[flow.i];
    if (s.email) {
      const v = text.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return say({ say: "That doesn't look like an email address. Try again, or type **cancel** to stop." }, false);
      flow.data.email = v;
    } else flow.data[s.key] = text.trim().slice(0, 60);
    flow.i += 1;
    if (flow.i < FLOW.length) return askStep();
    const d = flow.data, id = "XC-" + String(Date.now() % 100000).padStart(5, "0");
    flow = null; resetInput();
    await say({
      say: `Got it. ${CONTACT.name} in client services will reply to **${d.email}** within one business day (SAMPLE). Need someone sooner? Call **${CONTACT.phone}**.`,
      parts: [{ type: "ticket", id, d }],
      chips: [CHIP.process, CHIP.customers],
    }, false);
    convo.push({ role: "assistant", content: `Staffing request ${id} logged: ${d.fn}, requires ${d.clr}, ${d.n} people, start ${d.when}, contact ${d.email}. ${CONTACT.name} in client services will follow up by email.` });
  }

  /* ---------- live AI ---------- */
  async function streamChat(messages, onEvent) {
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }) });
    if (!res.ok || !res.body) { onEvent({ type: "error", code: res.status === 503 ? "unavailable" : "http" }); return; }
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (line) { try { onEvent(JSON.parse(line)); } catch { /* ignore a malformed line */ } }
      }
    }
  }
  const AI_JOBS = { all: "", healthcare: "health", it: "it", finance: "finance", cyber: "cyber", cleared: "cleared" };
  const AI_FLOW = { clinical: "health", behavioral_health: "behav", healthcare_admin: "admin", it_finance_cyber: "tech" };
  async function aiReply(text) {
    const { m, t } = botMsg();
    let acc = "", started = false, refused = false, failed = "";
    const actions = [];
    try {
      await streamChat(convo.slice(-24), (ev) => {
        if (ev.type === "text") {
          if (!started) { started = true; t.classList.add("is-streaming"); }
          acc += ev.text;
          t.innerHTML = md(closeBold(acc));
          stick();
        } else if (ev.type === "action") actions.push(ev);
        else if (ev.type === "refusal") refused = true;
        else if (ev.type === "error") failed = ev.code || "error";
      });
    } catch { failed = failed || "network"; }
    t.classList.remove("is-streaming");

    if (refused) {
      return deliver(m, t, { say: `That's one I can't help with here, but a recruiter can: **${CONTACT.phone}**.`, chips: [CHIP.contact] });
    }
    if (failed || (!acc.trim() && !actions.length)) {
      if (failed === "auth" || failed === "unavailable") setMode("guided");
      return deliver(m, t, guided(text)); // answer from the site content instead
    }
    const parts = [];
    let flowFn;
    for (const a of actions) {
      const inp = a.input || {};
      if (a.name === "show_jobs") {
        const key = AI_JOBS[inp.function] ?? "";
        parts.push({ type: "jobs", list: jobsFor(key).length ? jobsFor(key) : JOBS.slice() });
      } else if (a.name === "show_contact") parts.push({ type: "contact" });
      else if (a.name === "show_certifications") parts.push({ type: "certs" }, { type: "capability" });
      else if (a.name === "start_talent_request") flowFn = AI_FLOW[inp.function] || "";
    }
    if (!acc.trim()) {
      acc = flowFn !== undefined ? "Let's get your request to a recruiter."
        : parts[0]?.type === "jobs" ? "Here's what's open right now."
        : parts[0]?.type === "contact" ? "Here's how to reach a recruiter:"
        : "Here you go:";
    }
    t.innerHTML = md(acc);
    convo.push({ role: "assistant", content: acc });
    for (const p of parts) m.insertAdjacentHTML("beforeend", renderPart(p));
    reveal(m);
    if (flowFn !== undefined) await startFlow(flowFn);
  }

  /* ---------- one turn ---------- */
  function setBusy(b) { busy = b; sendBtn.disabled = b || !input.value.trim(); }
  async function handleUser(text, act) {
    if (busy || !text) return;
    setBusy(true);
    log.querySelectorAll(".xc-chips").forEach((c) => c.classList.add("is-spent"));
    addUser(text);
    try {
      if (flow) await flowInput(text);
      else {
        convo.push({ role: "user", content: text });
        if (act) await say(replyAct(act) || guided(text));
        else if (mode === "ai") await aiReply(text);
        else await say(guided(text));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    flow = null; convo = []; resetInput();
    log.innerHTML = WELCOME;
    log.scrollTop = 0;
  }
  reset();

  /* ---------- input ---------- */
  const autosize = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; };
  input.addEventListener("input", () => { autosize(); sendBtn.disabled = busy || !input.value.trim(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || busy) return;
    input.value = ""; autosize(); sendBtn.disabled = true;
    handleUser(v.slice(0, 1200));
  });
  log.addEventListener("click", (e) => {
    const chip = e.target.closest(".xc-chip, .xc-start");
    if (chip) { if (!busy) handleUser(chip.dataset.say, chip.dataset.act || undefined); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      e.preventDefault();
      const target = a.getAttribute("href");
      if (isPhone()) setOpen(false);
      if (lenis) lenis.scrollTo(target, { offset: -40 }); else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const api = { open: () => setOpen(true), close: () => setOpen(false), ask: (q) => { setOpen(true); handleUser(String(q)); } };
  window.xcChat = api;
  return api;
}
