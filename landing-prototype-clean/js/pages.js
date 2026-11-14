/* =====================================================================
   INNER PAGES. Each HTML page is a shell: <body data-page="..."><main></main>.
   This module renders the page from content.js inside the shared chrome.
   Forms and accounts are prototype-only: nothing is sent or stored on a server.
   ===================================================================== */
import {
  JOBS, SERVICE_PAGES, ABOUT, REQUEST_FORM, CONTACT, CREDENTIALS, CERTS, CUSTOMERS, LEDGER, STEPS, LEADERSHIP, STICKERS,
} from "./content.js?v=3";
import { esc, ph } from "./ph.js?v=3";
import { initPage, arrow, tel, toast } from "./site.js?v=3";
import { currentUser, signIn, signUp, signInWithGoogle, signOut, update, toggleSaved, recordApplication } from "./auth.js?v=3";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page;

/* ---------- shared pieces ---------- */
const eyebrow = (t) => `<p class="eyebrow type-caps" data-r="0"><span class="dot" aria-hidden="true"></span>${esc(t)}</p>`;
// headline lines; the last one is the red accent, like CARE in the hero
const headline = (lines, tag = "h1", id = "") => `<${tag} class="hl type-display pg-hl"${id ? ` id="${id}"` : ""} data-r="1">${lines.map((l, i) =>
  i === lines.length - 1 ? `<span class="mark">${esc(l)}</span>` : `<span class="l">${esc(l)}</span>`).join("")}</${tag}>`;
const btn = (label, href, ghost = false) => `<a class="btn${ghost ? " btn--ghost" : ""}" href="${href}">${esc(label)}${arrow}</a>`;
const callLink = () => `<a class="pg-call" href="${tel}">or call <b>${esc(CONTACT.phone)}</b></a>`;
const sectionHead = (eb, title, note = "") => `<div class="pg-head">${eyebrow(eb)}<h2 class="pg-h2" data-r="1">${esc(title)}</h2>${note ? `<p class="pg-lead" data-r="2">${esc(note)}</p>` : ""}</div>`;
const notice = (t) => `<p class="pg-notice" data-r="0"><span class="tag">Note</span>${esc(t)}</p>`;

function hero({ eb, title, intro, actions = "" }) {
  return `<section class="pg-hero">
    <div class="pg-wrap">
      ${eyebrow(eb)}
      ${headline(title)}
      ${intro ? `<p class="pg-intro" data-r="2">${esc(intro)}</p>` : ""}
      ${actions ? `<div class="pg-actions" data-r="3">${actions}</div>` : ""}
    </div>
  </section>`;
}

function askBand({ title, lead, cta, href }) {
  return `<section class="pg-sec pg-ask"><div class="pg-wrap pg-ask-in">
    <div>${headline(title, "h2")}<p class="pg-lead" data-r="2">${esc(lead)}</p></div>
    <div class="pg-actions" data-r="3">${btn(cta, href)}${callLink()}</div>
  </div></section>`;
}

const credStrip = () => `<ul class="pg-creds" data-r="1">
  ${CERTS.map((c) => `<li><b>${esc(c.code)}</b><span>${esc(c.name)}</span></li>`).join("")}
  <li><b>No. ${esc(CREDENTIALS.certNo)}</b><span>Maryland, since ${esc(CREDENTIALS.since)}</span></li>
  <li><b>CAGE</b><span>${esc(CREDENTIALS.cage)}</span></li>
  <li><b>UEI</b><span>${esc(CREDENTIALS.uei)}</span></li>
</ul>`;

/* =====================================================================
   SERVICE PAGES: healthcare, government, specialists
   ===================================================================== */
function servicePage(main, key) {
  const P = SERVICE_PAGES[key];
  const naics = key === "government" ? `
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Codes", "NAICS")}
      <ul class="pg-table" data-r="2">${CREDENTIALS.naics.map((n) => `<li><b>${esc(n.code)}</b><span>${esc(n.name)}</span></li>`).join("")}</ul>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Past performance", "Who we have worked with")}
      <ul class="pg-ledger" data-r="2">${LEDGER.map((r) => `<li><span class="d">${esc(r.date)}</span><span class="t">${esc(r.title)}</span><span class="s">${esc(r.stamp)}</span></li>`).join("")}</ul>
    </div></section>` : "";

  main.innerHTML = `
    ${hero({ eb: P.eyebrow, title: P.title, intro: P.intro, actions: btn(P.ask.cta, P.ask.href) + callLink() })}
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead(key === "healthcare" ? "Settings" : "Services", P.blocksTitle)}
      <ol class="pg-grid pg-grid--${P.blocks.length}">${P.blocks.map((b, i) => `<li class="pg-card" data-r="${i % 3}"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></li>`).join("")}</ol>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap pg-split">
      <div>${sectionHead(key === "specialists" ? "Locations" : key === "government" ? "Primes" : "Specialists", P.listTitle)}
        <ul class="pg-list" data-r="2">${P.list.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
      <div class="pg-panel" data-r="2">
        <h3 class="pg-h3">${esc(P.checksTitle)}</h3>
        <ul class="pg-checks">${P.checks.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <p class="pg-small">${esc(P.checksNote)}</p>
      </div>
    </div></section>
    ${P.terms ? `<section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("How we engage", "Four ways to work with us")}
      <ul class="pg-grid pg-grid--4">${P.terms.map((t, i) => `<li class="pg-card" data-r="${i % 4}"><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></li>`).join("")}</ul>
      <p class="pg-small pg-split-note" data-r="1">You keep the final interview, the hiring decision, the work site and day-to-day supervision. We handle the rest.</p>
    </div></section>` : ""}
    ${naics}
    <section class="pg-sec"><div class="pg-wrap">
      <ul class="pg-proof">${P.proof.map(([v, l], i) => `<li data-r="${i}"><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join("")}</ul>
      ${key !== "specialists" ? credStrip() : ""}
    </div></section>
    ${askBand(P.ask)}`;
}

/* =====================================================================
   JOBS
   ===================================================================== */
function jobsPage(main) {
  const fns = ["All", ...new Set(JOBS.map((j) => j.fn))];
  const opt = (v) => `<option>${esc(v)}</option>`;
  main.innerHTML = `
    ${hero({ eb: "Example roles", title: ["Find your", "next role"], intro: "Healthcare roles first, then IT, finance and cyber roles in healthcare and government. Applying is always free, and we prepare you for the interview." })}
    <section class="pg-sec pg-sec--tight"><div class="pg-wrap">
      ${notice("These are example roles, not current openings. Send your résumé and we'll match you to open roles.")}
      <div class="jb-bar" data-r="1">
        <label class="jb-search"><span class="sr-only">Search roles</span><input id="jb-q" type="search" placeholder="Search role, skill or credential"></label>
        <div class="jb-chips" role="group" aria-label="Field">${fns.map((f, i) => `<button type="button" class="chip${i ? "" : " is-on"}" data-fn="${esc(f)}">${esc(f)}</button>`).join("")}</div>
        <label class="jb-sel"><span class="sr-only">Location</span><select id="jb-where"><option value="">All locations</option>${[...new Set(JOBS.map((j) => j.where))].map(opt).join("")}</select></label>
        <label class="jb-sel"><span class="sr-only">Type</span><select id="jb-type"><option value="">All types</option>${[...new Set(JOBS.map((j) => j.type))].map(opt).join("")}</select></label>
      </div>
      <p class="jb-count" id="jb-count" aria-live="polite"></p>
      <ul class="jb-list" id="jb-list"></ul>
    </div></section>
    <section class="pg-sec" id="resume"><div class="pg-wrap pg-split">
      <div>${sectionHead("No match yet?", "Send us your résumé", "We search our network for every request. Send your résumé and we'll match you to roles as they open.")}</div>
      <form class="pg-form pg-panel" id="resume-form" data-r="2">
        <div class="f2"><label>First name<input name="first" required autocomplete="given-name"></label><label>Last name<input name="last" required autocomplete="family-name"></label></div>
        <label>Email<input name="email" type="email" required autocomplete="email"></label>
        <label>Field<select name="field">${["Healthcare", "IT", "Finance", "Cybersecurity", "Other"].map(opt).join("")}</select></label>
        <label class="file">Résumé (PDF or Word)<input name="resume" type="file" accept=".pdf,.doc,.docx" required></label>
        <button class="btn" type="submit">Send résumé${arrow}</button>
      </form>
    </div></section>
    <dialog class="jb-dlg" id="jb-dlg" aria-labelledby="jb-dlg-t"></dialog>`;

  const state = { fn: "All", q: "", where: "", type: "" };
  const list = $("#jb-list"), count = $("#jb-count");
  const savedIds = () => currentUser()?.saved || [];
  const render = () => {
    const q = state.q.trim().toLowerCase();
    const rows = JOBS.filter((j) => (state.fn === "All" || j.fn === state.fn) && (!state.where || j.where === state.where) && (!state.type || j.type === state.type)
      && (!q || [j.title, j.fn, j.where, j.type, j.desc, ...j.need, ...j.reqs].join(" ").toLowerCase().includes(q)));
    count.textContent = `${rows.length} ${rows.length === 1 ? "role" : "roles"}`;
    list.innerHTML = rows.map((j) => `
      <li class="jb-row" id="job-${j.id}">
        <div class="jb-main"><span class="jb-fn">${esc(j.fn)} · Example</span><h3>${esc(j.title)}</h3><p>${esc(j.where)} · ${esc(j.type)} · ${esc(j.need[0])}: <b>${esc(j.need[1])}</b></p></div>
        <div class="jb-acts">
          <button type="button" class="jb-save${savedIds().includes(j.id) ? " is-on" : ""}" data-save="${j.id}" aria-pressed="${savedIds().includes(j.id)}" aria-label="Save ${esc(j.title)}">${savedIds().includes(j.id) ? "Saved" : "Save"}</button>
          <button type="button" class="btn" data-open="${j.id}">View role${arrow}</button>
        </div>
      </li>`).join("") || `<li class="jb-empty">No roles match. <a href="#resume">Send your résumé</a> and we'll match you to open roles.</li>`;
  };
  render();
  $("#jb-q").addEventListener("input", (e) => { state.q = e.target.value; render(); });
  $("#jb-where").addEventListener("change", (e) => { state.where = e.target.value; render(); });
  $("#jb-type").addEventListener("change", (e) => { state.type = e.target.value; render(); });
  $(".jb-chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-fn]"); if (!b) return;
    state.fn = b.dataset.fn; $$(".jb-chips .chip").forEach((c) => c.classList.toggle("is-on", c === b)); render();
  });

  const dlg = $("#jb-dlg");
  const openJob = (id) => {
    const j = JOBS.find((x) => x.id === id); if (!j) return;
    const u = currentUser();
    const applied = u?.applied.some((a) => a.id === id);
    dlg.innerHTML = `
      <button class="jb-x" type="button" data-close aria-label="Close"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
      <p class="jb-fn">${esc(j.fn)} · Example role</p>
      <h2 id="jb-dlg-t">${esc(j.title)}</h2>
      <dl class="jb-meta"><div><dt>Location</dt><dd>${esc(j.where)}</dd></div><div><dt>Type</dt><dd>${esc(j.type)}</dd></div><div><dt>${esc(j.need[0])}</dt><dd>${esc(j.need[1])}</dd></div></dl>
      <p class="jb-desc">${esc(j.desc)}</p>
      <h3>What it needs</h3><ul class="pg-list">${j.reqs.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <h3>Interested in roles like this?</h3>
      <p class="pg-small">This is an example, not a current opening. Send your résumé and we'll match you to open roles. Free for candidates, always.</p>
      <div class="pg-actions"><a class="btn" href="#resume" data-close>Send your résumé${arrow}</a></div>`;
    dlg.showModal();
  };
  list.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) return openJob(o.dataset.open);
    const s = e.target.closest("[data-save]");
    if (s) {
      if (!currentUser()) { location.href = `login.html?next=jobs.html`; return; }
      toggleSaved(s.dataset.save); render();
    }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  $("#resume-form").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast(`Nothing was sent: this form isn't connected yet. Email ${CONTACT.email} or call ${CONTACT.phone}.`); });
  const m = location.hash.match(/^#job-(.+)$/);
  if (m) setTimeout(() => openJob(m[1]), 300);
}

/* =====================================================================
   CAPABILITY
   ===================================================================== */
function capabilityPage(main) {
  const rows = [
    ["Company", "XcelCareers"],
    ["Status", "Minority veteran-owned small business"],
    ["Certifications", `Maryland MBE · DBE · SBE, No. ${CREDENTIALS.certNo}, issued by the ${CREDENTIALS.certifier}. Certified since ${CREDENTIALS.since}; current certifications effective ${CREDENTIALS.effective}.`],
    ["CAGE", CREDENTIALS.cage], ["UEI", CREDENTIALS.uei],
    ["Contracting", "Ready to contract at the local, state and federal level, including task orders"],
    ["Cleared talent", "Up to TS/SCI with Full Scope Poly"],
    ["Where", "Maryland, DC, Virginia and remote"],
    ["Point of contact", `${CONTACT.name}, ${CONTACT.title} · ${CONTACT.phone} · ${CONTACT.email}`],
  ];
  main.innerHTML = `
    ${hero({ eb: "Contract-ready", title: ["Capability", "statement"], intro: "A minority veteran-owned small business, MBE/DBE/SBE certified in Maryland, ready to contract at the local, state and federal level, that understands patient care and the IT, finance and security behind it.",
      actions: btn("Request staff", "contact.html", true) })}
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Company data", "At a glance")}
      <dl class="pg-dl" data-r="2">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Core capabilities", "What we deliver")}
      <ol class="pg-grid pg-grid--4">${[
        ["Healthcare staffing", "Clinical and non-clinical staff for hospitals, clinics, long-term care, behavioral health and county and state HHS."],
        ["Staff augmentation & contract staffing", "From one specialist to 120+ personnel; we are the employer of record for contract staff."],
        ["Task orders / IDIQ", "Staffing for local, state and federal task orders and IDIQ contracts."],
        ["IT · Finance · Cyber", "EHR and systems, revenue cycle and budget analysis, cybersecurity, cleared to TS/SCI."],
      ].map(([t, d], i) => `<li class="pg-card" data-r="${i}"><span class="n">0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap pg-split">
      <div>${sectionHead("Codes", "NAICS")}<ul class="pg-table" data-r="2">${CREDENTIALS.naics.map((n) => `<li><b>${esc(n.code)}</b><span>${esc(n.name)}</span></li>`).join("")}</ul></div>
      <div>${sectionHead("Customers", "Current and past")}<ul class="pg-table" data-r="2">${CUSTOMERS.map((c) => `<li><b>${c.status === "current" ? "Current" : esc(c.years || "Past")}</b><span>${esc(c.name)}</span></li>`).join("")}</ul></div>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Past performance", "On the record")}
      <ul class="pg-proof">${Object.values(STICKERS).map((s, i) => `<li data-r="${i}"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("")}</ul>
      <ul class="pg-ledger" data-r="2">${LEDGER.map((r) => `<li><span class="d">${esc(r.date)}</span><span class="t">${esc(r.title)}</span><span class="s">${esc(r.stamp)}</span></li>`).join("")}</ul>
    </div></section>
    ${askBand({ title: ["Ready to", "staff it"], lead: "Send a staffing request or call us about a current requirement.", cta: "Request staff", href: "contact.html" })}`;
}

/* =====================================================================
   ABOUT
   ===================================================================== */
function aboutPage(main) {
  main.innerHTML = `
    ${hero({ eb: ABOUT.eyebrow, title: ABOUT.title, intro: ABOUT.intro, actions: btn("Request staff", "contact.html") + btn("Find a job", "jobs.html", true) })}
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Why XcelCareers", "Four reasons clients choose us")}
      <ol class="pg-grid pg-grid--4">${ABOUT.why.map((w, i) => `<li class="pg-card" data-r="${i}"><span class="n">0${i + 1}</span><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></li>`).join("")}</ol>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("Leadership", "125+ years of combined experience")}
      <ul class="pg-team">${LEADERSHIP.map((p, i) => `<li data-r="${i}"><div class="pg-photo">${ph({ quiet: true })}</div><h3>${esc(p.name)}</h3><p>${esc(p.role)}</p></li>`).join("")}</ul>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap pg-split">
      <div>${sectionHead("How we hire", "From open role to day one", "Our process for employers, step by step.")}
        <ol class="pg-steps" data-r="2">${STEPS.map((s, i) => `<li><b>0${i + 1}</b><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join("")}</ol></div>
      <div class="pg-panel" data-r="2"><h3 class="pg-h3">For candidates</h3><ul class="pg-list">${ABOUT.candidates.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>${btn("See example roles", "jobs.html")}</div>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">${sectionHead("Credentials", "Certified in Maryland")}${credStrip()}<p class="pg-small" data-r="2">A minority veteran-owned small business based at ${esc(CONTACT.address)}. Placing people across Maryland, DC and Virginia, and in remote roles.</p></div></section>
    ${askBand({ title: ["Tell us who", "you need"], lead: "One nurse or a full staff augmentation: start with a short request.", cta: "Request staff", href: "contact.html" })}`;
}

/* =====================================================================
   CONTACT: the staffing request (#1 feature), a call, or a job search
   ===================================================================== */
function contactPage(main) {
  const opt = (v) => `<option>${esc(v)}</option>`;
  const R = REQUEST_FORM;
  main.innerHTML = `
    ${hero({ eb: "Get in touch", title: ["Tell us who", "you need"], intro: `Tell us the role, the shifts, the pay range and the license, certification or clearance it needs.` })}
    <section class="pg-sec pg-sec--tight"><div class="pg-wrap pg-contact">
      <div>
        <div class="tabs" role="tablist" data-r="0">
          <button role="tab" aria-selected="true" aria-controls="t-req" id="tb-req">Request staff</button>
          <button role="tab" aria-selected="false" aria-controls="t-call" id="tb-call">Request a call</button>
          <button role="tab" aria-selected="false" aria-controls="t-job" id="tb-job">I'm looking for work</button>
        </div>
        <form class="pg-form pg-panel" id="t-req" role="tabpanel" aria-labelledby="tb-req" data-r="1">
          <div class="f2"><label>Organization<input name="org" required autocomplete="organization"></label><label>Your name<input name="name" required autocomplete="name"></label></div>
          <div class="f2"><label>Your role<input name="role" autocomplete="organization-title"></label><label>Work email<input name="email" type="email" required autocomplete="email"></label></div>
          <div class="f2"><label>Phone<input name="phone" type="tel" autocomplete="tel"></label><label>Type of staff<select name="type">${R.types.map(opt).join("")}</select></label></div>
          <div class="f2"><label>Number of people<select name="count">${R.headcount.map(opt).join("")}</select></label><label>Contract type<select name="contract">${R.contracts.map(opt).join("")}</select></label></div>
          <div class="f2"><label>Shifts and schedule<input name="shifts" placeholder="e.g. nights, 3×12"></label><label>Pay range <span class="opt">optional</span><input name="pay"></label></div>
          <div class="f2"><label>License, certification or clearance<input name="cred" placeholder="e.g. active RN, TS/SCI"></label><label>Work location<select name="loc">${R.locations.map(opt).join("")}</select></label></div>
          <div class="f2"><label>Start date<input name="start" type="date"></label><label>Notes<input name="notes"></label></div>
          <button class="btn" type="submit">Send request${arrow}</button>
        </form>
        <form class="pg-form pg-panel" id="t-call" role="tabpanel" aria-labelledby="tb-call" hidden>
          <p class="pg-small">A short call with client services about a current or upcoming requirement.</p>
          <div class="f2"><label>Your name<input name="name" required></label><label>Work email<input name="email" type="email" required></label></div>
          <div class="f2"><label>Phone<input name="phone" type="tel" required></label><label>Best time<select name="time"><option>Morning</option><option>Midday</option><option>Afternoon</option></select></label></div>
          <label>What is it about?<input name="topic" placeholder="e.g. behavioral health nurses for a county program"></label>
          <button class="btn" type="submit">Request a call${arrow}</button>
        </form>
        <div class="pg-panel" id="t-job" role="tabpanel" aria-labelledby="tb-job" hidden>
          <p class="pg-lead">Browse example healthcare, IT, finance and cyber roles, or send your résumé and we'll match you to open roles. Free for candidates, always.</p>
          <div class="pg-actions">${btn("See example roles", "jobs.html")}${btn("Send your résumé", "jobs.html#resume", true)}</div>
        </div>
      </div>
      <aside class="pg-panel pg-card-contact" data-r="2">
        <p class="eyebrow type-caps"><span class="dot" aria-hidden="true"></span>Client services</p>
        <h3>${esc(CONTACT.name)}</h3><p class="pg-small">${esc(CONTACT.title)}</p>
        <a class="pg-big" href="${tel}">${esc(CONTACT.phone)}</a>
        <a class="pg-mail" href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a>
        <address>${esc(CONTACT.address)}</address>
        <p class="pg-small">${esc(CONTACT.ids)}</p>
      </aside>
    </div></section>
    <section class="pg-sec"><div class="pg-wrap">
      ${sectionHead("What happens next", "From request to short list")}
      <ol class="pg-grid pg-grid--4">${STEPS.map((s, i) => `<li class="pg-card" data-r="${i}"><span class="n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
    </div></section>`;
  // carried over from the short form on the home page
  const q = new URLSearchParams(location.search), req = $("#t-req");
  if (q.get("org")) req.org.value = q.get("org");
  if (q.get("email")) req.email.value = q.get("email");
  if (q.get("role")) req.notes.value = `Role: ${q.get("role")}`;
  const tabs = $$('[role="tab"]');
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); $("#" + x.getAttribute("aria-controls")).hidden = !on; });
  }));
  $$("form", main).forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); f.reset();
    toast(`Nothing was sent: this form isn't connected yet. Email ${CONTACT.email} or call ${CONTACT.phone}.`);
  }));
}

/* =====================================================================
   SIGN IN / CREATE ACCOUNT (candidates only, prototype)
   ===================================================================== */
const googleG = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;
function loginPage(main) {
  const next = new URLSearchParams(location.search).get("next") || "account.html";
  const go = () => (location.href = next);
  if (currentUser()) { location.replace("account.html"); return; }
  main.innerHTML = `
    <section class="pg-hero pg-auth"><div class="pg-wrap pg-auth-in">
      <div>
        ${eyebrow("For candidates")}
        ${headline(["Your next role,", "one place"])}
        <ul class="pg-list" data-r="2"><li>Apply to roles with your saved résumé</li><li>Save roles and track your applications</li><li>Keep your license, certification or clearance details on file</li></ul>
        <p class="pg-small" data-r="3">Hiring? You do not need an account. <a href="contact.html">Send a staffing request</a>.</p>
      </div>
      <div class="pg-panel auth" data-r="2">
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="true" data-mode="in">Sign in</button>
          <button role="tab" aria-selected="false" data-mode="up">Create account</button>
        </div>
        <button class="gbtn" type="button" id="g-btn">${googleG}<span>Continue with Google</span></button>
        <p class="or"><span>or with email</span></p>
        <form class="pg-form" id="auth-form" novalidate>
          <label class="up-only" hidden>Full name<input name="name" autocomplete="name"></label>
          <label>Email<input name="email" type="email" required autocomplete="email"></label>
          <label>Password<input name="password" type="password" required minlength="8" autocomplete="current-password"></label>
          <p class="err" id="auth-err" role="alert"></p>
          <button class="btn" type="submit" id="auth-go">Sign in${arrow}</button>
          <a class="pg-small in-only" href="#" id="forgot">Forgot your password?</a>
        </form>
        ${notice("Accounts are not live yet. Details you enter stay in this browser and are not sent anywhere. Google sign-in is not connected.")}
      </div>
    </div></section>`;
  let mode = "in";
  const form = $("#auth-form"), err = $("#auth-err");
  $$("[data-mode]").forEach((t) => t.addEventListener("click", () => {
    mode = t.dataset.mode;
    $$("[data-mode]").forEach((x) => x.setAttribute("aria-selected", x === t));
    $$(".up-only").forEach((x) => (x.hidden = mode !== "up"));
    $$(".in-only").forEach((x) => (x.hidden = mode !== "in"));
    $("#auth-go").firstChild.textContent = mode === "up" ? "Create account" : "Sign in";
    form.password.autocomplete = mode === "up" ? "new-password" : "current-password";
    err.textContent = "";
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim(), pw = form.password.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "Enter a valid email address."; return; }
    if (pw.length < 8) { err.textContent = "Use at least 8 characters for the password."; return; }
    if (mode === "up") signUp({ name: form.name.value.trim(), email }); else signIn({ email });
    go();
  });
  $("#g-btn").addEventListener("click", () => { signInWithGoogle(); go(); });
  $("#forgot").addEventListener("click", (e) => { e.preventDefault(); toast("Password reset is not available yet."); });
}

/* =====================================================================
   CANDIDATE ACCOUNT (prototype)
   ===================================================================== */
function accountPage(main) {
  const u = currentUser();
  if (!u) { location.replace("login.html?next=account.html"); return; }
  const job = (id) => JOBS.find((j) => j.id === id);
  const opt = (v, cur) => `<option${v === cur ? " selected" : ""}>${esc(v)}</option>`;
  const draw = () => {
    const u = currentUser();
    main.innerHTML = `
      <section class="pg-hero pg-hero--short"><div class="pg-wrap">
        ${eyebrow(u.provider === "google" ? "Signed in with Google" : "Your account")}
        ${headline(["Welcome,", (u.name || "there").split(" ")[0]])}
        <div class="pg-actions" data-r="2">${btn("See example roles", "jobs.html")}<button class="btn btn--ghost" type="button" id="out">Sign out</button></div>
      </div></section>
      <section class="pg-sec pg-sec--tight"><div class="pg-wrap">${notice("Accounts are not live yet. This profile stays in this browser and is not sent anywhere.")}</div></section>
      <section class="pg-sec"><div class="pg-wrap pg-split">
        <form class="pg-form pg-panel" id="profile" data-r="1">
          <h3 class="pg-h3">Profile</h3>
          <div class="f2"><label>Full name<input name="name" value="${esc(u.name)}"></label><label>Email<input name="email" type="email" value="${esc(u.email)}"></label></div>
          <div class="f2"><label>Phone<input name="phone" type="tel" value="${esc(u.phone)}"></label><label>Location<select name="location"><option value="">Choose</option>${REQUEST_FORM.locations.map((l) => opt(l, u.location)).join("")}</select></label></div>
          <div class="f2"><label>Field<select name="field"><option value="">Choose</option>${["Healthcare", "IT", "Finance", "Cybersecurity", "Other"].map((l) => opt(l, u.field)).join("")}</select></label><label>License, certification or clearance<input name="credential" value="${esc(u.credential)}" placeholder="e.g. RN (MD), TS/SCI"></label></div>
          <label class="file">Résumé${u.resume ? ` (on file: ${esc(u.resume)})` : ""}<input name="resume" type="file" accept=".pdf,.doc,.docx"></label>
          <button class="btn" type="submit">Save profile${arrow}</button>
        </form>
        <div>
          <div class="pg-panel" data-r="2"><h3 class="pg-h3">Applications</h3>
            ${u.applied.length ? `<ul class="pg-table">${u.applied.map((a) => `<li><b>${new Date(a.at).toLocaleDateString()}</b><span>${esc(job(a.id)?.title || a.id)}</span></li>`).join("")}</ul>` : `<p class="pg-small">Applications are not available yet. Send your résumé from the <a href="jobs.html#resume">jobs page</a>.</p>`}
          </div>
          <div class="pg-panel" data-r="3"><h3 class="pg-h3">Saved roles</h3>
            ${u.saved.length ? `<ul class="pg-table">${u.saved.map((id) => `<li><b>${esc(job(id)?.fn || "")}</b><span><a href="jobs.html#job-${id}">${esc(job(id)?.title || id)}</a></span></li>`).join("")}</ul>` : `<p class="pg-small">Save roles from the <a href="jobs.html">jobs page</a> to see them here.</p>`}
          </div>
        </div>
      </div></section>`;
    $("#out").addEventListener("click", () => { signOut(); location.href = "index.html"; });
    $("#profile").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, file = f.resume.files[0];
      update({ name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), location: f.location.value, field: f.field.value, credential: f.credential.value.trim(), ...(file ? { resume: file.name } : {}) });
      toast("Profile saved in this browser.");
      draw();
      main.querySelectorAll("[data-r]").forEach((x) => x.classList.add("is-in"));
    });
  };
  draw();
}

/* ---------- boot ---------- */
const RENDER = {
  healthcare: (m) => servicePage(m, "healthcare"),
  government: (m) => servicePage(m, "government"),
  specialists: (m) => servicePage(m, "specialists"),
  jobs: jobsPage, capability: capabilityPage, about: aboutPage, contact: contactPage, login: loginPage, account: accountPage,
};
initPage(RENDER[page] || (() => {}));
