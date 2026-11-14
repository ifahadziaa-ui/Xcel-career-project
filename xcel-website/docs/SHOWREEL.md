# Showreel (migration Stage 5)

Source of truth for behaviour: `landing-prototype-clean/js/showreel.js` and `css/showreel.css`. The audit that planned this stage (nine scenes, five WebGL renderers, lifecycle) was delivered as the Stage 5A report; this file records what has been built.

## Status

| Step | State |
|---|---|
| 5B-1 Static stage | **Done.** This file |
| 5B-2 Timeline and engine (DOM only) | Not started |
| 5B-3 Snap and focus | Not started |
| 5B-4 to 5B-6 WebGL scenes | Not started |
| 5B-7 Motion, video, reduced-motion presentation | Not started |
| 5B-8 Final validation | Not started |

## What 5B-1 is

`src/components/showreel/Showreel.tsx` (server component, no state, no effects) replaces the Stage 3 placeholder. It renders the whole stage from `content.ts` (`SHOWREEL`, `FUNCTIONS`, `CONTACT`): marquee, opening card, three carousel cards, the card-3 network scene, the SVG mark used for the dive, the closing frame, the carousel button and the "What we staff" panels. `Showreel.module.css` ports `css/showreel.css`.

**What the visitor sees now:** the opening frame, pinned, for the whole track. **Nothing moves on scroll yet** (no engine), no WebGL is drawn (the five canvases are present and empty), the marquee loops (CSS, pause-aware), and the stage buttons and links work. The track already has its final height, so the page is the right length.

### Decisions built in

- **Frame 0 is CSS.** Every value the prototype's engine writes each frame is a known constant at scroll progress 0 (card sizes, transforms, z-indexes, letter states, opacities). They are written in the module under "FRAME 0" comments, so the server HTML is the correct opening frame with no script. The engine overwrites them with inline styles.
- **Geometry buckets are media queries**, not JS. Same rule as `pickBucket()`: landscape = desktop; portrait narrower than 640 = mobile; portrait up to 1024 = tablet; wider portrait = desktop. Track height: 1358 / 1157 / 893 vh. Measured against the prototype at 1440, 1920, 1024, 768, 640, 639, 390 and 1100x1400 (portrait): the track is the same height to the pixel at all of them.
- **Engine hooks are `data-sr="..."` attributes, scoped to the section**, never ids. Under Cache Components a hidden route's DOM stays in the document (checked: after navigating to `/about` the home stage is still in the DOM with height 0), so `document.getElementById` would find the wrong copy.
- **Media slots are placeholders.** The opening card's video, cards 01 and 02 and the three panel clips show the quiet placeholder (graphite or paper with the mark). The clips and portraits are stock with identifiable people and no confirmed releases (`docs/MEDIA.md`). No `<video>` or media file is referenced.
- **Mark geometry** moved from `IconSprite` into `src/lib/mark/geometry.ts` (data and pure functions), used by the sprite and by the showreel's server-rendered SVG mark. The sprite's rendered markup is byte-identical to before.
- **Accessibility markup:** split headings carry a screen-reader copy and the per-letter spans are `aria-hidden` (checked in the accessibility tree: headings read "Vetted. Credentialed. Ready.", "300,000+", "profiles on file"; no letter-by-letter nodes). Card headlines are `h3` (the prototype's `h4` skipped a level); the rotated caption is a paragraph.
- **Links:** `/contact` and `/capability` through `next/link`; "Request staff" and "Find a job" on the opening card are `#contact` and `#jobs`, handled by the shell's single Lenis instance.
- `data-chat-reel` is on the section: the chat launcher shrinks to its orb while the stage is on screen (checked).

### Behaviour that matches the prototype, recorded so it is not "fixed"

- The `#services` anchor lands the page 148 px above the pinned position (2 x the 58 px bar + the 32 px `scroll-padding-top`), so the stage slides into place. The prototype does the same (measured: 148 px in both). The Stage 5A report said "trackTop minus the bar"; that was imprecise.
- At frame 0 the three side cards are in the accessibility tree (opacity 1, `scaleX(0.0001)`), as in the prototype. The engine will set `visibility` as it does there.

## What is not done, on purpose

Scroll engine and Lenis frame hook, snap, WebGL (hero gradient, aurora, sphere, closing gradient, chrome mark), video, the reduced-motion presentation, the `data-sr-ready` first-paint guard (only needed once an engine can restore a mid-reel position), and context-loss handling. The panels, the closing frame and the dive are hidden by CSS until the engine drives them, so a keyboard or screen-reader user cannot reach their text yet; the reduced-motion presentation (Stage 5B-7, decision pending) decides how that content is exposed.

## Verification (5B-1)

`tsc --noEmit`, ESLint and `next build` pass. Compared with the prototype at eight viewports (opening-frame rectangles, opacities and visibility of the card, slider, headline, lead, buttons, carousel button, side cards and backdrop all within 1.5 px; track heights identical). No horizontal overflow at any of them. Console: only the known "preloaded but not used" CSS notice. Marquee pauses with `html[data-motion="paused"]` and starts paused under OS reduced motion. Client navigation to `/about` and back leaves the stage intact. Not checked: a real GPU (no WebGL is drawn yet), Safari, real phones, a screen reader (only the accessibility tree).

Out of scope, noticed: the hero's heading reads "PEOPLE BEHIND THECARE" in the accessibility tree (a missing space between the last two words; Stage 3 code).
