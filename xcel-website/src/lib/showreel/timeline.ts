/* =====================================================================
   SHOWREEL TIMELINE: every animated value is a pure function of p (0 to 1), the progress through
   the pinned track. No DOM, no browser APIs, no state: deterministic and testable from a number.

   Ported verbatim from landing-prototype-clean/js/showreel.js (lines 18 to 196). Names, constants,
   formulas and template strings are the prototype's, so the same p gives the same value; the
   engine (engine.ts) only applies these to the DOM. Do not "simplify" a formula here: the
   choreography is the product. A check against the prototype's own functions lives in
   docs/SHOWREEL.md ("Verification").

   Timeline units: v = p x VSCROLL_MAX (0 to 3700). gp = v / OLD_MAX is the original 0-to-1
   timeline of the template the showreel is derived from; its phase helpers use that scale.
   ===================================================================== */

/* ---------- constants (verbatim) ---------- */
export const OLD_MAX = 2000;
export const PS = OLD_MAX - 400; // portfolio (service panels) start: 1600
export const PF_DUR = 1500;
export const PF_END = PS + PF_DUR; // 3100
/* The closing beat: as the "What we staff" strip leaves, the closing scene opens through a wide,
   feathered circle, the mark assembles and the copy rises. 750 units, overlapping the strip's exit. */
export const CLOSE_START = PS + 0.8 * PF_DUR; // 2800
export const CLOSE_END = CLOSE_START + 750; // 3550
export const PERSP = 1500;
export const VSCROLL_MAX = CLOSE_END + 150; // 3700: a short hold on the finished frame
/** scroll length per unit of vScroll (vh) */
export const VH_PER_UNIT = 0.34;
export const trackVh = (density: number): number => Math.round(100 + VSCROLL_MAX * density);

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smooth = (t: number): number => t * t * (3 - 2 * t);
export const vScroll = (p: number): number => clamp01(p) * VSCROLL_MAX;
export const gp = (p: number): number => clamp01(vScroll(p) / OLD_MAX);
export const phase1 = (p: number): number => clamp01(gp(p) / (2 / 15));
export const phase2 = (p: number): number => clamp01((gp(p) - 0.1) / 0.05);
export const phase3 = (p: number): number => clamp01((gp(p) - 0.15) / 0.25);
export const phase4 = (p: number): number => clamp01((gp(p) - 0.4) / 0.35);

/* ---------- responsive geometry buckets ----------
   The CSS (Showreel.module.css) carries the same numbers as custom properties and picks the bucket
   with these exact media queries; the engine reads the bucket with matchMedia on the same queries,
   so CSS and JS cannot disagree. sh: height of the opening card's video slot (vh). */
export interface Geo {
  track: number; cw: number; ch: number; r: number; fly: number; pad: number;
  h1: number; h2: number; bw: number; bt: number; sh: number;
}
export type BucketName = "desktop" | "tablet" | "mobile";
export const GEO: Record<BucketName, Geo> = {
  desktop: { track: trackVh(VH_PER_UNIT), cw: 42, ch: 62, r: 27, fly: 40, pad: 8, h1: 18, h2: 24, bw: 52, bt: 2.4, sh: 62 },
  tablet: { track: trackVh(VH_PER_UNIT * 0.84), cw: 54, ch: 80, r: 35, fly: 52, pad: 8, h1: 13, h2: 16, bw: 64, bt: 3.0, sh: 40 },
  mobile: { track: trackVh(VH_PER_UNIT * 0.63), cw: 64, ch: 94, r: 41, fly: 60, pad: 8, h1: 10, h2: 12, bw: 82, bt: 4.2, sh: 42 },
};
/** landscape (width > height) = desktop; portrait narrower than 640 = mobile; portrait up to 1024 = tablet; else desktop */
export const BUCKET_QUERY = {
  mobile: "(orientation: portrait) and (width < 640px)",
  tablet: "(orientation: portrait) and (width <= 1024px)",
} as const;

/* ---------- opening card, carousel, marquee ---------- */
export const card1Width = (p: number): string => `calc((100vw - var(--sr-hero-pad)) * ${1 - phase1(p)} + var(--sr-card-h) * ${phase1(p)})`;
export const card1Height = (p: number): string => `calc((100vh - var(--sr-hero-pad)) * ${1 - phase1(p)} + var(--sr-card-w) * ${phase1(p)})`;
export const card1Transform = (p: number): string => `rotateZ(${phase1(p) * 90}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)} + 1px))`;
export const card1Opacity = (p: number): number => (gp(p) >= 0.75 ? 0 : 1);
export const heroSlidePan = (p: number): number => phase1(p) * -100;
export const heroTiltFade = (p: number): number => 1 - phase1(p);
export const heroSliderWidth = (p: number): string => `calc(min(90vw, 46vh) * ${1 - phase1(p)} + 66vmin * ${phase1(p)})`;
export const heroSliderHeight = (p: number): string => `calc(var(--sr-slider-h) * ${1 - phase1(p)} + 46vmin * ${phase1(p)})`;
export const heroContentFade = (p: number): number => Math.max(0, 1 - phase1(p) * 1.9);

export const sideCardTransform = (p: number, baseRotateY: number): string => {
  const sx = Math.max(phase2(p), 0.0001);
  return `rotateY(${baseRotateY}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)})) scaleX(${sx})`;
};
export const card4Opacity = (p: number): number => 1 - clamp01((vScroll(p) - PS) / 400);
export const cardZIndex = (p: number, slot: number): number => {
  const rotY = phase3(p) * -270;
  return Math.round(Math.cos(((rotY + slot * 90) * Math.PI) / 180) * 100) + 1000;
};
export const carouselCtaReveal = (p: number): number => {
  const appear = smooth(clamp01((phase1(p) - 0.9) / 0.1));
  const fadeOut = smooth(clamp01((gp(p) - 0.4) / 0.06));
  return appear * (1 - fadeOut);
};
export const carouselTransform = (p: number): string => {
  const fly = phase4(p) * phase4(p);
  return `translateZ(calc(var(--sr-flyback) * ${-fly})) rotateY(${phase3(p) * -270}deg)`;
};
export const flyBackZpx = (p: number, vmin: number, geo: Geo): number => -(phase4(p) * phase4(p)) * geo.fly * vmin;
export const blackScreenTransform = (p: number, vmin: number, geo: Geo): string => {
  const scale = (PERSP - flyBackZpx(p, vmin, geo)) / PERSP;
  const upY = smooth(clamp01((vScroll(p) - PS) / 400)) * 100;
  return `translate(-50%, calc(-50% - ${upY}vh)) scale(${scale})`;
};
export const sphereSceneScale = (p: number, vmin: number, geo: Geo): number => {
  const fly = flyBackZpx(p, vmin, geo);
  const radius = geo.r * vmin;
  return (PERSP - fly - radius) / (PERSP - fly);
};
export const sphereBodyReveal = (p: number): number => smooth(clamp01((gp(p) - 0.64) / 0.1));
export const sphereCollapse = (p: number): number => smooth(clamp01((gp(p) - 0.52) / 0.2));
export const sphereScale = (p: number): number => 1 + 0.5 * sphereCollapse(p);
export const sphereDisperse = (p: number): number => smooth(clamp01((vScroll(p) - (PS - 400)) / 600));

/* ---------- card 03: the mark builds, then the camera dives through its hub ----------
   gp 0.325 to 0.400  the blades arrive one by one (smallest first), then the figure
   gp 0.405 to 0.650  the stage dims, the hub opens into the dark network scene and the mark zooms
                      past the camera (exponential, so the speed feels constant) */
export const MARK_IN = [0.325, 0.4] as const;
export const DIVE = [0.405, 0.65] as const;
export const DIVE_K = 40; // final zoom of the mark
export const MARK_H = 0.38; // mark height as a share of the card height
export const markIn = (p: number): number => clamp01((gp(p) - MARK_IN[0]) / (MARK_IN[1] - MARK_IN[0]));
export const diveZ = (p: number): number => clamp01((gp(p) - DIVE[0]) / (DIVE[1] - DIVE[0]));
export const diveK = (z: number): number => Math.exp(Math.log(DIVE_K) * Math.pow(z, 1.7));
export const portalOpen = (z: number): number => smooth(clamp01(z / 0.12)); // the hub "pupil" opens
export const portalWiden = (z: number): number => 1 + 2 * smooth(clamp01((z - 0.08) / 0.5)); // then slides under the blades
// blades thin to light streaks as they pass the camera (by zoom, not by time)
export const markFade = (k: number): number => 1 - smooth(clamp01((Math.log(k) - Math.log(3)) / (Math.log(16) - Math.log(3))));
export const diveRotate = (z: number): number => -16 * smooth(z); // a slight turn along the spiral
export const hubDrift = (z: number): number => 1 - smooth(clamp01(z / 0.55)); // hub glides to the centre of view
export const faceFade = (p: number): number => 1 - smooth(clamp01((gp(p) - 0.405) / 0.035)); // card text clears first
export const cardFade = (p: number): number => 1 - smooth(clamp01((gp(p) - 0.47) / 0.08)); // then the red card dissolves
export const sideFade = (p: number): number => 1 - smooth(clamp01((gp(p) - 0.405) / 0.045)); // the other cards leave the stage
export const coreMarkIn = (p: number): number => smooth(clamp01((gp(p) - 0.58) / 0.1)); // the mark at the heart of the sphere

export const marqueeOpacity = (p: number): number => phase1(p) * (1 - smooth(clamp01((gp(p) - 0.4) / 0.07)));
export const marqueeBlur = (p: number): number => (1 - phase1(p)) * 20;
// the silver stage dims to graphite as the dive begins, so the mark flies over darkness
export const stageBackdropOpacity = (p: number): number => 1 - smooth(clamp01((gp(p) - 0.405) / 0.08));

export const auroraOpacity = (p: number): number => {
  const v = vScroll(p);
  const fadeIn = clamp01((v - 1200) / 350);
  const fadeOut = 1 - clamp01((v - 2900) / 350);
  return Math.min(fadeIn, fadeOut);
};

/* ---------- "What we staff": the service panels ---------- */
export const pfProgress = (p: number): number => clamp01((vScroll(p) - PS) / PF_DUR);
export const pfEnter = (p: number): number => smooth(clamp01(pfProgress(p) / 0.267));
export const pfSlide = (p: number): number => clamp01((pfProgress(p) - 0.267) / 0.453);
export const pfExit = (p: number): number => smooth(clamp01((pfProgress(p) - 0.72) / 0.28));
export const portfolioActive = (p: number): boolean => vScroll(p) > PS;
export const portfolioTransform = (p: number): string => {
  if (!portfolioActive(p)) return "translateY(100%)";
  const ty = (1 - pfEnter(p)) * 100;
  const sc = 1 - pfExit(p) * 0.62;
  const tx = -pfExit(p) * 130;
  return `translate(${tx}vw, ${ty}%) scale(${sc})`;
};
export const pfTrackTransform = (p: number, maxPan: number): string => `translateX(${-pfSlide(p) * maxPan}px)`;

/* ---------- the closing beat ---------- */
export const closeP = (p: number): number => clamp01((vScroll(p) - CLOSE_START) / (CLOSE_END - CLOSE_START));
export const closeActive = (p: number): boolean => vScroll(p) > CLOSE_START - 1;
// the scene opens through a circle whose edge is feathered over ~30% of the screen, so there is never a hard boundary
export const closeMask = (p: number): string => {
  const t = smooth(clamp01(closeP(p) / 0.55));
  if (t >= 0.999) return "none";
  const r = 8 + t * 125, f = 18 + t * 22; // radius and feather, % of the larger screen side
  return `radial-gradient(circle at 50% 52%, #000 ${(r - f).toFixed(2)}vmax, rgb(0 0 0 / 0.55) ${(r - f * 0.45).toFixed(2)}vmax, transparent ${r.toFixed(2)}vmax)`;
};
export const closeScale = (p: number): number => 1.08 - 0.08 * smooth(clamp01(closeP(p) / 0.7));
// the mark assembles over the middle of the beat; each piece of copy follows a step behind
export const markReveal = (p: number): number => clamp01((closeP(p) - 0.12) / 0.6);
export const finalBeat = (p: number, i: number): number => smooth(clamp01((closeP(p) - 0.3 - i * 0.08) / 0.34));

/* ---------- scroll letters ----------
   The prototype returned a fresh {transform, filter, opacity} object per letter per frame. Here the
   result is written into a reused object: y is translateY in %, blur is in vmin. The engine formats
   them with the prototype's templates (translateY(${y}%), blur(${blur}vmin)). */
export interface LetterOut { y: number; blur: number; opacity: number }
export const newLetterOut = (): LetterOut => ({ y: 0, blur: 0, opacity: 1 });

export function heroLetterStyle(p: number, index: number, total: number, out: LetterOut): LetterOut {
  const reversed = total - 1 - index;
  const delay = (reversed / total) * 0.4;
  const e = smooth(clamp01((phase1(p) - delay) / 0.6));
  out.y = e * 40; out.blur = e * 1.5; out.opacity = Math.max(0, 1 - e * 1.5);
  return out;
}
export function blockLetterStyle(p: number, index: number, total: number, out: LetterOut): LetterOut {
  const ap = clamp01((gp(p) - 0.6) / 0.135);
  const delay = (index / total) * 0.55;
  const inv = 1 - smooth(clamp01((ap - delay) / 0.45));
  out.y = inv * 70; out.blur = inv * 2.0; out.opacity = Math.max(0, 1 - inv * 1.3);
  return out;
}
export function templatesLetterStyle(p: number, index: number, out: LetterOut): LetterOut {
  const t = clamp01((phase1(p) - 0.45 - index * 0.005) / 0.45);
  out.y = (1 - smooth(t)) * 150; out.blur = (1 - t) * 1.5; out.opacity = t;
  return out;
}

/* ---------- which scenes need drawing (used by the WebGL stages, 5B-4 onward) ---------- */
export interface SceneVisibility { hero: boolean; aurora: boolean; sphere: boolean; target: boolean; portfolio: boolean }
export const sceneVisibility = (p: number): SceneVisibility => {
  const g = gp(p), v = vScroll(p);
  return {
    hero: g < 0.8,
    aurora: v > 1000 && v < PF_END + 350,
    sphere: g > 0.395 && v < PF_END,
    target: v > CLOSE_START - 200,
    portfolio: v > PS - 600 && v < PF_END + 350,
  };
};
