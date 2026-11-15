/* =====================================================================
   The closing 3D mark: a port of makeTargetStar(), markObject(), assembleMark() and chromeEnvironment() in
   landing-prototype-clean/js/showreel.js (lines 713 to 854). The client's mark, built in code from its traced
   geometry (src/lib/mark/geometry.ts, the numbers the prototype read back out of the sprite's DOM): nine chrome
   blades extruded and bevelled, stepping back one by one around the hub (a spiral stair), and a glossy signal-red
   figure (a body triangle and a flat disc head). The canvas is transparent: the gradient behind it is the other
   closing canvas (target-bg).

   Kept from the prototype, on purpose:
   - ExtrudeGeometry with depth 0.1 (figure 0.125) and a four-segment bevel (thickness 0.022, size 0.01); blade i sits
     at z = -0.03 i; the stack is centred in depth; mark height normalised to 2 units;
   - MeshPhysicalMaterial: satin silver (0xdedee2, metalness 0.82, roughness 0.24, envMapIntensity 1.6, clearcoat 1)
     and glossy red (0xff2a45, metalness 0.4, roughness 0.26, clearcoat 1);
   - the lights (ambient 0.25, white key 2.0 at (2.5, 3, 4), signal-red rim 0.9 at (-3, -1.5, 2)), ACES filmic tone
     mapping at exposure 1.1, a 45 degree camera at z 4, and the environment: a 1024 x 512 equirect painted on a 2D
     canvas (graphite room, a bright shelf, two softboxes, a red bounce) run through PMREM;
   - assembleMark(r) (blades smallest first, then the figure from above, scaled about the hub), the entrance turn,
     the slow sway, placement (right of the copy in landscape, small and top right in portrait);
   - antialiasing on, pixel ratio min(devicePixelRatio, 2), left out of adaptive resolution, a draw on every tick the
     manager asks for, and the scene's own clock (seconds, advanced by at most 0.1 s per drawn frame).
   Different from the prototype:
   - the warm-up draws the ASSEMBLED mark (the prototype's warm-up drew it at reveal 0, when every piece is hidden,
     so its physical materials were compiled at the first visible frame, mid-scroll), and the link of both programs
     is checked (host.ts assertProgramLinked);
   - the environment is rebuilt when the context is restored (a PMREM render target lives only in GPU memory, so a
     restored context would otherwise reflect nothing);
   - dispose() frees every geometry, both materials and the environment render target.
   ===================================================================== */
import { MARK_BODY, MARK_BOX, MARK_HEAD, MARK_HUB, MARK_RAYS } from "@/lib/mark/geometry";
import { clamp01, smooth } from "../timeline";
import type { Three } from "./three";
import type { GlScene, SceneHooks } from "./scene";
import { assertProgramLinked, createGlHost } from "./host";

type V2 = readonly [number, number];

interface Piece {
  mesh: InstanceType<Three["Mesh"]>;
  kind: "ray" | "fig";
  i: number;
  /** where it rests (the entrance moves it in from elsewhere) */
  rest: InstanceType<Three["Vector3"]>;
  /** the body scales about its own centre */
  pivot?: InstanceType<Three["Vector2"]>;
}

/** The chrome room: painted on a 2D canvas, filtered by PMREM. The caller owns (and disposes) the render target. */
function chromeEnvironment(T: Three, renderer: InstanceType<Three["WebGLRenderer"]>) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d");
  if (!g) throw new Error("2D canvas unavailable for the environment map");
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#3c3c3e"); grad.addColorStop(0.45, "#121214"); grad.addColorStop(1, "#050506");
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
  const shelf = g.createLinearGradient(0, 110, 0, 215);
  shelf.addColorStop(0, "rgba(255,255,255,0)"); shelf.addColorStop(0.5, "rgba(255,255,255,0.97)"); shelf.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = shelf; g.fillRect(0, 110, 1024, 105);
  const boxes: Array<[number, number, number, string]> = [[280, 150, 150, "rgba(255,255,255,.95)"], [740, 165, 130, "rgba(245,245,247,.9)"], [540, 340, 150, "rgba(255,42,69,.55)"]];
  for (const [x, y, r, col] of boxes) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col); rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const tex = new T.CanvasTexture(c);
  tex.mapping = T.EquirectangularReflectionMapping;
  tex.colorSpace = T.SRGBColorSpace;
  const pmrem = new T.PMREMGenerator(renderer);
  try {
    return pmrem.fromEquirectangular(tex);
  } finally {
    tex.dispose();
    pmrem.dispose();
  }
}

export function createMarkScene(T: Three, canvas: HTMLCanvasElement, hooks: SceneHooks): GlScene {
  let envTarget: ReturnType<typeof chromeEnvironment> | null = null;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4);
  let base: V2 = [0, 0.02], size = 1.2;
  // landscape: the mark stands to the right of the text; portrait: smaller, top right
  const place = () => {
    const a = camera.aspect, halfH = 4 * Math.tan((22.5 * Math.PI) / 180), halfW = halfH * a;
    if (a >= 1) { base = [Math.min(1.45, halfW * 0.55), 0.02]; size = 1.2; }
    else { base = [halfW * 0.42, halfH * 0.52]; size = 0.62; }
  };
  const host = createGlHost(T, canvas, hooks, {
    basePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    antialias: true,
    fixedPixelRatio: true,
    onSize: (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); place(); },
    onRestored: () => {
      // the filtered environment lived in GPU memory only: render it again into the new context
      // The old target is dropped, not disposed: its GL objects died with the old context, and disposing it now would
      // ask the new context to delete them ("object does not belong to this context").
      envTarget = chromeEnvironment(T, host.renderer);
      scene.environment = envTarget.texture;
    },
  });
  const r = host.renderer;
  r.toneMapping = T.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.1;
  scene.add(new T.AmbientLight(0xffffff, 0.25));
  const d1 = new T.DirectionalLight(0xffffff, 2.0); d1.position.set(2.5, 3.0, 4.0); scene.add(d1);
  const d2 = new T.DirectionalLight(0xff2a45, 0.9); /* signal-red rim light */ d2.position.set(-3.0, -1.5, 2.0); scene.add(d2);

  // ---- the mark (markObject) ----
  const s = 2 / MARK_BOX.h; // mark height normalised to 2 units
  const P = ([x, y]: V2) => new T.Vector2((x - MARK_BOX.cx) * s, -(y - MARK_BOX.cy) * s);
  const shape = (pts: readonly V2[]) => new T.Shape(pts.map(P));
  // satin silver: flat chrome faces would only mirror the dark room
  const chrome = new T.MeshPhysicalMaterial({ color: 0xdedee2, metalness: 0.82, roughness: 0.24, envMapIntensity: 1.6, clearcoat: 1.0, clearcoatRoughness: 0.08 });
  const red = new T.MeshPhysicalMaterial({ color: 0xff2a45, metalness: 0.4, roughness: 0.26, envMapIntensity: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.06 });
  const depth = 0.1;
  const bevel = { bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.01, bevelSegments: 4, curveSegments: 1 };
  const group = new T.Group();
  const pieces: Piece[] = [];
  const geometries: Array<InstanceType<Three["BufferGeometry"]>> = [];
  const hub = P(MARK_HUB);
  const add = (mesh: InstanceType<Three["Mesh"]>, kind: Piece["kind"], i: number, pivot?: Piece["pivot"]) => {
    pieces.push({ mesh, kind, i, rest: mesh.position.clone(), pivot });
    group.add(mesh);
  };
  const extrude = (sh: InstanceType<Three["Shape"]>, d: number, extra: object = {}) => {
    const geo = new T.ExtrudeGeometry(sh, { depth: d, ...bevel, ...extra });
    geometries.push(geo);
    return geo;
  };
  MARK_RAYS.forEach((ray, i) => {
    const mesh = new T.Mesh(extrude(shape(ray.pts), depth), chrome);
    mesh.position.z = -i * 0.03;
    add(mesh, "ray", i);
  });
  const body = new T.Mesh(extrude(shape(MARK_BODY), depth * 1.25), red);
  body.position.z = 0.03;
  const bc = MARK_BODY.reduce<V2>((a, q) => [a[0] + q[0] / 3, a[1] + q[1] / 3], [0, 0]);
  add(body, "fig", 0, P(bc));
  // the head is a flat disc like the logo's, not a ball
  const hp = P([MARK_HEAD.cx, MARK_HEAD.cy]);
  const disc = new T.Shape(); disc.absarc(0, 0, MARK_HEAD.r * s, 0, Math.PI * 2, false);
  const head = new T.Mesh(extrude(disc, depth * 1.25, { curveSegments: 48 }), red);
  head.position.set(hp.x, hp.y, 0.03);
  add(head, "fig", 1);
  // centre the stack in depth so it turns about its middle
  const box = new T.Box3().setFromObject(group);
  const dz = (box.min.z + box.max.z) / 2;
  for (const pc of pieces) { pc.mesh.position.z -= dz; pc.rest.z -= dz; }
  scene.add(group);

  // ---- scroll-driven assembly (assembleMark), r = 0..1 ----
  const n = MARK_RAYS.length;
  const assemble = (rv: number) => {
    for (const { mesh, kind, i, rest, pivot } of pieces) {
      const t = kind === "ray" ? smooth(clamp01((rv - (n - 1 - i) * 0.055) / 0.42)) : smooth(clamp01((rv - 0.5 - i * 0.06) / 0.38));
      const sc = Math.max(0.001, kind === "ray" ? t : 0.6 + 0.4 * t);
      mesh.scale.set(sc, sc, 1);
      mesh.visible = t > 0.001;
      if (kind === "ray") mesh.position.set(hub.x * (1 - sc), hub.y * (1 - sc), rest.z - (1 - t) * 0.6);
      else {
        // body: geometry sits in mark space, so pivot about its centre; head: its own origin
        const x = pivot ? pivot.x * (1 - sc) : rest.x, y = pivot ? pivot.y * (1 - sc) : rest.y;
        mesh.position.set(x, y + (1 - t) * 0.55, rest.z);
      }
    }
  };

  let clock = 0, lastT: number | null = null, reveal = 0;
  const draw = () => {
    const sc = clock;
    const [bx, by] = base;
    const e = smooth(reveal);
    assemble(reveal);
    group.scale.setScalar(size * (0.88 + 0.12 * e) * (1 + 0.012 * Math.sin(sc * 0.9) * e));
    group.position.set(bx, by + Math.sin(sc * 0.8) * 0.03 * e, 0);
    // turns into place as it assembles, then a slow sway that never shows it edge-on
    group.rotation.set(-0.08 + Math.sin(sc * 0.55) * 0.04 * e, -0.3 + Math.sin(sc * 0.42) * 0.4 * e - (1 - e) * 0.9, Math.sin(sc * 0.3) * 0.02 * e);
    r.render(scene, camera);
  };
  host.draw = draw;

  const dispose = () => {
    host.dispose(() => {
      scene.remove(group);
      for (const g of geometries) g.dispose();
      chrome.dispose();
      red.dispose();
      envTarget?.dispose();
      envTarget = null;
      scene.environment = null;
    });
  };
  try {
    envTarget = chromeEnvironment(T, r);
    scene.environment = envTarget.texture;
    reveal = 1; // warm-up: compile both physical programs and upload the geometry now, on the assembled mark
    host.size(true);
    assertProgramLinked(r, chrome);
    assertProgramLinked(r, red);
    reveal = 0;
    host.paint();
  } catch (e) {
    dispose();
    throw e;
  }

  return {
    get lost() { return host.lost; },
    redraw(v) {
      if (v !== undefined) reveal = v;
      host.paint();
    },
    resize: () => host.size(),
    pause() { lastT = null; },
    render(t, v) {
      reveal = v;
      const delta = lastT == null ? 0 : Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      clock += delta;
      host.paint();
    },
    dispose,
  };
}
