/* =====================================================================
   The one Lenis instance, and a counted scroll lock.

   LenisProvider (components/shell) creates and destroys the instance; everything else,
   including the future showreel snap engine, reaches it through getLenis() /
   onLenisChange() so there is never a second scroll engine. No Lenis is created here.
   ===================================================================== */
import type Lenis from "lenis";

let current: Lenis | null = null;
const listeners = new Set<(l: Lenis | null) => void>();

export const getLenis = (): Lenis | null => current;

export function setLenis(l: Lenis | null) {
  current = l;
  for (const fn of listeners) fn(l);
}

/** Subscribe to instance changes (create / destroy). Called once immediately with the current one. */
export function onLenisChange(fn: (l: Lenis | null) => void): () => void {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}

/* ---------- scroll lock (Lenis stop + html lock), counted so two owners can't unlock each other ----------
   Same effect as the prototype's lockScroll/unlockScroll (phone chat sheet; later the preloader). */
let locks = 0;

export function lockScroll() {
  if (locks++ > 0) return;
  current?.stop();
  const h = document.documentElement.style;
  h.position = "relative";
  h.overflow = "hidden";
  h.height = "100%";
}

export function unlockScroll() {
  if (locks === 0 || --locks > 0) return;
  const h = document.documentElement.style;
  h.removeProperty("position");
  h.removeProperty("overflow");
  h.removeProperty("height");
  current?.start();
}

/** true while something holds the scroll lock (a Lenis instance created later must start stopped). */
export const scrollLocked = (): boolean => locks > 0;
