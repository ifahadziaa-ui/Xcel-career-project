/* =====================================================================
   The showreel's gradient scene: a port of makeHeroGradient() in landing-prototype-clean/js/showreel.js
   (lines 610 to 657), used twice: the opening card's gradient (the pointer pulls it) and the closing frame's
   gradient (`follow: false`: the pointer is parked far away, where its pull is zero).

   Kept from the prototype, on purpose:
   - the drawing buffer is sized from the VIEWPORT (not the card, which resizes every scroll frame while it
     shrinks into the carousel: resizing a WebGL buffer clears it) and CSS stretches it; a soft gradient loses
     nothing when stretched. It changes only when the window does, and is redrawn at once;
   - pixel ratio 1, no alpha, no antialiasing, high-performance power preference;
   - the frame-rate cap (about 36 fps), the pointer easing (0.12 per frame) and u_time in seconds of the
     showreel's virtual clock (which stands still while animations are paused).
   Different from the prototype: it owns no loop and no window listeners (the manager calls render/resize),
   it handles context loss, and dispose() really frees everything.
   ===================================================================== */
import type { Three } from "./three";
import type { GlScene, SceneHooks } from "./scene";
import { CLIP_VERT, GRADIENT_FRAG } from "./shaders";

const MIN_FRAME_MS = 1000 / 36;

export function createGradientScene(T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks, opts: { follow: boolean }): GlScene {
  const renderer = new T.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
  const gl = renderer.getContext();
  let lost = gl.isContextLost();
  let disposed = false;
  if (lost) {
    renderer.dispose();
    throw new Error("WebGL context is lost at creation");
  }
  renderer.setPixelRatio(1);
  const scene = new T.Scene();
  const camera = new T.Camera();
  const uniforms = { u_resolution: { value: new T.Vector2(1, 1) }, u_time: { value: 0 }, u_mouse: { value: new T.Vector2(0, 0) } };
  const geometry = new T.PlaneGeometry(2, 2);
  const material = new T.ShaderMaterial({ vertexShader: CLIP_VERT, fragmentShader: GRADIENT_FRAG(true), uniforms });
  const mesh = new T.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  let bw = 0, bh = 0, last = -1e9;
  const draw = () => {
    if (lost || disposed) return;
    renderer.render(scene, camera);
    if (gl.isContextLost()) lost = true;
  };
  const size = (force = false) => {
    const w = Math.max(2, Math.round(window.innerWidth)), h = Math.max(2, Math.round(window.innerHeight));
    if (!force && w === bw && h === bh) return;
    bw = w; bh = h;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(w, h);
    draw(); // never present a cleared buffer
  };
  size(true);

  // follow = false parks the "cursor" far outside the canvas, where its pull on the gradient is zero
  const target = opts.follow ? { x: bw * 0.5, y: bh * 0.3 } : { x: -1e5, y: -1e5 };
  const cur = { ...target };
  const onPointer = (e: PointerEvent) => {
    if (hooks.isPaused()) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    target.x = ((e.clientX - r.left) / r.width) * bw;
    target.y = ((e.clientY - r.top) / r.height) * bh;
  };
  if (opts.follow) window.addEventListener("pointermove", onPointer, { passive: true });
  uniforms.u_mouse.value.set(cur.x, cur.y);

  // Context loss: the default is prevented because the scene can come back (three.js re-initialises its state and
  // recompiles the program on the next render; the uniforms live in JavaScript). Until then nothing is drawn and the
  // manager shows the CSS fallback.
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
    last = -1e9;
    size(true); // a restored context has an empty buffer: draw at once
    hooks.onRestored();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  draw(); // warm-up: compile the shader now, not mid-scroll

  return {
    get lost() { return lost; },
    redraw: draw,
    resize: () => size(),
    render(t) {
      if (lost || disposed) return;
      if (t - last < MIN_FRAME_MS) return; // ~36 fps is plenty for a slow gradient
      last = t;
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      uniforms.u_mouse.value.set(cur.x, cur.y);
      uniforms.u_time.value = t / 1000;
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true; // first: a loss or restore event during teardown must not bring anything back
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("pointermove", onPointer);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (!gl.isContextLost()) {
        try {
          renderer.forceContextLoss(); // release the context now; the canvas is replaced before it is used again
        } catch {}
      }
    },
  };
}
