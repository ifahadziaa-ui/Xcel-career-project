# Recreate this site as a single HTML file: Superconscious

You are an expert creative front-end developer. Produce a **single self-contained `index.html`**
that reproduces the project below **exactly** — same layout, sections, visuals, motion, and
interaction. Pure HTML/CSS/JS in one file: no build step, no framework, no bundler. Use ES modules
with a CDN importmap for Three.js (r0.185 from unpkg) and the GLTFLoader addon. Hardcode every value
given here as a fixed constant. Rebuild each component described below as a section of the one file.

## What it is

A dark, full-bleed, **scroll-driven WebGL showreel** for a fictional neural-engine brand,
*Superconscious* — "Prompts that think ahead." The entire page is one continuous experience driven
by a **single normalized scroll progress `p` (0→1)** over a very tall scroll track (2000vh on
desktop; shorter in portrait — see Responsive geometry) with a sticky, pinned stage. An immersive intro loader (a spinning chrome star over a violet bloom) lifts to
reveal the stage, then on scroll the experience plays out in phases:

1. **Hero card** — a full-screen card with an animated mesh-gradient (violet/indigo) shader
   background, a cursor-tilting image card, and a big headline that descends + blurs out.
2. The hero card **shrinks and flips 90°** into a **4-card 3D carousel** (cosine z-sorted), with a
   running services **marquee** visible behind it and a CTA pinned underneath. Cards 2 & 3 are
   "Catalist" product-UI mockups; card 4 is a violet "Neural Core" card.
3. The carousel rotates to card 4, which **opens via a star-shaped mask** into a black panel holding
   a **34k-particle sphere** (pink→purple, additive bloom) with a white star logo and big headings
   that rise into focus ("Beyond / all / limits"). The page background fades from white to black,
   revealing a pinned **"northern lights" aurora** corner shader.
4. A fixed **portfolio** section flies up from below, scrolls three autoplaying video cards
   horizontally, then exits left with a scale-down. The aurora carries through behind it.
5. A **camera-rig flight**: the viewport flies through a parallax field of 14 floating image tiles…
6. …and lands on a **target block** — a chrome star (loaded GLB, polished mirror metal) turning over
   its own violet mesh-gradient background, with a final CTA ("Build beyond / all limits") and a
   white inner frame snapping in as the scene settles.

Palette: near-black backgrounds, off-white ink (`#f5f1ec`), and a violet/indigo/electric-purple
family throughout. Type: **Zen Kaku Gothic New** (geometric sans, weights 400/500/700) for
everything. Motion is spring-like/eased; **every animated value is a pure function of `p`**.

## Page shell & libraries

- **Fonts** — load from Google Fonts: `Zen Kaku Gothic New` (400, 500, 700). Set as the global
  `font-family`. (A `Marck Script` accent face is declared in the original but the showreel does not
  visibly use it — you may omit it.)
- **Three.js** — importmap, e.g.:
  ```html
  <script type="importmap">
  { "imports": {
    "three": "https://unpkg.com/three@0.185.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.185.0/examples/jsm/"
  }}
  </script>
  ```
  Use `GLTFLoader` from `three/addons/loaders/GLTFLoader.js` for the target star.
- **Smooth scroll** — the original uses Lenis. You may include Lenis from a CDN for buttery scroll,
  or rely on native scroll; either way the math reads `window.scrollY`. **Hide the scrollbar**
  (`scrollbar-width:none`, `::-webkit-scrollbar{display:none}`) on `html, body`.
- **Global CSS** — `* { margin:0; box-sizing:border-box }`, `body { background:#000; color:#f5f1ec;
  overflow-x:hidden; font-family:"Zen Kaku Gothic New",sans-serif }`. Define the design tokens below
  as CSS variables on `:root`.
- **Adaptive root font-size** (rem scaling — most layout is vmin/vw/vh, so this only affects rem UI):
  `html { font-size:16px }`; `@media (max-width:1920px){html{font-size:0.833333vw}}`;
  `@media (max-width:1440px){html{font-size:1.111111vw}}`;
  `@media (max-width:1024px){html{font-size:1.5625vw}}`;
  `@media (max-width:640px){html{font-size:4.444444vw}}`.

### Design tokens (`:root` CSS variables — hardcode these)

```css
--background:#000000; --foreground:#f5f1ec;
--ink:#07031a;        /* target-block deep navy-black */
--pf-card:#14110e;    /* portfolio card surface */
--cc-search:#161310;  /* catalist light-card search bar */
--paper:#f5f1ec;      /* off-white card/UI text */
--paper-alt:#f3f1ec;  /* portfolio section ink */
--nav-ink:#1a1a1a;    /* nav-pill links */
--cc-dark-ink:#f5f1ec; --cc-light-ink:#1a1714; --cc-light-muted:#9a948d;
--nav-surface:#e3e3e3; --nav-item:#ffffff; --nav-logo:#dadada;
--nav-cta:#0d0d0d; --nav-cta-ink:#f4f4f4;
--nav-border:rgba(255,255,255,0.6); --nav-shadow:rgba(0,0,0,0.12);
--glass-dark:rgba(40,36,33,0.55); --glass-border:rgba(255,255,255,0.12);
--glass-border-soft:rgba(255,255,255,0.14); --hairline:rgba(255,255,255,0.28);
--watermark:rgba(255,255,255,0.85);
--card-violet:radial-gradient(95% 80% at 50% 28%, #ddd6fe 0%, #9a73f0 38%, #6d28d9 68%, #34146e 100%);
--loader-glow:rgba(154,115,240,0.55);
/* Radii */
--radius-btn:8px; --radius-card:3vmin; --radius-pf:2.5vmin;
--radius-slider:1.6vmin; --radius-grid:12px; --radius-target:30px;
/* Responsive showreel geometry — DESKTOP defaults (also the SSR/no-JS fallback).
   JS swaps these live on <html> for portrait phones/tablets — see "Responsive
   geometry" below. The timeline builders + card/sphere sizes read these vars so
   the values can swap without rebuilding any interpolation. */
--sr-card-w:42vmin;        /* side-card width  (= hero card HEIGHT) */
--sr-card-h:62vmin;        /* side-card height (= hero card WIDTH)  */
--sr-carousel-r:27vmin;    /* carousel radius (card translateZ) */
--sr-flyback:40vmin;       /* carousel fly-back depth */
--sr-hero-pad:8vmin;       /* hero full-screen inset (2× stage padding) */
--sr-heading-1:18vmin;     /* sphere top heading */
--sr-heading-2:24vmin;     /* sphere bottom heading */
--sr-sphere-body-w:52vmin; /* sphere supporting-copy max-width */
--sr-sphere-body-text:2.4vmin; /* sphere supporting-copy text size */
```

## The scroll model (the spine of the whole piece)

Build ONE tall scroll track and a sticky stage inside it:

```
<div class="track" style="position:relative; height:var(--sr-track-vh)">  /* 2000vh desktop; see Responsive geometry */
  <div class="sticky" style="position:sticky; top:0; height:100vh; overflow:hidden; padding:4vmin">
     … the pinned 3D stage …
  </div>
</div>
```

Compute `p` every scroll frame (and on resize) as the track's scroll progress:
`p = clamp01( scrollY / (trackHeight - innerHeight) )` where `trackHeight` is the track's pixel
height (2000vh on desktop) and `innerHeight = 100vh`. **The track height changes per layout** (see
Responsive geometry) — but `p` is always normalized 0→1 over whatever the track height is, so the
choreography is identical; a shorter track just means less swiping traverses the same timeline. Drive
**every** animated style from `p` on each `requestAnimationFrame` (or in the Lenis `scroll`
callback). Don't throttle — update at the display refresh so it tracks 1:1.

### Responsive geometry (mobile / tablet / desktop)

The whole showreel is sized in `vmin` (= `min(vw, vh)`). On landscape desktop `vmin` tracks height and
the cards/headings fill the screen; in **portrait** `vmin` collapses to the narrow width, so the cards
and sphere headings end up tiny / overflowing. Fix this by retuning a handful of constants per layout —
written as the `--sr-*` CSS vars on `<html>`. Everything else (camera flight, parallax grid, target
block) is viewport-relative and self-scales, so leave it. `PERSP` stays **1500** across all layouts
(it's baked into the JS counter-scales, the grid depth, and the `[perspective:1500px]` CSS).

Pick the bucket on load + on resize/orientationchange (debounced), keying on **orientation + width**:
- `w > h` (landscape, any size) → **desktop**
- portrait, `w < 640` → **mobile**
- portrait, `w ≤ 1024` → **tablet**
- otherwise → **desktop**

Then set these vars on `<html>` (desktop = the `:root` defaults above; track height is the only
non-`vmin` one — apply it to the `.track` height):

| var / value | desktop | tablet | mobile |
|---|---|---|---|
| track height (vh) | 2000 | 1700 | 1300 |
| `--sr-card-w` | 42vmin | 54vmin | 64vmin |
| `--sr-card-h` | 62vmin | 80vmin | 94vmin |
| `--sr-carousel-r` | 27vmin | 35vmin | 41vmin |
| `--sr-flyback` | 40vmin | 52vmin | 60vmin |
| `--sr-hero-pad` | 8vmin | 8vmin | 8vmin |
| `--sr-heading-1` | 18vmin | 13vmin | 10vmin |
| `--sr-heading-2` | 24vmin | 16vmin | 12vmin |
| `--sr-sphere-body-w` | 52vmin | 64vmin | 82vmin |
| `--sr-sphere-body-text` | 2.4vmin | 3.0vmin | 4.2vmin |

The two JS-math counter-scales (`flyBackZpx` → `blackScreenTransform` / `sphereSceneScale`) can't read
CSS `calc`, so feed them the numeric `flybackVmin` (40/52/60) and `carouselRVmin` (27/35/41) for the
active bucket — these MUST equal the `--sr-flyback` / `--sr-carousel-r` the cards use, so derive both
from one table. (Desktop numbers reproduce the original exactly.)

### Virtual-scroll timeline (port these formulas verbatim)

The original compresses scroll into a "virtual" axis. Reproduce exactly:

```js
const TRACK_VH = 2000, STICKY_VH = 100;
const TRAVEL_VH = TRACK_VH - STICKY_VH;     // 1900
const SCROLL_COMPRESS = 0.4;
const VSCROLL_MAX = TRAVEL_VH / SCROLL_COMPRESS; // 4750
const OLD_MAX = 2000;
const PS = OLD_MAX - 400;        // portfolioStart = 1600
const PF_DUR = 1500;
const PF_END = PS + PF_DUR;      // 3100
const GRID_START = PS + 0.72*PF_DUR; // 2680
const P6_END = GRID_START + 1000;    // 3680
const P7_START = P6_END;             // 3680
const P7_END = P7_START + 900;       // 4580
const PERSP = 1500;              // scene perspective (px)

const clamp01 = x => x<0?0 : x>1?1 : x;
const smooth  = t => t*t*(3-2*t);                 // smoothstep
const vScroll = p => clamp01(p) * VSCROLL_MAX;    // virtual scroll, in "vh"
const gp      = p => clamp01(vScroll(p) / OLD_MAX); // 0..1 over phases 1–5

// phase progresses (gp-relative)
const phase1 = p => clamp01(gp(p) / (2/15));      // 0–13.33%
const phase2 = p => clamp01((gp(p) - 0.1) / 0.05);// 10–15%
const phase3 = p => clamp01((gp(p) - 0.15)/ 0.25);// 15–40%
const phase4 = p => clamp01((gp(p) - 0.4) / 0.35);// 40–75%
```

**The stage perspective:** the 3D scene wrapper has `perspective:1500px` and a `[transform-style:
preserve-3d]` camera-rig div inside it; the carousel is a preserve-3d child of the rig. (See section
order below.)

## Layout & sections (in order)

The sticky stage stacks these layers (low→high z). All the per-`p` style functions are listed under
**Timeline functions** further down — wire each element's inline style to the named function.

### 0. Fixed aurora overlay (z-30) — "northern lights" corner shader

A `position:fixed; inset:0; pointer-events:none; z-index:30` div holding a **full-viewport WebGL
canvas** running the **FlameBackground** shader (below). Its opacity = `auroraOpacity(p)`. It's an
alpha overlay (clear centre, glowing violet corners) shared by the sphere scene and the portfolio.

### 1. The sticky stage interior (inside `.sticky`, padding 4vmin)

Layers, bottom to top:

- **White backdrop** (z-0): `absolute inset-0 bg-white`, opacity = `stageBackdropOpacity(p)`. Phases
  1–4 sit on white; it fades to reveal the black page + aurora as the sphere opens.
- **Services marquee** (z-1): `absolute left-0 top-1/2 w-screen -translate-y-1/2 pointer-events-none`,
  opacity = `marqueeOpacity(p)`, `filter: blur(${marqueeBlur(p)}px)`. Contains the **Marquee**
  (below) — visible behind the carousel through its gaps.
- **3D scene** (z-2): `relative flex size-full items-center justify-center` with
  `perspective:1500px`. Inside it:
  - **Camera-rig** div: `absolute inset-0; transform-style:preserve-3d`, `transform =
    cameraRigTransform(p)`.
    - **Carousel** div: `relative flex size-full items-center justify-center; transform-style:
      preserve-3d`, `transform = carouselTransform(p)`. Holds the 4 cards:
      - **Card 1 — Hero** (`absolute overflow-hidden`): width=`card1Width(p)`, height=
        `card1Height(p)`, `transform = card1Transform(p)`, zIndex=`cardZIndex(p,0)`, opacity=
        `card1Opacity(p)`. Contents = **HeroCard** (below).
      - **Card 2 — Catalist dark** (`absolute h-[var(--sr-card-h)] w-[var(--sr-card-w)]`): `transform =
        sideCardTransform(p,90)`, zIndex=`cardZIndex(p,1)`, opacity=`card1Opacity(p)`. =
        **CatalistCard(dark)**.
      - **Card 3 — Catalist light** (`absolute h-[var(--sr-card-h)] w-[var(--sr-card-w)]`): `transform =
        sideCardTransform(p,180)`, zIndex=`cardZIndex(p,2)`, opacity=`card1Opacity(p)`. =
        **CatalistCard(light)**.
      - **Card 4 — Sphere** (`absolute flex h-[var(--sr-card-h)] w-[var(--sr-card-w)] items-center justify-center;
        overflow:visible`): `transform = sideCardTransform(p,270)`, zIndex=`cardZIndex(p,3)`,
        opacity=`card4Opacity(p)`. = **SphereCard** (below) — its masked black panel escapes via
        `overflow:visible`.
    - **Parallax grid tiles** (siblings of the carousel, inside the rig): the 14 **GRID_ITEMS**
      (below), each `absolute left-1/2 top-1/2 z-[-1] overflow-hidden bg-cover bg-center` with
      width/height/`transform=gridItemTransform(item)`/`borderRadius=gridItemRadius(item)` fixed per
      item, and opacity=`gridOpacity(p)` (the only live value).
    - **Target block** (`absolute left-1/2 top-1/2 z-[-1] h-screen w-screen overflow-hidden`,
      background `var(--ink)`): `transform = targetTransform()` (constant), `borderRadius =
      ${targetRadius(p)}px`, opacity=`targetOpacity(p)`. Holds:
      - the **TargetStar** WebGL canvas (`absolute inset-0`) — chrome GLB star + its bg gradient;
      - a **white inner frame**: `absolute inset-[-4vmin] z-[3] rounded-[11vmin] border-[8vmin]
        border-white pointer-events-none`, opacity=`finalFrameReveal(p)`;
      - the **CtaBlock** (below).
  - **Carousel CTA** (sibling overlay of the 3D scene, NOT inside its perspective): `absolute
    inset-x-0 bottom-[2vmin] z-[3] flex justify-center px-[4vmin] pointer-events-none`, opacity=
    `carouselCtaReveal(p)`, `transform: translateY(${(1-carouselCtaReveal(p))*2.5}vh)`. A single
    pill `<a>`: `rounded-btn bg-[var(--ink)] px-[4.2vmin] py-[2vmin] text-[2.1vmin] text-[var(--paper)]`
    reading **"Explore the collection"** (href `#templates`).

### 2. Portfolio (fixed, z-40) — outside the sticky stage

A `position:fixed; inset:0; z-index:40; flex flex-col; overflow:hidden; pt-[9vmin] pb-[8vmin]`
section, `transform = portfolioTransform(p)`. No own background (sits on the shared aurora). Inside,
a horizontal track `flex h-full gap-[3vmin] pl-[3vmin]`, `transform = pfTrackTransform(p, maxPan)`
where `maxPan = max(0, track.scrollWidth - viewport.clientWidth + 3vmin)` (measured live). Three
**PfCards** (below).

### 3. Site header (fixed, z-100) — self-revealing nav

(Renders above everything; revealed after the loader lifts — see The loader.)

---

### Component: SiteHeader

`<header class="fixed left-0 top-[2vmin] z-[100] flex w-full flex-col items-center
pointer-events-none">` containing a `<nav>` (`pointer-events-auto flex items-stretch gap-[1px]
rounded-[8px] bg-[var(--nav-surface)] p-[1px]`). The 1px gaps + base colour read as hairlines between
tiles. Nav reveal: opacity 0→1 and `translateY(-10px→0)` over 700ms ease-in-out, triggered once the
loader finishes (set a `revealed` flag).

Tiles (all `rounded-[8px]`, height 40px):
- **Logo tile** — `<a href="#" aria-label="Home">` `w-[40px] bg-[var(--nav-logo)]`, holding the star
  SVG (18×18). On hover the star spring-rotates 0→90°.
- **Link tiles** — `<ul class="hidden items-stretch gap-[1px] sm:flex">` of 5: `Wearable`(#wearable),
  `Neural`(#neural), `Programs`(#programs), `Updates`(#updates), `Search`(#search). Each `<a>`
  `w-[88px] bg-[var(--nav-item)]` (`max-[760px]:w-[66px]`), label `text-[15px] text-[var(--nav-ink)]`
  (`max-[760px]:text-[13px]`); on hover the label spring-fades to opacity 0.55. **Hidden below `sm`
  (640px)** — replaced by the menu toggle.
- **Menu toggle** — `<button class="… w-[40px] bg-[var(--nav-item)] sm:hidden">` (phones only) with a
  hamburger icon that swaps to an "✕" when open; toggles the `open` state for the dropdown below.
- **CTA tile** — `<a href="#get-started">` `bg-[var(--nav-cta)] px-[22px] text-[15px] font-medium
  text-[var(--nav-cta-ink)]` (`max-[760px]:px-[16px] max-[760px]:text-[13px]`) reading
  **"Get Started"**.

**Mobile dropdown** (`sm:hidden`, sibling of the `<nav>` inside the column header): a panel
`mt-[1vmin] w-[calc(100%-8vmin)] max-w-[420px] overflow-hidden rounded-[8px] bg-[var(--nav-surface)]
p-[1px]`, spring-animated opacity 0→1 / `translateY(-8px→0)` on `open`. Inside, a vertical `<ul>` of
the same 5 links — each `<a>` `h-[44px] w-full bg-[var(--nav-item)] text-[15px] text-[var(--nav-ink)]`,
closing the menu on click. Keep it mounted but `pointer-events-none` while closed.

### Component: Marquee

A seamless running strip filling the viewport width. Render the items **twice** in a flex row and
translate the row `0% → -50%` on an infinite **25s linear** loop. Items (each `px-[3vw] text-[7vw]
tracking-[-0.03em] text-black`), separated by a small ring bullet (`size-[1.5vw] translate-y-[0.8vw]
rounded-full border-2 border-black`):
`"Templates that work"`, `"Design that sells"`, `"Speed without compromise"`,
`"AI prompts on another level"`.

### Component: HeroCard (carousel slot 1)

`relative size-full overflow-hidden rounded-[var(--radius-card)] bg-black`, layered:
1. **HeroGradient** WebGL canvas (`absolute inset-0 z-[1]`) — the cursor-reactive mesh-gradient
   shader (below).
2. **Headline** (`absolute inset-0 z-[3] flex p-[40px] max-sm:p-5 pointer-events-none`), opacity=
   `heroContentFade(p)`. An `<h1>` `flex flex-col items-start text-left text-[7vw] font-normal
   leading-[0.95] tracking-[-0.03em] text-white` with two lines: **"Prompts that"** and
   **"think ahead"** (second line `opacity-40`). Each line's letters are per-letter animated by
   `heroLetterStyle` (see ScrollLetters).
3. **"Browse our templates"** (`absolute inset-0 z-[7] flex items-center justify-center
   pointer-events-none`): an `<h2>` `text-center text-[3.6vmin] font-normal text-white
   drop-shadow-lg` rotated `-90deg`, text `"Browse our\ntemplates"` (newline → `<br>`), per-letter
   animated by `templatesLetterStyle`.
4. **Image card** (`absolute inset-0 z-[6] perspective:1400px pointer-events-none`): an inner
   `absolute left-1/2 top-1/2 overflow-hidden rounded-[var(--radius-slider)] shadow-2xl` with
   width=`heroSliderWidth(p)`, height=`heroSliderHeight(p)`, and `transform =
   translate(-50%,-50%) rotateX(rx*f)deg rotateY(ry*f)deg` where `f = heroTiltFade(p)` and `rx,ry`
   come from a cursor spring: on `pointermove`, `nx=(clientX/innerW)*2-1`, `ny=(clientY/innerH)*2-1`,
   ease `rx → -ny*9`, `ry → nx*12`. Inside, two stacked full-size images each translated
   `translateX(${heroSlidePan(p)}%)`:
   - image A = `showreel/stone.jpg` (`object-cover`);
   - image B = `showreel/hero-image-2.png`, positioned `left-full`, `object-cover`, with
     `transform: rotate(-90deg) scale(1.65)` (counter-rotates to read upright after the card flips).
5. **Bottom content block** (`absolute bottom-0 left-0 w-full p-[40px] max-sm:p-5 z-[6] flex flex-col
   gap-6 max-sm:gap-4 text-white font-light`), opacity=`heroContentFade(p)`:
   - paragraph (`max-w-md opacity-90 text-[16px] max-sm:text-[14px] leading-relaxed`): *"Turn
     engagement into conversions, trends into traffic, and views into revenue. All with a team that
     knows how to make social media work for you."*
   - two buttons (`flex items-center gap-4 max-sm:flex-col max-sm:items-stretch max-sm:gap-3`):
     **"See Pricing"** (`px-8 py-3.5 max-sm:px-5 max-sm:py-3 rounded-[8px] bg-white/10 backdrop-blur-md
     border border-white/20 text-[17px] max-sm:text-[15px]`) and **"Start Journey"** (`bg-white
     text-black font-medium`).
   - a `w-full h-[1px] bg-white/30 my-2 max-sm:hidden` divider.
   - a row (`max-sm:hidden` — dropped on phones, the narrow card can't fit it): a glassy avatar pill
     (`bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-1.5 pl-2 pr-4`) with 5
     overlapping 32px round avatars (`-space-x-2`) from `https://i.pravatar.cc/100?img=1..5` and the
     label **"Trusted by 4000+ creatives"** (`text-[14px] font-medium opacity-90`); and a right
     paragraph (`max-w-lg opacity-90 text-right text-[15px]`): *"From crafting scroll-stopping content
     to engineering algorithms we help your brand break through the noise and go viral."*

### Component: CatalistCard (carousel slots 2 dark & 3 light)

`relative size-full overflow-hidden rounded-[var(--radius-card)]`, ink color = dark→
`var(--cc-dark-ink)` / light→`var(--cc-light-ink)`. Full-bleed background `<img object-cover>`
(dark = `showreel/card-2.jpg`, light = `showreel/card-3.jpg`). Overlay `absolute inset-0 flex
flex-col p-[3.2vmin]`:
- **Top row** (`flex items-center justify-between`): a logo tile — `size-[3.4vmin] rounded-[0.9vmin]
  bg-white text-[var(--ink)]` holding a 4-point sparkle SVG (`size-[2.2vmin]`, path
  `M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z`) — and a url
  `text-[1.5vmin] tracking-[0.02em] opacity-85` = **"Catalist.co.uk"** (both cards).
- **Middle**:
  - *Dark:* a glass pill `mt-[2.6vmin] flex items-center justify-between gap-[1.5vmin]
    rounded-[4vmin] border border-[var(--glass-border)] bg-[var(--glass-dark)] px-[2vmin]
    py-[1.8vmin] backdrop-blur-[10px]` — left a stacked label `text-[1.4vmin] opacity-60`
    **"Catalist Lendings"** over `text-[2.2vmin]` **"Apply for Loan"**, right a `size-[3vmin]
    rounded-full bg-[var(--glass-border)]` "+" badge.
  - *Light:* a search bar `my-auto flex items-center gap-[1.4vmin] rounded-[5vmin]
    bg-[var(--cc-search)] px-[2.2vmin] py-[2vmin] text-[var(--paper)]` — a "+" badge, a flex-1
    ellipsized `text-[1.7vmin] opacity-80` query **"Analyze impact of lending in Business [Field]"**,
    and a "➤" send badge.
- **Bottom** (`mt-auto`):
  - *Dark:* `<h3 text-[4.6vmin] font-normal leading-[1.05]>` = `"The Ultimate Engine for "` +
    `<strong class="font-bold text-white">Business Lending</strong>`.
  - *Light:* `<p text-[3.1vmin] leading-[1.2] text-[var(--paper)]>` = `"Use AI-based system analyser
    — "` + `<strong class="font-bold text-white">all through one intelligent platform.</strong>`.

### Component: SphereCard (carousel slot 4 → the sphere scene)

`size-full`, layered:
1. **Card face** (`absolute inset-0 overflow-hidden rounded-[var(--radius-card)]`, background
   `var(--card-violet)`): an inner `flex size-full flex-col p-[3.2vmin] text-[var(--paper)]` with a
   top row — pill `rounded-full border border-[var(--glass-border)] bg-[var(--glass-dark)]
   px-[1.8vmin] py-[0.8vmin] text-[1.4vmin] backdrop-blur-[10px]` = **"Neural Core"**, and url
   `text-[1.5vmin] opacity-85` = **"superconscious.ai"** — and a bottom `<h3 mt-auto max-w-[88%]
   text-[4.4vmin] leading-[1.05]>` = **"Intelligence, beyond limits"**. Shows while card 4 is a
   carousel slot; covered by the mask as the sphere opens.
2. **Star-masked black panel** (`absolute left-1/2 top-1/2 h-[300vh] w-[300vw] bg-black`) — apply a
   CSS mask of `showreel/star.svg` (`mask-image:url(star.svg); mask-repeat:no-repeat;
   mask-position:center`), `mask-size = starMaskSize(p)`, `transform = blackScreenTransform(p, vmin)`
   (vmin = `min(innerW,innerH)/100`, live). As the mask grows from a small star to fill the screen,
   it reveals this black backdrop (the aurora shows through the star's concave corners during the
   reveal). Inside it a counter-scaling wrapper (`absolute left-1/2 top-1/2 h-screen w-screen`,
   `transform = translate(-50%,-50%) scale(${sphereSceneScale(p, vmin)})`) holding:
   - **Particle sphere** (`absolute left-1/2 top-1/2 z-[2] size-full`, `transform =
     translate(-50%,-50%) scale(${sphereScale(p)})`) — the **ParticleSphere** WebGL canvas, fed
     `uDisperse = sphereDisperse(p)` each frame.
   - **White star logo** (`absolute left-1/2 top-1/2 z-[3] h-[12vh] w-[12vh] bg-white`) masked by the
     same star.svg (`mask-size:contain`), `transform = sphereLogoTransform(p)`, opacity=
     `sphereLogoOpacity(p)`.
   - **Heading top** `<h2 absolute left-[4vmin] top-[4vmin] z-[4] text-[var(--sr-heading-1)] leading-[0.85]
     text-white>` = **"Beyond"**.
   - **Heading bottom** `<h2 absolute bottom-[4vmin] right-[4vmin] z-[4] flex flex-col items-end
     text-right text-[var(--sr-heading-2)] leading-[0.85] text-white>` = two lines **"all"** / **"limits"**.
     All three heading lines share **one** sequential per-letter stagger (`blockLetterStyle`), with a
     combined letter total and per-line index offsets (top=6 letters → "all" offset 6 → "limits"
     offset 9).
   - **Body copy** (`absolute bottom-[5vmin] left-[4vmin] z-[4] flex max-w-[var(--sr-sphere-body-w)] flex-col
     gap-[1.8vmin] text-[var(--sr-sphere-body-text)] font-light leading-[1.45] text-white`), opacity=
     `sphereBodyReveal(p)`, `transform: translateY(${(1-sphereBodyReveal(p))*2.5}vmin)`, two `<p>`:
     1. *"Superconscious is a neural engine that turns intent into action — anticipating your next
        move before you make it, across every device you already own."*
     2. *"One model, every surface: wearable, neural, and beyond. No ceilings, no limits — just
        intelligence that keeps pace with the way you think."*

### Component: PfCard (portfolio, ×3)

`relative flex h-full w-[62vw] shrink-0 flex-col justify-between overflow-hidden
rounded-[var(--radius-pf)] bg-[var(--pf-card)] p-[3.5vmin] text-white`. A full-bleed autoplaying
`<video autoplay loop muted playsinline>` (`absolute inset-0 z-0 size-full object-cover`). Over it
(z-2): a tag row `flex flex-wrap items-center gap-[1.4vmin] text-[1.7vmin] opacity-90` =
`client · year · discipline` (middot separators `opacity-50`), and a title `<h3 max-w-[85%]
text-[7vw] font-normal capitalize leading-[0.95] tracking-[-0.03em]>`. The three items:
1. `Archin` — client **logan cee**, year **2023**, **"Architecture Design · Website"**, video
   `showreel/portfolio-1.mp4`.
2. `Zumar` — client **zumar**, year **2024**, **"Web Design & Development"**, video
   `showreel/portfolio-2.mp4`.
3. `Nova` — client **nova**, year **2024**, **"Brand · Motion · Web"**, video
   `showreel/portfolio-3.mp4`.

(Optional: only mount the `<video>` when the portfolio is near its scroll range so the clips don't
load up-front.)

### Component: CtaBlock (on the final target block)

`absolute inset-0 z-[2] flex flex-col items-start justify-center gap-[2.5vmin] p-[9vmin]
pointer-events-none`, opacity=`ctaReveal(p)`, `transform: translateY(${(1-ctaReveal(p))*6}vh)`:
- `<h2 max-w-[60vw] max-sm:max-w-[88vw] flex flex-col items-start text-[7vw] font-normal
  leading-[0.95] tracking-[-0.03em] text-[var(--paper)]>` = **"Build beyond"** then **"all limits"**
  (second span `opacity-40`).
- `<p max-w-[26vw] max-sm:max-w-[80vw] text-[2.2vmin] max-sm:text-[3.4vmin] leading-snug
  text-[var(--paper)]/70>` = *"Templates, prompts, and tools that think ahead — start shipping faster
  today."*
- `<a href="#get-started" class="pointer-events-auto mt-[1.5vmin] inline-flex rounded-[8px]
  bg-[var(--paper)] px-[4.6vmin] py-[2.2vmin] text-[2.5vmin] text-[var(--ink)]">` = **"Get started"**.

### ScrollLetters helper

Split a string into per-letter `<span style="display:inline-block">`; spaces are preserved
(non-breaking) and **not counted** as letters; `\n` → `<br>`. Each glyph's `transform`, `filter`,
`opacity` are set every frame from a `styleFn(p, letterIndex, total)` returning
`{transform, filter, opacity}`. Use `align-bottom` wrappers and **no overflow clip** (the blur+fade
is the reveal). Supports an `indexOffset` + `totalOverride` so multiple lines share one stagger.

## The WebGL / canvas scenes (reproduce shaders VERBATIM)

All shader planes are a `[2,2]` plane with a clip-space vertex shader (no camera). For each canvas,
size the drawing buffer from the element's **layout box** and **do not** re-measure on scroll/CSS
transform (otherwise the framebuffer balloons as the stage zooms — this was the original's main
perf fix). Pause a canvas's render loop when its scene is off-screen (see `sceneVisibility`).

### A. HeroGradient (hero card background) — cursor-reactive violet mesh-gradient

Canvas `dpr=1` (the gradient is low-frequency; 1× is identical and ~4× cheaper), ~36fps cap. Track
the pointer on `window` and map to canvas-local pixels for `u_mouse`; ease `current += (target -
current) * 0.12` each frame. `u_time = elapsedSeconds`. Uniforms: `u_resolution` (vec2, canvas px),
`u_time` (float), `u_mouse` (vec2, px, top-left origin).

Vertex:
```glsl
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
```
Fragment (verbatim):
```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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

    vec2 mouse = u_mouse / u_resolution.xy;
    mouse.y = 1.0 - mouse.y;
    float infl = exp(-distance(st, mouse) * 1.8);
    uv += (st - mouse) * infl * 0.22;

    vec3 night    = vec3(0.020, 0.015, 0.045);
    vec3 indigo   = vec3(0.10,  0.08,  0.32);
    vec3 violet   = vec3(0.34,  0.14,  0.72);
    vec3 electric = vec3(0.52,  0.24,  0.92);
    vec3 glow     = vec3(0.82,  0.72,  0.99);

    vec3 acc = vec3(0.0);
    float wsum = 0.0;

    addBlob(acc, wsum, uv, vec2(0.5  + 0.05 * sin(t * 0.5), 1.18), 0.58, night);
    addBlob(acc, wsum, uv, vec2(-0.12, 1.05 + 0.05 * cos(t * 0.6)), 0.36, night);
    addBlob(acc, wsum, uv, vec2(1.12,  1.05 + 0.05 * sin(t * 0.6)), 0.36, night);

    addBlob(acc, wsum, uv, vec2(0.5  + 0.05 * sin(t * 0.4), 0.66 + 0.05 * cos(t * 0.5)), 0.40, indigo);
    addBlob(acc, wsum, uv, vec2(0.16 + 0.05 * cos(t * 0.8), 0.46), 0.26, indigo);
    addBlob(acc, wsum, uv, vec2(0.84 + 0.05 * sin(t * 0.8), 0.46), 0.26, indigo);

    addBlob(acc, wsum, uv, vec2(0.5  + 0.07 * sin(t * 0.6), 0.30 + 0.05 * cos(t * 0.6)), 0.42, violet);
    addBlob(acc, wsum, uv, vec2(0.5  + 0.06 * sin(t * 0.9), 0.12 + 0.04 * cos(t * 0.8)), 0.34, electric);

    addBlob(acc, wsum, uv, vec2(0.44 + 0.05 * sin(t * 1.1), 0.02 + 0.03 * cos(t)), 0.17, glow);

    addBlob(acc, wsum, uv, vec2(-0.10, -0.05), 0.28, night);
    addBlob(acc, wsum, uv, vec2(1.10,  -0.05), 0.28, night);

    vec3 col = acc / max(wsum, 0.0001);

    vec2 hot = vec2(0.44 + 0.05 * sin(t * 1.1), 0.02 + 0.03 * cos(t));
    float hotGlow = exp(-distance(uv, hot) * 4.5);
    col += vec3(0.78, 0.68, 1.0) * hotGlow * 0.7;

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
}
```

### B. FlameBackground (fixed aurora overlay) — alpha "northern lights" corners

Canvas `gl:{alpha:true}`, `dpr=[1,2]`, transparent material (`depthTest:false, depthWrite:false`).
`u_time = elapsedTime`.

Vertex:
```glsl
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
```
Fragment (verbatim):
```glsl
precision mediump float;
varying vec2 vUv;
uniform float u_time;
const vec3 iAuroraDeep = vec3(0.38, 0.14, 0.88);
const vec3 iAuroraBright = vec3(0.66, 0.30, 1.00);
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
}
```

### C. ParticleSphere (sphere scene)

A `THREE.Points` of **34000** points on a **Fibonacci sphere** (golden angle = `π*(3-√5)`). Per
point also store `aRand[i] = abs(sin((i+1)*12.9898)*43758.5453) % 1` (deterministic). Camera
`position [0,0,3.8], fov 50`. Material: custom `ShaderMaterial`, `transparent`, `depthWrite:false`,
`depthTest:false`, `blending: AdditiveBlending`. Canvas `dpr=[2,3]` (it's CSS-scaled up). Uniforms:
`uTime`, `uSize=24.0`, `uAmp=0.11`, `uPR=pixelRatio`, `uDisperse=0..1`. Each frame:
`uTime=elapsed`, `uPR=pixelRatio`, `uDisperse=sphereDisperse(p)`, and rotate the points
`rotation.y = t*0.12`, `rotation.x = sin(t*0.1)*0.12`.

Vertex shader = the simplex-noise block below, **then** the body. Simplex block (verbatim):
```glsl
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
}
```
Vertex body (verbatim):
```glsl
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
    float hole = smoothstep(0.10, 0.20, angR);
    vAlpha = hole * (0.10 + 0.40 * depth) * (0.15 + 0.95 * lit) * (1.0 - 0.85 * uDisperse);
}
```
Fragment (verbatim):
```glsl
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

    vec3 pink   = vec3(1.00, 0.32, 0.78);
    vec3 purple = vec3(0.52, 0.12, 1.00);
    vec3 white  = vec3(0.86, 0.82, 1.00);
    float vt = clamp(vVert * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(purple, pink, vt);
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
}
```

### D. TargetStar (final block) — chrome GLB star + violet bg gradient

A canvas (`gl:{alpha:true, antialias:true}`, `dpr=[1,2]`, `ACESFilmicToneMapping`, exposure `1.1`)
with camera `position [0,0,4], fov 45, near 0.1, far 100`. Lights: `ambient #ffffff 0.25`;
`directional #ffffff 2.0 @ (2.5,3.0,4.0)`; `directional #cfe0ff 0.9 @ (-3.0,-1.5,2.0)`.

**Background gradient mesh** — a `renderOrder:-1` fullscreen `[2,2]` plane,
`depthTest:false,depthWrite:false`, with vertex `void main(){ gl_Position = vec4(position.xy,0.0,
1.0); }` and the **same mesh-gradient fragment as HeroGradient but WITHOUT the `u_mouse` term**
(uniforms `u_resolution`, `u_time` only — drop the three `mouse`/`infl` lines). Set `u_resolution` to
`(width*dpr, height*dpr)`, `u_time = elapsedTime`.

**Chrome star** — `GLTFLoader.load('…/showreel/model.glb')`. On load, traverse meshes and replace
each material with:
```js
new THREE.MeshPhysicalMaterial({ color:0xeef2f8, metalness:1.0, roughness:0.025,
  envMapIntensity:1.35, clearcoat:1.0, clearcoatRoughness:0.03 });
```
Center the model (subtract bounding-box center) and normalize: `scale = 2.4 / maxDim`. Then each
frame set on its group: `position.set(1.46,-0.43,-0.33)`, `scale.setScalar(1.74)`,
`rotation.set(-44°, -44°, spin)` where `spin -= delta * (2π/12)` (one clockwise revolution per 12s;
°→rad).

**Procedural chrome environment** (mirror reflections — build once, set `scene.environment`): draw a
1024×512 canvas — vertical gradient stops `#3a4150`@0 → `#10131a`@0.45 → `#020308`@1; a bright
horizontal "light shelf" white band (alpha 0→0.97→0) over y∈[110,215]; and three radial "softbox"
blobs: `(280,150,r150, rgba(255,255,255,.95))`, `(740,165,r130, rgba(244,248,255,.9))`,
`(540,340,r150, rgba(200,214,235,.45))`. Make a `CanvasTexture` (`EquirectangularReflectionMapping`,
`SRGBColorSpace`), run it through `PMREMGenerator`, and use the result as the env map.

## The loader / reveal (the hero moment the preview captures)

A `position:fixed; inset:0; z-index:200; display:flex; place-items:center; overflow:hidden;
background:#000` overlay. **Freeze page scroll** while it's up. Centered: the **chrome star SVG**
(`showreel/star.svg`, 132×132, `drop-shadow(0 0 28px var(--loader-glow))`) over a **violet bloom**
(`size:78vmin; border-radius:9999px; filter:blur(80px); background:var(--card-violet)`).

Timing & motion (all eased, no CSS keyframes — use rAF springs/tweens):
- Star **enters**: opacity 0→1, scale 0.5→1, blur 22px→0, over a soft spring (≈ tension 90 /
  friction 20). The bloom fades to opacity 0.85.
- Star **spins** continuously: 0→360° on a linear loop (≈ 4200ms per turn).
- After **`minDuration = 2600ms`** (700ms if `prefers-reduced-motion`): set `ready`, then **exit** —
  star accelerates its spin (≈ 1100ms/turn), scales 1→1.55, blur 0→14, lifts `translateY(-4vh)`,
  fades to 0; bloom fades to 0; the overlay cross-fades opacity 1→0 and lifts `translateY(-3vh)` over
  **650ms ease-in-out**, then unmounts. Release scroll. When the overlay finishes, set the
  `revealed` flag → the SiteHeader nav fades/slides in.
- The stage underneath is NOT faded in — it renders at full opacity *under* the opaque loader (so the
  WebGL warms up) and is simply uncovered when the loader lifts.

`prefers-reduced-motion`: skip the spin, shorten to 700ms.

## Timeline functions (bake in exactly — wire each to the elements above)

```js
// ── Card 1 (hero) ── (hero is rotated 90°: its box width = side-card HEIGHT, height = side-card WIDTH)
const card1Width = p => `calc((100vw - var(--sr-hero-pad)) * ${1-phase1(p)} + var(--sr-card-h) * ${phase1(p)})`;
const card1Height= p => `calc((100vh - var(--sr-hero-pad)) * ${1-phase1(p)} + var(--sr-card-w) * ${phase1(p)})`;
const card1Transform = p => `rotateZ(${phase1(p)*90}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)} + 1px))`;
const card1Opacity = p => (gp(p) >= 0.75 ? 0 : 1);
const heroSlidePan = p => phase1(p) * -100;                 // %
const heroTiltFade = p => 1 - phase1(p);
const heroSliderWidth  = p => `calc(min(90vw, 46vh) * ${1-phase1(p)} + 66vmin * ${phase1(p)})`;
const heroSliderHeight = p => `calc(62vh * ${1-phase1(p)} + 46vmin * ${phase1(p)})`;
const heroContentFade  = p => Math.max(0, 1 - phase1(p)*1.9);

// ── Side cards (2/3/4) ──
const sideCardTransform = (p, baseRotateY) => {
  const sx = Math.max(phase2(p), 0.0001);
  return `rotateY(${baseRotateY}deg) translateZ(calc(var(--sr-carousel-r) * ${phase2(p)})) scaleX(${sx})`;
};
const card4Opacity = p => 1 - clamp01((vScroll(p) - PS) / 400);
const cardZIndex = (p, slot) => {
  const rotY = phase3(p) * -270;
  return Math.round(Math.cos(((rotY + slot*90) * Math.PI) / 180) * 100) + 1000;
};

// ── Carousel CTA ──
const carouselCtaReveal = p => {
  const appear = smooth(clamp01((phase1(p) - 0.9) / 0.1));
  const fadeOut = smooth(clamp01((gp(p) - 0.4) / 0.06));
  return appear * (1 - fadeOut);
};

// ── Carousel ──
const carouselTransform = p => {
  const fly = phase4(p) * phase4(p);
  return `translateZ(calc(var(--sr-flyback) * ${-fly})) rotateY(${phase3(p) * -270}deg)`;
};

// ── Sphere card internals ── (geo = active bucket: {flybackVmin, carouselRVmin}; desktop {40,27})
const starMaskSize = p => `${8 + Math.pow(phase4(p), 4) * 1500}vmin`;
const flyBackZpx = (p, vmin, geo) => -(phase4(p)*phase4(p)) * geo.flybackVmin * vmin;
const blackScreenTransform = (p, vmin, geo) => {
  const scale = (PERSP - flyBackZpx(p, vmin, geo)) / PERSP;
  const upY = smooth(clamp01((vScroll(p) - PS) / 400)) * 100; // vh
  return `translate(-50%, calc(-50% - ${upY}vh)) scale(${scale})`;
};
const sphereSceneScale = (p, vmin, geo) => {
  const fly = flyBackZpx(p, vmin, geo); const radius = geo.carouselRVmin * vmin;
  return (PERSP - fly - radius) / (PERSP - fly);
};
const sphereLogoEase = p => smooth(clamp01((phase3(p) - 0.6) / 0.4));
const sphereBodyReveal = p => smooth(clamp01((gp(p) - 0.64) / 0.1));
const sphereCollapse = p => smooth(clamp01((gp(p) - 0.52) / 0.2));
const sphereScale = p => 1 + 0.5 * sphereCollapse(p);
const sphereLogoTransform = p =>
  `translate(-50%, -50%) scale(${0.12 + 0.88*sphereLogoEase(p) - 0.55*sphereCollapse(p)})`;
const sphereLogoOpacity = p => sphereLogoEase(p);
const sphereDisperse = p => smooth(clamp01((vScroll(p) - (PS - 400)) / 600));

// ── Marquee + backdrop ──
const marqueeOpacity = p => phase1(p) * (1 - clamp01((gp(p) - 0.58) / 0.12));
const marqueeBlur = p => (1 - phase1(p)) * 20; // px
const stageBackdropOpacity = p => clamp01((0.75 - gp(p)) / 0.03);

// ── Aurora ──
const auroraOpacity = p => {
  const v = vScroll(p);
  const fadeIn = clamp01((v - 1200) / 350);
  const fadeOut = 1 - clamp01((v - 2900) / 350);
  return Math.min(fadeIn, fadeOut);
};

// ── Portfolio ──
const pfProgress = p => clamp01((vScroll(p) - PS) / PF_DUR);
const pfEnter = p => smooth(clamp01(pfProgress(p) / 0.267));
const pfSlide = p => clamp01((pfProgress(p) - 0.267) / 0.453);
const pfExit  = p => smooth(clamp01((pfProgress(p) - 0.72) / 0.28));
const portfolioActive = p => vScroll(p) > PS;
const portfolioTransform = p => {
  if (!portfolioActive(p)) return "translateY(100%)";
  const ty = (1 - pfEnter(p)) * 100;
  const sc = 1 - pfExit(p) * 0.62;
  const tx = -pfExit(p) * 130;
  return `translate(${tx}vw, ${ty}%) scale(${sc})`;
};
const pfTrackTransform = (p, maxPan) => `translateX(${-pfSlide(p) * maxPan}px)`;

// ── Camera-rig flight + target (phases 6–7) ──
const flightActive = p => vScroll(p) > GRID_START;
const p6 = p => clamp01((vScroll(p) - GRID_START) / 1000);
const p7 = p => clamp01((vScroll(p) - P7_START) / (P7_END - P7_START));
const easeP7 = p => { const t = p7(p); return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; };
const cameraRigTransform = p => {
  if (!flightActive(p)) return "translate(0vw, 0vh) translateZ(0px)";
  const rigX = -250 * Math.sin((p6(p) * Math.PI) / 2);
  const rigY = -100 * (1 - Math.cos((p6(p) * Math.PI) / 2));
  const rigZ = 2250 * easeP7(p);
  return `translate(${rigX}vw, ${rigY}vh) translateZ(${rigZ}px)`;
};
const targetOpacity = p => (flightActive(p) ? 1 : 0);
const targetTransform = () => "translate(calc(-50% + 250vw), calc(-50% + 100vh)) translateZ(-2250px)";
const targetRadius = p => (flightActive(p) ? 30 * (1 - easeP7(p)) : 30); // px
const ctaReveal = p => smooth(clamp01((p7(p) - 0.5) / 0.5));
const finalFrameReveal = p => smooth(clamp01((p7(p) - 0.8) / 0.2));

// ── Parallax grid ──
const gridOpacity = p => {
  const v = vScroll(p);
  if (v <= GRID_START) return 0;
  const gridFadeIn = clamp01((v - GRID_START) / (PF_END - GRID_START));
  if (v <= PF_END) return gridFadeIn;
  const fade = v > P7_START ? easeP7(p) : 0;
  return 1 - fade;
};

// ── Per-letter heading choreography ──
const heroLetterStyle = (p, index, total) => {
  const reversed = total - 1 - index;
  const delay = (reversed / total) * 0.4;
  const e = smooth(clamp01((phase1(p) - delay) / 0.6));
  return { transform:`translateY(${e*40}%)`, filter:`blur(${e*1.5}vmin)`,
           opacity: Math.max(0, 1 - e*1.5) };
};
const blockLetterStyle = (p, index, total) => {
  const ap = clamp01((gp(p) - 0.6) / 0.135);
  const delay = (index / total) * 0.55;
  const inv = 1 - smooth(clamp01((ap - delay) / 0.45));
  return { transform:`translateY(${inv*70}%)`, filter:`blur(${inv*2.0}vmin)`,
           opacity: Math.max(0, 1 - inv*1.3) };
};
const templatesLetterStyle = (p, index) => {
  const t = clamp01((phase1(p) - 0.45 - index*0.005) / 0.45);
  return { transform:`translateY(${(1-smooth(t))*150}%)`, filter:`blur(${(1-t)*1.5}vmin)`,
           opacity: t };
};
```

### Parallax grid items (build once, deterministic)

14 tiles. Base positions (tx in vw, ty in vh, w/h in vw/vh):
```js
const RAW_GRID = [
  {tx:-85,ty:-60,w:"45vw",h:"70vh"}, {tx:-80,ty:55,w:"40vw",h:"65vh"},
  {tx:85,ty:-60,w:"40vw",h:"75vh"},  {tx:80,ty:55,w:"45vw",h:"70vh"},
  {tx:-15,ty:-110,w:"45vw",h:"75vh"},{tx:15,ty:120,w:"50vw",h:"80vh"},
  {tx:50,ty:120,w:"45vw",h:"70vh"},  {tx:120,ty:-10,w:"40vw",h:"80vh"},
  {tx:0,ty:160,w:"45vw",h:"75vh"},   {tx:150,ty:0,w:"50vw",h:"80vh"},
  {tx:200,ty:30,w:"45vw",h:"75vh"},  {tx:300,ty:40,w:"40vw",h:"70vh"},
  {tx:190,ty:160,w:"45vw",h:"80vh"}, {tx:310,ty:170,w:"50vw",h:"75vh"},
];
// 9 source images: grid-images/image 553.png … image 561.png (URL-encode the space as %20)
const GRID_IMAGES = [ /* the 9 grid image URLs, in order 553..561 */ ];
const GRID_ITEMS = RAW_GRID.map((it, index) => {
  const pr = Math.abs(Math.sin((index+1)*12.9898) * 43758.5453) % 1;
  const z = -500 - pr*2500;
  const scale = 1500 / (1500 - z);                  // PERSP=1500
  const imgRand = Math.abs(Math.sin((index+1)*78.233) * 12345.678) % 1;
  const image = GRID_IMAGES[Math.floor(imgRand * GRID_IMAGES.length)];
  return { ...it, z, scale, image };
});
const gridItemTransform = it =>
  `translate(calc(-50% + ${it.tx}vw), calc(-50% + ${it.ty}vh)) translateZ(${it.z}px) scale(${it.scale})`;
const gridItemRadius = it => `${12 / it.scale}px`;
```

### Per-canvas visibility (gate render loops for perf)

```js
const sceneVisibility = p => {
  const g = gp(p), v = vScroll(p);
  return {
    hero: g < 0.8,
    aurora: v > 1000 && v < PF_END + 350,
    sphere: g > 0.1 && v < GRID_START + 400,
    target: v > GRID_START - 300,
    portfolio: v > PS - 600 && v < PF_END + 350,
  };
};
```
Pause each WebGL canvas's render loop (and mount/unmount the portfolio `<video>`s) per these flags.

## Fixed parameters (bake these in)

- Physical track height 2000vh desktop / 1700 tablet / 1300 mobile (Responsive geometry); sticky
  100vh, padding 4vmin. Virtual axis is **constant** across layouts: `SCROLL_COMPRESS 0.4` →
  `VSCROLL_MAX 4750`; `OLD_MAX 2000`; `PS 1600`, `PF_DUR 1500`, `PF_END 3100`, `GRID_START 2680`,
  `P7_START 3680`, `P7_END 4580`; `PERSP 1500`. (`p` normalizes 0→1 over the physical track; the
  virtual constants are unchanged, so a shorter track only changes scroll sensitivity, not motion.)
- Carousel cards `--sr-card-h`×`--sr-card-w` (62×42vmin desktop); card radius 3vmin, slider radius
  1.6vmin, portfolio radius 2.5vmin, buttons/header radius 8px, grid radius 12px, target radius 30px.
- Carousel ring radius `--sr-carousel-r` (27vmin desktop); fly-back `--sr-flyback`·phase4² (40vmin
  desktop); carousel rotateY 0→-270°.
- Sphere: 34000 points, `uSize 24`, `uAmp 0.11`, camera fov 50 @ z 3.8; star mask grows `8 +
  phase4⁴·1500`vmin; sphere headings `--sr-heading-1`/`--sr-heading-2` (18/24vmin desktop), body
  `--sr-sphere-body-w`/`--sr-sphere-body-text` (52vmin/2.4vmin desktop).
- Target: chrome star `scale 2.4/maxDim` then group scale 1.74 at `(1.46,-0.43,-0.33)`, rot
  `(-44°,-44°,spin)`, 1 rev/12s; camera fov 45 @ z 4; ACES exposure 1.1; rig flight `rigX
  -250·sin`, `rigY -100·(1-cos)`, `rigZ 2250·easeP7`; target offset `+250vw,+100vh,-2250px`.
- Loader: minDuration 2600ms (700 reduced), exit 650ms, star 132px, bloom 78vmin blur 80px.
- Marquee 25s linear loop; hero headline & section H1s/CTA 7vw, leading 0.95, tracking -0.03em.
- Colors: all from the `:root` tokens above. Mesh-gradient palette `night(0.020,0.015,0.045)`,
  `indigo(0.10,0.08,0.32)`, `violet(0.34,0.14,0.72)`, `electric(0.52,0.24,0.92)`,
  `glow(0.82,0.72,0.99)`; aurora `deep(0.38,0.14,0.88)`, `bright(0.66,0.30,1.00)`; particles
  `pink(1.00,0.32,0.78)`, `purple(0.52,0.12,1.00)`, `white(0.86,0.82,1.00)`.

## Assets

All assets load from our public bucket (full URLs — base):
`ASSET_BASE_URL = https://api.getlayers.ai/storage/v1/object/public/public/assets/ai-studio-0b8d365222`

- Hero image A — `…/ai-studio-0b8d365222/showreel/stone.jpg`
- Hero image B (rotated) — `…/ai-studio-0b8d365222/showreel/hero-image-2.png`
- Catalist dark bg — `…/ai-studio-0b8d365222/showreel/card-2.jpg`
- Catalist light bg — `…/ai-studio-0b8d365222/showreel/card-3.jpg`
- Brand star (logo / masks / loader) — `…/ai-studio-0b8d365222/showreel/star.svg`
- Chrome star model (GLB) — `…/ai-studio-0b8d365222/showreel/model.glb`
- Portfolio videos — `…/ai-studio-0b8d365222/showreel/portfolio-1.mp4`, `…/portfolio-2.mp4`,
  `…/portfolio-3.mp4`
- Parallax grid (9 PNGs, URL-encode the space) — `…/ai-studio-0b8d365222/grid-images/image%20553.png`
  through `…/grid-images/image%20561.png`
- Avatars (external, keep as-is) — `https://i.pravatar.cc/100?img=1` … `?img=5`