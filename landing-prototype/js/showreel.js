/* =====================================================================
   SHOWREEL: Prompt 1 scroll model ported verbatim.
   One tall track + a sticky stage; every animated value is a pure
   function of p (0→1) = progress through the track.
   Content: XcelCareers (js/content.js). Colours: the hero palette.
   The prompt's four-point star is replaced by the client's mark (js/mark.js):
   card 03 builds the mark, then the camera dives through its hub.
   ===================================================================== */
import * as THREE from "three";
import { SHOWREEL as S, FUNCTIONS, CONTACT } from "./content.js?v=3";
import { ph, esc } from "./ph.js?v=3";
import { readMark, markSVG } from "./mark.js?v=3";
import { isPaused, onPauseChange } from "./pause.js?v=3";

/* ---------- constants (verbatim) ---------- */
const SCROLL_COMPRESS = 0.4;
const OLD_MAX = 2000;
const PS = OLD_MAX - 400;              // portfolioStart = 1600
const PF_DUR = 1500;
const PF_END = PS + PF_DUR;            // 3100
/* The prompt's ending (a camera flight through 14 placeholder tiles into a box that
   zooms up, 1900 units long) is replaced by one short closing beat: as the "What we
   staff" strip leaves, the closing scene opens through a wide, feathered circle, the
   3D mark assembles and the copy rises. 750 units, overlapping the strip's exit. */
const CLOSE_START = PS + 0.8 * PF_DUR; // 2800
const CLOSE_END = CLOSE_START + 750;   // 3550
const PERSP = 1500;
const VSCROLL_MAX = CLOSE_END + 150;   // 3700: a short hold on the finished frame
/* scroll length per unit of vScroll (vh); the prompt used 0.4, a little faster here */
const VH_PER_UNIT = 0.34;
const trackVh = (density) => Math.round(100 + VSCROLL_MAX * density);

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (t) => t * t * (3 - 2 * t);
const vScroll = (p) => clamp01(p) * VSCROLL_MAX;
const gp = (p) => clamp01(vScroll(p) / OLD_MAX);
const phase1 = (p) => clamp01(gp(p) / (2 / 15));
const phase2 = (p) => clamp01((gp(p) - 0.1) / 0.05);
const phase3 = (p) => clamp01((gp(p) - 0.15) / 0.25);
const phase4 = (p) => clamp01((gp(p) - 0.4) / 0.35);

/* ---------- responsive geometry buckets ----------
   sh: height of the opening card's video slot (vh); shorter on portrait screens
   so the lead and buttons below it never run over the video. */
const GEO = {
  desktop: { track: trackVh(VH_PER_UNIT), cw: 42, ch: 62, r: 27, fly: 40, pad: 8, h1: 18, h2: 24, bw: 52, bt: 2.4, sh: 62 },
  tablet:  { track: trackVh(VH_PER_UNIT * 0.84), cw: 54, ch: 80, r: 35, fly: 52, pad: 8, h1: 13, h2: 16, bw: 64, bt: 3.0, sh: 40 },
  mobile:  { track: trackVh(VH_PER_UNIT * 0.63), cw: 64, ch: 94, r: 41, fly: 60, pad: 8, h1: 10, h2: 12, bw: 82, bt: 4.2, sh: 42 },
};
function pickBucket() {
  const w = innerWidth, h = innerHeight;
  if (w > h) return "desktop";
  if (w < 640) return "mobile";
  if (w <= 1024) return "tablet";
  return "desktop";
}

/* ---------- timeline functions (verbatim) ---------- */
const card1Width = (p) => `calc((100vw - var(--sr-hero-pad)) * ${1 - phase1(p)} + var(--sr-card-h) * ${phase1(p)})`;
const card1Height = (p) => `calc((100vh - var(--sr-hero-pad)) * ${1 - phase1(p)} + var(--sr-card-w) * ${phase1(p)})`;
const card1Transform = (p) => `rotateZ(${phase1(p) * 90}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)} + 1px))`;
const card1Opacity = (p) => (gp(p) >= 0.75 ? 0 : 1);
const heroSlidePan = (p) => phase1(p) * -100;
const heroTiltFade = (p) => 1 - phase1(p);
const heroSliderWidth = (p) => `calc(min(90vw, 46vh) * ${1 - phase1(p)} + 66vmin * ${phase1(p)})`;
const heroSliderHeight = (p) => `calc(var(--sr-slider-h) * ${1 - phase1(p)} + 46vmin * ${phase1(p)})`;
const heroContentFade = (p) => Math.max(0, 1 - phase1(p) * 1.9);

const sideCardTransform = (p, baseRotateY) => {
  const sx = Math.max(phase2(p), 0.0001);
  return `rotateY(${baseRotateY}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)})) scaleX(${sx})`;
};
const card4Opacity = (p) => 1 - clamp01((vScroll(p) - PS) / 400);
const cardZIndex = (p, slot) => {
  const rotY = phase3(p) * -270;
  return Math.round(Math.cos(((rotY + slot * 90) * Math.PI) / 180) * 100) + 1000;
};
const carouselCtaReveal = (p) => {
  const appear = smooth(clamp01((phase1(p) - 0.9) / 0.1));
  const fadeOut = smooth(clamp01((gp(p) - 0.4) / 0.06));
  return appear * (1 - fadeOut);
};
const carouselTransform = (p) => {
  const fly = phase4(p) * phase4(p);
  return `translateZ(calc(var(--sr-flyback) * ${-fly})) rotateY(${phase3(p) * -270}deg)`;
};
const flyBackZpx = (p, vmin, geo) => -(phase4(p) * phase4(p)) * geo.fly * vmin;
const blackScreenTransform = (p, vmin, geo) => {
  const scale = (PERSP - flyBackZpx(p, vmin, geo)) / PERSP;
  const upY = smooth(clamp01((vScroll(p) - PS) / 400)) * 100;
  return `translate(-50%, calc(-50% - ${upY}vh)) scale(${scale})`;
};
const sphereSceneScale = (p, vmin, geo) => {
  const fly = flyBackZpx(p, vmin, geo);
  const radius = geo.r * vmin;
  return (PERSP - fly - radius) / (PERSP - fly);
};
const sphereBodyReveal = (p) => smooth(clamp01((gp(p) - 0.64) / 0.1));
const sphereCollapse = (p) => smooth(clamp01((gp(p) - 0.52) / 0.2));
const sphereScale = (p) => 1 + 0.5 * sphereCollapse(p);
const sphereDisperse = (p) => smooth(clamp01((vScroll(p) - (PS - 400)) / 600));

/* ---------- card 03: the mark builds, then the camera dives through its hub ----------
   gp 0.325→0.400  the blades arrive one by one (smallest first), then the figure
   gp 0.405→0.650  the stage dims, the hub opens into the dark network scene and the
                   mark zooms past the camera (exponential, so the speed feels constant) */
const MARK_IN = [0.325, 0.4];
const DIVE = [0.405, 0.65];
const DIVE_K = 40;      // final zoom of the mark
const MARK_H = 0.38;    // mark height as a share of the card height
const markIn = (p) => clamp01((gp(p) - MARK_IN[0]) / (MARK_IN[1] - MARK_IN[0]));
const diveZ = (p) => clamp01((gp(p) - DIVE[0]) / (DIVE[1] - DIVE[0]));
const diveK = (z) => Math.exp(Math.log(DIVE_K) * Math.pow(z, 1.7));
const portalOpen = (z) => smooth(clamp01(z / 0.12));                  // the hub "pupil" opens
const portalWiden = (z) => 1 + 2 * smooth(clamp01((z - 0.08) / 0.5)); // then slides under the blades
// blades thin to light streaks as they pass the camera (by zoom, not by time)
const markFade = (k) => 1 - smooth(clamp01((Math.log(k) - Math.log(3)) / (Math.log(16) - Math.log(3))));
const diveRotate = (z) => -16 * smooth(z);                            // a slight turn along the spiral
const hubDrift = (z) => 1 - smooth(clamp01(z / 0.55));                // hub glides to the centre of view
const faceFade = (p) => 1 - smooth(clamp01((gp(p) - 0.405) / 0.035)); // card text clears first
const cardFade = (p) => 1 - smooth(clamp01((gp(p) - 0.47) / 0.08));  // then the red card dissolves
const sideFade = (p) => 1 - smooth(clamp01((gp(p) - 0.405) / 0.045)); // the other cards leave the stage
const coreMarkIn = (p) => smooth(clamp01((gp(p) - 0.58) / 0.1));    // the mark at the heart of the sphere

const marqueeOpacity = (p) => phase1(p) * (1 - smooth(clamp01((gp(p) - 0.4) / 0.07)));
const marqueeBlur = (p) => (1 - phase1(p)) * 20;
// the silver stage dims to graphite as the dive begins, so the mark flies over darkness
const stageBackdropOpacity = (p) => 1 - smooth(clamp01((gp(p) - 0.405) / 0.08));

const auroraOpacity = (p) => {
  const v = vScroll(p);
  const fadeIn = clamp01((v - 1200) / 350);
  const fadeOut = 1 - clamp01((v - 2900) / 350);
  return Math.min(fadeIn, fadeOut);
};

const pfProgress = (p) => clamp01((vScroll(p) - PS) / PF_DUR);
const pfEnter = (p) => smooth(clamp01(pfProgress(p) / 0.267));
const pfSlide = (p) => clamp01((pfProgress(p) - 0.267) / 0.453);
const pfExit = (p) => smooth(clamp01((pfProgress(p) - 0.72) / 0.28));
const portfolioActive = (p) => vScroll(p) > PS;
const portfolioTransform = (p) => {
  if (!portfolioActive(p)) return "translateY(100%)";
  const ty = (1 - pfEnter(p)) * 100;
  const sc = 1 - pfExit(p) * 0.62;
  const tx = -pfExit(p) * 130;
  return `translate(${tx}vw, ${ty}%) scale(${sc})`;
};
const pfTrackTransform = (p, maxPan) => `translateX(${-pfSlide(p) * maxPan}px)`;

/* ---------- the closing beat ---------- */
const closeP = (p) => clamp01((vScroll(p) - CLOSE_START) / (CLOSE_END - CLOSE_START));
const closeActive = (p) => vScroll(p) > CLOSE_START - 1;
// the scene opens through a circle whose edge is feathered over ~30% of the screen,
// so there is never a hard boundary on screen
const closeMask = (p) => {
  const t = smooth(clamp01(closeP(p) / 0.55));
  if (t >= 0.999) return "none";
  const r = 8 + t * 125, f = 18 + t * 22; // radius and feather, % of the larger screen side
  return `radial-gradient(circle at 50% 52%, #000 ${(r - f).toFixed(2)}vmax, rgb(0 0 0 / 0.55) ${(r - f * 0.45).toFixed(2)}vmax, transparent ${r.toFixed(2)}vmax)`;
};
const closeScale = (p) => 1.08 - 0.08 * smooth(clamp01(closeP(p) / 0.7));
// the mark assembles over the middle of the beat; each piece of copy follows a step behind
const markReveal = (p) => clamp01((closeP(p) - 0.12) / 0.6);
const finalBeat = (p, i) => smooth(clamp01((closeP(p) - 0.3 - i * 0.08) / 0.34));

const heroLetterStyle = (p, index, total) => {
  const reversed = total - 1 - index;
  const delay = (reversed / total) * 0.4;
  const e = smooth(clamp01((phase1(p) - delay) / 0.6));
  return { transform: `translateY(${e * 40}%)`, filter: `blur(${e * 1.5}vmin)`, opacity: Math.max(0, 1 - e * 1.5) };
};
const blockLetterStyle = (p, index, total) => {
  const ap = clamp01((gp(p) - 0.6) / 0.135);
  const delay = (index / total) * 0.55;
  const inv = 1 - smooth(clamp01((ap - delay) / 0.45));
  return { transform: `translateY(${inv * 70}%)`, filter: `blur(${inv * 2.0}vmin)`, opacity: Math.max(0, 1 - inv * 1.3) };
};
const templatesLetterStyle = (p, index) => {
  const t = clamp01((phase1(p) - 0.45 - index * 0.005) / 0.45);
  return { transform: `translateY(${(1 - smooth(t)) * 150}%)`, filter: `blur(${(1 - t) * 1.5}vmin)`, opacity: t };
};

const sceneVisibility = (p) => {
  const g = gp(p), v = vScroll(p);
  return {
    hero: g < 0.8,
    aurora: v > 1000 && v < PF_END + 350,
    sphere: g > 0.395 && v < PF_END,
    target: v > CLOSE_START - 200,
    portfolio: v > PS - 600 && v < PF_END + 350,
  };
};

/* ---------- ScrollLetters ---------- */
function letters(str) {
  let html = "";
  for (const ch of str) {
    if (ch === "\n") html += "<br>";
    else if (ch === " ") html += "&nbsp;";
    else html += `<span class="sl">${esc(ch)}</span>`;
  }
  return html;
}
function applyLetter(el, s) {
  el.style.transform = s.transform;
  el.style.filter = s.filter;
  el.style.opacity = s.opacity;
}

/* =====================================================================
   BUILD
   ===================================================================== */
const chip = (c) => `<span class="sr-chip"><b>${esc(c.n)}</b>${esc(c.label)}</span>`;
const markIcon = (cls) => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-mark"/></svg>`;

function build(section) {
  const M = readMark();
  const C = S.cards;
  const marq = S.marquee.map((t) => `<span class="sr-marquee-item">${esc(t)}</span><span class="sr-marquee-item" style="padding:0"><span class="sr-ring"></span></span>`).join("");
  const faces = S.team.map((i) => `<span class="face">${esc(i)}</span>`).join("");
  const btns = S.heroButtons.map((b) => `<a class="sr-btn${b.primary ? " sr-btn--solid" : ""}" href="${b.href}">${esc(b.label)}</a>`).join("");

  // 1 · opening card (it later shrinks into the first carousel card)
  const heroCard = `
  <div class="sr-hero">
    <canvas id="sr-hero-canvas"></canvas>
    <div class="sr-hero-head" id="sr-hero-head"><h2 id="sr-hero-h"><span class="sl-line">${letters(S.heroLines[0])}</span><span class="sl-line dim">${letters(S.heroLines[1])}</span></h2></div>
    <div class="sr-hero-rot"><h3 id="sr-hero-rot">${letters(S.heroRotated)}</h3></div>
    <div class="sr-hero-img"><div class="sr-slider" id="sr-slider">
      <div class="sr-slide" id="sr-slide-a">${ph({ kind: "video", what: "Healthcare montage: nurses, care staff, county teams at work", note: "Main reel · 10–20 s loop · muted · real people" })}</div>
      <div class="sr-slide sr-slide--b" id="sr-slide-b"><div class="sr-rotated">${ph({ kind: "photo", what: "Recruiter with a candidate", tone: "steel" })}</div></div>
    </div></div>
    <div class="sr-hero-bottom" id="sr-hero-bottom">
      <p class="lead">${esc(S.heroLead)}</p>
      <div class="sr-btns">${btns}</div>
      <div class="sr-divider"></div>
      <div class="sr-hero-row"><div class="sr-avatars"><span class="faces">${faces}</span><span class="lbl">${esc(S.avatarsLabel)}</span></div><p class="right">${esc(S.heroRight)}</p></div>
    </div>
  </div>`;

  // 3 · numbered carousel cards: chip → photo → headline → action
  const ccDark = `
  <div class="sr-cc sr-cc--dark">
    ${ph({ kind: "photo", what: "Nurse manager reviewing a short list", note: "Portrait · real staff", src: "assets/img/hc-admin.webp", alt: "A clinician in a white coat smiling at the camera", pos: "38% 30%" })}
    <div class="sr-cc-ui">
      <div class="sr-cc-top">${chip(C.employer)}${markIcon("sr-cc-mark")}</div>
      <div class="sr-cc-bottom">
        <h4>${esc(C.employer.title)}<br><strong>${esc(C.employer.strong)}</strong></h4>
        <div class="sr-glass-pill"><span><span class="k">${esc(C.employer.pillK)}</span><span class="v">${esc(C.employer.pillV)}</span></span><span class="sr-badge">+</span></div>
      </div>
    </div>
  </div>`;

  const ccLight = `
  <div class="sr-cc sr-cc--light">
    ${ph({ kind: "photo", what: "Nurse checking open roles on a phone", note: "Portrait · real staff", tone: "light", src: "assets/img/hc-clinic.webp", alt: "A clinician in a white coat with a stethoscope, checking a phone", pos: "50% 45%" })}
    <div class="sr-cc-ui">
      <div class="sr-cc-top">${chip(C.seeker)}${markIcon("sr-cc-mark")}</div>
      <div class="sr-cc-bottom">
        <h4>${esc(C.seeker.title)}<br><strong>${esc(C.seeker.strong)}</strong></h4>
        <div class="sr-search"><span class="sr-badge">+</span><span class="q">${esc(C.seeker.q)}</span><span class="sr-badge sr-badge--go">➤</span></div>
      </div>
    </div>
  </div>`;

  // card 03: the face, the dark network scene behind the hub (the portal), and the mark on top
  const sphereCard = `
  <div class="sr-sphere-card">
    <div class="sr-face"><div class="sr-face-in" id="sr-face-in">
      <div class="sr-face-top">${chip(C.network)}</div>
      <h4>${esc(C.network.title)}<br><strong>${esc(C.network.strong)}</strong></h4>
    </div></div>
    <div class="sr-blackpanel" id="sr-blackpanel">
      <div class="sr-sphere-scene" id="sr-sphere-scene">
        <div class="sr-sphere-canvas" id="sr-sphere-wrap"><canvas id="sr-sphere-canvas"></canvas></div>
        <div class="sr-core" id="sr-core">${markIcon("sr-core-mark")}</div>
        <h2 class="sr-h-top" id="sr-h-top"><span class="sl-line">${letters(S.sphereTop)}</span></h2>
        <h2 class="sr-h-bottom" id="sr-h-bottom">${S.sphereBottom.map((l) => `<span class="sl-line">${letters(l)}</span>`).join("")}</h2>
        <div class="sr-sphere-body" id="sr-sphere-body">${S.sphereBody.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      </div>
    </div>
    ${markSVG(M, { id: "sr-zoom", cls: "sr-zoom" })}
  </div>`;

  // 5 · the three lines of business, numbered in the client's order of priority
  const pf = FUNCTIONS.map((f) => `
    <article class="sr-pf">
      ${ph({ kind: "video", what: f.video, note: f.note })}
      <div class="sr-pf-tags">${f.tags.map((t) => `<span>${esc(t)}</span>`).join('<span class="sep">·</span>')}</div>
      <div class="sr-pf-foot"><p class="sr-pf-kicker"><b>${esc(f.n)}</b>${esc(f.kicker)}</p><h3>${esc(f.title)}</h3><p class="sr-pf-line">${esc(f.line)}</p></div>
    </article>`).join("");
  const tel = "tel:+1" + CONTACT.phone.replace(/\D/g, "");

  section.innerHTML = `
  <div class="sr-aurora" id="sr-aurora" aria-hidden="true"><canvas id="sr-aurora-canvas"></canvas></div>
  <div class="sr-track" id="sr-track">
    <div class="sr-sticky">
      <div class="sr-backdrop" id="sr-backdrop"></div>
      <div class="sr-marquee" id="sr-marquee" aria-hidden="true"><div class="sr-marquee-row">${marq}${marq}</div></div>
      <div class="sr-scene"><div class="sr-rig" id="sr-rig">
        <div class="sr-carousel" id="sr-carousel">
          <div class="sr-card1" id="sr-card1">${heroCard}</div>
          <div class="sr-side" id="sr-card2">${ccDark}</div>
          <div class="sr-side" id="sr-card3">${ccLight}</div>
          <div class="sr-side sr-card4" id="sr-card4">${sphereCard}</div>
        </div>
        <div class="sr-target" id="sr-target">
          <canvas id="sr-target-bg"></canvas>
          <canvas id="sr-target-canvas"></canvas>
          <div class="sr-vignette" aria-hidden="true"></div>
          <div class="sr-ctablock" id="sr-ctablock">
            <p class="sr-cta-eyebrow"><span class="dot" aria-hidden="true"></span>${esc(S.finalEyebrow)}</p>
            <h2><span>${esc(S.finalLines[0])}</span><span class="dim">${esc(S.finalLines[1])}</span></h2>
            <p class="sr-cta-lead">${esc(S.finalLead)}</p>
            <div class="sr-ctarow"><a class="sr-ctabtn" href="contact.html">${esc(S.finalButton)}</a><a class="sr-ctaghost" href="capability.html">${esc(S.finalSecondary)}</a></div>
            <p class="sr-ctatrust">${esc(S.finalTrust)} · <a class="sr-ctatel" href="${tel}">${esc(S.finalAlt)} <b>${esc(CONTACT.phone)}</b></a></p>
          </div>
        </div>
      </div></div>
      <div class="sr-cta" id="sr-cta"><a href="#process">${esc(S.cta)}</a></div>
    </div>
  </div>
  <section class="sr-portfolio" id="sr-portfolio" aria-label="What we staff"><div class="sr-pf-track" id="sr-pf-track">${pf}</div></section>`;
}

/* =====================================================================
   WEBGL SCENES (shaders verbatim from the prompt)
   ===================================================================== */
const GRADIENT_FRAG = (withMouse) => `
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

const CLIP_VERT = `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const AURORA_VERT = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const AURORA_FRAG = `
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

const SIMPLEX3 = `
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
const SPHERE_VERT = SIMPLEX3 + `
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
const SPHERE_FRAG = `
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

/* A canvas that sizes its drawing buffer from its layout box (never from a
   transformed rect, so it does not balloon while the stage zooms).
   Resizing a WebGL buffer clears it, so every resize is followed by an
   immediate redraw: a cleared buffer would otherwise show as a black frame. */
function glCanvas(canvas, { dpr = 1, alpha = false, antialias = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha, antialias, premultipliedAlpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  const state = { renderer, w: 1, h: 1, dpr, baseDpr: dpr, onResize: null, redraw: null };
  // adaptive resolution: render at a fraction of the base pixel ratio (never below 0.6)
  state.setQuality = (q) => {
    const d = Math.max(0.6, state.baseDpr * q);
    if (Math.abs(d - state.dpr) < 0.01) return;
    state.dpr = d;
    renderer.setPixelRatio(d);
    renderer.setSize(state.w, state.h, false);
    state.onResize?.(state.w, state.h);
    state.redraw?.(); // resizing clears the buffer: redraw at once
  };
  const measure = () => {
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    if (w === state.w && h === state.h) return;
    state.w = w; state.h = h;
    renderer.setSize(w, h, false);
    state.onResize?.(w, h);
    state.redraw?.();
  };
  new ResizeObserver(measure).observe(canvas);
  measure();
  return state;
}

function clipPlane(material) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  return mesh;
}

/* The opening card's gradient. The card resizes on every scroll frame while it
   shrinks into the carousel, and resizing a WebGL buffer clears it to black: that
   was the black/gradient flicker. So the buffer here is sized from the viewport
   (it changes only when the window does, and is redrawn at once) and CSS stretches
   it over the card. A soft gradient loses nothing when stretched. */
function makeHeroGradient(canvas, { follow = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const uniforms = { u_resolution: { value: new THREE.Vector2(1, 1) }, u_time: { value: 0 }, u_mouse: { value: new THREE.Vector2(0, 0) } };
  scene.add(clipPlane(new THREE.ShaderMaterial({ vertexShader: CLIP_VERT, fragmentShader: GRADIENT_FRAG(true), uniforms })));
  let bw = 0, bh = 0, lastT = 0, last = -1e9;
  const draw = () => renderer.render(scene, camera);
  const size = () => {
    const w = Math.max(2, Math.round(innerWidth)), h = Math.max(2, Math.round(innerHeight));
    if (w === bw && h === bh) return;
    bw = w; bh = h;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(w, h);
    draw(); // never present a cleared buffer
  };
  size();
  addEventListener("resize", size);
  // follow = false parks the "cursor" far outside the canvas, where its pull on the gradient is zero
  const target = follow ? { x: bw * 0.5, y: bh * 0.3 } : { x: -1e5, y: -1e5 }, cur = { ...target };
  if (follow) addEventListener("pointermove", (e) => {
    if (isPaused()) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    target.x = ((e.clientX - r.left) / r.width) * bw;
    target.y = ((e.clientY - r.top) / r.height) * bh;
  }, { passive: true });
  uniforms.u_mouse.value.set(cur.x, cur.y);
  draw();
  requestAnimationFrame(() => canvas.classList.add("is-live")); // fades in once, after the first real frame
  return {
    render(t) {
      lastT = t;
      if (t - last < 1000 / 36) return; // ~36 fps is plenty for a slow gradient
      last = t;
      cur.x += (target.x - cur.x) * 0.12; cur.y += (target.y - cur.y) * 0.12;
      uniforms.u_mouse.value.set(cur.x, cur.y);
      uniforms.u_time.value = lastT / 1000;
      draw();
    },
  };
}

function makeAurora(canvas) {
  const gl = glCanvas(canvas, { dpr: Math.min(devicePixelRatio || 1, 2), alpha: true });
  gl.renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const uniforms = { u_time: { value: 0 } };
  scene.add(clipPlane(new THREE.ShaderMaterial({ vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG, uniforms, transparent: true, depthTest: false, depthWrite: false })));
  gl.redraw = () => gl.renderer.render(scene, camera);
  gl.redraw(); // warm up: compile the shader now, not mid-scroll
  return { render(t) { uniforms.u_time.value = t / 1000; gl.renderer.render(scene, camera); }, setQuality: gl.setQuality };
}

function makeSphere(canvas) {
  const dpr = Math.min(Math.max(devicePixelRatio || 1, 2), 3);
  const gl = glCanvas(canvas, { dpr, alpha: true });
  gl.renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 3.8);
  gl.onResize = (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); };
  gl.onResize(gl.w, gl.h);
  const N = 34000;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
    rnd[i] = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
  const uniforms = { uTime: { value: 0 }, uSize: { value: 24.0 }, uAmp: { value: 0.11 }, uPR: { value: dpr }, uDisperse: { value: 0 } };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: SPHERE_FRAG, uniforms,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  }));
  points.frustumCulled = false;
  scene.add(points);
  gl.redraw = () => gl.renderer.render(scene, camera);
  gl.redraw(); // warm up: compile the shader and upload the 34k points at load, not at the start of the dive
  return {
    render(t, disperse) {
      const s = t / 1000;
      uniforms.uTime.value = s; uniforms.uPR.value = gl.renderer.getPixelRatio(); uniforms.uDisperse.value = disperse;
      points.rotation.y = s * 0.12; points.rotation.x = Math.sin(s * 0.1) * 0.12;
      gl.renderer.render(scene, camera);
    },
    setQuality: gl.setQuality,
  };
}

function chromeEnvironment(renderer) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#3c3c3e"); grad.addColorStop(0.45, "#121214"); grad.addColorStop(1, "#050506");
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
  const shelf = g.createLinearGradient(0, 110, 0, 215);
  shelf.addColorStop(0, "rgba(255,255,255,0)"); shelf.addColorStop(0.5, "rgba(255,255,255,0.97)"); shelf.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = shelf; g.fillRect(0, 110, 1024, 105);
  for (const [x, y, r, col] of [[280, 150, 150, "rgba(255,255,255,.95)"], [740, 165, 130, "rgba(245,245,247,.9)"], [540, 340, 150, "rgba(255,42,69,.55)"]]) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col); rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose(); pmrem.dispose();
  return env;
}

/* The prompt loads a chrome star GLB. In its place: the client's mark, built in
   code from the traced symbol. Chrome blades step back one by one around the hub
   (a spiral stair you only notice as it turns); the figure is glossy signal red. */
function markObject(M) {
  const s = 2 / M.box.h; // mark height normalised to 2 units
  const P = ([x, y]) => new THREE.Vector2((x - M.box.cx) * s, -(y - M.box.cy) * s);
  const shape = (pts) => new THREE.Shape(pts.map(P));
  // satin silver: flat chrome faces would only mirror the dark room
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xdedee2, metalness: 0.82, roughness: 0.24, envMapIntensity: 1.6, clearcoat: 1.0, clearcoatRoughness: 0.08 });
  const red = new THREE.MeshPhysicalMaterial({ color: 0xff2a45, metalness: 0.4, roughness: 0.26, envMapIntensity: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.06 });
  const depth = 0.1;
  const bevel = { bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.01, bevelSegments: 4, curveSegments: 1 };
  const group = new THREE.Group();
  const hub = P(M.hub);
  // every piece remembers where it rests, so the entrance can move it in from elsewhere
  const add = (mesh, kind, i) => { mesh.userData = { kind, i, rest: mesh.position.clone() }; group.add(mesh); };
  M.rays.forEach((r, i) => {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape(r.pts), { depth, ...bevel }), chrome);
    mesh.position.z = -i * 0.03;
    add(mesh, "ray", i);
  });
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(shape(M.body), { depth: depth * 1.25, ...bevel }), red);
  body.position.z = 0.03;
  add(body, "fig", 0);
  const bc = M.body.reduce((a, q) => [a[0] + q[0] / 3, a[1] + q[1] / 3], [0, 0]);
  body.userData.pivot = P(bc); // the body scales about its own centre
  // the head is a flat disc like the logo's, not a ball
  const hp = P([M.head.cx, M.head.cy]);
  const disc = new THREE.Shape(); disc.absarc(0, 0, M.head.r * s, 0, Math.PI * 2, false);
  const head = new THREE.Mesh(new THREE.ExtrudeGeometry(disc, { depth: depth * 1.25, ...bevel, curveSegments: 48 }), red);
  head.position.set(hp.x, hp.y, 0.03);
  add(head, "fig", 1);
  // centre the stack in depth so it turns about its middle
  const box = new THREE.Box3().setFromObject(group);
  const dz = (box.min.z + box.max.z) / 2;
  group.children.forEach((c) => { c.position.z -= dz; c.userData.rest.z -= dz; });
  group.userData.hub = hub;
  group.userData.rays = M.rays.length;
  return group;
}

/* Scroll-driven assembly, r = 0..1. Blades grow out of the hub one by one, smallest
   first (the order the card in the dive builds them), then the figure settles from
   above. Pieces scale about the hub, so nothing pops or slides in from off screen. */
function assembleMark(group, r) {
  const hub = group.userData.hub, n = group.userData.rays;
  for (const m of group.children) {
    const { kind, i, rest } = m.userData;
    let t;
    if (kind === "ray") t = smooth(clamp01((r - (n - 1 - i) * 0.055) / 0.42));
    else t = smooth(clamp01((r - 0.5 - i * 0.06) / 0.38));
    const sc = Math.max(0.001, kind === "ray" ? t : 0.6 + 0.4 * t);
    m.scale.set(sc, sc, 1);
    m.visible = t > 0.001;
    if (kind === "ray") m.position.set(hub.x * (1 - sc), hub.y * (1 - sc), rest.z - (1 - t) * 0.6);
    else {
      // body: geometry sits in mark space, so pivot about its centre; head: its own origin
      const pv = m.userData.pivot;
      const x = pv ? pv.x * (1 - sc) : rest.x, y = pv ? pv.y * (1 - sc) : rest.y;
      m.position.set(x, y + (1 - t) * 0.55, rest.z);
    }
  }
}

function makeTargetStar(canvas) {
  const gl = glCanvas(canvas, { dpr: Math.min(devicePixelRatio || 1, 2), alpha: true, antialias: true });
  const r = gl.renderer;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const d1 = new THREE.DirectionalLight(0xffffff, 2.0); d1.position.set(2.5, 3.0, 4.0); scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xff2a45, 0.9); /* signal-red rim light */ d2.position.set(-3.0, -1.5, 2.0); scene.add(d2);
  scene.environment = chromeEnvironment(r);

  // the gradient behind the mark is its own canvas (makeHeroGradient, the path that works everywhere);
  // this canvas only draws the mark and stays transparent

  const group = markObject(readMark());
  scene.add(group);
  let clock = 0, lastT = null;

  // landscape: the mark stands to the right of the text; portrait: smaller, top right
  const place = () => {
    const a = camera.aspect, halfH = 4 * Math.tan((22.5 * Math.PI) / 180), halfW = halfH * a;
    if (a >= 1) { group.userData.base = [Math.min(1.45, halfW * 0.55), 0.02]; group.userData.size = 1.2; }
    else { group.userData.base = [halfW * 0.42, halfH * 0.52]; group.userData.size = 0.62; }
  };
  gl.onResize = (w, h) => { camera.aspect = w / h; camera.updateProjectionMatrix(); place(); };
  gl.onResize(gl.w, gl.h);
  let reveal = 0;
  const draw = () => {
    const sc = clock;
    const [bx, by] = group.userData.base;
    const e = smooth(reveal);
    assembleMark(group, reveal);
    group.scale.setScalar(group.userData.size * (0.88 + 0.12 * e) * (1 + 0.012 * Math.sin(sc * 0.9) * e));
    group.position.set(bx, by + Math.sin(sc * 0.8) * 0.03 * e, 0);
    // turns into place as it assembles, then a slow sway that never shows it edge-on
    group.rotation.set(-0.08 + Math.sin(sc * 0.55) * 0.04 * e, -0.3 + Math.sin(sc * 0.42) * 0.4 * e - (1 - e) * 0.9, Math.sin(sc * 0.3) * 0.02 * e);
    r.render(scene, camera);
  };
  gl.redraw = draw;
  draw(); // warm up: compile the physical materials at load, not when the closing frame arrives
  return {
    render(t, r = 1) {
      reveal = r;
      const delta = lastT == null ? 0 : Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      clock += delta;
      draw();
    },
    pause() { lastT = null; },
    setQuality: gl.setQuality,
  };
}

/* =====================================================================
   INIT
   ===================================================================== */
export function initShowreel(section) {
  build(section);
  const $ = (id) => section.querySelector("#" + id);
  const el = {
    track: $("sr-track"), backdrop: $("sr-backdrop"), marquee: $("sr-marquee"), rig: $("sr-rig"), carousel: $("sr-carousel"),
    card1: $("sr-card1"), card2: $("sr-card2"), card3: $("sr-card3"), card4: $("sr-card4"),
    heroHead: $("sr-hero-head"), slider: $("sr-slider"), slideA: $("sr-slide-a"), slideB: $("sr-slide-b"), heroBottom: $("sr-hero-bottom"),
    panel: $("sr-blackpanel"), sphereScene: $("sr-sphere-scene"), sphereWrap: $("sr-sphere-wrap"), core: $("sr-core"),
    faceIn: $("sr-face-in"), face: section.querySelector(".sr-face"), zoom: $("sr-zoom"),
    sphereBody: $("sr-sphere-body"), target: $("sr-target"), ctaBlock: $("sr-ctablock"), cta: $("sr-cta"),
    aurora: $("sr-aurora"), portfolio: $("sr-portfolio"), pfTrack: $("sr-pf-track"),
  };
  const ctaParts = [...el.ctaBlock.querySelectorAll(".sr-cta-eyebrow, h2 > span, .sr-cta-lead, .sr-ctarow, .sr-ctatrust")];

  // card 03: the mark (one element per blade) and the dive through its hub
  const M = readMark();
  const zoomRot = el.zoom.querySelector(".zm-rot");
  const zoomRays = [...el.zoom.querySelectorAll(".zm-ray")];
  const zoomFig = el.zoom.querySelector(".zm-fig");
  // W/H: the zoom layer in px; S: vmin per mark unit on the card; dx0/dy0: hub offset from the card centre (vmin)
  const dive = { W: 1, H: 1, S: 1, dx0: 0, dy0: 0 };

  // letter groups
  const heroLines = [...section.querySelectorAll("#sr-hero-h .sl-line")].map((l) => [...l.querySelectorAll(".sl")]);
  const rotLetters = [...section.querySelectorAll("#sr-hero-rot .sl")];
  const blockLines = [
    ...section.querySelectorAll("#sr-h-top .sl-line"),
    ...section.querySelectorAll("#sr-h-bottom .sl-line"),
  ].map((l) => [...l.querySelectorAll(".sl")]);
  const blockTotal = blockLines.reduce((n, l) => n + l.length, 0);

  // geometry
  let geo = GEO.desktop, trackTop = 0, trackH = 1;
  const applyGeo = () => {
    geo = GEO[pickBucket()];
    const s = section.style;
    s.setProperty("--sr-track-vh", geo.track + "vh");
    s.setProperty("--sr-card-w", geo.cw + "vmin");
    s.setProperty("--sr-card-h", geo.ch + "vmin");
    s.setProperty("--sr-carousel-r", geo.r + "vmin");
    s.setProperty("--sr-flyback", geo.fly + "vmin");
    s.setProperty("--sr-hero-pad", `calc(${geo.pad}vmin + var(--bar-h, 0px))`); // the opening card sits below the fixed top bar
    s.setProperty("--sr-heading-1", geo.h1 + "vmin");
    s.setProperty("--sr-heading-2", geo.h2 + "vmin");
    s.setProperty("--sr-sphere-body-w", geo.bw + "vmin");
    s.setProperty("--sr-sphere-body-text", geo.bt + "vmin");
    s.setProperty("--sr-cu", geo.cw / 42 + "vmin");
    s.setProperty("--sr-slider-h", geo.sh + "vh");
  };
  const measure = () => {
    const r = el.track.getBoundingClientRect();
    trackTop = r.top + scrollY;
    trackH = el.track.offsetHeight;
  };
  // the mark sits on card 03 with its box centred and a little above the middle;
  // during the dive its hub glides to the centre of view
  const measureDive = () => {
    dive.W = el.zoom.clientWidth || innerWidth;
    dive.H = el.zoom.clientHeight || innerHeight;
    dive.S = (MARK_H * geo.ch) / M.box.h;
    dive.dx0 = (M.hub[0] - M.box.cx) * dive.S;
    dive.dy0 = -0.06 * geo.ch + (M.hub[1] - M.box.cy) * dive.S;
  };
  const relayout = () => { applyGeo(); measure(); measureDive(); lastP = -1; };
  applyGeo(); measure(); measureDive();
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(relayout, 120); });
  addEventListener("orientationchange", () => setTimeout(relayout, 200));
  new ResizeObserver(measure).observe(document.body);

  // cursor tilt for the hero image card
  const tilt = { tx: 0, ty: 0, rx: 0, ry: 0 };
  addEventListener("pointermove", (e) => {
    if (isPaused()) return;
    const nx = (e.clientX / innerWidth) * 2 - 1, ny = (e.clientY / innerHeight) * 2 - 1;
    tilt.tx = -ny * 9; tilt.ty = nx * 12;
  }, { passive: true });
  // a virtual clock for the shaders and the mark's sway: it stands still while animations are paused,
  // and the scenes are then redrawn only when the scroll position changes
  let vt = 0, lastFrameT = null, scenesP = -1, scenesDirty = true;
  onPauseChange(() => { scenesDirty = true; tilt.tx = 0; tilt.ty = 0; });

  /* adaptive resolution: when frames stay slow while the scenes play, the big WebGL canvases step down
     to a lower pixel ratio (1 → 0.75 → 0.6 → 0.5 of their base); they step back up only after a long
     stretch of headroom, and stay down if going back up made it slow again */
  const QUALITY = [1, 0.75, 0.6, 0.5];
  const SLOW_MS = 28, FAST_MS = 14;
  const ADAPTIVE = true; // set to false to switch adaptive resolution off (used while investigating the closing-frame background)
  let qLevel = 0, qEma = 16.7, qSince = 0, qCheck = 0, qUp = -1e9, qBlockedUp = false;
  const setQuality = (level, now) => {
    qLevel = level; qSince = now; qEma = 16.7;
    // the closing frame's canvas (gradient + chrome mark) is left alone: resizing it showed a black gradient in Chrome
    if (gfx) for (const k of ["aurora", "sphere"]) gfx[k].setQuality?.(QUALITY[level]);
    section.dataset.quality = String(level);
  };
  const govern = (dt, now) => {
    if (!ADAPTIVE) return;
    if (dt <= 0 || dt > 200) return; // a hidden tab or a stall, not a measurement
    qEma += (dt - qEma) * 0.08;
    if (now - qCheck < 500) return;
    qCheck = now;
    if (qEma > SLOW_MS && qLevel < QUALITY.length - 1 && now - qSince > 1500) {
      if (now - qUp < 10000) qBlockedUp = true; // it was fine one level down: do not oscillate
      setQuality(qLevel + 1, now);
    } else if (qEma < FAST_MS && qLevel > 0 && !qBlockedUp && now - qSince > 8000) {
      qUp = now;
      setQuality(qLevel - 1, now);
    }
  };

  // WebGL scenes (created lazily so a WebGL failure never breaks the page)
  let gfx = null;
  try {
    gfx = {
      hero: makeHeroGradient(section.querySelector("#sr-hero-canvas")),
      aurora: makeAurora(section.querySelector("#sr-aurora-canvas")),
      sphere: makeSphere(section.querySelector("#sr-sphere-canvas")),
      targetBg: makeHeroGradient(section.querySelector("#sr-target-bg"), { follow: false }),
      target: makeTargetStar(section.querySelector("#sr-target-canvas")),
    };
  } catch (err) {
    console.warn("WebGL unavailable, showreel runs without shaders", err);
  }

  let lastP = -1;
  function frame(t) {
    requestAnimationFrame(frame);
    const dtf = lastFrameT == null ? 0 : Math.min(100, t - lastFrameT);
    lastFrameT = t;
    if (!isPaused()) vt += dtf;
    const y = scrollY, vh = innerHeight;
    const near = y + vh > trackTop - 200 && y < trackTop + trackH + 200;
    const pinned = y >= trackTop - 2 && y <= trackTop + trackH - vh + 2;
    el.aurora.style.visibility = pinned ? "visible" : "hidden";
    el.portfolio.style.visibility = pinned ? "visible" : "hidden";
    if (!near) return;

    const p = clamp01((y - trackTop) / Math.max(1, trackH - vh));
    const vmin = Math.min(innerWidth, vh) / 100;
    tilt.rx += (tilt.tx - tilt.rx) * 0.1;
    tilt.ry += (tilt.ty - tilt.ry) * 0.1;
    const f = heroTiltFade(p);
    el.slider.style.transform = `translate(-50%,-50%) rotateX(${tilt.rx * f}deg) rotateY(${tilt.ry * f}deg)`;

    if (p !== lastP) {
      lastP = p;
      // backdrop + marquee
      el.backdrop.style.opacity = stageBackdropOpacity(p);
      el.marquee.style.opacity = marqueeOpacity(p);
      el.marquee.style.filter = `blur(${marqueeBlur(p)}px)`;
      // camera rig + carousel
      el.carousel.style.transform = carouselTransform(p);
      // card 1 (hero)
      const c1 = el.card1.style;
      c1.width = card1Width(p); c1.height = card1Height(p); c1.transform = card1Transform(p);
      const sf = sideFade(p);
      c1.zIndex = cardZIndex(p, 0); c1.opacity = card1Opacity(p) * sf;
      el.heroHead.style.opacity = heroContentFade(p);
      el.heroBottom.style.opacity = heroContentFade(p);
      el.slider.style.width = heroSliderWidth(p);
      el.slider.style.height = heroSliderHeight(p);
      el.slideA.style.transform = `translateX(${heroSlidePan(p)}%)`;
      el.slideB.style.transform = `translateX(${heroSlidePan(p)}%)`;
      heroLines.forEach((line) => line.forEach((s, i) => applyLetter(s, heroLetterStyle(p, i, line.length))));
      rotLetters.forEach((s, i) => applyLetter(s, templatesLetterStyle(p, i)));
      // side cards
      el.card2.style.transform = sideCardTransform(p, 90); el.card2.style.zIndex = cardZIndex(p, 1); el.card2.style.opacity = card1Opacity(p) * sf;
      el.card3.style.transform = sideCardTransform(p, 180); el.card3.style.zIndex = cardZIndex(p, 2); el.card3.style.opacity = card1Opacity(p) * sf;
      el.card4.style.transform = sideCardTransform(p, 270); el.card4.style.zIndex = cardZIndex(p, 3); el.card4.style.opacity = card4Opacity(p);
      // an invisible card must also stop catching clicks and hover: Chrome still hit-tests 3D layers at opacity 0
      for (const cd of [el.card1, el.card2, el.card3, el.card4]) cd.style.visibility = +cd.style.opacity <= 0.001 ? "hidden" : "visible";
      // carousel CTA
      const cr = carouselCtaReveal(p);
      el.cta.style.opacity = cr;
      el.cta.style.transform = `translateY(${(1 - cr) * 2.5}vh)`;
      el.cta.style.visibility = cr > 0.01 ? "visible" : "hidden";
      // card 03: build the mark, dim the stage, open the hub and dive through it
      const mi = markIn(p), z = diveZ(p), k = diveK(z), drift = hubDrift(z);
      const hx = dive.dx0 * drift, hy = dive.dy0 * drift; // hub position, vmin from the card centre
      const ppu = dive.S * k * vmin;                      // px per mark unit at this zoom
      const fade = markFade(k);
      el.zoom.style.visibility = mi > 0 && fade > 0.002 ? "visible" : "hidden";
      if (el.zoom.style.visibility === "visible") {
        el.zoom.setAttribute("viewBox", `${M.hub[0] - (dive.W / 2 + hx * vmin) / ppu} ${M.hub[1] - (dive.H / 2 + hy * vmin) / ppu} ${dive.W / ppu} ${dive.H / ppu}`);
        zoomRot.setAttribute("transform", `rotate(${diveRotate(z)} ${M.hub[0]} ${M.hub[1]})`);
        const lastRay = zoomRays.length - 1;
        zoomRays.forEach((ray, i) => {
          const t = smooth(clamp01((mi - (lastRay - i) * 0.065) / 0.42)); // smallest blade first, round the spiral
          const s = 0.3 + 0.7 * t;
          ray.setAttribute("transform", `matrix(${s} 0 0 ${s} ${M.hub[0] * (1 - s)} ${M.hub[1] * (1 - s)})`);
          ray.style.opacity = t;
        });
        const fi = smooth(clamp01((mi - 0.52) / 0.48)); // then the figure settles in from above
        zoomFig.setAttribute("transform", `translate(0 ${(1 - fi) * -16})`);
        zoomFig.style.opacity = fi;
        el.zoom.style.opacity = fade;
        el.zoom.style.transform = blackScreenTransform(p, vmin, geo);
      }
      el.faceIn.style.opacity = faceFade(p);
      el.face.style.opacity = cardFade(p);
      // the portal: the dark network scene, seen through the hub and widening until it fills the view
      const R = M.hole * dive.S * k * portalOpen(z) * portalWiden(z);
      el.panel.style.clipPath = z >= 1 ? "none" : `circle(${R.toFixed(3)}vmin at calc(50% + ${hx.toFixed(3)}vmin) calc(50% + ${hy.toFixed(3)}vmin))`;
      el.panel.style.transform = blackScreenTransform(p, vmin, geo);
      el.sphereScene.style.transform = `translate(-50%,-50%) scale(${sphereSceneScale(p, vmin, geo)})`;
      // portrait screens stack the copy under the sphere, so the sphere and its mark rise as the copy arrives
      const rise = geo === GEO.desktop ? 0 : 15 * smooth(clamp01((gp(p) - 0.6) / 0.12));
      el.sphereWrap.style.transform = `translate(-50%, calc(-50% - ${rise.toFixed(3)}vh)) scale(${sphereScale(p)})`;
      const cm = coreMarkIn(p);
      el.core.style.opacity = cm;
      el.core.style.transform = `translate(-50%, calc(-50% - ${rise.toFixed(3)}vh)) scale(${0.72 + 0.28 * cm - 0.16 * sphereCollapse(p)})`;
      let idx = 0;
      blockLines.forEach((line) => line.forEach((s) => applyLetter(s, blockLetterStyle(p, idx++, blockTotal))));
      const br = sphereBodyReveal(p);
      el.sphereBody.style.opacity = br;
      el.sphereBody.style.transform = `translateY(${(1 - br) * 2.5}vmin)`;
      // aurora
      el.aurora.style.opacity = auroraOpacity(p);
      // portfolio
      el.portfolio.style.transform = portfolioTransform(p);
      const maxPan = Math.max(0, el.pfTrack.scrollWidth - el.portfolio.clientWidth + 3 * vmin);
      el.pfTrack.style.transform = pfTrackTransform(p, maxPan);
      // flight grid + target
      // closing scene: opens through a feathered circle, settles from a slight zoom
      const ca = closeActive(p);
      el.target.style.visibility = ca ? "visible" : "hidden";
      if (ca) {
        const m = closeMask(p);
        el.target.style.maskImage = m; el.target.style.webkitMaskImage = m;
        el.target.style.transform = `translate(-50%, -50%) scale(${closeScale(p).toFixed(4)})`;
      }
      ctaParts.forEach((part, i) => {
        const r = finalBeat(p, i);
        part.style.opacity = r * (part.classList.contains("dim") ? 0.4 : 1);
        part.style.transform = `translateY(${((1 - r) * 2.6).toFixed(3)}vh)`;
        part.style.filter = r < 0.999 ? `blur(${((1 - r) * 8).toFixed(2)}px)` : "none";
        part.style.visibility = r > 0.005 ? "visible" : "hidden";
      });
    }

    const onScreen = y + vh > trackTop && y < trackTop + trackH;
    if (gfx && onScreen && (!isPaused() || p !== scenesP || scenesDirty)) {
      scenesP = p; scenesDirty = false;
      const vis = sceneVisibility(p);
      if (vis.hero) gfx.hero.render(vt);
      if (vis.aurora && auroraOpacity(p) > 0) gfx.aurora.render(vt);
      if (vis.sphere) gfx.sphere.render(vt, sphereDisperse(p));
      if (vis.target && closeActive(p)) { gfx.targetBg.render(vt); gfx.target.render(vt, markReveal(p)); } else gfx.target.pause();
      if (!isPaused()) govern(dtf, t);
    }
  }
  requestAnimationFrame(frame);

  /* ---------- horizontal snap ----------
     Vertical scroll stays continuous. Where the reel moves sideways (the carousel
     turning through its cards, the "What we staff" strip panning), a sideways input
     — trackpad swipe, shift + wheel, ← / → keys, a horizontal touch swipe — steps to
     the next or previous resting position instead, so no one has to time the scroll. */
  const vToY = (v) => trackTop + (v / VSCROLL_MAX) * Math.max(1, trackH - innerHeight);
  const yToV = (y) => clamp01((y - trackTop) / Math.max(1, trackH - innerHeight)) * VSCROLL_MAX;
  const zones = () => {
    const vmin = Math.min(innerWidth, innerHeight) / 100;
    // carousel: one stop per card (phase3 = 0, 1/3, 2/3, 1)
    const car = [0, 1, 2, 3].map((k) => (0.15 + (0.25 * k) / 3) * OLD_MAX);
    // portfolio: one stop per tile, measured from the track, plus the far end
    const maxPan = Math.max(1, el.pfTrack.scrollWidth - el.portfolio.clientWidth + 3 * vmin);
    const tiles = [...el.pfTrack.children];
    const x0 = tiles[0]?.offsetLeft ?? 0;
    const slides = [...new Set(tiles.map((t) => Math.min(1, (t.offsetLeft - x0) / maxPan)).concat(1).map((x) => Math.round(x * 1000) / 1000))];
    const pf = slides.filter((x, i, a) => i === 0 || x - a[i - 1] > 0.02).map((x) => PS + PF_DUR * (0.267 + 0.453 * x));
    return [
      { from: 0.1 * OLD_MAX, to: 0.415 * OLD_MAX, stops: car },
      { from: PS + PF_DUR * 0.2, to: PS + PF_DUR * 0.76, stops: pf },
    ];
  };
  const zoneAt = (y) => { const v = yToV(y); return zones().find((z) => v >= z.from && v <= z.to) || null; };
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let lenis = null;
  const step = (dir) => {
    const base = lenis ? lenis.targetScroll : scrollY;
    const z = zoneAt(base);
    if (!z) return false;
    const ys = z.stops.map(vToY);
    const to = dir > 0 ? ys.find((y) => y > base + 4) : [...ys].reverse().find((y) => y < base - 4);
    if (to == null) return true; // at the end of this strip: swallow the input, stay put
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(to, { duration: reduce ? 0.01 : 0.9, easing: ease });
    else scrollTo({ top: to, behavior: reduce ? "auto" : "smooth" });
    return true;
  };
  /* ---------- vertical snap ----------
     Inside the pinned reel a tap on ↓ / ↑ steps to the next or previous resting beat:
     the opening card, the four carousel cards, the sphere once its text has settled, the
     three "What we staff" panels, and the closing frame. Holding the key past the
     keyboard's repeat delay scrolls freely and smoothly instead, and the wheel is untouched.
     Outside the reel the arrow keys keep the browser's own behaviour. */
  const SPHERE_REST = 0.735 * OLD_MAX; // the sphere's "profiles on file" text has finished arriving
  const vstops = () => {
    const [car, pf] = zones();
    const v = [0, ...car.stops, SPHERE_REST, ...pf.stops, VSCROLL_MAX].sort((a, b) => a - b);
    return v.filter((x, i) => i === 0 || x - v[i - 1] > 10).map((x) => ({ v: x, y: vToY(x) }));
  };
  const inTrack = (y) => y >= trackTop - 4 && y <= trackTop + trackH - innerHeight + 4;
  let pressSnapped = false, snapY = 0, snapUntil = 0;
  const vstep = (dir) => {
    if (!lenis || lenis.isStopped) return false;
    // taps in quick succession chain: measure from where the last one is heading, not from where it is now
    const base = performance.now() < snapUntil ? snapY : lenis.targetScroll;
    if (!inTrack(base)) return false;
    const s = vstops();
    const to = dir > 0 ? s.find((x) => x.y > base + 4) : [...s].reverse().find((x) => x.y < base - 4);
    if (!to) return false; // first or last beat: leave the key to the browser, so the page carries on
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dist = Math.abs(to.y - base) / Math.max(1, (trackH - innerHeight) / VSCROLL_MAX); // in timeline units
    const dur = reduce ? 0.01 : Math.min(2.4, Math.max(0.9, 0.5 + dist / 1400));
    snapY = to.y; snapUntil = performance.now() + dur * 1000;
    lenis.scrollTo(to.y, { duration: dur, easing: ease });
    return true;
  };
  // hold: speed eases in and out, so starting and stopping feel like the wheel, not like a jump
  let holdDir = 0, holdVel = 0, holdRaf = 0, holdT = 0;
  const holdTick = (t) => {
    const dt = Math.min(0.05, (t - holdT) / 1000); holdT = t;
    holdVel += (holdDir * 2.2 * innerHeight - holdVel) * (1 - Math.exp(-dt / 0.12));
    const y = lenis.animatedScroll + holdVel * dt;
    if (holdDir && !inTrack(y)) { holdDir = 0; pressSnapped = false; } // left the reel: browser scrolling takes over
    if (!holdDir && Math.abs(holdVel) < 8) { holdVel = 0; holdRaf = 0; return; }
    lenis.scrollTo(y, { immediate: true, force: true });
    holdRaf = requestAnimationFrame(holdTick);
  };
  const holdStart = (dir) => {
    holdDir = dir; holdVel = 0; snapUntil = 0;
    lenis.scrollTo(lenis.animatedScroll, { immediate: true, force: true }); // cancel the tap's snap
    if (!holdRaf) { holdT = performance.now(); holdRaf = requestAnimationFrame(holdTick); }
  };
  const holdStop = () => { holdDir = 0; };
  function attachSnap(l) {
    lenis = l;
    // wheel: one step per gesture; trackpad momentum is swallowed until the gesture ends
    let acc = 0, last = 0, fired = false;
    addEventListener("wheel", (e) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx || e.ctrlKey || !zoneAt(lenis.targetScroll)) return;
      e.preventDefault(); e.stopImmediatePropagation(); // keeps Lenis and the browser's back-swipe out of it
      const now = performance.now();
      if (now - last > 220) { acc = 0; fired = false; }
      last = now;
      if (fired) return;
      acc += e.deltaMode === 1 ? dx * 16 : dx;
      if (Math.abs(acc) > 30) { fired = true; step(Math.sign(acc)); }
    }, { passive: false, capture: true });
    addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { if (step(e.key === "ArrowRight" ? 1 : -1)) e.preventDefault(); return; }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (e.target.closest?.(".xc-panel")) return; // the chat has its own scrolling
      const dir = e.key === "ArrowDown" ? 1 : -1;
      if (!e.repeat) { // a tap: step to the next resting position
        holdStop(); pressSnapped = vstep(dir);
        if (pressSnapped) e.preventDefault();
      } else if (holdDir) { e.preventDefault(); } // already holding: swallow the browser's repeats
      else if (pressSnapped) { holdStart(dir); e.preventDefault(); } // held past the key-repeat delay: scroll freely
    });
    addEventListener("keyup", (e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { pressSnapped = false; holdStop(); } });
    addEventListener("blur", () => { pressSnapped = false; holdStop(); });
    let tx = 0, ty = 0;
    addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    addEventListener("touchend", (e) => {
      const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  // keyboard focus must land in view: the stage is pinned (sticky), so the browser's own
  // scroll-into-view can leave a focused button below the fold; bring the pinned stage up instead
  section.addEventListener("focusin", (e) => {
    const target = e.target;
    // check again once the browser's own scroll has settled and the stage has re-laid out
    setTimeout(() => {
      // keyboard focus only: a mouse click on a link also focuses it, and must not fight the scroll it starts
      if (document.activeElement !== target || !target.matches(":focus-visible")) return;
      const r = target.getBoundingClientRect();
      if (!r.height || (r.top <= innerHeight - 8 && r.bottom >= 8)) return;
      if (lenis) lenis.scrollTo(trackTop, { immediate: true, force: true });
      else scrollTo(0, trackTop);
    }, 150);
  });
  return { measure, attachSnap };
}
