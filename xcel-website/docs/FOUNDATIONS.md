# Foundations (migration Stage 1)

What the shared layer of `xcel-website/` is, how it maps to the verified prototype (`landing-prototype-clean/`), and the rules later stages must follow. Nothing here is page-specific. Read `AGENTS.md` and the bundled Next.js docs before changing version-specific behaviour.

## Where things live

| Concern | File |
|---|---|
| Fonts, metadata, `<html>`/`<body>` shell, inline motion script | `src/app/layout.tsx` |
| Tailwind import, token import, small base layer | `src/app/globals.css` |
| Design tokens and the root font size | `src/styles/tokens.css` |
| Typed site content (the chatbot will read it too) | `src/content/content.ts` |
| Icon sprite (symbol ids kept) | `src/components/shared/IconSprite.tsx` |
| Motion preference logic | `src/lib/motion/motion.ts` |
| Pre-hydration script text | `src/lib/motion/script.ts` |
| `useMotionPaused()` hook | `src/lib/motion/useMotionPaused.ts` |
| Root-layout effect that re-applies and follows the preference | `src/components/shared/MotionSync.tsx` |
| Favicon | `src/app/icon.svg` |

Page and component styling belongs in CSS Modules next to the component, not in `globals.css`.

## Fonts

Loaded with `next/font/google` in the root layout and exposed as CSS variables on `<html>`:

| next/font variable | Family | Used for (checked against the prototype CSS) |
|---|---|---|
| `--font-mona-sans` | Mona Sans, `wdth` axis (75 to 125), weight 200 to 900 | The hero headline (width 75, weight 900); the chat panel's text (`--xc-sans` in the prototype) |
| `--font-geist-mono` | Geist Mono, weight 100 to 900 | The hero's header, meta, specimen and placard; the chat's mono (`--xc-mono`); `--font-bar` |
| `--font-zen-kaku` | Zen Kaku Gothic New, 300, 400, 500, 700 | `--font-sans`, `--font-display` and `--font-mono`: all running text, headings and labels below the hero, and the inner pages |

Tokens built on them (in `tokens.css`): `--font-sans`, `--font-display`, `--font-mono` (all Zen Kaku, as in the prototype, where "mono" is not a monospace face) and `--font-bar` (Geist Mono: top bar, ledger dates, tables, credentials, job meta). There is no `@theme` font key on purpose; Tailwind's `font-sans`/`font-mono` read these tokens.

**Zen Kaku preload is off.** Google's CSS for Zen Kaku is split into about 80 numbered Japanese slices per weight that `next/font` cannot map to the `latin` subset; with preload on it emitted 312 preload tags. With it off, the browser downloads only the slices whose `unicode-range` matches the characters used (four Latin files of about 10 KB each for the four weights in the test page). The cost that remains is that all `@font-face` rules ship in the CSS (about 365 KB raw, 128 KB gzip, render-blocking) and about 490 unused font files sit in `.next/static/media`. If that CSS weight matters, the alternative is `next/font/local` with the four Latin-subset files (needs the files added to the repo). Open decision.

## Reset and global CSS

There is one reset: **Tailwind 4 preflight** (the prototype's own reset was a hand copy of it). The only prototype reset rule preflight lacks is `button, summary { cursor: pointer }`, kept in `@layer base`. The `.sr-only` class is not ported; use Tailwind's `sr-only` utility.

Global rules are limited to: tokens; `body` (background, colour, font, `overflow-x: clip`); `main` (`position: relative; overflow-x: clip`); `.type-display` and `.type-caps` (in `@layer components`). `overflow-x: clip` (not `hidden`) is deliberate so `position: sticky` and the pinned showreel keep working.

Not ported yet, on purpose: Lenis classes (Stage 2, with the provider), placeholder `.ph` styles (Stage 4, `<Media>`), `.just-fit` and `.nb` text rules (with the justification script).

## Design tokens

Ported verbatim from the prototype's `base.css` (names and values): the palette (`--raw-color-*`, `--background`, `--foreground`, `--surface*`, `--accent`), the type scale with its three breakpoint blocks and the second "below the hero" scale (`--type-*`, `--type-min`, `--type-heading`), line heights, letter spacing, corner radii, `--duration-hover`, `--ease-entrance`, elevations, `--header-scrim` and `--measure`. A computed-value comparison against the prototype at 1920, 1440, 1199, 1024, 895, 768, 699, 390 and 360 px found all 91 non-font tokens identical; only the four font tokens differ, by design.

Breakpoints are the prototype's: below 1200, 896 and 700 px, written as `@media (width < Npx)`.

## The sizing system: how `rem` works on every route

**The decision:** keep the prototype's viewport-scaled root font size, site-wide, defined once in `tokens.css`.

```
html { font-size: 1.142857vw }            /* 1400 frame: 16.0 px at 1400 */
< 1200px: 1.5625vw   < 896px: 2.083333vw   < 700px: min(4.102564vw, 19.2px)
```

Why: the prototype's rem-based CSS (every section below the hero and all inner pages) was designed to render 1:1 at 1400, 1024, 768 and 390. Keeping one root rule is the only way to port it faithfully, and it keeps the homepage and future inner pages on one scale. It cannot be scoped to one route, because `rem` always resolves against `<html>`.

Rules for every route:

1. **Component CSS written in `rem` assumes this root.** Do not set a different root size on a page.
2. **The hero and showreel do not use `rem`.** They size themselves with `--u`, `vmin` and container units, so they are unaffected.
3. **Tailwind spacing and text utilities are rem-based and therefore scale with the viewport.** Use them for layout and spacing, not for pixel-exact sizes. Tailwind's responsive prefixes (`sm:`, `md:`) are media queries and are unaffected: `rem` in a media query resolves against the browser default (16 px), not this root.
4. **Nothing below the hero renders under 11 px.** Use `--type-min` and `max(<rem>, var(--type-min))`.
5. **Media queries in px.** Write `@media (width < 700px)`, never in `rem`.
6. **Global CSS keeps applying to hidden routes** (Cache Components keeps up to three routes mounted with `<Activity>`), so the root size, `body` and `main` rules must stay route-agnostic. Never add route-specific global rules.

Known limitation (open decision for the user): because the root size ignores the browser's default text size, a visitor's larger-text setting does not enlarge `rem` text. Browser zoom still works through the breakpoints. Options: leave as is (faithful), or move the root to a `calc()` that mixes a rem term with the vw term, which changes the 1:1 reference frames and needs a design check.

## Motion preference

Same semantics as `js/pause.js`: `<html data-motion="paused" | "playing">`; starts paused when the OS asks for reduced motion; the visitor's choice (`localStorage["xc-motion"]` = `"paused"` or `"playing"`) wins in both directions; a change of the OS setting while the page is open is followed only when the visitor has not chosen; the setter takes `{ remember }`.

How it avoids a wrong first paint and hydration warnings (pattern from the bundled guide "Preventing flash before hydration"):

1. The server always renders `<html data-motion="playing" suppressHydrationWarning>`, so the page stays statically prerendered.
2. A synchronous inline script in `<head>` (`script.ts`) sets the real value before the first paint, using the same rules.
3. `MotionSync` (a layout effect in the root layout) re-writes the value, which also covers the dev Strict Mode remount that resets `<html>` attributes, follows the OS setting, and cleans up when React hides the layout.

API for engines and components: `isPaused()`, `setPaused(v, { remember })`, `onPauseChange(fn)` (returns unsubscribe), `startMotion()`, `MOTION_TOGGLE_TITLE`, and `useMotionPaused()`. Style anything that must be right on the first paint from `html[data-motion="paused"]` in CSS, not from the hook (the hook is `false` until hydration).

Scroll-linked motion is not touched, as in the prototype.

## Content module

`src/content/content.ts`: a typed port of `landing-prototype-clean/js/content.js`. 23 exports, identical to the prototype's data (checked by a deep comparison; `FLIGHT`, an unused placeholder list, is not ported). No imports, no browser APIs. Hrefs such as `capability.html` are the prototype's and are mapped to routes in a later stage.

Groups: `BRAND`, `CERT_LINE`, `CERTS`, `CREDENTIALS`, `CUSTOMERS`; `SHOWREEL` (hero, marquee, cards, sphere, final ask), `FUNCTIONS`, `STEPS`, `PROCESS_SPLIT`, `JOBS`, `FEATURED_JOB`, `JOBS_NOTE`, `CAPABILITY`, `STICKERS`, `LEDGER`, `FAQ`, `FAQ_NOTE`, `CONTACT`, `LEADERSHIP`; `NAV`, `SERVICE_PAGES` (healthcare, government, specialists), `ABOUT`, `REQUEST_FORM`. Exported types: `Brand`, `Customer`, `Showreel`, `FunctionLine`, `Step`, `Job`, `FaqEntry`, `Contact`, `ServicePage`, `ServicePageId`, `About`, `RequestForm` and others. Claim status of every statement: `docs/CLAIMS-REGISTER.md` at the repository root.

## Icon sprite

`IconSprite` renders `<svg id="xc-sprite" aria-hidden>` once, first in `<body>`. Symbol ids unchanged: `i-arrow`, `i-plus`, `i-close`, `i-spark`, `i-mark` (the mark keeps `.mk-ray`, `.mk-head`, `.mk-body`, `data-g` and `data-hub`, and the `--mk-fig`, `--mk-ray`, `--mk-o1..3` variables). Use `<svg aria-hidden="true"><use href="#i-mark" /></svg>`.

## Metadata and favicon

Title `XcelCareers | Healthcare Staffing & Government Contracting in Maryland` with the template `%s | XcelCareers` for inner pages; description: a healthcare staffing and government contracting company in Dayton, Maryland, with the Maryland MBE, DBE and SBE certificate number and CAGE code. Theme colour `#101012` (the prototype's). The favicon is the prototype's mark as `src/app/icon.svg`; the create-next-app `favicon.ico` was removed so it does not override it. Safari may need a PNG or ICO fallback (not generated: no source asset).

The clean prototype's `index.html` meta description places "Minority veteran-owned small business" directly before "MBE/DBE/SBE certified", which the claims register forbids (its verification report says that pairing was removed, but the file still has it). The description above states the certificate on its own and omits the veteran-owned phrase.
