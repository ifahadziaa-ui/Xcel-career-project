/* =====================================================================
   ENTRY: render content → build showreel → start motion → preloader.
   ===================================================================== */
import Lenis from "lenis";
import {
  CERT_LINE, CERTS, CREDENTIALS, CUSTOMERS, STEPS, PROCESS_SPLIT, JOBS, FEATURED_JOB, JOBS_NOTE,
  CAPABILITY, STICKERS, LEDGER, FAQ, FAQ_NOTE, CONTACT,
} from "./content.js?v=3";
import { ph, esc } from "./ph.js?v=3";
import { initShowreel } from "./showreel.js?v=3";
import {
  registerReveals, releaseReveals, initParallax, runPreloader, initHeader,
} from "./motion.js?v=3";
import { initChat } from "./chat.js?v=3";

const $ = (s) => document.querySelector(s);

/* ---------- film grain (generated, no image file) ---------- */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.25 -0.62'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
document.querySelectorAll(".grain-tex").forEach((g) => (g.style.backgroundImage = GRAIN));

/* ---------- 02 certifications + customers ---------- */
$("#certs-title").innerHTML = `${esc(CERT_LINE.text)}: <span class="hi">${esc(CERT_LINE.id)}</span>`;
$("#certs-badges").innerHTML = CERTS.map((c, i) => `
  <li class="badge" data-m="sticker" data-i="${i}">
    <span class="badge-seal" role="img" aria-label="${esc(c.name)} badge placeholder"><span class="code">${esc(c.code)}</span><span class="art">official badge</span></span>
    <span class="badge-name">${esc(c.name)}</span>
  </li>`).join("") + `
  <li class="badge badge--add" data-m="sticker" data-i="${CERTS.length}">
    <span class="badge-seal"><span class="code">+</span></span>
    <span class="badge-name">Contract vehicles (to confirm)</span>
  </li>`;
$("#customers").innerHTML = CUSTOMERS.map((c, i) => `
  <li class="cust" data-m="chip" data-i="${i % 6}">
    <div class="cust-logo">${ph({ kind: "logo", what: "Official logo" })}</div>
    <span class="cust-name">${esc(c.name)}</span>
    ${c.status ? `<span class="cust-tag">${c.status === "current" ? "Current" : "Past"}</span>` : ""}
  </li>`).join("");

const C = CREDENTIALS;
$("#certs-note").textContent = `Certified by the ${C.certifier} · No. ${C.certNo} · since ${C.since} · UEI ${C.uei} · NAICS ${C.naics.map((n) => n.code).join(", ")}`;

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
const jobCard = (j) => `
  <div class="jobcard"><div class="jc-in">
    <div class="jc-top"><span class="jc-fn">${esc(j.fn)}</span><svg class="jc-x" aria-hidden="true"><use href="#i-mark"/></svg></div>
    <div class="jc-art">${ph({ kind: "loop", what: j.art })}</div>
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
$("#cap-art").innerHTML = ph({ kind: "photo", what: CAPABILITY.art, note: "From the client's PDF · portrait 3:4", tone: "light" });
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
/* the email teaser: validates, never sends (no backend yet) */
const joinForm = $("#join-form"), joinEmail = $("#join-email"), joinMsg = $("#join-msg");
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const joinSay = (text, state) => {
  joinMsg.textContent = text;
  joinMsg.dataset.state = state;
  joinMsg.setAttribute("role", state === "error" ? "alert" : "status");
  joinMsg.hidden = false;
};
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = joinEmail.value.trim();
  if (!v) { joinEmail.setAttribute("aria-invalid", "true"); joinSay("Enter your work email so we know where to reach you.", "error"); joinEmail.focus(); return; }
  if (!EMAIL_OK.test(v)) { joinEmail.setAttribute("aria-invalid", "true"); joinSay("That doesn't look like an email address. Check it and try again.", "error"); joinEmail.focus(); return; }
  joinEmail.removeAttribute("aria-invalid");
  joinSay("The request form isn't connected yet, so nothing was sent.", "note");
});
joinEmail.addEventListener("input", () => {
  if (joinEmail.getAttribute("aria-invalid")) { joinEmail.removeAttribute("aria-invalid"); joinMsg.hidden = true; }
});
$("#join-art").innerHTML = ph({ kind: "photo", what: "Barry Klasson or the client services team, real photo", note: "Portrait 3:4 · no stock" });
$("#footer-address").textContent = CONTACT.address;
$("#footer-legal").textContent = CONTACT.legal;
$("#footer-ids").textContent = CONTACT.ids;

/* ---------- showreel ---------- */
const sr = initShowreel($("#services"));

/* ---------- smooth scroll ---------- */
history.scrollRestoration = "manual";
scrollTo(0, 0);
const lenis = new Lenis({ smoothWheel: true });
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
window.__proto = { lenis }; // handy for debugging in the console
sr.attachSnap(lenis); // sideways input steps the carousel and the staffing strip
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  // land each section just below the fixed top bar
  lenis.scrollTo(target, { offset: id === "#top" ? 0 : -$("#site-header").offsetHeight });
}));

/* ---------- motion ---------- */
const fontsReady = document.fonts.ready;
initParallax();
initHeader($(".hx-hero"));
initChat({ lenis });

const pileCards = [
  ph({ kind: "photo", what: "Nurse portrait" }),
  ph({ kind: "photo", what: "Case manager" }),
  ph({ kind: "photo", what: "EHR administrator" }),
  ph({ kind: "photo", what: "Budget analyst" }),
];

fontsReady.then(() => registerReveals());
runPreloader({
  lenis,
  cardsHTML: pileCards,
  ready: fontsReady,
  onRelease: () => { sr.measure(); releaseReveals(); },
});
