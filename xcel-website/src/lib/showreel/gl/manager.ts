/* =====================================================================
   GL MANAGER (Stage 5B-4): who owns the showreel's WebGL scenes, when they exist, and when they draw.

   OWNERSHIP
   - One manager per ACTIVE engine (engine.ts creates it in attach() and destroys it in detach()): it exists
     exactly as long as the engine's subscription to the shared tick, so a hidden route, a stage far from the
     viewport, or reduced motion (the engine is "off") has no manager, no Three.js, no renderer, no context.
   - The manager owns the scenes (scene.ts), their <canvas> elements, the virtual clock and the fallback
     state. React renders the canvases once on the server, empty; the manager looks them up by data-sr in the
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

   DIAGNOSTICS: root[data-gl-live] lists the scenes that exist (written when it changes).
   ===================================================================== */
import { isPaused } from "@/lib/motion/motion";
import * as T from "../timeline";
import { createGradientScene } from "./gradient";
import type { GlScene, SceneFactory, SceneHooks } from "./scene";
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
  make: SceneFactory;
}

/* The showreel's scenes. Ranges are the prototype's sceneVisibility() (timeline.ts): the opening gradient draws
   while gp < 0.8 (v < 1600); the closing gradient draws once the closing beat is active (v > 2799) and is
   created from v 2600 (CLOSE_START - 200). Later stages add the aurora, sphere and closing mark here. */
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
    name: "targetBg",
    canvas: "target-bg",
    create: (p) => T.sceneVisibility(p).target,
    release: (p) => T.vScroll(p) < 2400,
    draw: (p) => T.closeActive(p),
    make: (three, canvas, hooks) => createGradientScene(three, canvas, hooks, { follow: false }),
  },
];

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

  const canvasFor = (spec: SceneSpec) => root.querySelector<HTMLCanvasElement>(`canvas[data-sr="${spec.canvas}"]`);
  const diag = () => {
    if (dead || live.size === 0) delete root.dataset.glLive;
    else root.dataset.glLive = [...live.keys()].join(",");
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

  return {
    frame(t, p) {
      if (dead) return;
      lastP = p;
      const dt = lastT == null ? 0 : Math.min(100, t - lastT);
      lastT = t;
      const paused = isPaused();
      if (!paused) clock += dt;
      for (const spec of SPECS) {
        const l = live.get(spec.name);
        if (!l) {
          if (!creating.has(spec.name) && !failed.has(spec.name) && spec.create(p)) create(spec);
          continue;
        }
        if (spec.release(p)) { dispose(spec.name); continue; }
        if (l.scene.lost) continue;
        if (spec.draw(p) && (!paused || p !== l.lastP || l.dirty)) {
          if (l.dirty) l.scene.redraw();
          else l.scene.render(clock);
          l.lastP = p;
          l.dirty = false;
        }
        // shown from the frame after its first drawn frame, so the canvas never appears blank
        if (l.state === "pending" && !l.dirty) {
          l.state = "live";
          l.canvas.dataset.gl = "live";
        }
      }
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
