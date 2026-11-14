/* =====================================================================
   MOTION ENGINE: Prompt 2 ("HELD-MINT") written by hand:
   springs (react-spring semantics), one shared ticker, gated reveals,
   line/letter text reveals, scroll parallax, rubber stamps,
   the "pile + stamp" preloader and the top bar.
   ===================================================================== */

const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
export const reduced = () => reduceMQ.matches;

/* ---------- one shared ticker ---------- */
const subs = new Set();
let rafId = 0;
function loop(now) {
  for (const s of [...subs]) {
    if (s.gap && now - s.last < s.gap) continue;
    s.last = now;
    let keep = true;
    try { keep = s.fn(now) !== false; } catch (e) { console.error(e); keep = false; }
    if (!keep) subs.delete(s);
  }
  rafId = subs.size ? requestAnimationFrame(loop) : 0;
}
export const ticker = {
  add(fn, gap = 0) {
    const s = { fn, gap, last: -Infinity };
    subs.add(s);
    if (!rafId) rafId = requestAnimationFrame(loop);
    return () => subs.delete(s);
  },
};

/* ---------- spring (verbatim from the prompt) ---------- */
export function spring({ from = 0, to = 1, tension = 170, friction = 26, delay = 0, onUpdate, onRest } = {}) {
  let pos = from, vel = 0, target = to, startAt = performance.now() + delay, last = null, done = false, running = false;
  const run = () => { if (!running) { running = true; ticker.add((now) => (running = step(now))); } };
  const s = {
    get value() { return pos; },
    set(v, { delay: d = 0, immediate = false, config } = {}) {
      if (config) ({ tension, friction } = config);
      target = v; from = pos; startAt = performance.now() + d; done = false; last = null;
      if (immediate || reduced()) { pos = v; vel = 0; onUpdate?.(pos); done = true; onRest?.(); }
      else run();
    },
    stop() { done = true; },
  };
  function step(now) {
    if (done) return false;
    if (now < startAt) return true;
    const dt = Math.min(64, last == null ? 16 : now - last); last = now;
    const precision = Math.min(1, Math.abs(target - from) * 0.001) || 0.001, restV = precision / 10;
    for (let i = 0; i < Math.ceil(dt); i++) {
      const f = -tension * 0.000001 * (pos - target) - friction * 0.001 * vel;
      vel += f; pos += vel;
    }
    if (Math.abs(vel) <= restV && Math.abs(target - pos) <= precision) { pos = target; vel = 0; done = true; }
    onUpdate?.(pos);
    if (done) onRest?.();
    return !done;
  }
  if (reduced()) { pos = to; onUpdate?.(pos); onRest?.(); } else run();
  return s;
}

/* ---------- style maps: one progress spring lerps every number ---------- */
const NUM = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
const fmt = (v) => String(Math.round(v * 10000) / 10000);
function lerper(a, b) {
  if (typeof a === "number" && typeof b === "number") return (t) => a + (b - a) * t;
  const sa = String(a), sb = String(b);
  const na = sa.match(NUM) || [], nb = sb.match(NUM) || [];
  if (na.length !== nb.length) return (t) => (t < 1 ? sa : sb);
  const parts = sb.split(NUM);
  return (t) => {
    let out = parts[0];
    for (let i = 0; i < nb.length; i++) out += fmt(+na[i] + (+nb[i] - +na[i]) * t) + parts[i + 1];
    return out;
  };
}
function setProp(el, k, v) {
  if (k === "maskImage") { el.style.maskImage = v; el.style.webkitMaskImage = v; }
  else el.style[k] = v;
}
export function setStyles(el, map) { for (const k in map) if (k !== "config") setProp(el, k, map[k]); }

export function animate(el, from, to, config, delay = 0, onRest) {
  const keys = Object.keys(to).filter((k) => k !== "config");
  const ls = keys.map((k) => [k, lerper(from[k] ?? to[k], to[k])]);
  return spring({ from: 0, to: 1, ...config, delay, onUpdate: (p) => { for (const [k, f] of ls) setProp(el, k, f(p)); }, onRest });
}
/* keyframe chain: each step from where the last one rested */
export function animateChain(el, from, steps, delay = 0) {
  let state = { ...from }, i = 0;
  const next = (d) => {
    if (i >= steps.length) return;
    const st = steps[i++];
    const prev = state; state = { ...state, ...st };
    animate(el, prev, st, st.config, d, () => next(0));
  };
  next(delay);
}

/* ---------- the motion set (verbatim) ---------- */
const SOFT = { tension: 120, friction: 26 };
const HEAVY = { tension: 60, friction: 30 };
const RISE = { tension: 190, friction: 26 }; // shared entrance: quick, no bounce
const sprayMask = (edge) => `linear-gradient(90deg, rgba(0, 0, 0, 1) ${edge}%, rgba(0, 0, 0, 0) ${edge + 22}%)`;
const SPRAY_FROM = { filter: "blur(6px)", maskImage: sprayMask(-22) };
const SPRAY_TO = { filter: "blur(0px)", maskImage: sprayMask(100) };
const STAMP_FROM = { opacity: 0, transform: "translateY(-55%) scale(2.1) rotate(-14deg)", filter: "blur(3px)" };
const STAMP_TO = [
  { opacity: 0.6, transform: "translateY(-30%) scale(1.6) rotate(-9deg)", filter: "blur(2px)", config: { tension: 260, friction: 26 } },
  { opacity: 1, transform: "translateY(0%) scale(0.9) rotate(1deg)", filter: "blur(0px)", config: { tension: 900, friction: 30 } },
  { opacity: 1, transform: "translateY(0%) scale(1) rotate(0deg)", filter: "blur(0px)", config: { tension: 400, friction: 18 } },
];
const MOTION = {
  // One entrance for text and pictures alike: a short rise with a soft settle,
  // so a headline and the card beside it arrive the same way.
  headline: { type: "inview", from: { opacity: 0, transform: "translateY(24%) scale(1)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, stagger: 110 },
  mark: { type: "inview", from: SPRAY_FROM, to: SPRAY_TO, config: { tension: 55, friction: 20 }, delay: 300 },
  copy: { type: "text", layer: "line", config: { tension: 170, friction: 26 }, stagger: 70 },
  button: { type: "inview", from: { opacity: 0, transform: "translateY(40%) scale(0.98)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, delay: 160 },
  photo: { type: "inview", from: { transform: "scale(1.16)", filter: "brightness(0.25)" }, to: { transform: "scale(1)", filter: "brightness(1)" }, config: HEAVY },
  card: { type: "inview", from: { opacity: 0, transform: "translateY(10%) scale(0.94)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, delay: 120, stagger: 90 },
  chip: { type: "inview", from: { opacity: 0, transform: "translateY(18%) scale(0.96)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, stagger: 60 },
  step: { type: "inview", from: { opacity: 0, transform: "translateY(10%) scale(0.96)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, delay: 120, stagger: 100 },
  sticker: { type: "inview", from: { opacity: 0, transform: "translateY(14%) scale(0.95)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: RISE, delay: 120, stagger: 100 },
  ledger: { type: "inview", from: { opacity: 0 }, to: { opacity: 1 }, config: SOFT, stagger: 70 },
  stamp: { type: "chain", from: STAMP_FROM, to: STAMP_TO, delay: 200, stagger: 160 },
  faq: { type: "inview", from: { opacity: 0, transform: "translateY(-30%)" }, to: { opacity: 1, transform: "translateY(0%)" }, config: SOFT, repeat: true },
  wordmark: { type: "text", layer: "letter", config: { tension: 200, friction: 22 }, stagger: 45 },
};

/* ---------- text splitting ---------- */
function spaceEm(el) {
  const cs = getComputedStyle(el);
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font:${cs.font};letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform}`;
  document.body.appendChild(probe);
  probe.textContent = "x x"; const a = probe.getBoundingClientRect().width;
  probe.textContent = "xx"; const b = probe.getBoundingClientRect().width;
  probe.remove();
  return (a - b) / (parseFloat(cs.fontSize) || 16);
}
function splitLines(it) {
  const el = it.el;
  if (it.orig == null) { it.orig = el.innerHTML; it.text = el.textContent.trim(); }
  el.innerHTML = it.orig;
  const words = [];
  for (const node of [...el.childNodes]) {
    if (node.nodeType === 3) node.textContent.split(/\s+/).filter(Boolean).forEach((w) => words.push(document.createTextNode(w)));
    else if (node.nodeType === 1) node.textContent.split(/\s+/).filter(Boolean).forEach((w) => { const c = node.cloneNode(false); c.textContent = w; words.push(c); });
  }
  const gap = spaceEm(el);
  const centered = getComputedStyle(el).textAlign === "center";
  el.innerHTML = "";
  const row = document.createElement("span");
  row.className = "copy-row"; row.style.columnGap = gap + "em";
  if (centered) row.style.justifyContent = "center";
  row.setAttribute("aria-hidden", "true");
  const spans = words.map((w) => { const s = document.createElement("span"); s.style.display = "inline-block"; s.appendChild(w); row.appendChild(s); return s; });
  el.appendChild(row);
  const groups = [];
  let top = null;
  for (const s of spans) { if (s.offsetTop !== top) { groups.push([]); top = s.offsetTop; } groups[groups.length - 1].push(s); }
  row.innerHTML = "";
  row.style.display = "block";
  it.lines = groups.map((ws) => {
    const clip = document.createElement("span");
    clip.className = "copy-clip"; clip.style.display = "block";
    const inner = document.createElement("span");
    inner.className = "copy-line"; inner.style.display = "flex"; inner.style.columnGap = gap + "em";
    if (centered) inner.style.justifyContent = "center";
    ws.forEach((w) => inner.appendChild(w));
    clip.appendChild(inner); row.appendChild(clip);
    return inner;
  });
  const sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = it.text;
  el.appendChild(sr);
}
function splitLetters(it) {
  const el = it.el;
  if (it.orig == null) { it.orig = el.textContent; }
  el.innerHTML = "";
  it.lines = [...it.orig].map((ch) => { const s = document.createElement("span"); s.className = "wl"; s.textContent = ch; el.appendChild(s); return s; });
}

/* ---------- reveals: gated until the preloader releases ---------- */
const items = [];
const byTarget = new Map();
let released = false;
let atBottom = false;

function resetItem(it) {
  it.played = false;
  if (it.spec.type === "text") {
    if (it.spec.layer === "line") it.lines?.forEach((l) => (l.style.transform = "translateY(100%)"));
    else it.lines?.forEach((l) => { l.style.transform = "translateY(80px)"; l.style.opacity = 0; });
  } else setStyles(it.el, it.spec.from);
}
function prepare(it) {
  if (it.spec.style) Object.assign(it.el.style, it.spec.style);
  if (it.spec.type === "text") { it.spec.layer === "line" ? splitLines(it) : splitLetters(it); }
  resetItem(it);
}
function play(it) {
  if (it.played) return;
  it.played = true;
  const sp = it.spec;
  const delay = (sp.delay ?? 0) + it.index * (sp.stagger ?? 0);
  // once the spray reveal settles, drop the mask and filter so the word renders as plain text
  const settle = sp === MOTION.mark ? () => { it.el.style.maskImage = it.el.style.webkitMaskImage = "none"; it.el.style.filter = "none"; } : undefined;
  if (sp.type === "inview") animate(it.el, sp.from, sp.to, sp.config, delay, settle);
  else if (sp.type === "chain") animateChain(it.el, sp.from, sp.to, delay);
  else if (sp.layer === "line") {
    it.lines.forEach((l, i) => spring({ from: 100, to: 0, ...sp.config, delay: it.index * 120 + i * sp.stagger, onUpdate: (v) => (l.style.transform = `translateY(${v}%)`) }));
  } else {
    it.lines.forEach((l, i) => spring({ from: 0, to: 1, ...sp.config, delay: i * sp.stagger, onUpdate: (v) => { l.style.transform = `translateY(${80 * (1 - v)}px)`; l.style.opacity = v; } }));
  }
}
function maybePlay(it) { if (released && it.seen && it.on) play(it); }

const deepIO = new IntersectionObserver((entries) => {
  for (const e of entries) for (const it of byTarget.get(e.target) || []) { if (e.isIntersecting) it.seen = true; maybePlay(it); }
}, { rootMargin: "0px 0px -15% 0px" });
const anyIO = new IntersectionObserver((entries) => {
  for (const e of entries) for (const it of byTarget.get(e.target) || []) {
    it.on = e.isIntersecting;
    if (!it.on && it.spec.repeat && it.played) resetItem(it);
    if (it.on && atBottom) it.seen = true;
    maybePlay(it);
  }
});

export function registerReveals(root = document) {
  root.querySelectorAll("[data-m]").forEach((el) => {
    if (el.__rv) return;
    const spec = MOTION[el.dataset.m];
    if (!spec) return;
    const it = { el, spec, index: +(el.dataset.i || 0), played: false, seen: false, on: false };
    el.__rv = it;
    items.push(it);
    prepare(it);
    const target = el;
    if (!byTarget.has(target)) byTarget.set(target, []);
    byTarget.get(target).push(it);
  });
}

export function releaseReveals() {
  released = true;
  for (const t of byTarget.keys()) { deepIO.observe(t); anyIO.observe(t); }
  const checkBottom = () => {
    atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom) for (const it of items) if (it.on) { it.seen = true; maybePlay(it); }
  };
  addEventListener("scroll", checkBottom, { passive: true });
  // FAQ answers replay each time their item opens
  document.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => {
    for (const el of d.querySelectorAll("[data-m]")) { const it = el.__rv; if (!it) continue; if (!d.open) resetItem(it); else { it.seen = true; it.on = true; play(it); } }
  }));
  // crossing into another layout range replays the reveals for the new layout
  const ranges = [matchMedia("(width >= 1200px)"), matchMedia("(width >= 896px)"), matchMedia("(width >= 700px)")];
  const onRange = () => {
    for (const it of items) {
      if (it.spec.type === "text") prepare(it); else resetItem(it);
      if (it.on) { it.seen = true; play(it); }
    }
  };
  ranges.forEach((m) => m.addEventListener("change", onRange));
}

/* ---------- scroll parallax ---------- */
export function initParallax() {
  // Scroll-linked, no springs: Lenis already eases the scroll, and a spring on top of it
  // lagged behind, froze while a layer was off-screen and then crawled up from a stale
  // value on the way back. Position is now an absolute function of where the box is.
  const layers = [...document.querySelectorAll("[data-px]")].map((box) => {
    const inner = box.querySelector(":scope > .px") || box.firstElementChild;
    const distance = +box.dataset.px;
    const tiltDeg = box.dataset.tilt != null ? +box.dataset.tilt : distance * 0.3;
    return { box, inner, distance, tiltDeg, y: NaN, r: NaN, rc: null };
  });
  ticker.add(() => {
    const vh = innerHeight, still = reduced();
    for (const L of layers) L.rc = L.box.getBoundingClientRect(); // all reads first
    for (const L of layers) {                                       // then all writes
      const { rc } = L;
      if (rc.bottom < -vh * 0.25 || rc.top > vh * 1.25) continue;
      const progress = Math.min(Math.max(0, (vh - rc.top) / (vh + rc.height)), 1);
      const off = still ? 0 : progress - 0.5;
      const y = Math.round(off * L.distance * 1600) / 1600, r = Math.round(off * L.tiltDeg * 1600) / 1600;
      if (y === L.y && r === L.r) continue;
      L.y = y; L.r = r;
      L.inner.style.transform = `translate3d(0, ${y}rem, 0) rotate(${r}deg)`;
    }
    return true;
  });
}

/* ---------- scroll lock (Lenis stop + html lock) ---------- */
export function lockScroll(lenis) {
  lenis?.stop();
  const h = document.documentElement.style;
  h.position = "relative"; h.overflow = "hidden"; h.height = "100%";
}
export function unlockScroll(lenis) {
  const h = document.documentElement.style;
  h.removeProperty("position"); h.removeProperty("overflow"); h.removeProperty("height");
  lenis?.start();
}

/* ---------- preloader: pile + stamp ---------- */
const PILE = {
  wide:     [[19.7, 40.8, 28.2, -20], [58.7, 43.7, 24.6, 2], [40.2, 68.6, 19.2, 4], [77.1, 53.4, 32.8, 20]],
  portrait: [[30, 27, 47, -12], [71, 26, 41, 6], [31, 71, 37, 4], [67, 68, 51, 12]],
  tall:     [[36, 22, 62, -10], [68, 40, 52, 7], [32, 60, 46, -4], [64, 77, 64, 10]],
};
export function runPreloader({ lenis, cardsHTML, ready, onRelease }) {
  const root = document.querySelector("[data-preloader]");
  if (!root) { onRelease?.(); return; }
  const box = root.querySelector("#pl-box");
  const num = root.querySelector("#pl-num");
  const fill = root.querySelector("#pl-fill");
  const stamp = root.querySelector("#pl-stamp");
  const MIN_MS = 1500, EXIT_MS = 750, LIFT_DELAY = 350, SETTLE = 175;
  const STOPS = [0.05, 0.3, 0.55, 0.78];

  const tallMQ = matchMedia("(max-aspect-ratio: 5/8)"), portraitMQ = matchMedia("(orientation: portrait)");
  const layout = () => (tallMQ.matches ? "tall" : portraitMQ.matches ? "portrait" : "wide");

  const cards = cardsHTML.map((html, i) => {
    const wrap = document.createElement("div");
    wrap.className = "pl-card";
    const inner = document.createElement("div");
    inner.className = "pl-card-in";
    inner.innerHTML = html;
    wrap.appendChild(inner);
    box.insertBefore(wrap, stamp);
    const c = { wrap, inner, landed: false, tilt: 0, sp: null };
    c.sp = spring({ from: 0, to: 0, tension: 420, friction: 20, onUpdate: (v) => {
      inner.style.opacity = Math.min(1, Math.max(0, v));
      inner.style.transform = `scale(${1.6 - 0.6 * v}) rotate(${c.tilt - 10 + 10 * v}deg)`;
    } });
    return c;
  });
  const place = () => {
    const L = PILE[layout()];
    cards.forEach((c, i) => {
      const [l, t, w, tilt] = L[i];
      c.wrap.style.left = l + "%"; c.wrap.style.top = t + "%"; c.wrap.style.width = w + "%";
      c.tilt = tilt;
      c.sp.set(c.landed ? 1 : 0, { immediate: true });
    });
  };
  place();
  tallMQ.addEventListener("change", place); portraitMQ.addEventListener("change", place);
  const landCards = (target) => cards.forEach((c, i) => { if (!c.landed && STOPS[i] <= target) { c.landed = true; c.sp.set(1); } });

  const progress = spring({ from: 0, to: 0, tension: 480, friction: 52, onUpdate: (p) => {
    num.textContent = String(Math.round(Math.min(1, Math.max(0, p)) * 100)).padStart(3, "0");
    fill.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
  } });

  scrollTo(0, 0);
  lockScroll(lenis);
  const t0 = performance.now();
  let last = 0, readyDone = false;
  ready.then(() => (readyDone = true), () => (readyDone = true));
  function tick() {
    const imgs = [...document.images].filter((i) => i.loading !== "lazy");
    const loaded = imgs.length ? imgs.filter((i) => i.complete).length / imgs.length : 1;
    const elapsed = performance.now() - t0;
    const time = Math.min(1, elapsed / MIN_MS);
    let next = elapsed > MIN_MS * 2 ? 1 : Math.min(time, 0.15 + loaded * 0.85);
    if (next >= 1 && !readyDone && elapsed < MIN_MS * 3) next = 0.99; // wait for fonts + layout
    progress.set(next);
    if (next >= 1 || STOPS.some((at) => at > last && at <= next)) { last = next; landCards(next); }
    if (next >= 1) { setTimeout(done, SETTLE); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function done() {
    animate(stamp, { opacity: 0, transform: "scale(2.6) rotate(-24deg)" }, { opacity: 1, transform: "scale(1) rotate(-8deg)" }, { tension: 520, friction: 22 });
    setTimeout(() => {
      onRelease?.();
      spring({ from: 0, to: 1, tension: 480, friction: 48, onUpdate: (v) => (root.style.transform = `translateY(${-v * 105}%)`) });
    }, LIFT_DELAY);
    setTimeout(() => { root.remove(); unlockScroll(lenis); }, EXIT_MS);
  }
}

/* ---------- top bar: the hero's bar, fixed on every section; a backdrop fades in once scrolled ---------- */
export function initHeader(hero) {
  const header = document.getElementById("site-header");
  const backdrop = document.getElementById("header-backdrop");
  // other sections (the showreel) read the bar's height to stay clear of it
  new ResizeObserver(() => document.documentElement.style.setProperty("--bar-h", `${header.offsetHeight}px`)).observe(header);
  let scrolled = false;
  const bd = spring({ from: 0, to: 0, tension: 220, friction: 30, onUpdate: (v) => { backdrop.style.opacity = v; header.style.setProperty("--dock", v); } });
  const grain = document.querySelector(".below > .grain");
  const check = () => {
    grain?.classList.toggle("is-on", hero.getBoundingClientRect().bottom <= 0);
    const sc = scrollY > 40;
    if (sc !== scrolled) { scrolled = sc; bd.set(sc ? 1 : 0); }
  };
  addEventListener("scroll", check, { passive: true });
  check();
}
