/* =====================================================================
   The contract between the GL manager (manager.ts) and one WebGL scene.

   A scene owns exactly: one WebGLRenderer on one canvas, its geometry and materials, and the listeners it
   adds (context loss, pointer). It never schedules anything: the manager calls it from the shared tick.
   ===================================================================== */
import type { Three } from "./three";

export interface GlScene {
  /** Draw for virtual time `t` (ms) and the scene's timeline value `v` (SceneSpec.drive; 0 if it has none).
      May skip the frame (a scene's own frame-rate cap). */
  render(t: number, v: number): void;
  /** Draw now, unconditionally, with the last time (after a resize, a restore, a pause change); `v` refreshes the
      timeline value so a redraw never shows a stale one. */
  redraw(v?: number): void;
  /** Re-read the viewport; redraws when the buffer size changed. */
  resize(): void;
  /** The manager has the scene but is not drawing it this frame (outside its drawn range): forget the frame gap. */
  pause?(): void;
  /** Adaptive resolution (aurora, sphere): render at this fraction of the base pixel ratio. Absent = fixed. */
  setQuality?(q: number): void;
  /** true between webglcontextlost and webglcontextrestored */
  readonly lost: boolean;
  /** Idempotent. Frees geometry, material and renderer, releases the context, removes every listener. */
  dispose(): void;
}

export interface SceneHooks {
  /** the site's motion preference (frozen clock and no pointer pull while paused) */
  isPaused(): boolean;
  /** the manager's current resolution fraction (1 = full), read once when a scene is created */
  quality(): number;
  /** the context was lost: the manager shows the CSS fallback */
  onLost(): void;
  /** the context came back and the scene redrew: the manager may show the canvas again */
  onRestored(): void;
}

export type SceneFactory = (T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks) => GlScene;
