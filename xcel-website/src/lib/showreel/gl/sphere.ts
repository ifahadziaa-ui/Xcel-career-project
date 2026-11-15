/* =====================================================================
   The network sphere: a port of makeSphere() in landing-prototype-clean/js/showreel.js (lines 671 to 711).
   34,000 points on a Fibonacci sphere (golden-angle spiral) of radius 1, seen by a 50 degree perspective camera
   at z 3.8, drawn as additive, depth-less, soft round sprites by SPHERE_VERT / SPHERE_FRAG: simplex-noise
   displacement, a hole at the centre for the mark (an HTML element), and a dispersal (the timeline value,
   sphereDisperse) that blows the points outwards as the services panels arrive.

   Same as the prototype, on purpose: N = 34000 (never reduced), the point size / amplitude uniforms, the
   pseudo-random aRand attribute, the slow rotation (y: 0.12 rad/s, x: sin(0.1 s) * 0.12), pixel ratio
   min(max(devicePixelRatio, 2), 3) (never below 2 before adaptive resolution), transparent, buffer from the
   layout box, one draw per tick the manager asks for, adaptive resolution.
   ===================================================================== */
import type { Three } from "./three";
import type { GlScene, SceneHooks } from "./scene";
import { SPHERE_FRAG, SPHERE_VERT } from "./shaders";
import { assertProgramLinked, createGlHost } from "./host";

export const SPHERE_POINTS = 34000;

export function createSphereScene(T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks): GlScene {
  const base = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  const camera = new T.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 3.8);
  const host = createGlHost(T, canvas, hooks, {
    basePixelRatio: base,
    onSize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); },
  });
  const scene = new T.Scene();

  const N = SPHERE_POINTS;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
    rnd[i] = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.BufferAttribute(pos, 3));
  geometry.setAttribute("aRand", new T.BufferAttribute(rnd, 1));
  const uniforms = { uTime: { value: 0 }, uSize: { value: 24.0 }, uAmp: { value: 0.11 }, uPR: { value: base }, uDisperse: { value: 0 } };
  const material = new T.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: SPHERE_FRAG, uniforms,
    transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending,
  });
  const points = new T.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  host.draw = () => {
    uniforms.uPR.value = host.renderer.getPixelRatio();
    host.renderer.render(scene, camera);
  };
  const dispose = () => {
    host.dispose(() => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    });
  };
  try {
    host.size(true); // measures, then draws once (warm-up: compile the shader and upload the points now, not at the start of the dive)
    assertProgramLinked(host.renderer, material);
  } catch (e) {
    dispose();
    throw e;
  }

  return {
    get lost() { return host.lost; },
    redraw(v) {
      if (v !== undefined) uniforms.uDisperse.value = v;
      host.paint();
    },
    resize: () => host.size(),
    setQuality: (q) => host.setQuality(q),
    render(t, v) {
      const s = t / 1000;
      uniforms.uTime.value = s;
      uniforms.uDisperse.value = v;
      points.rotation.y = s * 0.12;
      points.rotation.x = Math.sin(s * 0.1) * 0.12;
      host.paint();
    },
    dispose,
  };
}
