/* =====================================================================
   GL MANAGER (Stage 5B-4): who owns the showreel's WebGL scenes, when they exist, and when they draw.

   OWNERSHIP
   - One manager per ACTIVE engine (engine.ts creates it in attach() and destroys it in detach()): it exists
     exactly as long as the engine's subscription to the shared tick, so a hidden route, a stage far from the
     viewport, or reduced motion (the engine is "off") has no manager, no Three.js, no renderer, no context.
   - The manager owns the scenes (scene.ts), their <canvas> elements, the virtual clock, the adaptive-resolution
     level of the heavy scenes and the fallback state. React renders the canvases once on the server, empty; the manager looks them up by data-sr in the
     engine's root (never by id) each time it needs one.
   - A canvas is used for ONE renderer. After a renderer is disposed its context is lost for good (getContext
     would hand back the dead one), so dispose replaces the canvas with a fresh empty clone.

   SCHEDULING
   - No loop, no timer, no listener of its own: frame(t, p) is called by the engine from its onScrollFrame
     callback, i.e. on the shared Lenis tick, only while the stage is near. A scene is created when the
     timeline gets close to the range it draws in, drawn only inside that range, and disposed once the
     timeline has moved well past it (the two ranges leave a gap, so at most one gradient exists at a time and
     a reader hovering at a boundary does not create and destroy it repeatedly).
   - While animations are paused the clock stands still and a scene is redrawn only when the scroll position
     changed or it was invalidated (resize, restore, tab visible again), as in the prototype.

   FALLBACK (the CSS underneath is always there; the canvas is only shown while a scene is drawing)
   - canvas[data-gl] is absent (no scene), "pending" (created, first frame drawn, not yet shown), "live"
     (shown), "lost" (context lost: hidden at once, no transition) or "failed" (could not be created; the
     scene is not retried until the next activation). CSS fades "live" in and shows nothing otherwise.
   - Context loss: the default is prevented (the scene can recover), drawing stops, the canvas hides. On
     restoration the scene redraws at once and is shown again on the next frame, if it still exists.
   - Creation can fail (no WebGL, a lost context at creation, the Three.js chunk failing to load): caught, one
     console.warn, the CSS fallback stays, nothing is retried every frame.
   - Teardown first marks the scene disposed and removes its listeners, then releases the context, so a loss
     event during or after dispose cannot resurrect anything; creation that finishes after destroy() is
     discarded.

   DIAGNOSTICS: root[data-gl-live] lists the scenes that exist and root[data-quality] is the adaptive-resolution
   level (0 = full), both written when they change and absent when no scene exists.
   ===================================================================== */
import { isPaused } from "@/lib/motion/motion";
import * as T from "../timeline";
import { createAuroraScene } from "./aurora";
import { createGradientScene } from "./gradient";
import { createMarkScene } from "./mark";
import type { GlScene, SceneFactory, SceneHooks } from "./scene";
import { createSphereScene } from "./sphere";
import { loadThree } from "./three";

interface SceneSpec {
  name: string;
  /** data-sr of the server-rendered canvas */
  canvas: string;
  /** timeline: create the scene now? */
  create(p: number): boolean;
  /** timeline: dispose it now? (must be false wherever create is true, with a gap between) */
  release(p: number): boolean;
  /** timeline: draw it now? */
  draw(p: number): boolean;
  /** timeline value handed to the scene with every draw (the sphere's dispersal); 0 when absent */
  drive?(p: number): number;
  /** adaptive resolution applies to this scene (the aurora and the sphere, as in the prototype) */
  governed?: boolean;
  make: SceneFactory;
}

/* The showreel's scenes. "draw" is the prototype's sceneVisibility() (timeline.ts, v = p * 3700): the opening
   gradient while gp < 0.8 (v < 1600); the aurora while v is in (1000, 3450) AND auroraOpacity > 0 (so v 1200 to
   3250); the sphere while gp > 0.395 (v > 790) up to the portfolio's end (v < 3100); the closing gradient once the
   closing beat is active (v > 2799). A scene is created 200 v ahead of its range (a head start of about a screen
   of scrolling; the aurora's range ends where its opacity reaches 0, v 3250) and disposed 100 to 200 v after it, so a reader hovering at a boundary does not create and destroy it
   repeatedly. Later stages add the closing mark here. */
const SPECS: readonly SceneSpec[] = [
  {
    name: "hero",
    canvas: "hero-canvas",
    create: (p) => T.sceneVisibility(p).hero,
    release: (p) => T.vScroll(p) > 1900,
    draw: (p) => T.sceneVisibility(p).hero,
    make: (three, canvas, hooks) => createGradientScene(three, canvas, hooks, { follow: true }),
  },
  {
    name: "sphere",
    canvas: "sphere-canvas",
    create: (p) => { const v = T.vScroll(p); return v > 590 && v < T.PF_END + 200; },
    release: (p) => { const v = T.vScroll(p); return v < 390 || v > T.PF_END + 300; },
    draw: (p) => T.sceneVisibility(p).sphere,
    drive: T.sphereDisperse,
    governed: true,
    make: createSphereScene,
  },
  {
    name: "aurora",
    canvas: "aurora-canvas",
    create: (p) => { const v = T.vScroll(p); return v > 800 && v < 3450; },
    release: (p) => { const v = T.vScroll(p); return v < 600 || v > 3550; },
    draw: (p) => T.sceneVisibility(p).aurora && T.auroraOpacity(p) > 0,
    governed: true,
    make: createAuroraScene,
  },
  {
    name: "targetBg",
    canvas: "target-bg",
    create: (p) => T.sceneVisibility(p).target,
    release: (p) => T.vScroll(p) < 2400,
    draw: (p) => T.closeActive(p),
    make: (three, canvas, hooks) => createGradientScene(three, canvas, hooks, { follow: false }),
  },
  {
    name: "mark",
    canvas: "target-canvas",
    create: (p) => T.sceneVisibility(p).target,
    release: (p) => T.vScroll(p) < 2400,
    draw: (p) => T.closeActive(p),
    drive: T.markReveal,
    make: createMarkScene,
  },
];

/* Adaptive resolution (the prototype's govern(), 5B-5): when frames stay slow while a governed scene draws, those
   canvases step down to a lower pixel ratio (1 -> 0.75 -> 0.6 -> 0.5 of their base, never below 0.6 absolute); they
   step back up only after a long stretch of headroom, and stay down if going back up made it slow again. It runs
   on the frame times the shared tick already delivers; there is no timer of its own. */
const QUALITY = [1, 0.75, 0.6, 0.5];
const SLOW_MS = 28, FAST_MS = 14;

interface Live {
  scene: GlScene;
  canvas: HTMLCanvasElement;
  state: "pending" | "live" | "lost";
  dirty: boolean;
  lastP: number;
}

export interface GlManager {
  /** One tick of the shared ticker: create, draw and release scenes for scroll progress p. */
  frame(t: number, p: number): void;
  /** The viewport changed. */
  resize(): void;
  /** Redraw every scene at the next frame (tab visible again). */
  invalidate(): void;
  /** Idempotent: dispose every scene, replace its canvas, discard creation still in flight. */
  destroy(): void;
}

export function createGlManager(root: HTMLElement): GlManager {
  const live = new Map<string, Live>();
  const creating = new Set<string>();
  const failed = new Set<string>();
  let dead = false;
  let lastP = 0;
  let clock = 0, lastT: number | null = null; // virtual clock (ms): stands still while animations are paused
  // adaptive resolution state (see QUALITY)
  let qLevel = 0, qEma = 16.7, qSince = 0, qCheck = 0, qUp = -1e9, qBlockedUp = false;

  const canvasFor = (spec: SceneSpec) => root.querySelector<HTMLCanvasElement>(`canvas[data-sr="${spec.canvas}"]`);
  const diag = () => {
    if (dead || live.size === 0) { delete root.dataset.glLive; delete root.dataset.quality; }
    else { root.dataset.glLive = [...live.keys()].join(","); root.dataset.quality = String(qLevel); }
  };
  const fail = (spec: SceneSpec, canvas: HTMLCanvasElement | null, e: unknown) => {
    failed.add(spec.name);
    if (canvas) canvas.dataset.gl = "failed";
    console.warn(`[showreel] WebGL scene "${spec.name}" unavailable, using the CSS fallback`, e);
  };

  function create(spec: SceneSpec) {
    creating.add(spec.name);
    loadThree().then(
      (three) => {
        creating.delete(spec.name);
        // the owner may have been destroyed, or the timeline moved on, while Three.js was loading
        if (dead || live.has(spec.name) || failed.has(spec.name) || !spec.create(lastP)) return;
        const canvas = canvasFor(spec);
        if (!canvas) return;
        const entry: Live = { scene: null as unknown as GlScene, canvas, state: "pending", dirty: true, lastP: -1 };
        const hooks: SceneHooks = {
          isPaused,
          quality: () => QUALITY[qLevel],
          onLost() {
            entry.state = "lost";
            canvas.dataset.gl = "lost";
          },
          onRestored() {
            entry.state = "pending";
            entry.dirty = true;
          },
        };
        try {
          entry.scene = spec.make(three, canvas, hooks); // draws once (warm-up) before returning
        } catch (e) {
          replaceCanvas(canvas); // whatever the failed attempt did to it
          fail(spec, canvasFor(spec), e);
          return;
        }
        canvas.dataset.gl = "pending";
        live.set(spec.name, entry);
        diag();
      },
      (e) => {
        creating.delete(spec.name);
        if (!dead) fail(spec, null, e);
      },
    );
  }

  function dispose(name: string) {
    const l = live.get(name);
    if (!l) return;
    live.delete(name);
    l.scene.dispose();
    replaceCanvas(l.canvas);
    diag();
  }

  const setQuality = (level: number, now: number) => {
    qLevel = level; qSince = now; qEma = 16.7;
    for (const spec of SPECS) if (spec.governed) live.get(spec.name)?.scene.setQuality?.(QUALITY[level]);
    root.dataset.quality = String(level);
  };
  const govern = (dt: number, now: number) => {
    if (dt <= 0 || dt > 200) return; // a hidden tab or a stall, not a measurement
    qEma += (dt - qEma) * 0.08;
    if (now - qCheck < 500) return;
    qCheck = now;
    if (qEma > SLOW_MS && qLevel < QUALITY.length - 1 && now - qSince > 1500) {
      if (now - qUp < 10000) qBlockedUp = true; // it was fine one level down: do not oscillate
      setQuality(qLevel + 1, now);
    } else if (qEma < FAST_MS && qLevel > 0 && !qBlockedUp && now - qSince > 8000) {
      qUp = now;
      setQuality(qLevel - 1, now);
    }
  };

  return {
    frame(t, p) {
      if (dead) return;
      lastP = p;
      const dt = lastT == null ? 0 : Math.min(100, t - lastT);
      lastT = t;
      const paused = isPaused();
      if (!paused) clock += dt;
      let governedDrew = false;
      for (const spec of SPECS) {
        const l = live.get(spec.name);
        if (!l) {
          if (!creating.has(spec.name) && !failed.has(spec.name) && spec.create(p)) create(spec);
          continue;
        }
        if (spec.release(p)) { dispose(spec.name); continue; }
        if (l.scene.lost) continue;
        const inRange = spec.draw(p);
        if (!inRange) l.scene.pause?.();
        if (inRange && (!paused || p !== l.lastP || l.dirty)) {
          const v = spec.drive ? spec.drive(p) : 0;
          if (l.dirty) l.scene.redraw(v);
          else l.scene.render(clock, v);
          if (spec.governed) governedDrew = true;
          l.lastP = p;
          l.dirty = false;
        }
        // shown from the frame after its first drawn frame, so the canvas never appears blank
        if (l.state === "pending" && !l.dirty) {
          l.state = "live";
          l.canvas.dataset.gl = "live";
        }
      }
      if (governedDrew && !paused) govern(dt, t);
    },
    resize() {
      if (dead) return;
      for (const l of live.values()) if (!l.scene.lost) l.scene.resize();
    },
    invalidate() {
      for (const l of live.values()) l.dirty = true;
    },
    destroy() {
      if (dead) return;
      dead = true; // first: creation still in flight is discarded
      for (const name of [...live.keys()]) dispose(name);
      for (const spec of SPECS) {
        const c = canvasFor(spec);
        if (c) delete c.dataset.gl; // a "failed" or "lost" marker does not outlive the owner
      }
      delete root.dataset.glLive;
      delete root.dataset.quality;
    },
  };
}

/** The old canvas's context is gone for good: put an empty twin in its place for the next renderer. */
function replaceCanvas(old: HTMLCanvasElement) {
  if (!old.isConnected) return;
  const fresh = old.cloneNode(false) as HTMLCanvasElement;
  delete fresh.dataset.gl;
  old.replaceWith(fresh);
}
