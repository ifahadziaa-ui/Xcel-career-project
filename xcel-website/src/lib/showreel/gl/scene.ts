/* =====================================================================
   The contract between the GL manager (manager.ts) and one WebGL scene.

   A scene owns exactly: one WebGLRenderer on one canvas, its geometry and materials, and the listeners it
   adds (context loss, pointer). It never schedules anything: the manager calls it from the shared tick.
   ===================================================================== */
import type { Three } from "./three";

export interface GlScene {
  /** Draw for virtual time `t` (ms). May skip the frame (a scene's own frame-rate cap). */
  render(t: number): void;
  /** Draw now, unconditionally (after a resize, a restore, a pause change). */
  redraw(): void;
  /** Re-read the viewport; redraws when the buffer size changed. */
  resize(): void;
  /** true between webglcontextlost and webglcontextrestored */
  readonly lost: boolean;
  /** Idempotent. Frees geometry, material and renderer, releases the context, removes every listener. */
  dispose(): void;
}

export interface SceneHooks {
  /** the site's motion preference (frozen clock and no pointer pull while paused) */
  isPaused(): boolean;
  /** the context was lost: the manager shows the CSS fallback */
  onLost(): void;
  /** the context came back and the scene redrew: the manager may show the canvas again */
  onRestored(): void;
}

export type SceneFactory = (T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks) => GlScene;
