/* =====================================================================
   The renderer plumbing the aurora and the sphere share (Stage 5B-5): one WebGLRenderer on one canvas with a
   transparent clear colour, a drawing buffer sized from the canvas's LAYOUT box (never from a transformed rect,
   so it does not balloon while the stage zooms), adaptive resolution, context loss and teardown. The 5B-4
   gradient keeps its own, differently sized (viewport, pixel ratio 1) copy of this and is not changed.

   Kept from the prototype's glCanvas(): a resize clears a WebGL buffer, so every resize is followed by an
   immediate redraw (a cleared buffer would show as a black frame); the resolution never drops below 0.6.
   Different from the prototype: no ResizeObserver (the canvases fill the viewport or a viewport-sized box whose
   layout size changes only with the window, and the manager's resize() is called from the engine's one resize
   handler), and it handles context loss and releases everything on dispose().
   ===================================================================== */
import type { Three } from "./three";
import type { SceneHooks } from "./scene";

export const MIN_PIXEL_RATIO = 0.6;

/** three.js does not throw when a shader fails to compile or link: it logs and draws nothing, which would show an
    empty canvas over the CSS fallback. Called after the warm-up draw so a broken program becomes a creation failure. */
export function assertProgramLinked(renderer: InstanceType<Three["WebGLRenderer"]>, material: object): void {
  const gl = renderer.getContext();
  if (gl.isContextLost()) return; // the loss handler owns that case
  const program = (renderer.properties.get(material) as { currentProgram?: { program: WebGLProgram } }).currentProgram?.program;
  if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("shader program failed to compile or link");
}

export interface GlHost {
  readonly renderer: InstanceType<Three["WebGLRenderer"]>;
  readonly lost: boolean;
  /** drawing-buffer size in CSS pixels (the canvas's layout box) */
  readonly width: number;
  readonly height: number;
  /** set by the scene right after it has built its meshes */
  draw: () => void;
  /** draw unless lost or disposed; notices a context that was lost while drawing */
  paint(): void;
  /** re-read the layout box; applies and redraws when it changed (or when `force`) */
  size(force?: boolean): void;
  setQuality(q: number): void;
  /** tears down; `release` frees the scene's own geometry and material first */
  dispose(release: () => void): void;
}

export interface HostOptions {
  /** base pixel ratio before the quality fraction */
  basePixelRatio: number;
  /** multisampled antialiasing (the closing mark only; the other scenes draw soft shapes) */
  antialias?: boolean;
  /** ignore the manager's adaptive-resolution level (the closing mark is left at its base ratio, as in the prototype) */
  fixedPixelRatio?: boolean;
  /** the context came back: rebuild whatever lived only in GPU memory (render targets), before the buffer is redrawn */
  onRestored?(): void;
  /** the buffer size changed (CSS px) */
  onSize?(w: number, h: number): void;
}

export function createGlHost(T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks, o: HostOptions): GlHost {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: o.antialias ?? false, premultipliedAlpha: true, powerPreference: "high-performance" });
  const gl = renderer.getContext();
  if (gl.isContextLost()) {
    renderer.dispose();
    throw new Error("WebGL context is lost at creation");
  }
  renderer.setClearColor(0x000000, 0);
  const prFor = (q: number) => (q >= 1 ? o.basePixelRatio : Math.max(MIN_PIXEL_RATIO, o.basePixelRatio * q));
  let pr = o.fixedPixelRatio ? o.basePixelRatio : prFor(hooks.quality());
  renderer.setPixelRatio(pr);

  let lost = false, disposed = false, w = 1, h = 1;
  const host: GlHost = {
    renderer,
    get lost() { return lost; },
    get width() { return w; },
    get height() { return h; },
    draw: () => {},
    paint() {
      if (lost || disposed) return;
      host.draw();
      if (gl.isContextLost()) lost = true;
    },
    size(force = false) {
      if (lost || disposed) return;
      const nw = Math.max(1, canvas.clientWidth), nh = Math.max(1, canvas.clientHeight);
      if (!force && nw === w && nh === h) return;
      w = nw; h = nh;
      renderer.setSize(w, h, false);
      o.onSize?.(w, h);
      host.paint(); // never present a cleared buffer
    },
    setQuality(q) {
      const d = prFor(q);
      if (lost || disposed || Math.abs(d - pr) < 0.01) return;
      pr = d;
      renderer.setPixelRatio(d);
      renderer.setSize(w, h, false);
      o.onSize?.(w, h);
      host.paint(); // resizing clears the buffer: redraw at once
    },
    dispose(release) {
      if (disposed) return;
      disposed = true; // first: a loss or restore event during teardown must not bring anything back
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      release();
      renderer.dispose();
      if (!gl.isContextLost()) {
        try {
          renderer.forceContextLoss(); // release the context now; the canvas is replaced before it is used again
        } catch {}
      }
    },
  };

  // The default is prevented because the scene can come back (three.js re-initialises its state and recompiles
  // the program on the next render; geometry and uniforms live in JavaScript). Until then nothing is drawn and
  // the manager shows the CSS fallback.
  const onLost = (e: Event) => {
    e.preventDefault();
    if (disposed) return;
    lost = true;
    hooks.onLost();
  };
  const onRestored = () => {
    if (disposed) return;
    lost = gl.isContextLost();
    if (lost) return;
    try {
      o.onRestored?.();
    } catch (e) {
      lost = true; // could not rebuild: stay on the CSS fallback until the scene is disposed
      console.warn("[showreel] WebGL scene could not be restored, using the CSS fallback", e);
      return;
    }
    host.size(true); // a restored context has an empty buffer: draw at once
    hooks.onRestored();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  return host;
}
