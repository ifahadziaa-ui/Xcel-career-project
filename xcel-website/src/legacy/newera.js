// @ts-nocheck
/* The "New Era" particle scene (brief supplied by the user), lighter version and in the site's colours:
   a cloud of points that morphs sphere -> funnel -> DNA double helix -> rolling wave -> tunnel -> singularity -> galaxy
   as the page scrolls, over a slow aurora of red and silver in the corners.
   Changes from the brief, on purpose:
   - about 40,000 points (the brief uses 120,000) and no bloom pass: far less GPU work;
   - colours: deep blue becomes silver, blazing orange becomes the site's signal red, base is graphite;
   - the aurora uses 3 noise octaves instead of 4 and the renderer is capped at 1.5x pixel ratio.
   The morph vertex shader is the brief's, with the colours and a point-size boost for the lower count. */
import * as THREE from "three";

const AURORA_VERT = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

const AURORA_FRAG = `
uniform float uTime; uniform float uScroll; uniform vec2 uResolution; uniform vec3 color1; uniform vec3 color2;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec2 x) {
  vec2 i = floor(x); vec2 f = fract(x);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
#define OCTAVES 3
float fbm(vec2 x) {
  float v = 0.0; float a = 0.5; vec2 shift = vec2(100);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < OCTAVES; ++i) { v += a * noise(x); x = rot * x * 2.0 + shift; a *= 0.5; }
  return v;
}
void main() {
  vec2 st = vUv; st.x *= uResolution.x / uResolution.y;
  float t = uTime * 6.0 + uScroll * 150.0;
  vec2 st1 = st * 1.2; vec2 st2 = st * 1.6;
  float f1 = fbm(st1 + vec2(t * 0.15, t * 0.1));
  float mask1 = pow(fbm(st1 + f1 * 2.5 - vec2(t * 0.25, 0.0)), 2.0) * 3.5;
  float f2 = fbm(st2 - vec2(t * 0.1, t * 0.2));
  float mask2 = pow(fbm(st2 + f2 * 2.0 + vec2(0.0, t * 0.2)), 2.5) * 4.0;
  vec3 finalColor = color2 * mask1 + color1 * mask2;
  vec2 aspectUv = vUv - 0.5; aspectUv.x *= uResolution.x / uResolution.y;
  float centerDist = length(aspectUv);
  float angle = atan(aspectUv.y, aspectUv.x) + uScroll * 15.0;
  float maskOffset = sin(angle * 3.0 + t * 0.4) * 0.05 + sin(angle * 5.0 - t * 0.6) * 0.03;
  float dynamicDist = centerDist + maskOffset;
  float cornerFade = smoothstep(0.7, 1.15, dynamicDist);
  cornerFade = pow(cornerFade, 1.6);
  finalColor *= cornerFade * 0.9;
  vec3 baseBg = vec3(0.063, 0.063, 0.071);
  gl_FragColor = vec4(baseBg + finalColor, 1.0);
}`;

const PARTICLE_VERT = `
uniform float uTime; uniform float uScroll; uniform float uIntro; uniform float uPoint;
varying float vEdgeFade; varying vec3 vColor;
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
float random(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
void main() {
  vec3 normalVec = normalize(position);
  float noiseVal = snoise(position * 0.5 + uTime * 0.8);
  noiseVal += 0.5 * snoise(position * 1.5 - uTime * 1.2);
  vec3 spherePos = position + normalVec * (noiseVal * 0.5);
  float stretchedY = position.y * 7.0 - 8.0;
  float funnelRadius = 1.0 + smoothstep(-32.0, 16.0, stretchedY) * 5.0;
  float angle = atan(position.z, position.x) + stretchedY * 0.3;
  vec3 funnelPos = vec3(funnelRadius * cos(angle), stretchedY, funnelRadius * sin(angle));
  funnelPos += normalVec * (snoise(funnelPos * 0.3 + uTime * 3.0) * 1.0);
  float rnd1 = random(position); float rnd2 = random(position + vec3(1.0)); float rnd3 = random(position + vec3(2.0));
  float t = stretchedY; float twistMultiplier = 0.65; float twist = t * twistMultiplier;
  float dnaRadius = 1.0; float strandThickness = 0.35;
  vec3 dnaPos;
  if (rnd1 < 0.40) {
    vec3 core = vec3(dnaRadius * cos(twist), t, dnaRadius * sin(twist));
    vec3 offset = vec3(rnd1 - 0.2, rnd2 - 0.5, rnd3 - 0.5) * 2.0 * strandThickness;
    dnaPos = core + offset;
  } else if (rnd1 < 0.80) {
    vec3 core = vec3(dnaRadius * cos(twist + 3.14159), t, dnaRadius * sin(twist + 3.14159));
    vec3 offset = vec3(rnd1 - 0.6, rnd2 - 0.5, rnd3 - 0.5) * 2.0 * strandThickness;
    dnaPos = core + offset;
  } else {
    float rungT = (rnd1 - 0.80) * 5.0;
    float discreteT = floor(t * 2.5) / 2.5;
    float discreteTwist = discreteT * twistMultiplier;
    vec3 p1 = vec3(dnaRadius * cos(discreteTwist), discreteT, dnaRadius * sin(discreteTwist));
    vec3 p2 = vec3(dnaRadius * cos(discreteTwist + 3.14159), discreteT, dnaRadius * sin(discreteTwist + 3.14159));
    vec3 core = mix(p1, p2, rungT);
    vec3 offset = vec3(rnd1 - 0.9, rnd2 - 0.5, rnd3 - 0.5) * 2.0 * 0.10;
    dnaPos = core + offset;
  }
  dnaPos.x += snoise(vec3(0.0, t * 0.2, uTime * 0.2)) * 0.5;
  dnaPos.z += snoise(vec3(t * 0.2, 0.0, uTime * 0.2)) * 0.5;
  float phase1 = smoothstep(0.0, 0.15, uScroll);
  float phase2 = smoothstep(0.15, 0.30, uScroll);
  vec3 step1Pos = mix(spherePos, funnelPos, phase1);
  vec3 step2Pos = mix(step1Pos, dnaPos, phase2);
  float meltProgress = smoothstep(0.30, 0.50, uScroll);
  float meltY = mix(-50.0, 90.0, meltProgress);
  float depthBelowMeltLine = meltY - stretchedY;
  float localMelt = smoothstep(0.0, 45.0, depthBelowMeltLine);
  vec3 targetWavePos = vec3(position.x * 7.0, -45.0, position.z * 25.0);
  targetWavePos.x += position.y * 6.0;
  float waveNoise = snoise(vec3(targetWavePos.x * 0.08, targetWavePos.z * 0.08, uTime * 0.15)) * 2.0;
  waveNoise += snoise(vec3(targetWavePos.x * 0.16, targetWavePos.z * 0.16, uTime * 0.3)) * 0.8;
  targetWavePos.y += waveNoise;
  float tunnelProgress = smoothstep(0.65, 0.80, uScroll);
  float blackHoleLinear = clamp((uScroll - 0.80) / 0.12, 0.0, 1.0);
  float blackHoleProgress = pow(blackHoleLinear, 2.0);
  float tunnelR = 12.0;
  float pinchFactor = clamp((targetWavePos.z + 80.0) / 100.0, 0.0, 1.0);
  tunnelR = mix(tunnelR, tunnelR * pinchFactor, blackHoleProgress);
  float tunnelCy = -33.0;
  float currentSliceRadius = sqrt(max(0.0, 17.64 - position.z * position.z));
  float maxSliceWidth = 9.2195 * currentSliceRadius;
  float normalizedX = targetWavePos.x / (maxSliceWidth + 0.001);
  float tunnelAngle = normalizedX * 3.14159265;
  float tunnelLinear = clamp((uScroll - 0.70) / 0.22, 0.0, 1.0);
  float tunnelEnd = pow(tunnelLinear, 3.0);
  float jitterAngle = snoise(vec3(position.x * 15.0, position.y * 15.0, uTime * 0.1)) * 0.35;
  float jitterZ = snoise(vec3(position.y * 15.0, position.z * 15.0, uTime * 0.1)) * 4.0;
  float ambientSwirl = snoise(vec3(position.x * 5.0, position.y * 5.0, uTime * 0.2)) * 3.0;
  float diveTwist = snoise(vec3(position.x * 5.0, position.y * 5.0, 0.0)) * 30.0 * tunnelEnd;
  float vortexSpeed = (ambientSwirl + diveTwist) * tunnelLinear;
  tunnelAngle += jitterAngle + vortexSpeed;
  float tunnelZ = targetWavePos.z + jitterZ;
  float dynamicR = tunnelR - waveNoise;
  vec3 tunnelPos = vec3(dynamicR * sin(tunnelAngle), tunnelCy - dynamicR * cos(tunnelAngle), tunnelZ);
  vec3 morphedWave = mix(targetWavePos, tunnelPos, tunnelProgress);
  vec3 tunnelFinalPos = mix(step2Pos, morphedWave, localMelt);
  float galaxyPhase = step(0.93, uScroll);
  float gRnd1 = fract(sin(dot(position.xyz, vec3(12.989, 78.233, 45.164))) * 43758.545);
  float gRnd2 = fract(sin(dot(position.xyz, vec3(93.989, 67.345, 54.256))) * 24634.634);
  float gRnd3 = fract(sin(dot(position.xyz, vec3(43.332, 11.235, 89.234))) * 56475.234);
  float gRnd4 = fract(sin(dot(position.xyz, vec3(75.321, 32.123, 23.456))) * 35432.123);
  float galaxyR = pow(gRnd1, 2.0) * 60.0 + pow(gRnd2, 3.0) * 30.0;
  float swirl = pow(galaxyR, 1.1) * 0.08;
  float armIndex = floor(gRnd2 * 2.0);
  float baseAngle = armIndex * 3.14159265;
  float uniformTheta = gRnd3 * 2.0 - 1.0;
  float dTheta = pow(uniformTheta, 5.0) * 3.14159;
  float theta = baseAngle + swirl + dTheta + (uTime * 0.4);
  float gx = galaxyR * cos(theta); float gz = galaxyR * sin(theta);
  float gyDisc = pow(gRnd4 * 2.0 - 1.0, 3.0) * 1.5;
  vec3 basePos = vec3(gx, gyDisc, gz);
  float bulgeStrength = smoothstep(25.0, 0.0, galaxyR);
  float gRnd5 = fract(sin(gRnd1 * 44.44 + gRnd2) * 555.55);
  float gRnd6 = fract(sin(gRnd3 * 66.66 + gRnd4) * 777.77);
  float gRnd7 = fract(sin(gRnd5 * 88.88 + gRnd6) * 999.99);
  float phi = acos(gRnd5 * 2.0 - 1.0);
  float thetaSphere = gRnd6 * 6.2831853 + (uTime * 0.8);
  float rSphere = pow(gRnd7, 2.0) * 18.0;
  vec3 bulgeOffset = vec3(rSphere * sin(phi) * cos(thetaSphere), rSphere * cos(phi), rSphere * sin(phi) * sin(thetaSphere));
  vec3 galaxyPos = mix(basePos, bulgeOffset, bulgeStrength);
  galaxyPos.y -= 33.0; galaxyPos.z -= 120.0;
  vec3 finalPos = mix(tunnelFinalPos, galaxyPos, galaxyPhase);
  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  vec3 viewDir = normalize(-mvPosition.xyz);
  vec3 worldNormal = normalize(normalMatrix * normalVec);
  float rim = 1.0 - abs(dot(viewDir, worldNormal));
  float edgeFadeSphere = smoothstep(0.4, 0.9, rim);
  float edgeFadeDNA = 1.0;
  float morph = smoothstep(0.0, 0.30, uScroll);
  float opacityMultiplier = 0.8; float sizeMultiplier = 1.5;
  float dnaPhase = smoothstep(0.15, 0.30, uScroll);
  opacityMultiplier = mix(opacityMultiplier, 0.25, dnaPhase); sizeMultiplier = mix(sizeMultiplier, 4.0, dnaPhase);
  float wavePhase = smoothstep(0.30, 0.50, uScroll);
  opacityMultiplier = mix(opacityMultiplier, 0.35, wavePhase); sizeMultiplier = mix(sizeMultiplier, 4.0, wavePhase);
  float tunnelPhase = smoothstep(0.65, 0.80, uScroll);
  opacityMultiplier = mix(opacityMultiplier, 0.5, tunnelPhase); sizeMultiplier = mix(sizeMultiplier, 6.0, tunnelPhase); // smaller than the brief: the copy sits over this part
  float isOrb = step(0.98, fract(gRnd1 * 77.77));
  float starSize = mix(5.0, 16.0, isOrb);
  opacityMultiplier = mix(opacityMultiplier, 0.25, galaxyPhase); sizeMultiplier = mix(sizeMultiplier, starSize, galaxyPhase);
  float introSphere = mix(1.0, edgeFadeSphere, uIntro);
  vEdgeFade = mix(introSphere, edgeFadeDNA, morph) * opacityMultiplier;
  vEdgeFade *= smoothstep(0.0, 0.2, uIntro);
  // the site's colours: silver and signal red (the brief's deep blue and blazing orange)
  vec3 cBottom = vec3(0.80, 0.80, 0.85);
  vec3 cTop = vec3(1.0, 0.16, 0.27);
  float baseColorMix = smoothstep(-3.0, 3.0, position.y + position.x * 0.5);
  vec3 normalColor = mix(cBottom, cTop, clamp(baseColorMix, 0.0, 1.0));
  float orangeMix = smoothstep(80.0, 0.0, galaxyR);
  vec3 galaxyColor = mix(cBottom, cTop, clamp(orangeMix, 0.0, 1.0));
  vColor = mix(normalColor, galaxyColor, galaxyPhase);
  gl_PointSize = sizeMultiplier * uPoint * (10.0 / -mvPosition.z);
  gl_PointSize = max(gl_PointSize, 1.5);
  gl_Position = projectionMatrix * mvPosition;
}`;

const PARTICLE_FRAG = `
varying float vEdgeFade; varying vec3 vColor;
void main() {
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if (ll > 0.5) discard;
  float pointAlpha = smoothstep(0.5, 0.1, ll);
  gl_FragColor = vec4(vColor, vEdgeFade * pointAlpha * 0.9);
}`;

/* canvas: the fixed WebGL canvas; read(): returns { progress 0..1, active bool } each frame; onFrame(progress) lets
   the overlays follow the same value. Returns { dispose }. */
export function createNewEra(canvas, read, onFrame) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.autoClear = false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 8;

  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const bgMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uScroll: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) },
      color1: { value: new THREE.Color(0.9, 0.12, 0.2) },   // signal red (the brief's orange)
      color2: { value: new THREE.Color(0.32, 0.32, 0.38) }, // graphite silver (the brief's blue)
    },
    vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG, depthWrite: false,
  });
  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uIntro: { value: 0 }, uPoint: { value: 1.55 } },
    vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  // about 40,000 points (about 20,000 on a phone)
  const small = window.innerWidth <= 640;
  const particles = new THREE.Points(small ? new THREE.SphereGeometry(4.2, 70, 280) : new THREE.SphereGeometry(4.2, 100, 400), material);
  particles.frustumCulled = false;
  scene.add(particles);

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const pr = renderer.getPixelRatio();
    bgMaterial.uniforms.uResolution.value.set(w * pr, h * pr);
  };
  resize();
  window.addEventListener("resize", resize);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let time = 0, introStart = 0, smooth = 0, raf = 0, dead = false;
  const look = new THREE.Vector3();

  const frame = (now) => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const { progress, active, paused } = read();
    onFrame && onFrame(progress);
    if (!active) { introStart = 0; return; } // nothing to draw while the page is past the story
    if (!paused && !reduced) time += 0.005; // the pause toggle and reduced motion freeze the drifting; scrolling still morphs
    if (introStart === 0) introStart = now;
    const introRaw = Math.min((now - introStart) / 2600, 1);
    const introEased = 1 - Math.pow(1 - introRaw, 3);
    material.uniforms.uIntro.value = introEased;
    // a light smoothing of the scroll, so the morph glides instead of stepping with the wheel
    smooth += (progress - smooth) * (reduced ? 1 : 0.12);
    const cs = smooth;
    material.uniforms.uTime.value = time; material.uniforms.uScroll.value = cs;
    bgMaterial.uniforms.uTime.value = time; bgMaterial.uniforms.uScroll.value = cs;

    const panProgress = Math.min(cs / 0.5, 1);
    const smoothPan = panProgress * panProgress * (3 - 2 * panProgress);
    const flyPhase = cs < 0.5 ? 0 : Math.min((cs - 0.5) / 0.35, 1);
    const blackHoleDive = cs < 0.8 ? 0 : Math.min((cs - 0.8) / 0.12, 1);
    camera.position.y = -38 * smoothPan + 5 * Math.pow(blackHoleDive, 2);
    camera.position.z = 8 - 4 * smoothPan - 55 * flyPhase;
    const galaxyPullback = cs < 0.93 ? 0 : Math.min((cs - 0.93) / 0.07, 1);
    const smoothPullback = galaxyPullback * galaxyPullback * (3 - 2 * galaxyPullback);
    camera.position.z += 75 * smoothPullback;
    camera.position.y += 35 * smoothPullback;
    let waveTilt = 0;
    if (cs > 0.3 && cs < 0.7) waveTilt = Math.sin(((cs - 0.3) / 0.4) * Math.PI) * 15;
    const lookY = THREE.MathUtils.lerp(camera.position.y + waveTilt, -33, smoothPullback);
    const lookZ = THREE.MathUtils.lerp(camera.position.z - 100, -120, smoothPullback);
    camera.position.z += (1 - introEased) * -3 * (1 - Math.min(cs / 0.05, 1));
    look.set(0, lookY, lookZ);
    camera.lookAt(look);
    particles.rotation.y = smoothPan * Math.PI * 2;
    particles.rotation.x = Math.sin(smoothPan * Math.PI) * 0.15;

    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      particles.geometry.dispose(); material.dispose(); bgMaterial.dispose(); renderer.dispose();
    },
  };
}
