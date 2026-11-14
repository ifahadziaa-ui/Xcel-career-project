# Migration assessment: the clean homepage into `xcel-website/`

A read-only assessment made on 14 Nov 2026. **Nothing described here has been implemented.** Implementation needs the user's authorization (CLAUDE.md §3 and §4). Reference: `landing-prototype-clean/` ([CLEAN-COPY.md](CLEAN-COPY.md)). Target: `xcel-website/` (Next 16.4.5, React 19.3, TypeScript, Tailwind 4).

## 1. The target today

- One route: `/` renders `<Hero />` (`src/app/page.tsx`). No inner routes, no API routes.
- `src/app/layout.tsx` loads Mona Sans (width axis) and Geist Mono with `next/font/google`; metadata is still a stub.
- `src/app/globals.css` is 22 lines. The hero is a CSS Module (`hero.module.css`, 603 lines) and still carries the VESSEL copy.
- `public/` holds only the hero placeholder image. No `three`, `lenis` or `@types/three`.
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. `AGENTS.md` warns this Next version differs from older ones: read `node_modules/next/dist/docs/` before writing code.
- With Cache Components, a route you leave is hidden with React `<Activity>` (up to three routes), not unmounted: effect cleanups run on hide, `<video>` keeps playing unless paused, and global CSS keeps applying (`preserving-ui-state.md`).

## 2. The prototype in numbers

About 6,800 lines of vanilla ES modules and CSS. Largest: `showreel.js` 1,246, `chat.js` 696, `hero.css` 627, `chat.css` 590, `sections.css` 519, `motion.js` 410. Markup is built with `innerHTML`; engines are long-lived imperative loops. three@0.185.0 and Lenis 1.3.26 come from a CDN import map; fonts from a Google Fonts link; video is about 15 MB.

## 3. Recommended shape

Static markup as React components; every engine kept as a ported TypeScript module behind one client component that owns its lifecycle. Do not rewrite the engines idiomatically: that is where parity is lost.

| Feature | Prototype | In Next |
|---|---|---|
| Content | `content.js` (single source, the chat reads it) | Typed `content.ts`, copied exactly, server-safe |
| Fonts | Mona Sans, Geist Mono, Zen Kaku Gothic New (weights 300 to 700, not variable) | `next/font/google` for all three, exposed as CSS variables |
| Icon sprite | `sprite.js` injects `#i-mark` and icons | Inline `<svg>` sprite in the root layout |
| Tokens and reset | `base.css`, `html { font-size: 1.142857vw }` | Global stylesheet; reconcile with Tailwind preflight; decide whether the vw root size stays site-wide |
| Pause and reduced motion | `pause.js`, `html[data-motion]` | Client module plus a tiny pre-hydration script; `suppressHydrationWarning` on `<html>` |
| Lenis | one instance on `window.__proto` | Root client provider with setup and teardown; reconcile with Next's scroll restoration |
| Preloader | pile and stamp, locks scroll | Client component, first visit to `/` only, no replay, no-JS fallback |
| Top bar and dock | fixed bar, glass dock once scrolled, `--bar-h` | Client `SiteHeader` in the layout |
| Hero | `.hx-hero`, cursor tilt | Rework `Hero.tsx` and its CSS with the clean content; hero keeps Mona Sans and Geist Mono |
| **Showreel** | five WebGL renderers, one scroll value, nine scenes, snap controls | Markup from JSX; engine ported line for line; client component loaded with `next/dynamic` (`ssr: false`); **new** `destroy()` and `pause()`/`resume()` |
| Content sections | certifications, process, jobs fan, capability, record, FAQ, contact, footer | Server components; reveals and parallax as client hooks; keep native `<details name="faq">` |
| Video | `video.js` plays clips only on screen and when not paused | `<video>` with a visibility and pause hook; pause explicitly when the route is hidden |
| Placeholders | `ph()` strings | A `<Media>` component (image, video or quiet placeholder) |
| Chat | builds its own panel on `<body>`; guided answers from `content.js`; live mode needs `/api/chat` | Client component in the root layout; port guided mode only |
| Sign-in state | `auth.js`, browser-only | Client hook, design-only, or drop it |

**The showreel engine has no teardown today.** It never cancels its loop, removes its listeners (resize, orientationchange, pointermove, wheel in capture mode, keydown, keyup, blur, touch), disconnects its ResizeObserver or disposes its renderers, geometries, materials and textures. Porting needs a `destroy()` and a pause/resume pair. Under `<Activity>` either keep the contexts and pause, or dispose and rebuild; browsers cap WebGL contexts at about 16 and the page uses five.

## 4. Risks

1. **Client/server boundary:** most modules touch `window`, `matchMedia`, `localStorage` or WebGL at import time (for example `pause.js`), so they need `'use client'` boundaries and `ssr: false` loading.
2. **Lifecycle:** the motion ticker, showreel loop, Lenis, chat key handler and body append, header scroll listener and IntersectionObservers all assume a page that lives once.
3. **Scroll:** Lenis, capture-phase wheel handling, the preloader's scroll lock and `history.scrollRestoration = "manual"` must be reconciled with Next navigation; the pinned track must be re-measured after route changes and font loads.
4. **Three.js disposal:** five contexts, particle buffers, extruded mark meshes and the environment map.
5. **Video:** hidden routes keep videos playing; 15 MB moves to `public/` or a CDN; the main reel is MP4 only.
6. **Fonts and paths:** hard-coded family names become `next/font` variables; `assets/...` becomes `/assets/...`; the `?v=3` cache-busting goes away.
7. **Global CSS bleed:** vw root font size, `main { overflow-x: clip }`, `html` scroll padding, `html[data-motion]` selectors and the preloader's inline style affect hidden routes and future inner pages.
8. **Preflight versus the prototype reset:** subtle spacing and border differences.
9. **Hydration:** `data-motion` and "My account" are decided on the client.
10. **Accessibility parity:** chat focus return and `aria-modal` on phones, the 2.2.2 pause toggle, Escape handling, scroll padding under the bar, the showreel's focus-into-view handler, the 11 px type floor.

## 5. Decisions needed from the user

- Add `three@0.185.0`, `@types/three` and `lenis@1.3.26` as npm packages (recommended) instead of CDN loading.
- Where inner-page links go while those routes do not exist.
- Port the prototype CSS (recommended for parity) or convert to Tailwind utilities.
- Showreel lifecycle under Activity: pause and resume, or dispose and rebuild.
- Keep `html { font-size: 1.142857vw }` site-wide or scope it to the homepage.
- Keep candidate sign-in design-only or drop it; leave the live AI chat out (it needs a backend).
- Main reel: abstract clip or real footage.

## 6. Staged plan

Each stage ends with a side-by-side check against the clean copy (port 3201) at 360, 390, 768, 1024, 1440 and 1920 px, plus the scripted checks in [TESTING.md](TESTING.md).

1. **Foundations:** packages, fonts, `content.ts`, tokens and reset, sprite, pause module with pre-hydration script, metadata.
2. **Shell:** root layout, Lenis provider, header and dock, footer, guided chat. Check navigation away and back with nothing duplicated.
3. **Static sections:** hero, certifications, process, jobs fan, capability, record, FAQ, contact form, footer, with reveals and parallax.
4. **Media:** `<Media>`, video visibility and pause, assets in `public/`. (Parallel with 3.)
5. **Showreel engine:** markup from JSX, ported engine with `destroy()` and pause/resume, snap controls, five scenes. Check all nine scenes at matching scroll positions, nine ArrowDown taps to the closing frame, WebGL context count stays at five after repeated navigation, reduced motion and pause.
6. **Preloader:** last; first visit only; no-JS fallback.
7. **Hardening:** production build, performance pass, real-GPU and Safari check, screen-reader spot check, docs.

Stage 5 depends on 1, 2 and 4; stage 6 on 3.

## 7. Not verified

- `next build` and `next dev` were not run (they write `.next/`, and `next dev` rewrites `AGENTS.md`), so the current app's compile state and the real interaction of Tailwind preflight with the ported CSS are untested.
- Only the caching, Activity, fonts, video and lazy-loading chapters of the bundled docs were read.
- Real GPU, Safari, touch, WebGL context limits on mobile and MP4 playback without H.264 are untested.
- `superconscious/` was not inspected; `landing-prototype-clean/js/showreel.js` is the code to port.
