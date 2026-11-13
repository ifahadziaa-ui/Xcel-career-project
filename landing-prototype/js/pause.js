/* =====================================================================
   PAUSE ANIMATIONS (WCAG 2.2.2) + prefers-reduced-motion.
   One shared state: html[data-motion="paused"]. It starts paused when the
   visitor's system asks for reduced motion, and the toggle in the top bar
   lets anyone pause or resume. It stops what moves on its own (marquee,
   shader animation, the mark's sway, cursor tilt, looping placeholders).
   Scroll-linked motion is not touched: it only moves when the visitor scrolls.
   ===================================================================== */
const KEY = "xc-motion";
const mq = matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new Set();
let paused = mq.matches;

try {
  const saved = localStorage.getItem(KEY); // a per-viewer convenience; the page works without it
  if (saved === "paused") paused = true;
  else if (saved === "playing") paused = false;
} catch {}

const apply = () => {
  document.documentElement.dataset.motion = paused ? "paused" : "playing";
  for (const fn of listeners) fn(paused);
};

export const isPaused = () => paused;
export const onPauseChange = (fn) => { listeners.add(fn); };
export function setPaused(v, { remember = true } = {}) {
  if (v === paused) return;
  paused = v;
  if (remember) { try { localStorage.setItem(KEY, v ? "paused" : "playing"); } catch {} }
  apply();
}
// a change of the system setting while the page is open follows it, unless the visitor chose
mq.addEventListener("change", () => {
  let chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch {}
  if (!chosen) setPaused(mq.matches, { remember: false });
});
apply();

/* the toggle button in the top bar */
export function initPauseToggle(btn) {
  const sync = (p) => {
    btn.setAttribute("aria-pressed", String(p));
    btn.title = p ? "Animations paused. Select to resume" : "Pause animations";
  };
  sync(paused);
  onPauseChange(sync);
  btn.addEventListener("click", () => setPaused(!paused));
}
