/* =====================================================================
   Motion preference: pause animations (WCAG 2.2.2) + prefers-reduced-motion.

   Ported from landing-prototype-clean/js/pause.js with the same semantics:
   - One shared state, written to <html data-motion="paused" | "playing">.
   - It starts paused when the operating system asks for reduced motion.
   - The visitor's explicit choice (stored under "xc-motion") wins over the system,
     in both directions: "paused" and "playing".
   - A change of the system setting while the page is open is followed only when the
     visitor has not chosen.
   - It stops what moves on its own. Scroll-linked motion is not touched.

   Differences from the prototype, all needed by React and Next, none of them semantic:
   - Nothing runs at import time (the module is evaluated on the server too).
     State resolves lazily on first use; the listener is attached by startMotion().
   - onPauseChange() returns an unsubscribe function (React effects clean up).
   - The first paint is handled by the inline script in script.ts, not by this module.

   Independent of the showreel and of any component: engines import isPaused /
   onPauseChange, React components use useMotionPaused().
   ===================================================================== */

export const MOTION_STORAGE_KEY = "xc-motion";
export type MotionState = "paused" | "playing";
export type PauseListener = (paused: boolean) => void;

/** Text for the future top-bar toggle (same strings as the prototype). */
export const MOTION_TOGGLE_TITLE: Record<MotionState, string> = {
  paused: "Animations paused. Select to resume",
  playing: "Pause animations",
};

const listeners = new Set<PauseListener>();
let paused = false;
let resolved = false;

const readSaved = (): string | null => {
  try {
    return window.localStorage.getItem(MOTION_STORAGE_KEY); // a per-viewer convenience; the page works without it
  } catch {
    return null;
  }
};

/** System preference first, then the visitor's saved choice (same order as the inline script). */
function resolveInitial(): boolean {
  let value = false;
  try {
    value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {}
  const saved = readSaved();
  if (saved === "paused") value = true;
  else if (saved === "playing") value = false;
  return value;
}

function ensure() {
  if (resolved || typeof window === "undefined") return;
  paused = resolveInitial();
  resolved = true;
}

const apply = () => {
  document.documentElement.dataset.motion = paused ? "paused" : "playing";
  for (const fn of listeners) fn(paused);
};

/** false on the server and until the browser state is known. */
export const isPaused = (): boolean => {
  ensure();
  return paused;
};

/** Subscribe to changes. Returns the unsubscribe function. */
export const onPauseChange = (fn: PauseListener): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export function setPaused(value: boolean, { remember = true }: { remember?: boolean } = {}) {
  ensure();
  if (value === paused) return;
  paused = value;
  if (remember) {
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, value ? "paused" : "playing");
    } catch {}
  }
  apply();
}

/**
 * Start following the system setting and (re)write data-motion on <html>.
 * Call from a layout effect in the root layout (see MotionSync). Returns the cleanup.
 * Safe to call twice (Strict Mode) and again after React hides and re-shows the layout.
 */
export function startMotion(): () => void {
  ensure();
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  // a change of the system setting while the page is open follows it, unless the visitor chose
  const onSystemChange = () => {
    if (!readSaved()) setPaused(query.matches, { remember: false });
  };
  query.addEventListener("change", onSystemChange);
  apply();
  return () => query.removeEventListener("change", onSystemChange);
}
