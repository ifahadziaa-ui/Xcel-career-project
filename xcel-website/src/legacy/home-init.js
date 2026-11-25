// @ts-nocheck
/* =====================================================================
   ENTRY: render content → build showreel → start motion → preloader.
   ===================================================================== */
import {
  CERT_LINE, CERTS, CREDENTIALS, CUSTOMERS, STEPS, PROCESS_SPLIT, JOBS, FEATURED_JOB, JOBS_NOTE,
  CAPABILITY, STICKERS, LEDGER, FAQ, FAQ_NOTE, CONTACT,
} from "@/content/content";
import { ph, esc } from "./ph.js";
import { initShowreel } from "./showreel.js";
import {
  registerReveals, releaseReveals, initParallax,
} from "./motion.js";
import { initChat } from "./chat";
import { initHeroReel } from "./heroreel.js";
import { watchVideos } from "./video.js";
import { initJustify } from "./justify.js";


export function initHome({ lenis }) {
const $ = (s) => document.querySelector(s);

/* ---------- film grain (generated, no image file) ---------- */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.25 -0.62'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
document.querySelectorAll(".grain-tex").forEach((g) => (g.style.backgroundImage = GRAIN));

/* ---------- 02 certifications + customers ---------- */
$("#certs-title").innerHTML = `${esc(CERT_LINE.text)}: <span class="hi">${esc(CERT_LINE.id)}</span>`;
const CERT_IMG = {
  MBE: { src: "assets/img/cert-mbe.webp", alt: "Minority Business Enterprise (MBE) certification badge" },
  DBE: { src: "assets/img/cert-dbe.webp", alt: "Disadvantaged Business Enterprise (DBE) certification badge" },
  SBE: { src: "assets/img/cert-sbe.webp", alt: "Small Business Enterprise (SBE) certification badge" },
};
$("#certs-badges").innerHTML = CERTS.map((c, i) => `
  <li class="badge" data-m="sticker" data-i="${i}">
    ${CERT_IMG[c.code]
      ? `<img class="badge-img" src="${CERT_IMG[c.code].src}" alt="${esc(CERT_IMG[c.code].alt)}" loading="lazy" decoding="async" draggable="false">`
      : `<span class="badge-seal" role="img" aria-label="${esc(c.name)} badge placeholder"><span class="code">${esc(c.code)}</span><span class="art">official badge</span></span>`}
  </li>`).join(""); // contract vehicles: not shown until the client confirms them
// only logos the client has approved (Q20) are shown; every other customer is shown as a name tile
const CUST_LOGO = {
  "Montgomery County Government": { src: "assets/img/logo-montgomery.webp", alt: "Montgomery County, Maryland seal" },
  "Prince George's County Government (OIT)": { src: "assets/img/logo-pg-county.webp", alt: "Prince George's County, Maryland seal" },
  "Raytheon Technologies": { src: "assets/img/logo-raytheon.webp", alt: "Raytheon Technologies logo" },
  "Pearson": { src: "assets/img/logo-pearson.webp", alt: "Pearson logo" },
  "Indeed": { src: "assets/img/logo-indeed.webp", alt: "Indeed logo" },
  "Smile Brands": { src: "assets/img/logo-smilebrands.webp", alt: "Smile Brands logo" },
  "NGA": { src: "assets/img/logo-nga.webp", alt: "National Geospatial-Intelligence Agency seal" },
  "Navy Federal Credit Union": { src: "assets/img/logo-navyfederal.webp", alt: "Navy Federal Credit Union logo" },
  "GD Mission Systems": { src: "assets/img/logo-gdms.webp", alt: "GD Mission Systems logo" },
  "U.S. House of Representatives": { src: "assets/img/logo-house.webp", alt: "Seal of the U.S. House of Representatives" },
};
// every logo is a plain, equal tile; the names live in the alt text (the Capstone name tile carries its own name)
$("#customers").innerHTML = CUSTOMERS.map((c, i) => `
  <li class="cust" data-m="chip" data-i="${i % 6}">
    ${CUST_LOGO[c.name]
      ? `<div class="cust-logo cust-logo--mark"><img src="${CUST_LOGO[c.name].src}" alt="${esc(CUST_LOGO[c.name].alt)}" decoding="async" draggable="false"></div>`
      : `<div class="cust-logo cust-logo--name"><span>${esc(c.name)}</span></div>`}
  </li>`).join("");

const C = CREDENTIALS;
$("#certs-note").textContent = `Maryland MBE, DBE and SBE · No. ${C.certNo} · since ${C.since} · UEI ${C.uei}`;

/* ---------- 04 process steps ---------- */
$("#steps").innerHTML = STEPS.map((s, i) => `
  <li class="step-box">
    <article class="step" data-m="step" data-i="${i}">
      <div class="step-top"><p class="type-display step-num" aria-hidden="true">0${i + 1}</p></div>
      <h3 class="type-display">${esc(s.title)}</h3>
      <p class="txt">${esc(s.text)}</p>
      <p class="type-caps stats">${s.stats.map(([k, v]) => `${esc(k)} <span class="v">${esc(v)}</span>`).join("   ")}</p>
    </article>
  </li>`).join("");

$("#process-split").textContent = PROCESS_SPLIT;

/* ---------- 05 open roles: five-card fan ---------- */
$("#jobs-note").textContent = JOBS_NOTE;
// desktop/tablet positions in % of the 1232-wide fan (cqw); mobile in % of the 350 column
const FAN = [
  { cls: "far", l: 4.71, t: 9.86, w: 19.16, r: -16, px: 10, tilt: -3, ml: 0, mt: 0, mw: 0 },
  { cls: "far", l: 76.14, t: 9.86, w: 19.16, r: 16, px: 7, tilt: 3, ml: 0, mt: 0, mw: 0 },
  { cls: "side", l: 19.89, t: 3.57, w: 21.92, r: -8, px: -4, tilt: -2.5, ml: 2.43, mt: 10.3, mw: 36.6 },
  { cls: "side", l: 58.2, t: 3.57, w: 21.92, r: 8, px: -7, tilt: 2.5, ml: 61.3, mt: 10.3, mw: 36.6 },
  { cls: "centre", l: 37.62, t: 0, w: 24.84, r: 1.5, px: -12, tilt: 1, ml: 31.7, mt: 2.1, mw: 36.6 },
];
const FAN_JOB = [0, 4, 1, 3, FEATURED_JOB]; // which job sits in which slot; centre = featured
// real photos for the jobs that have one; the rest keep their placeholder
const JOB_IMG = {
  "case-manager-hhs": { src: "assets/img/hc-long-term.webp", alt: "A nurse caring for an older patient", pos: "50% 40%" },
  "ehr-admin": { src: "assets/img/spec-it.webp", alt: "Two IT colleagues working through a problem on a laptop", pos: "78% 40%" },
  "rn-behavioral": { src: "assets/img/hc-nurse-care.webp", alt: "A clinician in gloves giving an injection", pos: "50% 40%" },
  "revenue-cycle": { src: "assets/img/spec-analytics.webp", alt: "An analytics dashboard on a laptop screen", pos: "40% 50%" },
  "cyber-engineer": { src: "assets/img/spec-cyber.webp", alt: "Racks of network and server equipment", pos: "50% 50%" },
};
const jobCard = (j) => `
  <div class="jobcard"><div class="jc-in">
    <div class="jc-top"><span class="jc-fn">${esc(j.fn)}</span><svg class="jc-x" aria-hidden="true"><use href="#i-mark"/></svg></div>
    <div class="jc-art">${ph({ kind: "loop", what: j.art, ...(JOB_IMG[j.id] || {}) })}</div>
    <h3 class="jc-title">${esc(j.title)}</h3>
    <p class="jc-meta">${esc(j.where)}</p>
    <p class="jc-stats"><span>${esc(j.need[0])} <b>${esc(j.need[1])}</b></span><span><b>${esc(j.type)}</b></span></p>
  </div></div>`;
$("#fan").innerHTML = FAN.map((f, i) => `
  <div class="fan-card fan-card--${f.cls}" style="--l:${f.l};--t:${f.t};--w:${f.w};--r:${f.r}deg;--ml:${f.ml};--mt:${f.mt};--mw:${f.mw}">
    <div class="tilt" data-px="${f.px}" data-tilt="${f.tilt}" style="width:100%;height:100%"><div class="px">
      <div class="card-reveal" data-m="card" data-i="${i}"><div class="card-rot">${jobCard(JOBS[FAN_JOB[i]])}</div></div>
    </div></div>
  </div>`).join("");
const fj = JOBS[FEATURED_JOB];
$("#fan-stats").innerHTML = [["Role", fj.title], fj.need, ["Location", fj.where], ["Type", fj.type]]
  .map(([k, v]) => `<span class="pair">${esc(k)} <span class="v">${esc(v)}</span></span>`).join("");

/* ---------- 06 capability statement poster ---------- */
$("#cap-art").innerHTML = `<div class="capdoc"><div class="capdoc-in">
  <div class="capdoc-head"><svg class="capdoc-mark" aria-hidden="true"><use href="#i-mark"/></svg><span>XcelCareers</span><span class="capdoc-tag">Capability statement</span></div>
  <h4>Healthcare staffing and government contracting</h4>
  <p>Minority veteran-owned small business. Maryland MBE, DBE and SBE certified.</p>
  <dl>
    <div><dt>CAGE</dt><dd>${esc(CREDENTIALS.cage)}</dd></div>
    <div><dt>UEI</dt><dd>${esc(CREDENTIALS.uei)}</dd></div>
    <div><dt>Certified</dt><dd>No. ${esc(CREDENTIALS.certNo)}, since ${esc(CREDENTIALS.since)}</dd></div>
    <div><dt>NAICS</dt><dd>${CREDENTIALS.naics.map((n) => esc(n.code)).join(" · ")}</dd></div>
    <div><dt>Where</dt><dd>Maryland, DC, Virginia and remote</dd></div>
  </dl>
  <div class="capdoc-badges">${CERTS.map((c) => (CERT_IMG[c.code] ? `<img src="${CERT_IMG[c.code].src}" alt="${esc(CERT_IMG[c.code].alt)}" loading="lazy" decoding="async" draggable="false">` : "")).join("")}</div>
  <footer>${esc(CONTACT.address)} · ${esc(CONTACT.phone)}</footer>
</div></div>`;
$("#cap-points").innerHTML = CAPABILITY.points.map((p, i) => `<li><span class="bul" aria-hidden="true"></span><p data-m="copy" data-i="${i}">${esc(p)}</p></li>`).join("");
$("#cap-meta").innerHTML = `${esc(CAPABILITY.meta[0])}  ·  <span class="v">${esc(CAPABILITY.meta[1])}</span>`;
$("#cap-pdf").setAttribute("href", CREDENTIALS.pdf);

/* ---------- 07 record: stickers + ledger ---------- */
// positions in cqw of the 1232-wide holder (desktop design coordinates)
$("#stickers").innerHTML = `
  <div class="stk stk--paper" style="--l:-0.49;--t:16.4;--w:34.9;--h:17.05;--r:4deg">
    <div class="stk-in" data-m="sticker" data-i="0"><span class="acc-block"></span><span class="paper"></span>
      <span class="stk-lbl">${esc(STICKERS.paper.label)}</span><span class="stk-val">${esc(STICKERS.paper.value)}</span></div>
  </div>
  <div class="stk stk--accent" style="--l:37.3;--t:12.3;--w:30.84;--h:18.67;--r:-3deg">
    <div class="stk-in" data-m="sticker" data-i="1"><span class="stk-lbl">${esc(STICKERS.accent.label)}</span><span class="stk-val">${esc(STICKERS.accent.value)}</span></div>
  </div>
  <div class="stk stk--dark" style="--l:68.26;--t:19.97;--w:19.48;--h:17.05;--r:3deg">
    <div class="stk-in" data-m="sticker" data-i="2"><span class="stk-lbl">${esc(STICKERS.dark.label)}</span><span class="stk-val">${esc(STICKERS.dark.value)}</span></div>
  </div>
  <div class="stk stk--ring" style="--l:81.98;--t:1.46;--w:20.29;--h:20.29;--r:-9deg">
    <div class="stk-in" data-m="sticker" data-i="3"><span class="ring-outer"></span><span class="ring-inner"></span>
      <span class="stk-val">${esc(STICKERS.ring.value)}</span><span class="stk-lbl">${esc(STICKERS.ring.label)}</span></div>
  </div>`;
$("#ledger").innerHTML = LEDGER.map((r, i) => `
  <li data-m="ledger" data-i="${i}">
    <span class="type-caps lg-date">${esc(r.date)}</span>
    <span class="type-caps lg-title">${esc(r.title)}</span>
    <span class="type-caps lg-ref">${esc(r.ref)}</span>
    <span class="lg-stamp-box" style="rotate:${r.rot}deg"><span class="type-display lg-stamp" data-m="stamp" data-i="${i}">${esc(r.stamp)}</span></span>
  </li>`).join("");

/* ---------- 08 FAQ (native one-open-at-a-time accordion) ---------- */
$("#faq-list").innerHTML = FAQ.map((f, i) => `
  <details name="faq"${i === 0 ? " open" : ""}>
    <summary><span class="type-caps q">${esc(f.q)}</span><svg class="ico" aria-hidden="true"><use class="plus" href="#i-plus"/><use class="minus" href="#i-close"/></svg></summary>
    <p class="a" data-m="faq">${esc(f.a)}</p>
  </details>`).join("");

$("#faq-note").textContent = FAQ_NOTE;

/* ---------- 09 contact + footer ---------- */
$("#join-fine").innerHTML = `Call ${esc(CONTACT.phone)}  ·  ${esc(CONTACT.email)}
${esc(CONTACT.name)}, ${esc(CONTACT.title)}`;
/* the home request form hands off to /contact (org, role and email arrive prefilled); it only checks the fields first */
const joinForm = $("#join-form"), joinMsg = $("#join-msg");
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const joinFields = [
  [$("#join-org"), () => "Enter your organization so we know who is asking."],
  [$("#join-role"), () => "Tell us the role you need, for example RN or behavioral health."],
  [$("#join-email"), (v) => (v ? "That doesn't look like an email address. Check it and try again." : "Enter your work email so we know where to reach you.")],
];
const joinClear = () => { joinFields.forEach(([el]) => el.removeAttribute("aria-invalid")); joinMsg.hidden = true; };
joinForm.addEventListener("submit", (e) => {
  for (const [el, msg] of joinFields) {
    const v = el.value.trim();
    if (v && (el.type !== "email" || EMAIL_OK.test(v))) continue;
    e.preventDefault();
    joinClear();
    el.setAttribute("aria-invalid", "true");
    joinMsg.textContent = msg(v); joinMsg.dataset.state = "error"; joinMsg.setAttribute("role", "alert"); joinMsg.hidden = false;
    el.focus();
    return;
  } // all three filled: the form goes on to /contact
});
joinFields.forEach(([el]) => el.addEventListener("input", () => { if (el.getAttribute("aria-invalid")) joinClear(); }));
$("#join-art").innerHTML = ph({ kind: "photo", what: "Barry Klasson or the client services team, real photo", note: "Portrait 3:4 · no stock" });

/* ---------- showreel ---------- */
const sr = initShowreel($("#services"));
watchVideos();
initJustify();

/* ---------- smooth scroll (Lenis is created by the app's SmoothScroll component) ---------- */
history.scrollRestoration = "manual";
scrollTo(0, 0);
const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
sr.attachSnap(lenis); // sideways input steps the carousel and the staffing strip
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  lenis.scrollTo(target, { offset: id === "#top" ? 0 : -($("#site-header")?.offsetHeight || 0), immediate: reduceMQ.matches });
}));

/* ---------- motion ---------- */
const fontsReady = document.fonts.ready;
initParallax();
initChat({ lenis });
initHeroReel();
fontsReady.then(() => { registerReveals(); sr.measure(); releaseReveals(); });

}
