/* =====================================================================
   Shader sources for the showreel's WebGL scenes. Copied verbatim from
   landing-prototype-clean/js/showreel.js and not to be edited by hand (the stage's fidelity check compares
   them with the prototype's):
   - lines 333 to 434 (Stage 5B-4): GRADIENT_FRAG (simplex-noise gradient of eleven blobs in the hero palette,
     optional pointer pull, film grain) and CLIP_VERT (a full-screen clip-space quad);
   - lines 436 to 571 (Stage 5B-5): AURORA_VERT / AURORA_FRAG (a domain-warped signal-red band, premultiplied
     over the stage), SIMPLEX3 (3D simplex noise) and SPHERE_VERT / SPHERE_FRAG (the 34,000-point network
     sphere: noise displacement, dispersal, silver globe with a red underside).
   ===================================================================== */

export const GRADIENT_FRAG = (withMouse: boolean): string => `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
${withMouse ? "uniform vec2 u_mouse;" : ""}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ; m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void addBlob(inout vec3 acc, inout float wsum, vec2 uv, vec2 center, float radius, vec3 color) {
    float d = distance(uv, center);
    float w = exp(-(d * d) / (radius * radius));
    acc += color * w;
    wsum += w;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.22;

    vec2 uv = st;
    uv.x += 0.16 * snoise(st * 1.1 + vec2(0.0, t));
    uv.y += 0.16 * snoise(st * 1.1 + vec2(7.3, -t * 0.9));
${withMouse ? `
    vec2 mouse = u_mouse / u_resolution.xy;
    mouse.y = 1.0 - mouse.y;
    float infl = exp(-distance(st, mouse) * 1.8);
    uv += (st - mouse) * infl * 0.22;` : ""}

    // hero palette: graphite room, silver spotlight, a low signal-red ember on the sides
    vec3 night    = vec3(0.050, 0.050, 0.056);
    vec3 dusk     = vec3(0.13,  0.13,  0.14);
    vec3 ember    = vec3(0.30,  0.025, 0.055);
    vec3 steel    = vec3(0.36,  0.36,  0.37);
    vec3 silver   = vec3(0.58,  0.58,  0.59);
    vec3 glow     = vec3(0.80,  0.80,  0.81);

    vec3 acc = vec3(0.0);
    float wsum = 0.0;

    addBlob(acc, wsum, uv, vec2(0.5  + 0.05 * sin(t * 0.5), 1.18), 0.58, night);
    addBlob(acc, wsum, uv, vec2(-0.12, 1.05 + 0.05 * cos(t * 0.6)), 0.36, night);
    addBlob(acc, wsum, uv, vec2(1.12,  1.05 + 0.05 * sin(t * 0.6)), 0.36, night);

    addBlob(acc, wsum, uv, vec2(0.5  + 0.05 * sin(t * 0.4), 0.66 + 0.05 * cos(t * 0.5)), 0.40, dusk);
    addBlob(acc, wsum, uv, vec2(0.16 + 0.05 * cos(t * 0.8), 0.46), 0.26, ember);
    addBlob(acc, wsum, uv, vec2(0.84 + 0.05 * sin(t * 0.8), 0.46), 0.26, ember);

    addBlob(acc, wsum, uv, vec2(0.5  + 0.07 * sin(t * 0.6), 0.30 + 0.05 * cos(t * 0.6)), 0.42, steel);
    addBlob(acc, wsum, uv, vec2(0.5  + 0.06 * sin(t * 0.9), 0.12 + 0.04 * cos(t * 0.8)), 0.34, silver);

    addBlob(acc, wsum, uv, vec2(0.44 + 0.05 * sin(t * 1.1), 0.02 + 0.03 * cos(t)), 0.17, glow);

    addBlob(acc, wsum, uv, vec2(-0.10, -0.05), 0.28, night);
    addBlob(acc, wsum, uv, vec2(1.10,  -0.05), 0.28, night);

    vec3 col = acc / max(wsum, 0.0001);

    vec2 hot = vec2(0.44 + 0.05 * sin(t * 1.1), 0.02 + 0.03 * cos(t));
    float hotGlow = exp(-distance(uv, hot) * 4.5);
    col += vec3(0.80, 0.80, 0.82) * hotGlow * 0.6;

    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 1.4);
    col = max(col, 0.0);
    col = clamp(col, 0.0, 1.0);
    col = pow(col, vec3(0.90));

    float vig = smoothstep(1.20, 0.32, distance(st, vec2(0.5, 0.22)));
    col *= 0.50 + 0.50 * vig;

    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time * 0.5) * 43758.5453);
    col += (grain - 0.5) * 0.05;

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
}`;

export const CLIP_VERT = `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export const AURORA_VERT = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
export const AURORA_FRAG = `
precision mediump float;
varying vec2 vUv;
uniform float u_time;
const vec3 iAuroraDeep = vec3(0.70, 0.04, 0.10);   /* signal red, deep */
const vec3 iAuroraBright = vec3(1.00, 0.16, 0.27); /* signal red #ff2a45 */
vec3 warp3d(vec3 pos, float t) {
    float curv = .8, a = 1.9, b = 0.7; pos *= 2.;
    pos.x += curv * sin(t + a * pos.y) + t * b; pos.y += curv * cos(t + a * pos.x);
    pos.y += curv * sin(t + a * pos.z) + t * b; pos.z += curv * cos(t + a * pos.y);
    pos.z += curv * sin(t + a * pos.x) + t * b; pos.x += curv * cos(t + a * pos.z);
    return 0.5 + 0.5 * cos(pos.xyz + vec3(1, 2, 4));
}
void main() {
    vec2 uv = 2.0 * vUv - 1.0;
    vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), u_time * 1.5), vec3(1.5));
    vec3 col = 1.6 * iAuroraDeep * w.x; col *= w.y; col += iAuroraBright * w.z;
    col *= smoothstep(0.6, 1.0, abs(uv.y));
    col *= smoothstep(-0.5, 1.0, -uv.y * uv.x); col *= smoothstep(-0.5, 1.0, -uv.y * uv.x);
    vec3 c = col * 1.15;
    float a = clamp(max(c.r, max(c.g, c.b)) * 1.6, 0.0, 0.9);
    gl_FragColor = vec4(c, a);
}`;

export const SIMPLEX3 = `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;
export const SPHERE_VERT = SIMPLEX3 + `
uniform float uTime; uniform float uSize; uniform float uAmp; uniform float uPR;
uniform float uDisperse;
attribute float aRand;
varying float vAlpha; varying float vLit; varying float vVert; varying float vSide;
void main(){
    vec3 p = position;
    float n1 = snoise(p * 1.6 + vec3(0.0, uTime * 0.18, 0.0));
    float n2 = snoise(p * 3.3 - vec3(uTime * 0.12));
    float disp = n1 * 0.72 + n2 * 0.28;
    vec3 pos = p * (1.0 + uAmp * disp);

    vec3 dir = normalize(p + vec3(1e-4));
    pos += dir * uDisperse * (0.18 + 0.5 * aRand);
    pos += vec3(n1, n2, n1 * n2) * uDisperse * 0.22;

    float lit = smoothstep(-0.25, 0.5, disp);
    vLit = lit;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPR * (1.0 / max(0.1, -mv.z));

    vVert = mv.y;
    vSide = abs(mv.x);

    float depth = pos.z * 0.5 + 0.5;
    float angR = length(mv.xy) / max(0.1, -mv.z);
    float hole = smoothstep(0.05, 0.115, angR); /* room for the mark at the centre; small, so the hub shows the network early */
    vAlpha = hole * (0.10 + 0.40 * depth) * (0.15 + 0.95 * lit) * (1.0 - 0.85 * uDisperse);
}`;
export const SPHERE_FRAG = `
precision highp float;
uniform float uDisperse;
varying float vAlpha; varying float vLit; varying float vVert; varying float vSide;
void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float tighten = 1.0 - 0.45 * uDisperse;
    float bloomK = 1.0 - 0.65 * uDisperse;
    float soft = smoothstep(0.5 * tighten, 0.0, d);
    float core = smoothstep(0.16 * tighten, 0.0, d);

    // silver globe, signal-red underside, near-white rim (hero palette)
    vec3 silver = vec3(0.62, 0.62, 0.64);
    vec3 red    = vec3(0.85, 0.045, 0.07); /* blooms to ~#ff2a45, not magenta */
    vec3 white  = vec3(0.90, 0.90, 0.92);
    float vt = clamp(vVert * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(red, silver, smoothstep(0.18, 0.62, vt));
    col = mix(col, white, smoothstep(0.72, 1.15, vSide));

    col *= (0.60 + 0.55 * vLit);
    col += smoothstep(0.55, 1.0, vLit) * core * vec3(0.75);

    float halo = smoothstep(0.5 * tighten, 0.0, d);
    col += col * halo * 0.9 * bloomK;
    float cap = smoothstep(0.55, 1.05, abs(vVert));
    col += col * cap * 1.7 * bloomK;
    col *= mix(1.25, 1.05, uDisperse);
    float capA = 1.0 + 1.0 * cap;
    gl_FragColor = vec4(col, soft * vAlpha * capA);
}`;
