/* =====================================================================
   THE XCELCAREERS MARK
   Read from the #i-mark symbol injected by js/sprite.js, the single source of the
   geometry (traced from Assets/Logo.png; units are pixels of that 400 px file).
   - hub:  the empty centre the nine blades and the body all point at
   - hole: radius of that empty hub (the nearest blade tip)
   - rays: blades in spiral order, biggest first; g = tone group 1..3
   ===================================================================== */
const nums = (s) => s.trim().split(/[\s,]+/).map(Number);
const pairs = (s) => {
  const n = nums(s), out = [];
  for (let i = 0; i < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

let cached = null;

export function readMark() {
  if (cached) return cached;
  const sym = document.getElementById("i-mark");
  const hub = nums(sym.dataset.hub);
  const rays = [...sym.querySelectorAll(".mk-ray")].map((p) => ({ g: Number(p.dataset.g), pts: pairs(p.getAttribute("points")) }));
  const body = pairs(sym.querySelector(".mk-body").getAttribute("points"));
  const h = sym.querySelector(".mk-head");
  const head = { cx: Number(h.getAttribute("cx")), cy: Number(h.getAttribute("cy")), r: Number(h.getAttribute("r")) };

  const all = [...rays.flatMap((r) => r.pts), ...body];
  const x0 = Math.min(...all.map((p) => p[0]), head.cx - head.r);
  const x1 = Math.max(...all.map((p) => p[0]), head.cx + head.r);
  const y0 = Math.min(...all.map((p) => p[1]), head.cy - head.r);
  const y1 = Math.max(...all.map((p) => p[1]));
  const box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };

  const dist = (p) => Math.hypot(p[0] - hub[0], p[1] - hub[1]);
  const hole = Math.min(...all.map(dist));
  cached = { hub, rays, body, head, box, hole };
  return cached;
}

/* Inline SVG of the mark with one element per blade, so each can be animated.
   Colours come from CSS (fill on .zm-ray / .zm-fig); tones via [data-g]. */
export function markSVG(M, { id = "", cls = "" } = {}) {
  const pts = (P) => P.map(([x, y]) => `${x},${y}`).join(" ");
  const rays = M.rays.map((r, i) => `<polygon class="zm-ray" data-i="${i}" data-g="${r.g}" points="${pts(r.pts)}"/>`).join("");
  const b = M.box;
  return `<svg${id ? ` id="${id}"` : ""} class="${cls}" aria-hidden="true" focusable="false" preserveAspectRatio="none" viewBox="${b.x} ${b.y} ${b.w} ${b.h}">`
    + `<g class="zm-rot"><g class="zm-rays">${rays}</g>`
    + `<g class="zm-fig"><circle cx="${M.head.cx}" cy="${M.head.cy}" r="${M.head.r}"/><polygon points="${pts(M.body)}"/></g></g></svg>`;
}
