/* =====================================================================
   Shader sources for the showreel's WebGL scenes. Copied verbatim from
   landing-prototype-clean/js/showreel.js (lines 333 to 434): GRADIENT_FRAG (simplex-noise gradient of
   eleven blobs in the hero palette, optional pointer pull, film grain) and CLIP_VERT (a full-screen
   clip-space quad). Do not edit them by hand: the stage's fidelity check compares them with the prototype's.
   Later scenes (aurora, sphere) add their own sources here.
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
