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

/* ---------- post-frame subscription ----------
   One shared tick drives all scroll-linked work. LenisController's ticker callback calls
   lenis.raf(t) and then, immediately, notifyScrollFrame(t). Subscribers therefore always see the
   scroll position Lenis has just written for THIS frame, whatever order unrelated effects mounted
   in. There is no second requestAnimationFrame loop and no second Lenis.

   Contract:
   - onScrollFrame(fn) returns an unsubscribe function. The same function subscribed twice is held
     once (a Set); its first unsubscribe removes it.
   - Callbacks run in subscription order, every tick while subscribed (not only when the scroll
     position changed: a subscriber that eases toward a target needs the ticks). Unsubscribe when
     inactive.
   - Safe to unsubscribe (itself or another) during a notification: a callback removed before its
     turn is not called. A callback added during a notification is called in the same pass.
   - A throwing subscriber is logged and does not stop the others.
   - The frame object is reused: read it, do not keep it.
   - No Lenis instance is exposed. `scroll` is window.scrollY as just written. Nothing is
     delivered while no LenisController is mounted. */
export interface ScrollFrame {
  /** the shared ticker's frame timestamp (ms, rAF clock) */
  time: number;
  /** window.scrollY after this frame's lenis.raf(time) */
  scroll: number;
}
export type ScrollFrameListener = (frame: ScrollFrame) => void;

const frameSubs = new Set<ScrollFrameListener>();
const frame: ScrollFrame = { time: 0, scroll: 0 };
const publishCount = () => {
  // inspectable in DevTools and by leak checks; written on (un)subscribe only, never per frame
  if (typeof document !== "undefined") document.documentElement.dataset.scrollFrameSubs = String(frameSubs.size);
};

export function onScrollFrame(fn: ScrollFrameListener): () => void {
  frameSubs.add(fn);
  publishCount();
  return () => {
    if (frameSubs.delete(fn)) publishCount();
  };
}

/** Called by LenisController only, right after lenis.raf(t). */
export function notifyScrollFrame(time: number): void {
  if (frameSubs.size === 0) return;
  frame.time = time;
  frame.scroll = window.scrollY;
  for (const fn of frameSubs) {
    try {
      fn(frame);
    } catch (e) {
      console.error(e);
    }
  }
}

/** number of post-frame subscribers (tests and leak checks) */
export const scrollFrameSubscribers = (): number => frameSubs.size;

/* ---------- scroll interruption ----------
   Something that takes over the page's attention (the chat opening) tells scroll-owning features to stop
   what they are animating and forget where they were heading. Features listen for the event; nothing here
   scrolls, locks or exposes Lenis. */
export const SCROLL_INTERRUPT_EVENT = "xc:interrupt-scroll";
export const interruptScroll = (): void => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SCROLL_INTERRUPT_EVENT));
};

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
