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
  registerReveals, releaseReveals, initParallax, initSpray, buildDrips, runPreloader, initHeader, initMenu,
} from "./motion.js?v=3";
import { initChat } from "./chat.js?v=3";

const $ = (s) => document.querySelector(s);
const crown = `<svg class="crown"><use href="#i-crown"/></svg>`;

/* ---------- film grain (generated, no image file) ---------- */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.25 -0.62'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
document.querySelectorAll(".grain-tex").forEach((g) => (g.style.backgroundImage = GRAIN));

/* ---------- barbed wire, drawn in code ---------- */
function wireSVG(sample, { w, h, amp = 4.5, twist = 0.085, barbEvery = 64, barbLen = 12, uid }) {
  // sample(t) → [x, y] along the base curve, t in 0..1
  const N = 900, pts = [];
  for (let i = 0; i <= N; i++) pts.push(sample(i / N));
  const len = [0];
  for (let i = 1; i <= N; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const nrm = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    return [-dy / m, dx / m, dx / m, dy / m];
  });
  const strand = (sign) => pts.map((p, i) => {
    const o = sign * amp * Math.sin(len[i] * twist);
    return `${(p[0] + nrm[i][0] * o).toFixed(1)},${(p[1] + nrm[i][1] * o).toFixed(1)}`;
  }).join(" ");
  let barbs = "";
  for (let s = barbEvery * 0.6; s < len[N]; s += barbEvery) {
    let i = len.findIndex((L) => L >= s); if (i < 0) break;
    const [x, y] = pts[i], [nx, ny, tx, ty] = nrm[i];
    for (const ang of [55, -55]) {
      const r = (ang * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r);
      const dx = tx * c - ty * sn, dy = tx * sn + ty * c;
      barbs += `<path d="M${(x - dx * barbLen).toFixed(1)} ${(y - dy * barbLen).toFixed(1)} L${(x + dx * barbLen).toFixed(1)} ${(y + dy * barbLen).toFixed(1)}"/>`;
    }
    barbs += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="st${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f3f5"/><stop offset=".55" stop-color="#a7a7a9"/><stop offset="1" stop-color="#4c4c4e"/></linearGradient></defs>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="${strand(1)}" stroke="#232325" stroke-width="5.4"/>
      <polyline points="${strand(-1)}" stroke="#232325" stroke-width="5.4"/>
      <polyline points="${strand(1)}" stroke="url(#st${uid})" stroke-width="3.2"/>
      <polyline points="${strand(-1)}" stroke="url(#st${uid})" stroke-width="3.2"/>
      <g stroke="#d0d0d2" stroke-width="2.6" fill="#909092">${barbs}</g>
    </g></svg>`;
}
let wireId = 0;
const strandA = (t) => [-40 + t * 1720, 230 + 120 * Math.sin(t * Math.PI * 1.25 + 0.35) - 60 * t];
const strandB = (t) => [-40 + t * 1720, 170 + 110 * Math.sin(t * Math.PI * 1.1 + 2.2) + 40 * t];
const arc = (t) => { const a = ((110 + t * 180) * Math.PI) / 180; return [500 + 440 * Math.cos(a), 500 + 440 * Math.sin(a)]; };
document.querySelectorAll("[data-wire]").forEach((el) => {
  const kind = el.dataset.wire;
  el.innerHTML = kind === "arc"
    ? wireSVG(arc, { w: 1000, h: 1000, uid: ++wireId })
    : wireSVG(kind === "strand2" ? strandB : strandA, { w: 1640, h: 400, uid: ++wireId });
});

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
      <div class="step-top"><p class="type-display step-num" aria-hidden="true">0${i + 1}</p>${crown}</div>
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
// four wire arcs around the poster (section-relative), with parallax
const ARCS = [
  { r: 4, top: 2.125, left: 33.375, size: 70.7, px: 8, show: "d" },
  { r: -176, top: 0.875, left: -16.625, size: 70.7, px: -6, show: "d" },
  { r: -86, top: -23.125, left: 9, size: 72.06, px: 12, show: "a" },
  { r: 94, top: 24.875, left: 6.5, size: 72.06, px: -9, show: "a" },
];
$("#arcs").innerHTML = ARCS.map((a) => `
  <div class="arc arc--${a.show}" style="top:${a.top + 2}rem;left:${a.left}rem;width:${a.size}rem;height:${a.size}rem">
    <div class="tilt" data-px="${a.px}" style="width:100%;height:100%"><div class="px" style="rotate:${a.r}deg" data-wire="arc"></div></div>
  </div>`).join("");
document.querySelectorAll("#arcs [data-wire]").forEach((el) => (el.innerHTML = wireSVG(arc, { w: 1000, h: 1000, uid: ++wireId })));

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
  </div>
  <div class="stk-crown" style="--l:35.5;--t:10.3" aria-hidden="true">${crown}</div>`;
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
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  lenis.scrollTo(target, { offset: id === "#top" ? 0 : -10 });
}));

/* ---------- motion ---------- */
buildDrips();
const fontsReady = document.fonts.ready;
initParallax();
initSpray();
initHeader($(".hx-hero"));
initMenu(lenis);
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
