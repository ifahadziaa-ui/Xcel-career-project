/* =====================================================================
   SHARED CHROME FOR THE INNER PAGES (jobs, healthcare, government, ...).
   The home page (index.html) builds its own; both share the same top bar,
   footer, chatbot, smooth scroll and type scale.
   ===================================================================== */
import "./sprite.js?v=3";
import Lenis from "lenis";
import { NAV, CONTACT } from "./content.js?v=3";
import { esc } from "./ph.js?v=3";
import { initHeader, reduced } from "./motion.js?v=3";
import { initChat } from "./chat.js?v=3";
import { currentUser } from "./auth.js?v=3";
import { initPauseToggle } from "./pause.js?v=3";
import { initJustify } from "./justify.js?v=3";

const here = location.pathname.split("/").pop() || "index.html";

export const arrow = `<svg aria-hidden="true"><use href="#i-arrow"/></svg>`;
export const mark = (cls) => `<svg class="${cls}" aria-hidden="true"><use href="#i-mark"/></svg>`;
export const tel = "tel:+1" + CONTACT.phone.replace(/\D/g, "");

/* the top bar: the hero's bar, same markup on every page */
export function navHTML({ hidden = false } = {}) {
  const ti = hidden ? ' tabindex="-1"' : "";
  return `
    <a${ti} href="index.html" class="hx-logo" aria-label="XcelCareers home">${mark("hx-mark")}XcelCareers<span class="hx-reg" aria-hidden="true">®</span></a>
    <nav class="hx-nav" aria-label="Primary"><ul>${NAV.map((n) => `<li><a${ti} href="${n.href}"${n.href === here ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="hx-end">
      <button${ti} type="button" class="mo-toggle" id="mo-toggle" aria-pressed="false" aria-label="Pause animations">
        <svg class="ic-pause" aria-hidden="true" viewBox="0 0 12 12"><rect x="2" y="1.5" width="2.8" height="9" rx="0.6"/><rect x="7.2" y="1.5" width="2.8" height="9" rx="0.6"/></svg>
        <svg class="ic-play" aria-hidden="true" viewBox="0 0 12 12"><path d="M3 1.6v8.8L10.4 6z"/></svg>
      </button>
      <p class="hx-status"><a${ti} class="hx-account" href="login.html" data-account>Sign in</a><span class="hx-live">Now staffing</span></p>
    </div>`;
}

export function footerHTML() {
  return `
  <footer class="footer">
    <div class="footer-rule"></div>
    <div class="footer-main">
      <div class="footer-brand">
        <a href="index.html" class="footer-logo">${mark("footer-mark")}XcelCareers<span class="reg" aria-hidden="true">®</span></a>
        <address class="type-caps">${esc(CONTACT.address)}<br><a href="${tel}">${esc(CONTACT.phone)}</a> · <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></address>
      </div>
      <div class="footer-cols">
        <nav aria-label="Employers"><p class="type-caps ttl">Employers</p><ul><li><a href="healthcare.html">Healthcare staffing</a></li><li><a href="government.html">Government contracting</a></li><li><a href="specialists.html">IT · Finance · Cyber</a></li><li><a href="contact.html">Request staff</a></li></ul></nav>
        <nav aria-label="Candidates"><p class="type-caps ttl">Candidates</p><ul><li><a href="jobs.html">Jobs</a></li><li><a href="jobs.html#resume">Upload résumé</a></li><li><a href="login.html">Sign in</a></li></ul></nav>
        <nav aria-label="Company"><p class="type-caps ttl">Company</p><ul><li><a href="about.html">About</a></li><li><a href="capability.html">Capability statement</a></li><li><a href="contact.html">Contact</a></li></ul></nav>
      </div>
    </div>
    <div class="footer-legal type-caps"><p>${esc(CONTACT.legal)}</p><p>${esc(CONTACT.ids)}</p></div>
    <p class="type-display footer-word" aria-hidden="true">XcelCareers</p>
  </footer>`;
}

/* "Sign in" becomes "My account" once a (prototype) account exists in this browser */
export function syncAccountLinks() {
  const u = currentUser();
  document.querySelectorAll("[data-account]").forEach((a) => {
    a.textContent = u ? "My account" : "Sign in";
    a.href = u ? "account.html" : "login.html";
  });
}
addEventListener("xc-account", syncAccountLinks);

/* entrances: one shared rise, played once when the element enters the view */
function initReveals(root = document) {
  const els = [...root.querySelectorAll("[data-r]")];
  if (reduced()) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e, i) => { e.style.setProperty("--d", `${(Number(e.dataset.r) || 0) * 70}ms`); io.observe(e); });
}

/* builds the page around its content; render(main) fills <main> */
export function initPage(render) {
  const header = document.createElement("header");
  header.className = "site-header"; header.id = "site-header";
  header.innerHTML = `<div class="backdrop" id="header-backdrop" aria-hidden="true"></div><div class="hx-header">${navHTML()}</div>`;
  document.body.prepend(header);
  const main = document.querySelector("main");
  render(main);
  main.insertAdjacentHTML("afterend", footerHTML() + `<div class="grain grain-tex is-on" aria-hidden="true"></div>`);
  syncAccountLinks();

  history.scrollRestoration = "manual";
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const lenis = new Lenis({ smoothWheel: !reduceMQ.matches });
  reduceMQ.addEventListener("change", () => { lenis.options.smoothWheel = !reduceMQ.matches; });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  window.__proto = { lenis };
  // in-page anchors land just below the fixed bar
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href").length < 2) return;
    const t = document.querySelector(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    lenis.scrollTo(t, { offset: -header.offsetHeight - 16, immediate: reduceMQ.matches });
  });
  if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); if (t) lenis.scrollTo(t, { offset: -header.offsetHeight - 16, immediate: true }); }, 60);

  initPauseToggle(document.getElementById("mo-toggle"));
  initHeader(main.firstElementChild || main);
  initReveals();
  initJustify();
  initChat({ lenis });
  return { lenis, main };
}

/* a small toast for prototype-only actions (forms, sign-in) */
export function toast(msg) {
  let t = document.getElementById("xc-toast");
  if (!t) { t = document.createElement("div"); t.id = "xc-toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("is-on"), 4200);
}
