// @ts-nocheck
/* The Healthcare page's background: one large DNA double helix made of fine points, running the whole height of the page.
   It twists as the page scrolls and drifts upward at half the speed of the content, so it reads as a background and not as
   foreground. Nothing else: no aurora, no sphere, no other morph phases (the user asked for only the helix).
   About 40,000 points (22,000 on a phone), no bloom, silver and signal red on the site's graphite. */
import * as THREE from "three";

const VERT = `
uniform float uTime; uniform float uRot; uniform float uLen; uniform float uTwist; uniform float uRadius; uniform float uPx;
attribute float aT; attribute float aSel; attribute vec3 aR;
varying vec3 vColor; varying float vAlpha;
void main() {
  float y = (aT - 0.5) * uLen;
  float thick = 0.5;
  vec3 p;
  vec3 silver = vec3(0.82, 0.82, 0.88);
  vec3 red = vec3(1.0, 0.16, 0.27);
  if (aSel < 0.4) {                       // strand A
    float tw = y * uTwist + uRot;
    p = vec3(uRadius * cos(tw), y, uRadius * sin(tw)) + (aR - 0.5) * thick;
    vColor = silver;
  } else if (aSel < 0.8) {                // strand B, half a turn behind
    float tw = y * uTwist + uRot + 3.14159265;
    p = vec3(uRadius * cos(tw), y, uRadius * sin(tw)) + (aR - 0.5) * thick;
    vColor = red;
  } else {                                // rungs, one every 0.45 units
    float yq = floor(y / 0.45) * 0.45;
    float tw = yq * uTwist + uRot;
    vec3 a = vec3(uRadius * cos(tw), yq, uRadius * sin(tw));
    vec3 b = vec3(uRadius * cos(tw + 3.14159265), yq, uRadius * sin(tw + 3.14159265));
    p = mix(a, b, aR.x) + vec3(0.0, (aR.y - 0.5) * 0.08, (aR.z - 0.5) * 0.08);
    vColor = mix(silver, red, aR.x) * 0.8;
  }
  p.x += sin(y * 0.7 + uTime * 0.6) * 0.05;   // a slow shimmer along the length
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = smoothstep(-uRadius * 1.1, uRadius * 1.1, p.z);   // the near side is brighter and larger
  vAlpha = mix(0.35, 1.0, depth) * (aSel < 0.8 ? 1.0 : 0.7);
  gl_PointSize = mix(1.7, 3.6, depth) * uPx;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.15, d));
}`;

/* canvas: the fixed canvas; read(): { scrollY, active, paused } each frame. Returns { dispose }. */
export function createDna(canvas, read) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x101012, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const CAM_Z = 17; // further back than before: a smaller, calmer helix
  camera.position.z = CAM_Z;
  const VIS_H = 2 * CAM_Z * Math.tan((50 * Math.PI) / 360); // visible height at the helix, about 9.3 units

  const LEN = 110;
  const n = window.innerWidth <= 640 ? 22000 : 40000;
  const aT = new Float32Array(n), aSel = new Float32Array(n), aR = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    aT[i] = Math.random(); aSel[i] = Math.random();
    aR[i * 3] = Math.random(); aR[i * 3 + 1] = Math.random(); aR[i * 3 + 2] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3)); // required by three; the shader ignores it
  geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  geo.setAttribute("aSel", new THREE.BufferAttribute(aSel, 1));
  geo.setAttribute("aR", new THREE.BufferAttribute(aR, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uRot: { value: 0 }, uLen: { value: LEN }, uTwist: { value: 0.55 }, uRadius: { value: 3.2 }, uPx: { value: 1 },
    },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const pts = new THREE.Points(geo, material);
  pts.frustumCulled = false;
  scene.add(pts);

  let pxPerUnit = 100;
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    material.uniforms.uPx.value = renderer.getPixelRatio();
    // wide screens get a big helix; on a phone it is kept inside the width
    material.uniforms.uRadius.value = Math.min(3.6, VIS_H * (w / h) * 0.24);
    pxPerUnit = h / VIS_H;
  };
  resize();
  window.addEventListener("resize", resize);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let time = 0, rot = 0, raf = 0, dead = false, sy = -1;
  const frame = () => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const { scrollY, active, paused } = read();
    if (!active) return;
    sy = sy < 0 ? scrollY : sy + (scrollY - sy) * (reduced ? 1 : 0.14); // a light smoothing, so it glides with the wheel
    if (!paused && !reduced) { time += 0.016; rot += 0.0016; }
    material.uniforms.uTime.value = time;
    material.uniforms.uRot.value = rot + sy * 0.0022;
    camera.position.y = -(sy * 0.5) / pxPerUnit; // it drifts at half the speed of the page
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geo.dispose(); material.dispose(); renderer.dispose();
    },
  };
}
