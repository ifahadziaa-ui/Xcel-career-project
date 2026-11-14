/* =====================================================================
   Shared ticker and spring, ported from landing-prototype-clean/js/motion.js
   (react-spring semantics, one requestAnimationFrame loop for everything).

   Differences from the prototype, none of them behavioural:
   - no work at import time (the module is evaluated on the server too);
   - ticker.add() returns an unsubscribe, spring().stop() really stops it;
   - "reduced" is the site's motion preference (isPaused(): the OS setting
     unless the visitor chose), not only the OS media query.
   Springs are for imperative, per-frame style writes behind a React effect.
   ===================================================================== */
import { isPaused } from "./motion";

export const reduced = (): boolean => isPaused();

type Sub = { fn: (now: number) => boolean | void; gap: number; last: number };
const subs = new Set<Sub>();
let rafId = 0;

function loop(now: number) {
  for (const s of [...subs]) {
    if (s.gap && now - s.last < s.gap) continue;
    s.last = now;
    let keep = true;
    try {
      keep = s.fn(now) !== false;
    } catch (e) {
      console.error(e);
      keep = false;
    }
    if (!keep) subs.delete(s);
  }
  rafId = subs.size ? requestAnimationFrame(loop) : 0;
}

export const ticker = {
  /** Returns the unsubscribe function. Return false from fn to unsubscribe too. */
  add(fn: Sub["fn"], gap = 0): () => void {
    const s: Sub = { fn, gap, last: -Infinity };
    subs.add(s);
    if (!rafId) rafId = requestAnimationFrame(loop);
    return () => {
      subs.delete(s);
    };
  },
  /** Number of live subscribers (for tests and leak checks). */
  get size() {
    return subs.size;
  },
};

export interface SpringOptions {
  from?: number;
  to?: number;
  tension?: number;
  friction?: number;
  delay?: number;
  onUpdate?: (v: number) => void;
  onRest?: () => void;
}
export interface Spring {
  readonly value: number;
  set(v: number, o?: { delay?: number; immediate?: boolean; config?: { tension: number; friction: number } }): void;
  stop(): void;
}

export function spring({ from = 0, to = 1, tension = 170, friction = 26, delay = 0, onUpdate, onRest }: SpringOptions = {}): Spring {
  let pos = from, vel = 0, target = to, startAt = performance.now() + delay, last: number | null = null, done = false, running = false;
  let unsub: (() => void) | null = null;
  const run = () => {
    if (!running) {
      running = true;
      unsub = ticker.add((now) => (running = step(now)));
    }
  };
  const s: Spring = {
    get value() {
      return pos;
    },
    set(v, { delay: d = 0, immediate = false, config } = {}) {
      if (config) ({ tension, friction } = config);
      target = v;
      from = pos;
      startAt = performance.now() + d;
      done = false;
      last = null;
      if (immediate || reduced()) {
        pos = v;
        vel = 0;
        onUpdate?.(pos);
        done = true;
        onRest?.();
      } else run();
    },
    stop() {
      done = true;
      running = false;
      unsub?.();
      unsub = null;
    },
  };
  function step(now: number): boolean {
    if (done) return false;
    if (now < startAt) return true;
    const dt = Math.min(64, last == null ? 16 : now - last);
    last = now;
    const precision = Math.min(1, Math.abs(target - from) * 0.001) || 0.001,
      restV = precision / 10;
    for (let i = 0; i < Math.ceil(dt); i++) {
      const f = -tension * 0.000001 * (pos - target) - friction * 0.001 * vel;
      vel += f;
      pos += vel;
    }
    if (Math.abs(vel) <= restV && Math.abs(target - pos) <= precision) {
      pos = target;
      vel = 0;
      done = true;
    }
    onUpdate?.(pos);
    if (done) onRest?.();
    return !done;
  }
  if (reduced()) {
    pos = to;
    onUpdate?.(pos);
    onRest?.();
  } else run();
  return s;
}
