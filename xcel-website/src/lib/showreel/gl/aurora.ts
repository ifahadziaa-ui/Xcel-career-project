/* =====================================================================
   The aurora: a port of makeAurora() in landing-prototype-clean/js/showreel.js (lines 659 to 669). A full-screen
   clip-space quad with AURORA_FRAG (a domain-warped signal-red band, premultiplied alpha) drawn over the stage
   in a fixed layer. The layer's opacity (auroraOpacity) and visibility belong to the engine; the shader's own
   u_time is the showreel's virtual clock in seconds.

   Same as the prototype: pixel ratio min(devicePixelRatio, 2), transparent, buffer from the layout box, a draw
   on every tick the manager asks for one (no frame cap), adaptive resolution.
   ===================================================================== */
import type { Three } from "./three";
import type { GlScene, SceneHooks } from "./scene";
import { AURORA_FRAG, AURORA_VERT } from "./shaders";
import { assertProgramLinked, createGlHost } from "./host";

export function createAuroraScene(T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks): GlScene {
  const host = createGlHost(T, canvas, hooks, { basePixelRatio: Math.min(window.devicePixelRatio || 1, 2) });
  const scene = new T.Scene();
  const camera = new T.Camera();
  const uniforms = { u_time: { value: 0 } };
  const geometry = new T.PlaneGeometry(2, 2);
  const material = new T.ShaderMaterial({ vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG, uniforms, transparent: true, depthTest: false, depthWrite: false });
  const mesh = new T.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);
  host.draw = () => host.renderer.render(scene, camera);
  const dispose = () => {
    host.dispose(() => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    });
  };
  try {
    host.size(true); // measures, then draws once (warm-up: compile the shader now, not mid-scroll)
    assertProgramLinked(host.renderer, material);
  } catch (e) {
    dispose();
    throw e;
  }

  return {
    get lost() { return host.lost; },
    redraw: () => host.paint(),
    resize: () => host.size(),
    setQuality: (q) => host.setQuality(q),
    render(t) {
      uniforms.u_time.value = t / 1000;
      host.paint();
    },
    dispose,
  };
}
