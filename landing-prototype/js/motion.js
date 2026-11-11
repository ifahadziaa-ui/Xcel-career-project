/* =====================================================================
   MOTION ENGINE: Prompt 2 ("HELD-MINT") written by hand:
   springs (react-spring semantics), one shared ticker, gated reveals,
   line/letter text reveals, scroll parallax, spray underline, drips,
   rubber stamps, the "pile + stamp" preloader, header and poster menu.
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
const PUNCH = { tension: 420, friction: 22 };
const SOFT = { tension: 120, friction: 26 };
const HEAVY = { tension: 60, friction: 30 };
const DRIP = { tension: 140, friction: 13 };
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
  headline: { type: "inview", from: { opacity: 0, transform: "translateY(18%) scale(1.18)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: PUNCH, stagger: 110 },
  mark: { type: "inview", from: SPRAY_FROM, to: SPRAY_TO, config: { tension: 55, friction: 20 }, delay: 300 },
  scribble: { type: "inview", from: SPRAY_FROM, to: SPRAY_TO, config: { tension: 70, friction: 20 }, delay: 700 },
  copy: { type: "text", layer: "line", config: { tension: 170, friction: 26 }, stagger: 70 },
  button: { type: "inview", from: { opacity: 0, transform: "translateY(-30%)" }, to: { opacity: 1, transform: "translateY(0%)" }, config: SOFT },
  drip: { type: "inview", from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" }, config: DRIP, delay: 350, stagger: 70, style: { transformOrigin: "50% 0%" } },
  photo: { type: "inview", from: { transform: "scale(1.16)", filter: "brightness(0.25)" }, to: { transform: "scale(1)", filter: "brightness(1)" }, config: HEAVY },
  card: { type: "inview", from: { opacity: 0, transform: "scale(1.35) rotate(-8deg)" }, to: { opacity: 1, transform: "scale(1) rotate(0deg)" }, config: PUNCH, stagger: 90 },
  chip: { type: "inview", from: { opacity: 0, transform: "scale(1.4)" }, to: { opacity: 1, transform: "scale(1)" }, config: PUNCH, stagger: 70 },
  step: { type: "inview", from: { opacity: 0, transform: "scale(1.12)" }, to: { opacity: 1, transform: "scale(1)" }, config: PUNCH, stagger: 100 },
  sticker: { type: "inview", from: { opacity: 0, transform: "scale(1.5) rotate(-12deg)" }, to: { opacity: 1, transform: "scale(1) rotate(0deg)" }, config: { tension: 420, friction: 18 }, stagger: 120 },
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
  if (sp.type === "inview") animate(it.el, sp.from, sp.to, sp.config, delay);
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
    // scribbles and drips start with no visible extent: watch an unscaled wrapper
    const target = el.dataset.m === "scribble" || el.dataset.m === "drip" ? el.parentElement : el;
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
  const layers = [...document.querySelectorAll("[data-px]")].map((box) => {
    const inner = box.querySelector(":scope > .px") || box.firstElementChild;
    const distance = +box.dataset.px;
    const tiltDeg = box.dataset.tilt != null ? +box.dataset.tilt : distance * 0.3;
    let y = 0, r = 0;
    const apply = () => (inner.style.transform = `translate3d(0, ${y}rem, 0) rotate(${r}deg)`);
    const ys = spring({ from: 0, to: 0, tension: 280, friction: 40, onUpdate: (v) => { y = v; apply(); } });
    const rs = spring({ from: 0, to: 0, tension: 280, friction: 40, onUpdate: (v) => { r = v; apply(); } });
    return { box, distance, tiltDeg, ys, rs, after: 0 };
  });
  ticker.add(() => {
    const vh = innerHeight;
    for (const L of layers) {
      const rc = L.box.getBoundingClientRect();
      const on = rc.bottom > 0 && rc.top < vh;
      if (on) L.after = 10; else if (L.after > 0) L.after--; else continue;
      const progress = Math.min(Math.max(0, (vh - rc.top) / (vh + rc.height)), 1);
      const off = reduced() ? 0 : progress - 0.5;
      L.ys.set(off * L.distance);
      L.rs.set(off * L.tiltDeg);
    }
    return true;
  }, 10);
}

/* ---------- PlateButton drips ---------- */
const DRIPS = {
  md: { left: [0.105, 0.227, 0.367, 0.496, 0.656, 0.809, 0.926], h: [22, 12, 38, 16, 28, 10, 20], w: [7, 5, 8, 5, 7, 5, 8] },
  sm: { left: [0.12, 0.24, 0.376, 0.51, 0.67, 0.82, 0.94], h: [15, 8, 27, 11, 20, 7, 14], w: [5, 4, 6, 4, 5, 4, 6] },
};
export function buildDrips(root = document) {
  root.querySelectorAll(".plate[data-drips]").forEach((plate) => {
    if (plate.__drips) return;
    plate.__drips = true;
    const d = DRIPS[plate.dataset.drips] || DRIPS.md;
    const pw = parseFloat(plate.style.getPropertyValue("--pw")) || 16;
    const revealed = plate.hasAttribute("data-m");
    d.left.forEach((f, i) => {
      const s = document.createElement("span");
      s.className = "plate-drip"; s.setAttribute("aria-hidden", "true");
      s.style.left = `${(f * pw).toFixed(3)}rem`; s.style.height = `${d.h[i] / 16}rem`; s.style.width = `${d.w[i] / 16}rem`;
      if (revealed) { s.dataset.m = "drip"; s.dataset.i = i; }
      plate.insertBefore(s, plate.firstChild);
    });
  });
}

/* ---------- SprayLink underline ---------- */
const S_LINE = "M8.6 8.1C17.4 4.6 38.1 2.9 67.6 4.1C69.6 4.3 69.6 8.5 67.6 8.9C44 7.7 23.4 10.3 11.6 12.7C9 13.1 7.2 9.3 8.6 8.1Z";
const S_DRIPS = [
  "M23.4 8.6C23.4 7.77157 22.7284 7.1 21.9 7.1C21.0716 7.1 20.4 7.77157 20.4 8.6V14.6C20.4 15.4284 21.0716 16.1 21.9 16.1C22.7284 16.1 23.4 15.4284 23.4 14.6V8.6Z",
  "M43.7 8.4C43.7 7.68203 43.118 7.1 42.4 7.1C41.682 7.1 41.1 7.68203 41.1 8.4V19.8C41.1 20.518 41.682 21.1 42.4 21.1C43.118 21.1 43.7 20.518 43.7 19.8V8.4Z",
  "M59.2 8.2C59.2 7.59249 58.7075 7.1 58.1 7.1C57.4925 7.1 57 7.59249 57 8.2V13C57 13.6075 57.4925 14.1 58.1 14.1C58.7075 14.1 59.2 13.6075 59.2 13V8.2Z",
];
const S_DOTS = [
  "M3.6 7.1C4.15229 7.1 4.6 6.65228 4.6 6.1C4.6 5.54772 4.15229 5.1 3.6 5.1C3.04772 5.1 2.6 5.54772 2.6 6.1C2.6 6.65228 3.04772 7.1 3.6 7.1Z",
  "M5.1 14.3C5.4866 14.3 5.8 13.9866 5.8 13.6C5.8 13.2134 5.4866 12.9 5.1 12.9C4.7134 12.9 4.4 13.2134 4.4 13.6C4.4 13.9866 4.7134 14.3 5.1 14.3Z",
  "M0.6 10.7C0.931371 10.7 1.2 10.4314 1.2 10.1C1.2 9.76863 0.931371 9.5 0.6 9.5C0.26863 9.5 0 9.76863 0 10.1C0 10.4314 0.26863 10.7 0.6 10.7Z",
  "M71.6 3.5C72.0971 3.5 72.5 3.09706 72.5 2.6C72.5 2.10294 72.0971 1.7 71.6 1.7C71.1029 1.7 70.7 2.10294 70.7 2.6C70.7 3.09706 71.1029 3.5 71.6 3.5Z",
  "M74.6 8.2C74.9314 8.2 75.2 7.93137 75.2 7.6C75.2 7.26863 74.9314 7 74.6 7C74.2686 7 74 7.26863 74 7.6C74 7.93137 74.2686 8.2 74.6 8.2Z",
  "M63.6 13.3C63.9866 13.3 64.3 12.9866 64.3 12.6C64.3 12.2134 63.9866 11.9 63.6 11.9C63.2134 11.9 62.9 12.2134 62.9 12.6C62.9 12.9866 63.2134 13.3 63.6 13.3Z",
  "M33.4 14.7C33.7314 14.7 34 14.4314 34 14.1C34 13.7686 33.7314 13.5 33.4 13.5C33.0686 13.5 32.8 13.7686 32.8 14.1C32.8 14.4314 33.0686 14.7 33.4 14.7Z",
  "M49.9 1.2C50.2314 1.2 50.5 0.931371 50.5 0.6C50.5 0.268629 50.2314 0 49.9 0C49.5686 0 49.3 0.268629 49.3 0.6C49.3 0.931371 49.5686 1.2 49.9 1.2Z",
  "M15.7 2.3C16.0866 2.3 16.4 1.9866 16.4 1.6C16.4 1.2134 16.0866 0.9 15.7 0.9C15.3134 0.9 15 1.2134 15 1.6C15 1.9866 15.3134 2.3 15.7 2.3Z",
];
export function initSpray() {
  const NS = "http://www.w3.org/2000/svg";
  document.querySelectorAll(".spray").forEach((wrap) => {
    const link = wrap.querySelector("a");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 75.2 21.1"); svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("overflow", "visible"); svg.setAttribute("fill", "currentColor"); svg.setAttribute("aria-hidden", "true");
    svg.classList.add("spray-svg");
    const mk = (d) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); svg.appendChild(p); return p; };
    const line = mk(S_LINE);
    const drips = S_DRIPS.map(mk), dots = S_DOTS.map(mk);
    [...drips, ...dots].forEach((p) => { p.style.transformBox = "fill-box"; });
    drips.forEach((p) => (p.style.transformOrigin = "50% 0%"));
    dots.forEach((p) => (p.style.transformOrigin = "50% 50%"));
    wrap.appendChild(svg);
    let session = 0;
    const unspray = () => {
      line.style.clipPath = "inset(0% 100% 0% 0%)";
      drips.forEach((p) => (p.style.transform = "scaleY(0)"));
      dots.forEach((p) => (p.style.transform = "scale(0)"));
    };
    unspray();
    const op = spring({ from: 0, to: 0, tension: 260, friction: 30, onUpdate: (v) => (svg.style.opacity = v) });
    const on = () => {
      const id = ++session;
      op.set(1, { immediate: true });
      spring({ from: 0, to: 1, tension: 300, friction: 32, onUpdate: (v) => { if (id === session) line.style.clipPath = `inset(0% ${100 - v * 100}% 0% 0%)`; } });
      drips.forEach((p, i) => spring({ from: 0, to: 1, tension: 110, friction: 9, delay: 160 + i * 70, onUpdate: (v) => { if (id === session) p.style.transform = `scaleY(${v})`; } }));
      dots.forEach((p, i) => spring({ from: 0, to: 1, tension: 420, friction: 16, delay: (i * 37) % 180, onUpdate: (v) => { if (id === session) p.style.transform = `scale(${v})`; } }));
    };
    const off = () => { session++; unspray(); op.set(0); };
    wrap.addEventListener("pointerenter", on);
    wrap.addEventListener("pointerleave", off);
    link?.addEventListener("focus", on);
    link?.addEventListener("blur", off);
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

/* ---------- header: slides in after the hero, backdrop once scrolled ---------- */
export function initHeader(hero) {
  const header = document.getElementById("site-header");
  const backdrop = document.getElementById("header-backdrop");
  let shown = false, scrolled = false;
  const slide = spring({ from: 0, to: 0, tension: 220, friction: 30, onUpdate: (v) => (header.style.transform = `translateY(${-120 + 120 * v}%)`) });
  const bd = spring({ from: 0, to: 0, tension: 220, friction: 30, onUpdate: (v) => (backdrop.style.opacity = v) });
  const grain = document.querySelector(".below > .grain");
  const track = document.getElementById("sr-track");
  const check = () => {
    // hidden over the hero (it has its own nav) and while the showreel is pinned full-screen
    const tr = track?.getBoundingClientRect();
    const inReel = tr ? tr.top <= 1 && tr.bottom >= innerHeight - 1 : false;
    const past = hero.getBoundingClientRect().bottom < 80 && !inReel;
    grain?.classList.toggle("is-on", hero.getBoundingClientRect().bottom <= 0);
    if (past !== shown) { shown = past; slide.set(past ? 1 : 0); }
    const sc = scrollY > 40;
    if (sc !== scrolled) { scrolled = sc; bd.set(sc ? 1 : 0); }
  };
  addEventListener("scroll", check, { passive: true });
  check();
}

/* ---------- poster menu (handheld) ---------- */
export function initMenu(lenis) {
  const menu = document.getElementById("menu");
  const sheet = document.getElementById("menu-sheet");
  const backdrop = document.getElementById("menu-backdrop");
  const burger = document.getElementById("burger");
  const close = document.getElementById("menu-close");
  const rows = [...menu.querySelectorAll("[data-trail]")];
  let open = false;
  const sheetS = spring({ from: 0, to: 0, tension: 210, friction: 22, onUpdate: (v) => (sheet.style.transform = `translateY(${-115 + 115 * v}%) rotate(${-7 + 5.5 * v}deg)`) });
  const bdS = spring({ from: 0, to: 0, tension: 200, friction: 30, onUpdate: (v) => (backdrop.style.opacity = v) });
  const rowS = rows.map((r) => spring({ from: 0, to: 0, tension: 260, friction: 24, onUpdate: (v) => { r.style.opacity = v; r.style.transform = `translateX(${-12 + 12 * v}%)`; } }));
  const set = (o) => {
    open = o;
    menu.classList.toggle("is-open", o);
    menu.setAttribute("aria-hidden", String(!o));
    o ? menu.removeAttribute("inert") : menu.setAttribute("inert", "");
    burger.setAttribute("aria-expanded", String(o));
    sheetS.set(o ? 1 : 0); bdS.set(o ? 1 : 0);
    rowS.forEach((s, i) => s.set(o ? 1 : 0, { delay: o ? 180 + i * 55 : 0 }));
    o ? lockScroll(lenis) : unlockScroll(lenis);
  };
  burger.addEventListener("click", () => set(!open));
  close.addEventListener("click", () => set(false));
  backdrop.addEventListener("click", () => set(false));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && open) set(false); });
}
