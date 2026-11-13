# Landing prototype: developer guide

How `landing-prototype/` is built, so a new contributor (or an LLM) can change it without rediscovering things. **The directory is protected** (CLAUDE.md §3): edit only with the user's authorization for a stated task. For status and decisions see [../FRONTEND-PROTOTYPE-STATUS.md](../FRONTEND-PROTOTYPE-STATUS.md); for every change made to it see [../PROJECT-BRIEF.md](../PROJECT-BRIEF.md) §5.

## 1. Stack and running it

- Static HTML, CSS and ES modules. No build step, no framework.
- Runtime libraries come from CDNs through an import map in `index.html`: three.js 0.185.0 (unpkg) and Lenis 1.3.26 (jsDelivr). Fonts come from Google Fonts. If one is blocked, the showreel fails; fixing that (self-hosting, graceful fallback) was left for production.
- Run: `python3 landing-prototype/serve.py` → http://127.0.0.1:3200. `serve.py` is a static server plus the chat endpoints (see [BACKEND-HANDOFF.md](BACKEND-HANDOFF.md)). Any static server works for everything except the live-AI chat.

## 2. Files

| File | Responsibility |
|---|---|
| `index.html` | Markup for the top bar, hero, certifications, process, jobs, capability, record, FAQ, contact and footer; the shared SVG icons and the mark symbol (`#i-mark`); the import map. The showreel section (`#services`) is empty and filled by `showreel.js`. Some headings are written here, not in `content.js`. |
| `js/content.js` | All copy and facts (`BRAND`, `CERTS`, `CREDENTIALS`, `CUSTOMERS`, `SHOWREEL`, `FUNCTIONS`, `FLIGHT`, `STEPS`, `JOBS`, `CAPABILITY`, `STICKERS`, `LEDGER`, `FAQ`, `CONTACT`, `LEADERSHIP`). The chatbot reads it too. Facts only come from the proof bank in PROJECT-BRIEF §1.9. Ask before editing. |
| `js/main.js` | Entry point. Renders content into the sections, builds the showreel, starts Lenis, wires the contact teaser, then starts motion and the preloader. |
| `js/motion.js` | Spring engine and shared ticker, the `MOTION` reveal set (`RISE` is the shared entrance), gated "seen" reveals, scroll parallax (`initParallax`, scroll-linked, no spring), the preloader, `initHeader` (dock and `--bar-h`), scroll lock. |
| `js/showreel.js` | The scroll-driven showreel: timeline functions of one scroll value `p`, geometry buckets, the WebGL scenes (hero gradient, aurora, particle sphere, closing-frame mark), sideways snap, adaptive resolution, focus handling. About 1200 lines. |
| `*.html` (about, account, capability, contact, government, healthcare, jobs, login, specialists), `js/pages.js`, `js/site.js`, `js/auth.js`, `js/sprite.js`, `css/pages.css` | The inner pages (from `main`): `pages.js` renders each from `content.js` inside the shared chrome in `site.js` (bar with the pause toggle, footer, Lenis, reveals, chat); `auth.js` is the design-only candidate sign-in (localStorage). |
| `js/pause.js` | Pause/play state (`html[data-motion]`), the top-bar toggle, `prefers-reduced-motion`. |
| `js/chat.js` | The XC Concierge chat widget (guided mode from `content.js`, optional live AI). |
| `js/mark.js`, `js/ph.js` | Reads the mark polygons from the `#i-mark` symbol; the placeholder component (`ph()`) used for every "your asset" slot. It also renders a real image (`src`) or looping clip (`video`) in the same slot. |
| `js/video.js` | `watchVideos()`: plays each `video[data-vid]` only while on screen and not paused; the poster shows otherwise. |
| `css/base.css` | Tokens (palette, type scale, spacing), reset, placeholder styles. The root `font-size` tracks the viewport. |
| `css/hero.css` | The hero and the top bar's `.hx-*` layout. |
| `css/sections.css` | Everything after the hero except the showreel, plus the fixed bar's dock styles and the pause toggle. |
| `css/showreel.css` | The showreel stage. |
| `css/chat.css` | The chat widget. |

Cache-busting: the module imports carry `?v=3` (for example `./pause.js?v=3`). Use the same string everywhere a module is imported, or the browser loads two copies.

## 3. Page flow and scroll model

1. `main.js` renders content, builds the showreel DOM, starts Lenis (smooth scroll, off under reduced motion) and the preloader. Scroll is locked until the preloader releases.
2. Sections in order: top bar → hero (`#top`) → certifications → showreel (`#services`) → process → jobs → capability → record → FAQ → contact + footer.
3. **Showreel:** one tall track with a sticky stage. A single value `p` (0 to 1, progress through the track) drives every animated style. Constants: `VSCROLL_MAX = 4750`, `PS = 1600`, `PF_END = 3100`, `GRID_START = 2680`, `P7` phases at 3680 to 4580. Beats: hero card → carousel (3 cards) → sphere dive through the mark's hub → three services panels (pan sideways) → flight through tiles → closing frame ("One nurse"). Geometry buckets (desktop, tablet, mobile) are chosen by orientation and width and written as `--sr-*` variables.
4. **Sideways snap:** `attachSnap` steps the carousel and the services strip one card per sideways gesture (trackpad swipe, shift + wheel, ← / →, touch swipe). Vertical scroll is untouched.
   **Vertical snap (↓ / ↑ keys):** inside the reel, a *tap* steps to the next or previous resting beat (`vstops()` in `showreel.js`: opening card, four carousel cards, sphere text settled at v 1470, the three services panels, closing frame at 4750); quick taps chain. *Holding* the key past the OS repeat delay switches to free, eased scrolling (`holdStart`/`holdTick`, about 2.2 viewport heights per second). The wheel is untouched. Outside the reel, in inputs and in the chat panel the keys keep the browser's behaviour, as they do at the first and last beat so the page carries on.
5. **Reveals:** elements with `data-m="headline|card|button|…"` are animated by `registerReveals` / `releaseReveals` using the shared `RISE` spring. Add a reveal by giving an element `data-m` and an entry in `MOTION`.

## 4. Design tokens and conventions

- **Fonts:** hero and top bar: Mona Sans and Geist Mono. Everything after the hero: Zen Kaku Gothic New (`--font-sans/display/mono`; the bar uses `--font-bar`). A few showreel labels (chips, kickers) and the footer logo stay in Geist Mono by decision.
- **Type scale:** tokens in `css/base.css` (`--type-*`), stepped at 1200, 896 and 700 px. `--type-min: 11px` is the floor; use `--type-micro`, `--type-label` or floor new sizes with `max(…, var(--type-min))`. The root font size tracks the viewport, so a bare `rem` can fall under 11px on small phones.
- **Colour:** graphite `#101012`, silver `#d0d0d2`, ink `#f3f3f5`, one red `#ff2a45` (`--accent`). The deeper red was removed. Text on red fills is graphite. The capability poster uses `--surface-poster` (paper-50).
- **Breakpoints:** media queries at 1200, 896 and 700 px; design frames at 1400, 1024, 768 and 390 px.
- **Boxed text:** Zen Kaku sits low in its line box. Use `text-box: trim-both cap alphabetic` with symmetric padding; flex containers (`.btn`) need a small manual lift instead. Centre rows (`top: 50%`, translate) rather than hard-coding offsets: a fixed offset drifted when the pause toggle made the bar's row taller.
- **Bar and dock:** the fixed bar is the hero's header markup reused; `--dock` (0 to 1, set in `initHeader`) floats it into a rounded glass pill once scrolled. `--bar-h` is its height and feeds the showreel's top padding, so do not change the bar's height casually.
- **Motion that moves on its own** must respect `html[data-motion="paused"]` (CSS `animation-play-state`, or `isPaused()` in JS). Scroll-linked motion is exempt by decision.
- **Real media in a slot:** `ph({ ..., src, alt, pos })` for a photo (files in `assets/img/`), `ph({ ..., video: "name" })` for a clip (`name.webm`, `name.mp4`, `name-poster.webp` in `assets/video/`). Customer logos go in `CUST_LOGO` in `js/main.js` (one line plus the file); keep `assets/img/LOGOS.md` and `assets/video/LICENSES.md` current.
- **Placeholders:** use `ph({ kind, what, note })`. Placeholder tags are hidden inside the small job-card and customer-logo tiles (they do not fit at the 11px floor).

## 5. Things that bit us (read before changing the showreel)

- **Chrome hit-testing 3D layers.** The closing frame is moved by two opposite offsets, `translateZ(+2250px)` on the rig and `-2250px` on the target. They cancel visually, but Chrome then hit-tests the wrong layer (clicks and hover on "Request staff" failed). Once the camera has arrived (`ARRIVED = 0.97` of the last phase) both layers switch to flat 2D transforms. Layers that have faded to opacity 0 are also set to `visibility: hidden`, because Chrome still hit-tests them.
- **Resizing a WebGL canvas clears it.** Redraw immediately after any `setSize` (the helper `glCanvas` does). Adaptive resolution (`ADAPTIVE` flag, `setQuality`) relies on this.
- **Pinned stage and keyboard focus.** The browser's own scroll-into-view can leave a focused button below the fold because the stage is sticky; the `focusin` handler in `showreel.js` brings the stage up (keyboard focus only, so it never fights a mouse click's scroll).
- **Virtual clock.** The shaders and the mark's sway run on a clock that stands still while animations are paused; scenes then redraw only when the scroll position changes.
- **Measuring unrevealed elements.** Elements that have not played their reveal (for example the record stamps, scaled 2.1×) report oversized boxes. Scroll the whole page first before measuring overflow.
- **Headless window minimum.** A headless Firefox window cannot be narrower than about 500 px; test 390, 360 and 320 px through a same-origin iframe (see [TESTING.md](TESTING.md)).

## 6. Common tasks

| Task | Where |
|---|---|
| Change copy or a fact | `js/content.js` (ask first); headings that are written in `index.html` are edited there. |
| Add or change a section | Markup in `index.html`, content in `content.js`, rendering in `main.js`, styles in `css/sections.css`; add `data-m` for reveals. |
| Change a size | Use or add a token in `css/base.css`, floored with `--type-min`. |
| Swap a placeholder for a real asset | Replace the `ph()` call (or the `<img>`) and note it in the placeholder register in [../FRONTEND-PROTOTYPE-STATUS.md](../FRONTEND-PROTOTYPE-STATUS.md). |
| Pause a new animation | Add a selector to the `html[data-motion="paused"]` rule in `css/sections.css`, or check `isPaused()` in JS. |
| Turn adaptive resolution off | Set `ADAPTIVE = false` in `js/showreel.js`. |

## Body-copy alignment (justified only where it fits)

Body paragraphs are left-aligned with balanced line ends (`text-wrap: pretty`). `js/justify.js` measures each candidate (`.pg-intro`, `.pg-lead`, `.acc .a`) in a hidden copy at its current width and adds `.just-fit` (flush both edges, hyphenated, last line left; `css/base.css`) only when no word gap grows past 1.35x the normal space. It re-checks on resize, font load and FAQ open. Cards, steps, notes and showreel text are never candidates: with two or three lines the gaps stretch 2x to 7x. Measured on 8 pages at 1400, 768 and 390 px, the worst gap actually used is 1.26x, and at 390 px nothing is justified. Do not put `data-m="copy"` on a candidate (the line-splitting reveal breaks justification).
