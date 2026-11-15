/* =====================================================================
   SHOWREEL ENGINE (Stage 5B-2): applies the timeline (timeline.ts) to the server-rendered stage.

   DOM OWNERSHIP
   - React (Showreel.tsx) owns the structure: it renders every element once, on the server, with no
     inline styles and no state. It never re-renders this subtree.
   - This engine owns, and only touches, (a) inline style properties and (b) a few SVG attributes
     (viewBox, transform) on elements it looked up by data-sr inside ONE root. It never creates or
     removes nodes, never uses global ids or selectors, and never touches anything outside the root.
     Everything it writes is remembered, so release() puts the CSS-only frame 0 back exactly.
   - WebGL (5B-4 onward) will own the five <canvas> elements; none is touched here.

   LIFECYCLE (state is mirrored on the root as data-sr-state, for DevTools and tests)
     createShowreelEngine(root)   look up elements, start the (single) IntersectionObserver
       idle    --activate-->  active   measure, subscribe to the shared post-frame tick, attach the
                                       listeners it needs, render the first frame from the real scroll
       active  --deactivate-> idle     park the stage (one clamped frame, fixed layers hidden), then
                                       unsubscribe and detach EVERYTHING: an idle engine holds an
                                       observer and a media-query listener, nothing else
       any     --destroy--->  destroyed  idempotent; also releases the inline styles
       OS prefers-reduced-motion: reduce  =>  state "off": the choreography never starts (the static
                                       stacked presentation belongs to 5B-7). Follows later changes.
   While active it also owns the snap (snap.ts: sideways steps, Down/Up beats, hold-to-scroll, touch swipes), created in
   attach() and destroyed in detach(), so it exists exactly as long as the subscription. The keyboard focus jump
   (snap.ts attachFocusJump) lives for the engine's whole non-reduced lifetime, because focus can arrive before the
   stage is near enough to activate. Under OS reduced motion neither exists.
   Also while active: the GL manager (gl/manager.ts), created in attach() and destroyed in detach() with everything
   else, so the WebGL scenes (the opening and closing gradients so far) exist only for an active, non-reduced stage.
   It is ticked from onFrame, on the shared tick, with the scroll progress the DOM frame just used.
   The engine owns no requestAnimationFrame loop: it is called by the shared Lenis ticker through
   onScrollFrame (lib/scroll/lenis.ts), after lenis.raf for that frame. React Activity can hide the
   page without unmounting it: the component's effect cleanup calls destroy(), and showing it again
   creates a fresh engine, so nothing runs for a hidden route and nothing is duplicated.
   ===================================================================== */
import { onScrollFrame, type ScrollFrame } from "@/lib/scroll/lenis";
import { isPaused, onPauseChange } from "@/lib/motion/motion";
import { MARK_BOX, MARK_HOLE, MARK_HUB } from "@/lib/mark/geometry";
import * as T from "./timeline";
import { attachFocusJump, createSnap, type Snap } from "./snap";
import { createGlManager, type GlManager } from "./gl/manager";

export type EngineState = "idle" | "active" | "off" | "destroyed";
export interface ShowreelEngine {
  readonly state: EngineState;
  /** Idempotent. Detaches everything, releases the inline styles it wrote. */
  destroy(): void;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const NEAR_MARGIN = 200; // px around the track within which the engine runs (the prototype's "near")

/** A node the engine writes to: remembers every value so identical writes are skipped and release() can undo them. */
class Styled {
  private last: Record<string, string> = Object.create(null);
  private attrs: Record<string, string> = Object.create(null);
  private base: Record<string, string | null> = Object.create(null);
  constructor(readonly el: HTMLElement | SVGElement) {}
  css(prop: string, value: string | number): void {
    const v = typeof value === "number" ? String(value) : value;
    if (this.last[prop] === v) return;
    this.last[prop] = v;
    this.el.style.setProperty(prop, v);
  }
  attr(name: string, value: string): void {
    if (this.attrs[name] === value) return;
    if (!(name in this.base)) this.base[name] = this.el.getAttribute(name);
    this.attrs[name] = value;
    this.el.setAttribute(name, value);
  }
  release(): void {
    for (const p in this.last) this.el.style.removeProperty(p);
    for (const a in this.attrs) {
      const b = this.base[a];
      if (b == null) this.el.removeAttribute(a);
      else this.el.setAttribute(a, b);
    }
    if (this.el.getAttribute("style") === "") this.el.removeAttribute("style");
    this.last = Object.create(null);
    this.attrs = Object.create(null);
  }
}

export function createShowreelEngine(root: HTMLElement): ShowreelEngine | null {
  /* ---------- element lookup, once, scoped to this root ---------- */
  const missing: string[] = [];
  const one = (name: string): HTMLElement | null => root.querySelector<HTMLElement>(`[data-sr="${name}"]`);
  const req = (name: string): Styled => {
    const e = one(name);
    if (!e) missing.push(name);
    return new Styled(e ?? document.createElement("div")); // placeholder so the code below stays simple; never used when missing.length
  };
  const opt = (name: string): Styled | null => {
    const e = one(name);
    return e ? new Styled(e) : null;
  };
  const many = (name: string): Styled[] => Array.from(root.querySelectorAll<HTMLElement>(`[data-sr="${name}"]`), (e) => new Styled(e));
  const lettersOf = (container: Element | null): Styled[][] =>
    container
      ? Array.from(container.querySelectorAll<HTMLElement>(":scope > [aria-hidden='true']"), (line) =>
          Array.from(line.querySelectorAll<HTMLElement>("[data-sl]"), (l) => new Styled(l)),
        )
      : [];

  const track = req("track");
  const N = {
    backdrop: req("backdrop"), marquee: req("marquee"), carousel: req("carousel"),
    card1: req("card1"), card2: req("card2"), card3: req("card3"), card4: req("card4"),
    heroHead: req("hero-head"), heroBottom: req("hero-bottom"), slider: req("slider"), slideA: req("slide-a"), slideB: req("slide-b"),
    cta: req("cta"), face: req("face"), faceIn: req("face-in"), panel: req("blackpanel"),
    sphereScene: req("sphere-scene"), sphereWrap: req("sphere-wrap"), core: req("core"), sphereBody: req("sphere-body"),
    zoom: req("zoom"), zoomRot: req("zoom-rot"), zoomFig: req("zoom-fig"), target: req("target"),
    // optional: the engine runs without them
    aurora: opt("aurora"), portfolio: opt("portfolio"), pfTrack: opt("pf-track"), targetMark: opt("target-mark"),
  };
  const zoomRays = many("zoom-ray");
  const ctaParts = many("cta-part");
  const ctaDim = ctaParts.map((n) => n.el.hasAttribute("data-dim"));
  const heroLines = lettersOf(one("hero-h"));
  const rotLetters = one("hero-rot") ? Array.from(one("hero-rot")!.querySelectorAll<HTMLElement>("[data-sl]"), (l) => new Styled(l)) : [];
  const blockLines = [...lettersOf(one("h-top")), ...lettersOf(one("h-bottom"))];
  const blockTotal = blockLines.reduce((n, l) => n + l.length, 0);
  if (zoomRays.length === 0) missing.push("zoom-ray");
  if (missing.length) {
    const msg = `[showreel] required element(s) missing under the root: ${missing.join(", ")}. The engine will not start.`;
    if (process.env.NODE_ENV !== "production") throw new Error(msg);
    console.error(msg);
    return null;
  }
  const trackEl = track.el as HTMLElement;
  const nodes: Styled[] = [
    ...Object.values(N).filter((n): n is Styled => n !== null), ...zoomRays, ...ctaParts,
    ...heroLines.flat(), ...rotLetters, ...blockLines.flat(),
  ];

  /* ---------- state ---------- */
  let state: EngineState = "idle";
  const setState = (s: EngineState) => {
    state = s;
    if (s === "destroyed") delete root.dataset.srState;
    else root.dataset.srState = s;
  };
  const undo: Array<() => void> = []; // everything attach() set up, undone by detach()
  let snap: Snap | null = null;
  let gl: GlManager | null = null;
  let focusOff: (() => void) | null = null;
  const reducedMQ = window.matchMedia(REDUCED);
  const mqMobile = window.matchMedia(T.BUCKET_QUERY.mobile);
  const mqTablet = window.matchMedia(T.BUCKET_QUERY.tablet);

  /* ---------- geometry (measured on activation, resize and layout changes; never per frame) ---------- */
  let geo: T.Geo = T.GEO.desktop;
  let trackTop = 0, trackH = 0, pfOverflow = 0;
  const dive = { W: 1, H: 1, S: 1, dx0: 0, dy0: 0 };
  const measure = () => {
    geo = mqMobile.matches ? T.GEO.mobile : mqTablet.matches ? T.GEO.tablet : T.GEO.desktop;
    trackTop = trackEl.getBoundingClientRect().top + window.scrollY;
    trackH = trackEl.offsetHeight; // 0 while the page is hidden by React Activity
    if (N.pfTrack && N.portfolio) pfOverflow = N.pfTrack.el.scrollWidth - N.portfolio.el.clientWidth;
    // the mark sits on card 03 with its box centred and a little above the middle; during the dive its hub glides to the centre
    dive.W = N.zoom.el.clientWidth || window.innerWidth;
    dive.H = N.zoom.el.clientHeight || window.innerHeight;
    dive.S = (T.MARK_H * geo.ch) / MARK_BOX.h;
    dive.dx0 = (MARK_HUB[0] - MARK_BOX.cx) * dive.S;
    dive.dy0 = -0.06 * geo.ch + (MARK_HUB[1] - MARK_BOX.cy) * dive.S;
  };
  const nearNow = (): boolean => {
    const y = window.scrollY, vh = window.innerHeight;
    return trackH > 0 && y + vh > trackTop - NEAR_MARGIN && y < trackTop + trackH + NEAR_MARGIN;
  };

  /* ---------- frame ---------- */
  let lastP = -1;
  const tilt = { tx: 0, ty: 0, rx: 0, ry: 0, wa: NaN, wb: NaN }; // cursor tilt of the opening card's video slot
  const letter = T.newLetterOut();
  const invalidate = () => { lastP = -1; tilt.wa = NaN; };

  const applyLetter = (n: Styled, l: T.LetterOut) => {
    n.css("transform", `translateY(${l.y}%)`);
    n.css("filter", `blur(${l.blur}vmin)`);
    n.css("opacity", l.opacity);
  };
  const vis = (n: Styled, opacity: number) => n.css("visibility", opacity <= 0.001 ? "hidden" : "visible"); // Chrome hit-tests 3D layers at opacity 0

  /** Everything that depends on scroll progress. Called only when p changed. */
  const applyScroll = (p: number, vmin: number) => {
    N.backdrop.css("opacity", T.stageBackdropOpacity(p));
    N.marquee.css("opacity", T.marqueeOpacity(p));
    N.marquee.css("filter", `blur(${T.marqueeBlur(p)}px)`);
    N.carousel.css("transform", T.carouselTransform(p));

    // card 1 (the opening card)
    const sf = T.sideFade(p), co = T.card1Opacity(p) * sf;
    N.card1.css("width", T.card1Width(p)); N.card1.css("height", T.card1Height(p)); N.card1.css("transform", T.card1Transform(p));
    N.card1.css("z-index", T.cardZIndex(p, 0)); N.card1.css("opacity", co);
    const hc = T.heroContentFade(p);
    N.heroHead.css("opacity", hc); N.heroBottom.css("opacity", hc);
    N.slider.css("width", T.heroSliderWidth(p)); N.slider.css("height", T.heroSliderHeight(p));
    const pan = `translateX(${T.heroSlidePan(p)}%)`;
    N.slideA.css("transform", pan); N.slideB.css("transform", pan);
    for (const line of heroLines) for (let i = 0; i < line.length; i++) applyLetter(line[i], T.heroLetterStyle(p, i, line.length, letter));
    for (let i = 0; i < rotLetters.length; i++) applyLetter(rotLetters[i], T.templatesLetterStyle(p, i, letter));

    // side cards
    N.card2.css("transform", T.sideCardTransform(p, 90)); N.card2.css("z-index", T.cardZIndex(p, 1)); N.card2.css("opacity", co);
    N.card3.css("transform", T.sideCardTransform(p, 180)); N.card3.css("z-index", T.cardZIndex(p, 2)); N.card3.css("opacity", co);
    const c4 = T.card4Opacity(p);
    N.card4.css("transform", T.sideCardTransform(p, 270)); N.card4.css("z-index", T.cardZIndex(p, 3)); N.card4.css("opacity", c4);
    vis(N.card1, co); vis(N.card2, co); vis(N.card3, co); vis(N.card4, c4);

    // carousel button
    const cr = T.carouselCtaReveal(p);
    N.cta.css("opacity", cr); N.cta.css("transform", `translateY(${(1 - cr) * 2.5}vh)`); N.cta.css("visibility", cr > 0.01 ? "visible" : "hidden");

    // card 03: build the mark, dim the stage, open the hub and dive through it
    const mi = T.markIn(p), z = T.diveZ(p), k = T.diveK(z), drift = T.hubDrift(z);
    const hx = dive.dx0 * drift, hy = dive.dy0 * drift; // hub position, vmin from the card centre
    const ppu = dive.S * k * vmin; // px per mark unit at this zoom
    const fade = T.markFade(k);
    const zoomOn = mi > 0 && fade > 0.002;
    N.zoom.css("visibility", zoomOn ? "visible" : "hidden");
    if (zoomOn) {
      N.zoom.attr("viewBox", `${MARK_HUB[0] - (dive.W / 2 + hx * vmin) / ppu} ${MARK_HUB[1] - (dive.H / 2 + hy * vmin) / ppu} ${dive.W / ppu} ${dive.H / ppu}`);
      N.zoomRot.attr("transform", `rotate(${T.diveRotate(z)} ${MARK_HUB[0]} ${MARK_HUB[1]})`);
      const lastRay = zoomRays.length - 1;
      for (let i = 0; i < zoomRays.length; i++) {
        const t = T.smooth(T.clamp01((mi - (lastRay - i) * 0.065) / 0.42)); // smallest blade first, round the spiral
        const s = 0.3 + 0.7 * t;
        zoomRays[i].attr("transform", `matrix(${s} 0 0 ${s} ${MARK_HUB[0] * (1 - s)} ${MARK_HUB[1] * (1 - s)})`);
        zoomRays[i].css("opacity", t);
      }
      const fi = T.smooth(T.clamp01((mi - 0.52) / 0.48)); // then the figure settles in from above
      N.zoomFig.attr("transform", `translate(0 ${(1 - fi) * -16})`);
      N.zoomFig.css("opacity", fi);
      N.zoom.css("opacity", fade);
      N.zoom.css("transform", T.blackScreenTransform(p, vmin, geo));
    }
    N.faceIn.css("opacity", T.faceFade(p));
    N.face.css("opacity", T.cardFade(p));

    // the portal: the dark network scene, seen through the hub and widening until it fills the view
    const R = MARK_HOLE * dive.S * k * T.portalOpen(z) * T.portalWiden(z);
    N.panel.css("clip-path", z >= 1 ? "none" : `circle(${R.toFixed(3)}vmin at calc(50% + ${hx.toFixed(3)}vmin) calc(50% + ${hy.toFixed(3)}vmin))`);
    N.panel.css("transform", T.blackScreenTransform(p, vmin, geo));
    N.sphereScene.css("transform", `translate(-50%,-50%) scale(${T.sphereSceneScale(p, vmin, geo)})`);
    // portrait screens stack the copy under the sphere, so the sphere and its mark rise as the copy arrives
    const rise = geo === T.GEO.desktop ? 0 : 15 * T.smooth(T.clamp01((T.gp(p) - 0.6) / 0.12));
    N.sphereWrap.css("transform", `translate(-50%, calc(-50% - ${rise.toFixed(3)}vh)) scale(${T.sphereScale(p)})`);
    const cm = T.coreMarkIn(p);
    N.core.css("opacity", cm);
    N.core.css("transform", `translate(-50%, calc(-50% - ${rise.toFixed(3)}vh)) scale(${0.72 + 0.28 * cm - 0.16 * T.sphereCollapse(p)})`);
    let idx = 0;
    for (const line of blockLines) for (let i = 0; i < line.length; i++) applyLetter(line[i], T.blockLetterStyle(p, idx++, blockTotal, letter));
    const br = T.sphereBodyReveal(p);
    N.sphereBody.css("opacity", br);
    N.sphereBody.css("transform", `translateY(${(1 - br) * 2.5}vmin)`);

    // aurora (fixed layer; a CSS glow until its renderer exists) and the service panels (fixed layer)
    N.aurora?.css("opacity", T.auroraOpacity(p));
    if (N.portfolio && N.pfTrack) {
      N.portfolio.css("transform", T.portfolioTransform(p));
      N.pfTrack.css("transform", T.pfTrackTransform(p, Math.max(0, pfOverflow + 3 * vmin)));
    }

    // closing scene: opens through a feathered circle, settles from a slight zoom
    const ca = T.closeActive(p);
    N.target.css("visibility", ca ? "visible" : "hidden");
    if (ca) {
      const m = T.closeMask(p);
      N.target.css("mask-image", m); N.target.css("-webkit-mask-image", m);
      N.target.css("transform", `translate(-50%, -50%) scale(${T.closeScale(p).toFixed(4)})`);
    }
    if (N.targetMark) {
      const e = T.smooth(T.markReveal(p)); // CSS stand-in for the 3D mark until its renderer exists
      N.targetMark.css("opacity", e); N.targetMark.css("transform", `scale(${0.88 + 0.12 * e})`); N.targetMark.css("visibility", e > 0.001 ? "visible" : "hidden");
    }
    for (let i = 0; i < ctaParts.length; i++) {
      const r = T.finalBeat(p, i);
      ctaParts[i].css("opacity", r * (ctaDim[i] ? 0.4 : 1));
      ctaParts[i].css("transform", `translateY(${((1 - r) * 2.6).toFixed(3)}vh)`);
      ctaParts[i].css("filter", r < 0.999 ? `blur(${((1 - r) * 8).toFixed(2)}px)` : "none");
      ctaParts[i].css("visibility", r > 0.005 ? "visible" : "hidden");
    }
  };

  /** One frame at scroll position y. `park` renders the clamped end state even when the stage is out of range. */
  const renderAt = (y: number, park: boolean): number => {
    if (trackH <= 0) return -1; // the page is hidden (display: none) or collapsed
    const vh = window.innerHeight;
    const near = y + vh > trackTop - NEAR_MARGIN && y < trackTop + trackH + NEAR_MARGIN;
    const pinned = !park && y >= trackTop - 2 && y <= trackTop + trackH - vh + 2;
    N.aurora?.css("visibility", pinned ? "visible" : "hidden");
    N.portfolio?.css("visibility", pinned ? "visible" : "hidden");
    if (!near && !park) return -1;

    const p = T.clamp01((y - trackTop) / Math.max(1, trackH - vh));
    const vmin = Math.min(window.innerWidth, vh) / 100;

    tilt.rx += (tilt.tx - tilt.rx) * 0.1;
    tilt.ry += (tilt.ty - tilt.ry) * 0.1;
    const f = T.heroTiltFade(p), a = tilt.rx * f, b = tilt.ry * f;
    if (!(Math.abs(a - tilt.wa) < 1e-3 && Math.abs(b - tilt.wb) < 1e-3)) {
      tilt.wa = a; tilt.wb = b;
      N.slider.css("transform", `translate(-50%,-50%) rotateX(${a}deg) rotateY(${b}deg)`);
    }
    if (p !== lastP) {
      lastP = p;
      applyScroll(p, vmin);
    }
    return p;
  };

  const onFrame = (f: ScrollFrame) => {
    if (state !== "active") return;
    const p = renderAt(f.scroll, false);
    if (p >= 0) gl?.frame(f.time, p); // WebGL scenes: same tick, same progress
  };

  /* ---------- listeners that exist only while active ---------- */
  let resizeTimer = 0;
  const relayout = () => { measure(); snap?.refresh(); gl?.resize(); invalidate(); renderAt(window.scrollY, false); };
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(relayout, 120); };
  const onOrientation = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(relayout, 200); };
  const onPointer = (e: PointerEvent) => {
    if (isPaused()) return;
    tilt.tx = -((e.clientY / window.innerHeight) * 2 - 1) * 9;
    tilt.ty = ((e.clientX / window.innerWidth) * 2 - 1) * 12;
  };
  const onVisibility = () => { if (!document.hidden) { invalidate(); gl?.invalidate(); renderAt(window.scrollY, false); } };

  const attach = () => {
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    undo.push(
      () => window.removeEventListener("resize", onResize),
      () => window.removeEventListener("orientationchange", onOrientation),
      () => window.removeEventListener("pointermove", onPointer),
      () => document.removeEventListener("visibilitychange", onVisibility),
      () => clearTimeout(resizeTimer),
    );
    // content above or below the stage can change its position (fonts, accordions): re-measure, not every frame
    const host = root.parentElement;
    if (host) {
      const ro = new ResizeObserver(() => { measure(); snap?.refresh(); invalidate(); });
      ro.observe(host);
      undo.push(() => ro.disconnect());
    }
    undo.push(onPauseChange(() => { tilt.tx = 0; tilt.ty = 0; }));
    undo.push(onScrollFrame(onFrame)); // the shared tick; no rAF loop of our own
    snap = createSnap({ geometry: () => ({ trackTop, trackH }), pfTrack: N.pfTrack ? (N.pfTrack.el as HTMLElement) : null, portfolio: N.portfolio ? (N.portfolio.el as HTMLElement) : null });
    const sn = snap;
    undo.push(() => { sn.destroy(); if (snap === sn) snap = null; });
    const g = (gl = createGlManager(root));
    undo.push(() => { g.destroy(); if (gl === g) gl = null; });
  };
  const detach = () => { for (const fn of undo.splice(0).reverse()) fn(); };

  /* ---------- activation ---------- */
  const activate = () => {
    if (state !== "idle") return;
    measure();
    if (trackH <= 0) return; // hidden: nothing to do
    invalidate();
    attach();
    setState("active");
    renderAt(window.scrollY, false); // the first frame comes from the real scroll position (restoration, deep links)
  };
  const deactivate = () => {
    if (state !== "active") return;
    detach();
    setState("idle");
    renderAt(window.scrollY, true); // park: the clamped end state, fixed layers hidden
    tilt.tx = tilt.ty = tilt.rx = tilt.ry = 0;
  };
  const startFocusJump = () => {
    if (focusOff) return;
    // measure first when idle: the stage may be far from where it was last measured
    focusOff = attachFocusJump(root, () => { if (state !== "active") measure(); return trackTop; });
  };
  const stopFocusJump = () => { focusOff?.(); focusOff = null; };
  const release = () => {
    for (const n of nodes) n.release();
    invalidate();
  };

  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (!e || state === "off" || state === "destroyed") return;
      if (e.isIntersecting) activate(); else deactivate();
    },
    { rootMargin: `${NEAR_MARGIN}px 0px` },
  );
  io.observe(trackEl);

  // OS reduced motion has priority over everything: no choreography at all (the static presentation is 5B-7)
  const onReducedChange = () => {
    if (state === "destroyed") return;
    if (reducedMQ.matches) {
      detach();
      stopFocusJump();
      release();
      setState("off");
    } else if (state === "off") {
      setState("idle");
      startFocusJump();
      measure();
      if (nearNow()) activate();
    }
  };
  reducedMQ.addEventListener("change", onReducedChange);

  if (reducedMQ.matches) setState("off");
  else {
    setState("idle");
    startFocusJump();
    measure();
    if (nearNow()) activate();
  }

  return {
    get state() { return state; },
    destroy() {
      if (state === "destroyed") return;
      detach();
      stopFocusJump();
      io.disconnect();
      reducedMQ.removeEventListener("change", onReducedChange);
      release();
      setState("destroyed");
    },
  };
}
