/* =====================================================================
   SHOWREEL SNAP, NAVIGATION AND FOCUS (Stage 5B-3).
   Ported from landing-prototype-clean/js/showreel.js, "horizontal snap", "vertical snap" and the
   focusin handler (lines 1112 to 1244), with the thresholds, stops and timings unchanged.

   WHAT IT DOES
   Vertical scrolling stays continuous. Inside the pinned reel:
   - SIDEWAYS input (a horizontal trackpad swipe, shift + wheel, the Left/Right keys, a horizontal touch
     swipe) steps to the next or previous resting position of the strip that is moving sideways: the
     carousel (four stops, one per card) or the "What we staff" panels (one stop per panel, plus the end).
   - A TAP on Down/Up steps to the next or previous resting beat of the whole reel: the opening card, the
     four carousel stops, the sphere once its text has settled, the panel stops, and the closing frame.
   - HOLDING Down/Up past the keyboard's repeat delay scrolls freely and smoothly instead.
   - Plain wheel, touch drag and everything outside the reel are untouched.
   - Keyboard focus that lands off screen inside the stage brings the pinned stage up (focus jump).

   OWNERSHIP
   - SUPERSEDED DESTINATIONS: a tap's remembered destination is valid only while that tap's own Lenis command is
     still current (it is tagged through scrollTo's userData). An anchor click, another programmatic scroll, the
     wheel, a native scroll or the snap finishing ends it; the snap's own animation frames do not, so taps chain.
   - INTERRUPTION: the chat opening (interruptScroll, lib/scroll/lenis.ts) cancels any snap or hold on desktop and
     phone alike, freezing the page where it is; nothing resumes and nothing snaps when the chat closes.
   - There is no scroll engine here. Every scroll is a command to the one shared Lenis instance
     (lib/scroll/lenis.ts; the instance is followed through onLenisChange, so it may appear after this
     module and may be replaced). The hold loop runs on the shared post-frame tick (onScrollFrame): no
     requestAnimationFrame loop of its own.
   - A new snap supersedes the one in flight (Lenis replaces its animation). Vertical user input (plain
     wheel, touch) clears the remembered snap destination, so a later tap measures from where the page
     really is. cancelAll() (a scroll lock, deactivation, destroy, tab hidden, a window blur) stops the hold,
     forgets the destination and, if a snap is still running, freezes it at the current position.
   - Everything is installed while the engine is active (createSnap) and removed by destroy(); the focus
     jump is installed for the engine's whole non-reduced lifetime (attachFocusJump).
   - Nothing is installed under OS reduced motion (the engine never starts there).

   WHEN IT STEPS BACK (does not own the input)
   - the page scroll is locked (lenis.isStopped: the phone chat sheet);
   - the event started inside a dialog, an element marked data-lenis-prevent (the chat panel and its rail) or the
     chat root (data-xc-chat: its launcher and panel), or in an input, textarea, select or editable element;
   - modifier keys, ctrl+wheel (zoom), composing text, an already-handled event;
   - the scroll position is outside the interaction's zone (the wheel/Left/Right need a sideways zone; the
     arrows need the pinned track).
   preventDefault is called only when a step was actually taken or deliberately swallowed.
   ===================================================================== */
import type Lenis from "lenis";
import { isPaused } from "@/lib/motion/motion";
import { SCROLL_INTERRUPT_EVENT, onLenisChange, onScrollFrame, type ScrollFrame } from "@/lib/scroll/lenis";
import { OLD_MAX, PF_DUR, PS, VSCROLL_MAX, clamp01 } from "./timeline";

/* ---------- constants (verbatim from the prototype) ---------- */
/** the sphere's "text on file" copy has finished arriving (gp 0.735) */
export const SPHERE_REST = 0.735 * OLD_MAX;
/** the panel strip's timeline: enter 0.267 of the way, then pan for 0.453 (pfEnter / pfSlide in timeline.ts) */
const PF_ENTER = 0.267, PF_PAN = 0.453;
const WHEEL_GESTURE_GAP = 220; // ms of silence that ends a wheel gesture (trackpad momentum is swallowed until then)
const WHEEL_THRESHOLD = 30; // accumulated sideways delta that triggers a step
const TOUCH_MIN = 50, TOUCH_RATIO = 1.5; // px, and |dx| must exceed 1.5 x |dy|
const STEP_DURATION = 0.9; // s, sideways steps
const REDUCED_DURATION = 0.01; // s, when animations are paused
const HOLD_SPEED = 2.2, HOLD_TAU = 0.12; // viewport heights per second, and the ease-in/out time constant (s)

/** Stop a running Lenis animation where it is. Lenis's scrollTo returns early (and so does not stop anything) when the
 *  target equals its current targetScroll, which an animation keeps equal to its position, so the target is nudged by
 *  a hundredth of a pixel: an immediate scroll then resets the animation. */
function freeze(l: Lenis): void {
  l.scrollTo(l.animatedScroll + 0.01, { immediate: true, force: true });
}

export const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- the plan: zones and stops in timeline units (pure) ---------- */
export interface Zone { from: number; to: number; stops: readonly number[] }

/** Carousel zone and panel-strip zone. `tileLefts` = offsetLeft of each panel, `maxPan` = the strip's pan distance. */
export function computeZones(tileLefts: readonly number[], maxPan: number): [Zone, Zone] {
  // carousel: one stop per card (phase3 = 0, 1/3, 2/3, 1)
  const car = [0, 1, 2, 3].map((k) => (0.15 + (0.25 * k) / 3) * OLD_MAX);
  // panels: one stop per tile, measured from the track, plus the far end
  const x0 = tileLefts[0] ?? 0;
  const slides = [...new Set(tileLefts.map((l) => Math.min(1, (l - x0) / Math.max(1, maxPan))).concat(1).map((x) => Math.round(x * 1000) / 1000))];
  const pf = slides.filter((x, i, a) => i === 0 || x - a[i - 1] > 0.02).map((x) => PS + PF_DUR * (PF_ENTER + PF_PAN * x));
  return [
    { from: 0.1 * OLD_MAX, to: 0.415 * OLD_MAX, stops: car },
    { from: PS + PF_DUR * 0.2, to: PS + PF_DUR * 0.76, stops: pf },
  ];
}

/** Resting beats for the vertical arrows. */
export function computeVStops(zones: readonly [Zone, Zone]): number[] {
  const v = [0, ...zones[0].stops, SPHERE_REST, ...zones[1].stops, VSCROLL_MAX].sort((a, b) => a - b);
  return v.filter((x, i) => i === 0 || x - v[i - 1] > 10);
}

/* ---------- host: what the engine lends the snap ---------- */
export interface SnapHost {
  /** the engine's measured geometry (px, document coordinates); trackH is 0 while the page is hidden */
  geometry(): { trackTop: number; trackH: number };
  pfTrack: HTMLElement | null;
  portfolio: HTMLElement | null;
}
export interface Snap {
  /** re-read the panel strip's layout (call after the engine re-measures) */
  refresh(): void;
  /** idempotent: removes every listener, stops the hold, cancels a running snap */
  destroy(): void;
}

const EDITABLE = /^(INPUT|TEXTAREA|SELECT)$/;
/** Is this event target somewhere the showreel must not take input from? */
function isolated(t: EventTarget | null): boolean {
  const el = t instanceof Element ? t : null;
  if (!el) return false;
  return !!el.closest('[role="dialog"], [data-lenis-prevent], [data-xc-chat], [contenteditable]:not([contenteditable="false"])') || EDITABLE.test(el.tagName) || (el as HTMLElement).isContentEditable === true;
}

export function createSnap(host: SnapHost): Snap {
  let lenis: Lenis | null = null;
  let zones: [Zone, Zone] = computeZones([], 1);
  let vstops: number[] = computeVStops(zones);
  let destroyed = false;

  /* ---- geometry helpers ---- */
  const span = () => Math.max(1, host.geometry().trackH - window.innerHeight);
  const vToY = (v: number) => host.geometry().trackTop + (v / VSCROLL_MAX) * span();
  const yToV = (y: number) => clamp01((y - host.geometry().trackTop) / span()) * VSCROLL_MAX;
  const zoneAt = (y: number): Zone | null => {
    const v = yToV(y);
    return zones.find((z) => v >= z.from && v <= z.to) ?? null;
  };
  const inTrack = (y: number) => {
    const { trackTop, trackH } = host.geometry();
    return y >= trackTop - 4 && y <= trackTop + trackH - window.innerHeight + 4;
  };
  const refresh = () => {
    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    const pt = host.pfTrack, pf = host.portfolio;
    const lefts = pt ? Array.from(pt.children, (c) => (c as HTMLElement).offsetLeft) : [];
    const maxPan = pt && pf ? Math.max(1, pt.scrollWidth - pf.clientWidth + 3 * vmin) : 1;
    zones = computeZones(lefts, maxPan);
    vstops = computeVStops(zones);
  };

  /* ---- state ---- */
  let snapY = 0, snapUntil = 0, snapToken = 0, animUntil = 0; // animUntil: until when ANY snap step (sideways or vertical) is still running // where the last vertical tap is heading, until when, and which Lenis command it was
  let pressSnapped = false, holdDir = 0, holdVel = 0, holdT = -1;
  let holdUnsub: (() => void) | null = null;
  let acc = 0, lastWheel = 0, fired = false; // wheel gesture
  let tx = 0, ty = 0, touching = false; // touch gesture start

  const locked = () => !lenis || lenis.isStopped;
  /* The destination of the last vertical tap, but only while that tap's own Lenis command is still the current one.
     Every Lenis scrollTo (an anchor click, any other programmatic scroll, the wheel) replaces lenis.userData, a native
     scroll sets isScrolling to "native", and completion resets userData: any of them ends the memory. The snap's own
     animation frames change none of that, so consecutive taps still chain. */
  const remembered = (): number | null =>
    lenis && snapToken !== 0 && performance.now() < snapUntil && (lenis.userData as { showreelSnap?: number } | undefined)?.showreelSnap === snapToken && lenis.isScrolling !== "native"
      ? snapY
      : null;
  const duration = (d: number) => (isPaused() ? REDUCED_DURATION : d);

  /** Stop the hold loop and forget the remembered destination; freeze a running snap where it is. */
  function cancelAll(doFreeze: boolean) {
    const running = animUntil > performance.now();
    animUntil = 0;
    holdDir = 0; holdVel = 0; holdT = -1; pressSnapped = false; snapUntil = 0; acc = 0; fired = false; touching = false;
    holdUnsub?.(); holdUnsub = null;
    if (doFreeze && running && lenis && !lenis.isStopped) freeze(lenis);
  }

  /* ---- sideways step: the carousel and the panel strip ---- */
  function step(dir: number): boolean {
    if (!lenis) return false;
    const base = lenis.targetScroll;
    const z = zoneAt(base);
    if (!z) return false;
    const ys = z.stops.map(vToY);
    const to = dir > 0 ? ys.find((y) => y > base + 4) : [...ys].reverse().find((y) => y < base - 4);
    if (to == null) return true; // at the end of this strip: swallow the input, stay put
    const d = duration(STEP_DURATION);
    animUntil = performance.now() + d * 1000;
    lenis.scrollTo(to, { duration: d, easing: ease });
    return true;
  }

  /* ---- vertical tap step ---- */
  function vstep(dir: number): boolean {
    if (!lenis || lenis.isStopped) return false;
    // taps in quick succession chain: measure from where the last one is heading, not from where it is now
    const base = remembered() ?? lenis.targetScroll;
    if (!inTrack(base)) return false;
    const stops = vstops.map((v) => ({ v, y: vToY(v) }));
    const to = dir > 0 ? stops.find((x) => x.y > base + 4) : [...stops].reverse().find((x) => x.y < base - 4);
    if (!to) return false; // first or last beat: leave the key to the browser, so the page carries on
    const dist = Math.abs(to.y - base) / Math.max(1, span() / VSCROLL_MAX); // in timeline units
    const dur = isPaused() ? REDUCED_DURATION : Math.min(2.4, Math.max(0.9, 0.5 + dist / 1400));
    snapY = to.y;
    snapUntil = performance.now() + dur * 1000;
    snapToken += 1;
    animUntil = snapUntil;
    lenis.scrollTo(to.y, { duration: dur, easing: ease, userData: { showreelSnap: snapToken } });
    return true;
  }

  /* ---- hold: speed eases in and out, so starting and stopping feel like the wheel, not like a jump ---- */
  const holdTick = (f: ScrollFrame) => {
    if (!lenis || lenis.isStopped) { cancelAll(false); return; }
    if (holdT < 0) holdT = f.time;
    const dt = Math.min(0.05, (f.time - holdT) / 1000);
    holdT = f.time;
    holdVel += (holdDir * HOLD_SPEED * window.innerHeight - holdVel) * (1 - Math.exp(-dt / HOLD_TAU));
    const y = lenis.animatedScroll + holdVel * dt;
    if (holdDir && !inTrack(y)) { holdDir = 0; pressSnapped = false; } // left the reel: browser scrolling takes over
    if (!holdDir && Math.abs(holdVel) < 8) { holdVel = 0; holdT = -1; holdUnsub?.(); holdUnsub = null; return; }
    lenis.scrollTo(y, { immediate: true, force: true });
  };
  const holdStart = (dir: number) => {
    if (!lenis) return;
    holdDir = dir; holdVel = 0; snapUntil = 0; holdT = -1;
    freeze(lenis); // cancel the tap's snap
    if (!holdUnsub) holdUnsub = onScrollFrame(holdTick);
  };
  const holdStop = () => { holdDir = 0; };

  /* ---- listeners ---- */
  const onWheel = (e: WheelEvent) => {
    if (locked() || isolated(e.target)) return;
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (!dx) { snapUntil = 0; return; } // the visitor is scrolling vertically: forget any remembered destination
    if (e.ctrlKey || !zoneAt(lenis!.targetScroll)) return;
    e.preventDefault(); e.stopImmediatePropagation(); // keeps Lenis and the browser's back-swipe out of it
    const now = performance.now();
    if (now - lastWheel > WHEEL_GESTURE_GAP) { acc = 0; fired = false; }
    lastWheel = now;
    if (fired) return;
    acc += e.deltaMode === 1 ? dx * 16 : dx;
    if (Math.abs(acc) > WHEEL_THRESHOLD) { fired = true; step(Math.sign(acc)); }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || isolated(e.target) || isolated(document.activeElement)) return;
    if (locked()) { snapUntil = 0; if (holdDir || pressSnapped) cancelAll(false); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (step(e.key === "ArrowRight" ? 1 : -1)) e.preventDefault();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const dir = e.key === "ArrowDown" ? 1 : -1;
    if (!e.repeat) { // a tap: step to the next resting position
      holdStop();
      pressSnapped = vstep(dir);
      if (pressSnapped) e.preventDefault();
    } else if (holdDir) e.preventDefault(); // already holding: swallow the browser's repeats
    else if (pressSnapped) { holdStart(dir); e.preventDefault(); } // held past the key-repeat delay: scroll freely
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { pressSnapped = false; holdStop(); }
  };
  const onBlur = () => { pressSnapped = false; holdStop(); };
  const onInterrupt = () => cancelAll(true); // the chat opened: stop where we are, forget the destination, never resume
  const onVisibility = () => { if (document.hidden) cancelAll(false); }; // key-up and the animation clock do not arrive in the background
  const onTouchStart = (e: TouchEvent) => {
    touching = !locked() && !isolated(e.target) && e.touches.length === 1;
    if (!touching) return;
    snapUntil = 0; // a touch takes over from any remembered snap
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touching) return;
    touching = false;
    if (locked()) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) > TOUCH_MIN && Math.abs(dx) > TOUCH_RATIO * Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener(SCROLL_INTERRUPT_EVENT, onInterrupt);
  const offLenis = onLenisChange((l) => {
    lenis = l;
    if (!l) cancelAll(false);
  });
  refresh();

  return {
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(SCROLL_INTERRUPT_EVENT, onInterrupt);
      offLenis();
      cancelAll(true);
      lenis = null;
    },
  };
}

/* =====================================================================
   FOCUS JUMP
   The stage is pinned (sticky), so the browser's own scroll-into-view can leave a keyboard-focused button
   below the fold. When keyboard focus lands on something inside the showreel that is off screen, bring the
   pinned stage up (scroll to its start, immediately) once the browser's own scroll has settled (150 ms).
   Keyboard focus only: a mouse click that focuses a link must not fight the scroll it starts. Verbatim from
   the prototype, except that it does nothing while the page scroll is locked, and its timer is cleared on detach.
   ===================================================================== */
export function attachFocusJump(root: HTMLElement, trackTop: () => number): () => void {
  let lenis: Lenis | null = null;
  let timer = 0;
  const offLenis = onLenisChange((l) => { lenis = l; });
  const onFocusIn = (e: FocusEvent) => {
    const target = e.target as HTMLElement | null;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!target || document.activeElement !== target || !target.matches(":focus-visible")) return;
      const r = target.getBoundingClientRect();
      if (!r.height || (r.top <= window.innerHeight - 8 && r.bottom >= 8)) return;
      if (lenis?.isStopped) return; // a scroll lock (the chat sheet) is respected
      const y = trackTop();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, 150);
  };
  root.addEventListener("focusin", onFocusIn);
  let done = false;
  return () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    root.removeEventListener("focusin", onFocusIn);
    offLenis();
  };
}
