# Showreel (migration Stage 5)

Source of truth for behaviour: `landing-prototype-clean/js/showreel.js` and `css/showreel.css`. The audit that planned this stage (nine scenes, five WebGL renderers, lifecycle) was delivered as the Stage 5A report; this file records what has been built.

## Status

| Step | State |
|---|---|
| 5B-1 Static stage | **Done.** This file |
| 5B-2 Timeline, DOM engine, Lenis post-frame subscription | **Done**, plus a corrective pass (restoration guard, interim reduced-motion layout, lifecycle checks). See "Stage 5B-2" |
| 5B-3 Snap, navigation and focus | **Done.** See "Stage 5B-3" |
| 5B-4 WebGL infrastructure and the two gradients | **Done.** See "Stage 5B-4" |
| 5B-5, 5B-6 aurora, sphere, closing mark | Not started |
| 5B-7 Video, final reduced-motion styling, screen-reader access in the pinned reel | Not started (an interim reduced-motion layout exists, see "Reduced motion") |
| 5B-8 Final validation | Not started |

## Reduced motion (decided)

This is a decision, not an open question.

- **Normal motion:** visitors whose OS does not request reduced motion get the original pinned, scroll-driven nine-scene choreography.
- **OS reduced motion:** visitors whose OS requests reduced motion (`prefers-reduced-motion: reduce`) get a **static, vertically stacked presentation** of the showreel instead: no pinned track and no scroll-linked choreography. It must keep all the meaningful content, information and calls to action of the original: the opening promise and its two buttons, the three numbered cards (employers, candidates, network), the network text, the three service panels (healthcare, government, IT / finance / cyber, with their tags and lines), and the closing ask with its links and phone number.
- **The manual pause toggle does not switch layouts.** It keeps the existing semantics (`html[data-motion]`, `localStorage["xc-motion"]`, the visitor's choice wins): it freezes what moves on its own (shader time, the mark's sway, the marquee, cursor tilt, videos). It never swaps between the pinned and the stacked layout. The layout follows the OS setting only.
- **No layout shift, no script needed to pick the layout.** The OS setting is available to CSS on first paint, so the stacked layout and its dimensions are a `@media (prefers-reduced-motion: reduce)` branch in `Showreel.module.css`, in the server HTML, exactly as the geometry buckets already are. The track height rule (1358 / 1157 / 893 vh) does not apply in that branch. The engine reads the same media query and does not initialise the choreography (no listeners, no WebGL) when it matches, and tears down if the setting changes while the page is open.
- **Consequence to remember:** the layout keys on the OS setting alone, while the autonomous-motion preference lets a visitor's saved choice override the OS. So a visitor whose OS asks for reduced motion and who chooses "play" in the toggle still gets the stacked layout (with autonomous motion playing); a visitor whose OS does not ask for it and who chooses "pause" keeps the pinned layout with autonomous motion frozen.
- **No showreel Play control, and the saved choice does not override the OS here.** When the OS asks for reduced motion there is no control that starts the pinned choreography, and a saved manual "playing" choice (`xc-motion`) does not start it either: for the showreel's layout and choreography the OS setting has priority. (The toggle still governs autonomous motion everywhere else, with its existing semantics.) This refines the "consequence" bullet above where it implied the toggle matters to the showreel in this mode.
- **Status: implemented as an interim layout (5B-2 corrective pass); final styling is 5B-7.** The OS-reduced layout is a `@media (prefers-reduced-motion: reduce)` block at the end of `Showreel.module.css` that re-lays out the same server markup in normal flow, so it is chosen by CSS before first layout (no script, no hydration flash, no layout shift: measured 0). The engine starts in state `off` under that query and follows the setting live (see "Lifecycle"). Details and test results under "Interim reduced-motion layout"; spacing and styling are functional, not final.

## Withheld claim: "300,000+ profiles on file"

The figure is **withheld** from the showreel pending verification of its source, meaning and scope (what is counted, who holds the data, how current it is). The claims register is not changed by this; the register is the place that records verification status, and nothing here asserts evidence for the figure.

- Rendered wording before: heading "300,000+ / profiles on file", with the body "Every request is searched across it, plus job boards and referrals."
- Rendered wording now: heading **"Search." / "Then verify."**, body **"Every request starts with a search, including job boards and referrals."** followed by the unchanged "Then we interview and verify licenses, certifications, references and backgrounds." Both the visual text and the screen-reader text come from the same data (`SHOWREEL.sphereTop`, `sphereBottom`, `sphereBody` in `content.ts`), so neither carries the figure. The card's chip and headline ("03 Our network / Every placement starts here.") are unchanged.
- The figure still appears **outside the showreel** and was not touched here: `STEPS` ("Database 300K+", Process section), `STICKERS` ("Candidates on file 300K+", Record section) the Healthcare/Specialists proof rows in `SERVICE_PAGES` (inner pages, later stages), and the chat (its process card reads `STEPS`, its capability card reads `STICKERS`). Whether to withhold it there is a separate decision.
- Restoring it is a one-line change in `content.ts` once verified.

## What 5B-1 was (static stage)

`src/components/showreel/Showreel.tsx` (server component, no state, no effects) replaces the Stage 3 placeholder. It renders the whole stage from `content.ts` (`SHOWREEL`, `FUNCTIONS`, `CONTACT`): marquee, opening card, three carousel cards, the card-3 network scene, the SVG mark used for the dive, the closing frame, the carousel button and the "What we staff" panels. `Showreel.module.css` ports `css/showreel.css`.

**What the visitor saw after 5B-1:** the opening frame, pinned, for the whole track; nothing moved on scroll (see 5B-2 below for what changed), no WebGL was drawn (the five canvases are present and empty), the marquee loops (CSS, pause-aware), and the stage buttons and links work. The track already had its final height.

### Decisions built in

- **Frame 0 is CSS.** Every value the prototype's engine writes each frame is a known constant at scroll progress 0 (card sizes, transforms, z-indexes, letter states, opacities). They are written in the module under "FRAME 0" comments, so the server HTML is the correct opening frame with no script. The engine overwrites them with inline styles.
- **Geometry buckets are media queries**, not JS. Same rule as `pickBucket()`: landscape = desktop; portrait narrower than 640 = mobile; portrait up to 1024 = tablet; wider portrait = desktop. Track height: 1358 / 1157 / 893 vh. Measured against the prototype at 1440, 1920, 1024, 768, 640, 639, 390 and 1100x1400 (portrait): the track is the same height to the pixel at all of them.
- **Engine hooks are `data-sr="..."` attributes, scoped to the section**, never ids. Under Cache Components a hidden route's DOM stays in the document (checked: after navigating to `/about` the home stage is still in the DOM with height 0), so `document.getElementById` would find the wrong copy.
- **Media slots are placeholders.** The opening card's video, cards 01 and 02 and the three panel clips show the quiet placeholder (graphite or paper with the mark). The clips and portraits are stock with identifiable people and no confirmed releases (`docs/MEDIA.md`). No `<video>` or media file is referenced.
- **Mark geometry** moved from `IconSprite` into `src/lib/mark/geometry.ts` (data and pure functions), used by the sprite and by the showreel's server-rendered SVG mark. The sprite's rendered markup is byte-identical to before.
- **Accessibility markup:** split headings carry a screen-reader copy and the per-letter spans are `aria-hidden` (checked in the accessibility tree: headings read "Vetted. Credentialed. Ready.", "Search.", "Then verify."; no letter-by-letter nodes). Card headlines are `h3` (the prototype's `h4` skipped a level); the rotated caption is a paragraph.
- **Links:** `/contact` and `/capability` through `next/link`; "Request staff" and "Find a job" on the opening card are `#contact` and `#jobs`, handled by the shell's single Lenis instance.
- `data-chat-reel` is on the section: the chat launcher shrinks to its orb while the stage is on screen (checked).

### Behaviour that matches the prototype, recorded so it is not "fixed"

- The `#services` anchor lands the page 148 px above the pinned position (2 x the 58 px bar + the 32 px `scroll-padding-top`), so the stage slides into place. The prototype does the same (measured: 148 px in both). The Stage 5A report said "trackTop minus the bar"; that was imprecise.
- At frame 0 the three side cards are in the accessibility tree (opacity 1, `scaleX(0.0001)`), as in the prototype. The engine will set `visibility` as it does there.

## Stage 5B-2: timeline, DOM engine, Lenis post-frame subscription

### Files

| File | Role |
|---|---|
| `src/lib/showreel/timeline.ts` | Every animated value as a pure function of scroll progress `p` (0 to 1). No DOM, no state. Constants, geometry buckets, all scene formulas, the letter styles, `sceneVisibility` (for the WebGL stages). Ported verbatim from `landing-prototype-clean/js/showreel.js` lines 18 to 196 |
| `src/lib/showreel/engine.ts` | `createShowreelEngine(root)`: looks elements up once, applies the timeline to the DOM, owns the lifecycle |
| `src/components/showreel/ShowreelStage.tsx` | The one client component: renders the section (children are the untouched server markup) and owns the engine's lifetime in a layout effect |
| `src/components/showreel/Showreel.tsx` | Server markup (5B-1), now wrapped in `ShowreelStage`; adds `data-dim` on one closing-frame line and the closing-mark stand-in |
| `src/components/showreel/Showreel.module.css` | Adds the four CSS stand-ins for the WebGL visuals (below) |
| `src/lib/scroll/lenis.ts` | Adds `onScrollFrame`, `notifyScrollFrame`, `scrollFrameSubscribers`, `ScrollFrame` |
| `src/components/shell/LenisController.tsx` | One added line: `notifyScrollFrame(t)` straight after `lenis.raf(t)` in the existing ticker callback |

### Timeline responsibilities

`timeline.ts` answers "what is the value of X at progress p". It knows nothing about elements. The nine scenes in `v = p x 3700` units (exact formulas are in the file; this is orientation): opening card `phase1` (v 0 to 267), marquee in then out (to v 940), carousel formation `phase2` (200 to 300), rotation `phase3` (300 to 800) and fly-back `phase4` (to 1500), mark assembly (650 to 800), dive (810 to 1300), network sphere and aurora (aurora 1200 to 3250), service panels (1600 to 3100), closing frame (2800 to 3550, hold to 3700). Several formulas return CSS strings with `var(--sr-...)` terms (as the prototype's did); the letter functions fill a reused object instead of allocating one per letter. The geometry buckets (`GEO`, `BUCKET_QUERY`) are here too: the CSS module carries the same numbers and the engine picks the bucket with `matchMedia` on the same two queries, so CSS and JS cannot disagree.

### DOM ownership boundary

- **React owns the structure.** It renders every element once, on the server, with no inline styles and no state, and never re-renders the subtree (`ShowreelStage` has no state, its children are passed through).
- **The engine owns inline style properties and SVG attributes (`viewBox`, `transform`) on elements it finds by `data-sr` inside one root.** It never creates or removes nodes, never uses ids or document-wide selectors, and never touches anything outside the root. It remembers every value it writes, skips identical writes, and `release()` removes exactly what it wrote, so the CSS-only frame 0 comes back.
- **WebGL (5B-4 onward) will own the five canvases.** None is touched yet.
- Elements are looked up once. Required ones (the stage, cards, panels, the zoom mark, the closing frame) missing in development throw with the names; in production the engine logs one `console.error` and does not start. Optional ones (`aurora`, `portfolio`, `pf-track`, `target-mark`) are skipped when absent.
- Layout is measured on activation, on resize (debounced 120 ms, orientation 200 ms) and when the stage's parent changes size, never per frame. The service-panel pan distance (the prototype read `scrollWidth` every frame, forcing layout) is measured with the rest.

### Lenis post-frame subscription

`onScrollFrame(fn)` in `lib/scroll/lenis.ts`. The shared ticker already existed; `LenisController`'s callback is now `lenis.raf(t); notifyScrollFrame(t);`, so subscribers run in the same tick, right after Lenis has written that frame's scroll, whatever order unrelated effects mounted in.

- Returns an unsubscribe function. Several subscribers are supported. The same function subscribed twice is held once (a `Set`); its first unsubscribe removes it.
- Called every tick while subscribed, not only when the scroll changed (the engine eases the cursor tilt). Subscribers must unsubscribe when inactive.
- Safe to unsubscribe during a notification (a callback removed before its turn is not called); one added during a notification is called in the same pass. A throwing subscriber is logged and the others still run.
- The `ScrollFrame` argument (`time`, `scroll` = `window.scrollY` after `raf`) is reused: read it, do not keep it. No Lenis instance is exposed. Nothing is delivered while no `LenisController` is mounted.
- `html[data-scroll-frame-subs]` shows the subscriber count (written on subscribe and unsubscribe only, never per frame) for DevTools and leak checks; `scrollFrameSubscribers()` returns the same number.
- There is still one Lenis instance, one shared ticker and no other perpetual `requestAnimationFrame` loop (measured, see Verification).

### Lifecycle

State is mirrored on the section as `data-sr-state` (`idle`, `active`, `off`; removed on destroy).

| Event | What happens |
|---|---|
| Effect runs (first mount, React Activity show, Strict Mode re-run) | `createShowreelEngine(root)`: element lookup, one `IntersectionObserver` on the track (200 px margin, the prototype's "near"), one `matchMedia` listener. If the stage is near, it activates at once and renders the first frame from the **real** `scrollY` (restoration, deep links, returning to the page) |
| **Activate** (stage within 200 px of the viewport) | measure; subscribe to `onScrollFrame`; add `resize`, `orientationchange`, `pointermove` (passive), `visibilitychange`, a `ResizeObserver` on the stage's parent and the pause listener; render |
| **Deactivate** (stage far away, or its page hidden) | render one parked frame at the clamped end state (so a jump past the stage leaves nothing stale and the two fixed layers hidden), then remove every subscription and listener and disconnect the observer. An idle engine holds one IntersectionObserver and one media-query listener |
| **Pause** (motion toggle) | cursor tilt is ignored and eases back to rest; the marquee pauses in CSS. Scroll-linked motion continues, as in the prototype |
| **Tab hidden** | the browser stops `requestAnimationFrame`, so the shared tick stops; on return the engine re-renders |
| **OS reduced motion** | state `off`: the choreography never starts, regardless of a saved manual choice, and the CSS shows the stacked layout. Follows the setting live: turning it on releases the inline styles, turning it off activates if the stage is near |
| **Destroy** (effect cleanup: Activity hides the page, unmount, Strict Mode) | idempotent: detach everything, disconnect the observer, `release()` the inline styles. A hidden route therefore runs nothing; showing it again builds a fresh engine |

The engine is created in a **layout effect** so its first frame lands before the first paint after hydration, and the module is imported statically because it has no heavy dependency yet. When Three.js arrives (5B-4) it loads through a dynamic `import()` inside the engine, guarded against the engine having been destroyed before the import resolves (the `destroyed` state is already the guard).

### First paint, hydration, restoration

The server HTML is the correct opening frame (frame 0 in CSS) with the final track height, and nothing is hidden waiting for JavaScript on an ordinary visit, so a visit at the top has no layout shift (measured 0). Under OS reduced motion the stacked layout is also in the server HTML.

**Restored scroll positions (corrective pass).** The server HTML can only be frame 0. When the browser restores a position inside the reel, or lands on a `#hash`, that frame used to be painted at the restored position until hydration, and the engine's first frame then moved the layout (measured: about 1.5 s of the wrong frame under throttling, layout-shift score 0.054). Now:

- An inline script (`lib/showreel/preScript.ts`, first child of the section, so it runs before the stage's first paint) sets `data-sr-pre` on the section only when the navigation type is `reload` or `back_forward`, or the URL has a hash, and the OS has not asked for reduced motion. It reads no scroll position (the browser has usually not restored it yet) and starts no loop or listener. An ordinary visit (`navigate`, no hash) never gets the marker.
- CSS hides the stage while the marker is present: `visibility: hidden !important` on `.sticky`, everything in it, and the two fixed layers. `!important` is needed because the engine writes `visibility: visible` inline on the cards, which would otherwise show through a hidden parent (found by test). The section keeps its size and graphite background, so nothing moves.
- `ShowreelStage` lifts the marker after the engine's first frame, but only once the shell has published `--bar-h` (the opening card is sized from it; `SiteHeader` writes it a frame or so after hydration) and that layout has been rendered once: a one-shot `MutationObserver` on `<html>` plus one `requestAnimationFrame`, capped at 1.5 s. Neither is a loop. Lifting in the same frame `--bar-h` lands registered as a card shift in some runs.
- Failsafe: the marker removes itself after 10 s, so a page whose JavaScript never arrives shows the opening frame instead of an empty stage. Without JavaScript the script does not run and nothing is hidden.
- `suppressHydrationWarning` is on the section because the script adds an attribute before React hydrates (no warning in a development build, checked).

Result: on a reload or Back at a mid-reel position the stage is hidden until the engine's frame is ready, then appears already correct; the showreel contributes no layout shift. The total score is not zero: the remaining 0.008 to 0.02 comes from the header's dock and the chat launcher springs reacting to the restored scroll (Stage 2 components; their nodes are the only sources reported), which this pass does not touch. The trade-off is that on those loads the stage area is briefly empty (graphite) instead of showing a wrong frame. In-app Back/Forward (React Activity re-show) needed nothing: Next restores the scroll before the engine's effect, and no engine write happened at a stale scroll position.

The global scroll-restoration strategy is unchanged, as is the `#services` landing offset.

### Interim reduced-motion layout

How it works: under `prefers-reduced-motion: reduce` the CSS un-pins everything and lets the same markup flow in DOM order: the track and sticky stage become ordinary blocks, the 3D scene, carousel and rig become plain flex columns, every card, the network scene, the closing frame, the carousel link and the three service panels become static blocks with no transforms, masks, clip-paths or hidden states, and the frame-0 "invisible" states (letters at opacity 0, panels translated away, the closing frame hidden) are overridden. Decorative stage dressing is not rendered: marquee, aurora, backdrop, the opening card's video placeholder, the sphere stand-in, the dive mark, canvases, the closing mark. The engine never runs in this mode, so there is no pinned track, no scroll-linked motion and no control that starts it (the header's pause toggle still governs autonomous motion elsewhere but cannot start the choreography). Only the OS media query is consulted, so a saved manual choice cannot change it.

Content and order (DOM order = reading order = Tab order = visual order): opening promise with "Request staff" and "Find a job", the team pill and the certification line (the prototype hides these two on phones inside the pinned card; here they are plain content), the "Both sides of every hire" caption, the three numbered cards, "Search. / Then verify." with its two paragraphs, the closing ask ("One nurse. Or 120+ staff.", its lead, "Request staff", "Capability statement", the certificate and CAGE line, the phone link), "See how we staff", then the three service panels with their tags and lines. Headings keep their screen-reader copies and the letters stay `aria-hidden`.

Checked (Chromium, OS reduced motion emulated, with a saved manual "playing"): 48 of 48 content strings visible and hit-testable at 1440 and at 390 px; all 6 links focusable and visible, in an order that matches their visual order, no positive tabindex, no buttons in the showreel; the accessibility tree exposes the expected headings and names (opening headline, "Search.", "Then verify.", closing headline, the three panel titles, all link names) and sampled paragraph text; no horizontal overflow; layout shift 0 on load; turning the OS setting off and on while the page is open swaps the layout both ways with the engine releasing its inline styles. A screenshot of the 1440 and 390 render was inspected by eye.

Known gaps (for 5B-7): spacing and card proportions are functional; the opening headline is sized to fit its card rather than designed; the carousel link sits after the closing ask because that is where it is in the DOM; the stacked layout shows no media (placeholders only, as everywhere).

### CSS stand-ins for the WebGL visuals (temporary, deliberate)

Each stand-in that remains (the aurora, the sphere and the closing mark) is hidden by `.sr[data-gl="ready"]`, a flag the renderer stages are expected to set once their canvas draws.

| WebGL visual (stage) | Stand-in now |
|---|---|
| Opening card gradient (5B-4, **now WebGL**; this stays as its fallback) | `.hero` background: radial silver glow from below, red ember at the sides, on graphite (the card's palette) |
| Aurora (5B-5) | `.aurora` background: red glow along the top and bottom edges, faded by `auroraOpacity` like the shader would be |
| 34,000-point network sphere (5B-5) | `.sphereCanvasWrap::before`: a soft dotted globe with a red underside and an open centre, about 58vh across (the sphere's rest size), scaled by the engine's `sphereScale` |
| Closing gradient (5B-4, **now WebGL**; this stays as its fallback) | `.target` CSS gradient (already in the prototype as its no-WebGL fallback) |
| Closing 3D chrome mark (5B-6) | `.targetMark`: the brand mark (silver blades, red figure) at the right of the copy (top right on portrait), faded and scaled in by `markReveal` |

They keep the reel coherent; they do not reproduce the shaders' motion, particles, depth or the mark's extrusion and assembly.

### Complete in 5B-2

Timeline module; DOM engine for scenes 1 to 9 (marquee, carousel formation, rotation and fly-back, mark assembly, dive and portal, sphere scene and headings, aurora layer, service panels, closing frame and its copy, carousel button, opening-card cursor tilt); the post-frame subscription; lifecycle; the CSS stand-ins; the restored-scroll guard; the interim OS-reduced-motion layout and the engine's behaviour under it.

### Remaining

- **5B-3:** done (see "Stage 5B-3").
- **5B-5 and 5B-6:** the aurora, the network sphere and the closing chrome mark, and then `data-gl="ready"` on the section (5B-4 is done).
- **5B-7:** video; final styling of the reduced-motion layout; keyboard and screen-reader access to the panels, sphere text and closing frame **in the pinned reel** (they are hidden by `visibility` until the engine reveals them, as in the prototype; reduced-motion visitors now have them in the stacked layout, normal-motion assistive-technology users still do not).
- **5B-8:** final validation, GPU and device checks.

### Known limitations and fidelity gaps

- No shaders: the four visuals above are stand-ins; the mark does not extrude or assemble in 3D.
- Media slots are placeholders (clips and portraits are unapproved stock), so the opening card, carousel cards 01 and 02 and the three panels show the quiet placeholder instead of footage.
- The `viewBox` of the dive's SVG mark differs in text from the prototype's. The prototype's reset caps SVG width at the containing block (the card, 250 px at 390 wide), and it computed its `viewBox` from that width; here the SVG is the 100vw the showreel CSS specifies. Scale (px per mark unit) and centre are identical in both, and `overflow: visible` draws the same content, so the picture is the same; only the box differs.
- Block heading letters ("Search. / Then verify.") have a different letter count from the prototype's heading, so their per-letter delays differ with the wording (the formula is unchanged).
- In the pinned (normal-motion) reel the panels, sphere text and closing frame are hidden until the engine reveals them, so keyboard and screen-reader users of that layout cannot reach them (5B-7); the stacked layout under OS reduced motion exposes all of it.
- Cursor tilt and its easing are per frame, as in the prototype, so they depend on frame rate.
- On a reload, Back (new document) or `#hash` load the stage area is empty (graphite) until hydration instead of showing a wrong frame (above); that needs the inline script and is skipped under reduced motion.

### Deviations from the Stage 5A audit

- The audit proposed `onScrollFrame` as an additive hook; it is, with the contract above, plus the `data-scroll-frame-subs` diagnostic attribute (not in the audit).
- The audit said the engine would create its resources on approach; this stage has none yet, so "activation" is subscription and listeners. Contexts and `three` arrive in 5B-4.
- The audit listed a `data-sr-ready` first-paint guard that would hide the stage until the engine ran. It was first judged unnecessary, then the restoration flash showed a guard is needed in one case; the built guard (`data-sr-pre`, see "First paint, hydration, restoration") is narrower than the audit's: it applies only to reload, Back and `#hash` loads, never to an ordinary visit, and it lifts itself.
- Letter functions fill a reused object instead of returning a new one per letter (allocation only; same numbers).

## Verification (5B-2)

Done:

- `tsc --noEmit`, ESLint and `next build` pass.
- **Timeline against the prototype's own code:** the prototype's formula block (lines 18 to 196) was copied read-only into a scratch file and compared with `timeline.ts` over 4,003 scroll positions (including values outside 0 to 1), all three geometry buckets, five `vmin` values, every function, every constant and the three letter functions (formatted with the prototype's templates): 504,393 comparisons, 0 differences.
- **Live DOM against the prototype**, at 1440x900, 1024x768, 390x844 and 768x1024: 22 scroll positions each through the whole reel, comparing computed transform, opacity, visibility, filter, clip-path, mask, z-index and bounding rectangle of 25 elements, sampled letters and the closing-frame lines, plus the SVG mark's `viewBox`, blade and figure transforms. The two pages' effective scroll positions differ by at most 0.9 px (whole-pixel scroll against different fractional track tops), so tolerances scale with that. Result: only the SVG zoom box differs (documented above) and, at 1024, one bounding rectangle of a very large perspective-rotated element differing by about 1%, consistent with the sub-pixel scroll difference. The block-letter heading is excluded (different wording).
- **Visual side-by-side** at 1440 (p of 0, 0.19, 0.33, 0.47, 0.7, 0.85, 1.0): positions, rotation, dive timing, headings, panels and closing frame line up; the differences are the intended stand-ins and placeholders. 390 px screenshots were taken but only the 1440 series was inspected by eye; 1024 and 390 were checked numerically.
- **Lifecycle (production build, Chromium):** exactly one perpetual `requestAnimationFrame` callback (the shared ticker: 90 calls in 1.5 s idle, 80 active); `data-scroll-frame-subs` 1 while active and 0 otherwise; listener deltas while active exactly +4 (`resize`, `orientationchange`, `pointermove`, `visibilitychange`) and back to baseline when idle; 0 DOM writes in the stage while scrolling far from it and while its page is hidden; fixed layers hidden after leaving; 6 enter/leave cycles and 6 route round trips to `/about` and back with identical counts every time; reload mid-reel restores the identical frame; removing optional elements then re-creating the engine gave no errors; removing a required element gave one `console.error` and no engine; cursor tilt follows the pointer when playing and eases back and ignores it when paused; OS reduced motion gives state `off` with a saved "playing" choice, 0 writes, and follows live changes both ways (inline styles released).
- **Development build (Strict Mode):** after React's double setup/cleanup there is one subscriber and the same listener deltas; 3 round trips stable; no console errors.

Corrective pass (restoration guard, reduced-motion layout, lifecycle), all against the production build in Chromium unless noted:

- **Restoration guard:** reload with the page scrolled to p of 0.3 and 0.62, with CPU throttled 4x and about 1.5 MB/s: without the guard the stage showed a wrong frame for over 2 s and the score was 0.043 to 0.054; with it the stage is hidden until the engine's frame and no showreel node appears among the layout-shift sources (total 0.008 to 0.02, all header dock and chat launcher). A direct load on `#services` was clean in 8 of 8 runs after the last fix (an earlier version shifted in about one run in four; the causes, the inline `visibility: visible` and the `--bar-h` timing, are described above). An ordinary visit is untouched (no marker, score 0). Reload, `#hash` and Back to a new document (bfcache disabled at launch) all restored the identical frame. A development build produced no console output on a mid-reel reload (no hydration warning).
- **Reduced motion:** see the interim-layout section.
- **Real tab backgrounding** (a second tab activated through the DevTools protocol, which makes the first `hidden`): 0 `requestAnimationFrame` callbacks in 3 s while hidden, no DOM writes while hidden (the frame stayed the old one while the scroll position was changed), and on returning the frame equalled a normal visit to the new position, with the same subscriber and listener counts.
- **Back / Forward:** in-app (Activity): 3 cycles of away, Back, Forward, Back at p of 0.3: scroll restored exactly, frame identical, away state subs 0 and baseline listeners, back state 1 subscriber and +4 listeners every time, and 0 engine writes at a stale scroll position (0 of 135). Full document: restored scroll and identical frame both from the back/forward cache and as a new document (bfcache disabled).
- **`destroy()` and reactivation, with the real engine code:** the actual `engine.ts`, `timeline.ts`, `lenis.ts`, `motion.ts` and `geometry.ts` were transpiled with TypeScript and loaded in the page as modules, running on a clone of the stage so the live engine was left alone (the clone engine has its own copy of `lenis.ts`, so ticks were driven by hand). `destroy()` called 3 times on an active engine, twice after six leave/enter cycles, twice while idle, and twice after an OS flip: no throw each time, state `destroyed`, 0 subscribers, listeners back to baseline, no inline styles left, a tick after destroy changes nothing. Re-creating on the same root gave exactly 1 subscriber and +4 listeners, and six leave/enter cycles never accumulated either. An active engine whose OS setting switched to reduce went to `off` with 0 subscribers, baseline listeners and all styles released.
- **Normal motion regression:** the 1440 comparison against the prototype and the lifecycle smoke run were repeated after the changes with the same results as before.

Not done, or only approximated:

- Software-GL Chromium only: no real GPU, Safari, Firefox, real phone or screen reader (only the accessibility tree). Software rendering is slow enough that sampling had to wait for each page to render; no frame-rate or per-frame cost claims can be made, and no profile was taken.
- One run (full-document Back at p of 0.62, no source capture) reported a total shift of 0.035 that I could not reproduce in two re-runs with sources (which showed only the header dock and chat launcher); I have not explained it.
- The throttling profiles are emulated (CPU rate, network speed), not a real slow device.
- Tab backgrounding was done on a headless browser with a second tab; background throttling on a phone or a minimised window may differ.
- The reduced-motion layout was checked at 1440 and 390 px only; 768 and 1024 were not looked at.
- The 1920 and 640/639 px widths were checked for track height in 5B-1 but not re-compared frame by frame in 5B-2.

## Stage 5B-3: snap, navigation and focus

Source: `landing-prototype-clean/js/showreel.js` lines 1112 to 1244 ("horizontal snap", "vertical snap", the `focusin` handler), read from the code (not from the audit summary). The thresholds, stops and timings are unchanged; the deviations are listed below.

### Files

| File | Role |
|---|---|
| `src/lib/showreel/snap.ts` (new) | `createSnap(host)`: wheel, keyboard, hold and touch handling; `attachFocusJump(root, trackTop)`; the pure plan (`computeZones`, `computeVStops`, `SPHERE_REST`, `ease`) |
| `src/lib/showreel/engine.ts` | Creates the snap in `attach()` and destroys it in `detach()` (so it exists exactly while the engine is active); attaches the focus jump for the engine's whole non-reduced lifetime; refreshes the snap's panel layout whenever the engine re-measures |
| `src/components/showreel/Showreel.module.css` | `touch-action: pan-y pinch-zoom` on the pinned stage and the panel layer (`auto` in the reduced-motion layout) |
| `src/lib/scroll/lenis.ts` | (corrective pass) `SCROLL_INTERRUPT_EVENT` and `interruptScroll()`: a one-line signal, nothing scrolls or locks |
| `src/components/chat/Chat.tsx` | (corrective pass) one line in `setOpen`: calls `interruptScroll()` when the chat opens. Nothing else in the chat changed |

`timeline.ts` is untouched. There is no new loop, timer owner, Lenis instance or navigation system.

### What it does

Vertical scrolling stays continuous. Inside the pinned reel:

- **Sideways input steps the strip that is moving sideways** to its next or previous resting position: the carousel (four stops, one per card) or the "What we staff" panels (one stop per panel, plus the strip's end). At the first or last stop the input is swallowed and the page stays put.
- **A tap on Down/Up steps to the next or previous resting beat of the whole reel:** the opening card, the four carousel stops, the sphere once its text has settled, the panel stops and the closing frame (10 beats, so 9 taps from the opening card to the closing frame at all three sizes tested). Taps in quick succession chain from where the last one is heading. At the first or last beat the key is left to the browser, so the page carries on.
- **Holding Down/Up past the keyboard's repeat delay scrolls freely and smoothly** instead.
- Plain wheel, touch drag, and everything outside the reel are untouched.

### Input mappings and thresholds (all from the prototype)

| Input | Rule |
|---|---|
| Horizontal wheel (trackpad swipe) or shift + wheel | A gesture ends after 220 ms with no wheel event (trackpad momentum is swallowed until then). Deltas accumulate within a gesture (line-mode deltas count 16 px per line); at an accumulated magnitude over 30 it steps once and ignores the rest of the gesture. Needs the scroll position to be inside a sideways zone |
| Left / Right arrow | Steps the carousel or the panels, only inside a sideways zone |
| Down / Up arrow, tap | Steps to the next or previous beat, only while the scroll is inside the pinned track |
| Down / Up arrow, held | First press is a tap; repeats after it start a hold at 2.2 viewport heights per second with a 0.12 s ease-in and ease-out; it stops when the key is released, when the window loses focus, or when the reel is left |
| Touch | A single-finger swipe whose horizontal distance exceeds 50 px and 1.5 times its vertical distance steps; evaluated on touch end; only inside a sideways zone |
| Zones (timeline units) | Carousel 200 to 830 (stops at 300, 467, 633, 800); panels 1900 to 2740 (stops at the panels' own positions, measured from the DOM, plus the end at 2680) |
| Beats | 0, the four carousel stops, 1470, the panel stops, 3700 (stops closer than 10 units are merged) |
| Step timing | Sideways 0.9 s; vertical `0.5 + distance / 1400`, clamped to 0.9 to 2.4 s; cubic in-out easing |

### Scroll ownership and cancellation

- **There is no scroll engine in the snap.** Every scroll is a command to the one shared Lenis instance, followed through `onLenisChange` (it can appear after the snap and can be replaced). The hold loop runs on the shared post-frame tick (`onScrollFrame`), not on a requestAnimationFrame loop of its own, and subscribes only while holding.
- **A new snap supersedes the one in flight** (Lenis replaces its animation).
- **A tap's remembered destination is valid only while that tap's own Lenis command is still current** (corrective pass). Each vertical snap is tagged through `scrollTo`'s `userData`; Lenis replaces `userData` on every other `scrollTo` (an anchor click from `LenisController`, any programmatic scroll, the wheel), resets it when an animation completes, and sets `isScrolling` to `"native"` on a native scroll. Any of those ends the memory, so the next tap measures from where the page really is. The snap's own animation frames change none of it, so consecutive taps still chain. (Before, the memory was a bare timer.)
- **`cancelAll`** (the chat opening, a scroll lock, deactivation, destroy, the tab being hidden, a window blur, the Lenis instance going away) stops the hold, forgets the destination and, if any snap step (vertical or sideways) is still running, freezes it where it is. The freeze scrolls immediately to the current position plus a hundredth of a pixel: Lenis's `scrollTo` returns early, without stopping anything, when the target equals its `targetScroll`, which a running animation keeps equal to its position (found in the corrective pass: before it, the freeze was a no-op on desktop; on a phone the scroll lock's `stop()` happened to kill the animation). The nudge can move the page by up to one pixel when it fires.
- **The chat opening interrupts** (`interruptScroll()` from `Chat.tsx`'s `setOpen`): a snap or hold in progress stops where it is on desktop and phone alike, nothing resumes, and nothing snaps on close.
- **Locks:** when the page scroll is locked (`lenis.isStopped`, i.e. the phone chat sheet) the snap takes no input, and a lock that starts mid-snap or mid-hold stops it (Lenis's own `stop()` resets its animation); it does not resume on unlock.
- Listeners (`wheel` in the capture phase and non-passive, `keydown`, `keyup`, `blur`, `touchstart`, `touchend` on `window`, `visibilitychange` on `document`) exist only while the engine is active. `preventDefault` is called only when a step was taken or deliberately swallowed.
- **Under OS reduced motion nothing is attached** (the engine is `off`): no snap listeners and no focus listener.

### When the snap does not take the input

The event started inside a dialog, an element marked `data-lenis-prevent` (the chat panel and its rail) or the chat root `data-xc-chat` (its launcher and panel), or in an input, textarea, select or editable element; modifier keys (ctrl, alt, meta; shift on keys), ctrl + wheel (zoom), text composition, an event already handled; the page scroll is locked; the scroll position is outside the interaction's zone (the sideways inputs need a sideways zone, the arrows need the pinned track).

### Focus-into-view jump

The stage is pinned, so the browser's own scroll-into-view can leave a keyboard-focused control below the fold. When keyboard focus (`:focus-visible`) lands on something inside the showreel that is off screen (not within 8 px of the viewport), the page scrolls immediately to the stage's start once the browser's own scroll has settled (150 ms). It is attached for the engine's whole non-reduced lifetime (focus can arrive before the stage is near enough to activate; an idle engine re-measures first) and its timer is cleared on detach.

### Chat dialog

The chat root carries `data-xc-chat`, the panel is `role="dialog"` with `data-lenis-prevent`, and so is its horizontal rail; the snap steps back for wheel, key and touch events from any of them (the launcher included). The chat is otherwise unchanged apart from the one-line interruption signal.

- **Opening the chat interrupts the showreel's motion, consistently:** a vertical snap, a sideways step or a hold in progress freezes where it is, whether on desktop (where the page is not locked) or on a phone (where the sheet also locks the page). Nothing resumes, closing the chat leaves the scroll exactly where it was, and nothing snaps on close. The desktop chat is not modal and was not changed.
- **Keyboard:** with focus in the chat input, on a button in the dialog or on the launcher, arrow keys are not default-prevented by the showreel and the carousel does not move; typing works. The chat returns focus to its launcher when it closes, so after using the chat the arrow keys scroll natively (the browser's 40 px) until focus moves to the page; click the page or Tab away and the reel's own stepping returns (checked).
- **Wheel and touch:** a horizontal wheel over the dialog does not step; a wheel over an overflowing chat log scrolls the log (910 to 760) while the page and the reel stay put; on a phone the sheet locks the page, so keys, wheel and swipes do nothing, and closing restores the exact scroll position.
- Arrow keys with focus on the page (not in the chat) step the reel even while the desktop chat is open, since that dialog is not modal.

### Deviations from the prototype (deliberate)

1. **Attached only while the engine is active** (the prototype's listeners lived forever); the focus jump is the exception (above).
2. **The hold runs on the shared tick**, not on its own `requestAnimationFrame` loop; its first frame has dt 0.
3. **Input isolation is wider.** The prototype ignored arrow keys in inputs and inside `.xc-panel` only; a sideways trackpad swipe or touch inside the chat panel's rail was hijacked. Now wheel, key and touch all step back inside any dialog or `data-lenis-prevent`, and keys also check the focused element.
4. **A scroll lock is respected** (wheel, keys, touch and the focus jump), and cancels a hold or snap in progress.
5. **Step timing follows the site's motion preference** (`isPaused()`: 0.01 s when animations are paused or the OS asks, a saved "playing" choice wins) instead of the OS media query only (checked: 0.9 s playing, 0.01 s paused).
6. **No Lenis instance means no snap** (the prototype fell back to a native smooth scroll). The app always has one.
7. **`touch-action: pan-y pinch-zoom` on the pinned stage.** Without it Chrome also took the sideways drag as its history-navigation gesture (in touch emulation the page navigated back; the prototype does the same there). Vertical scrolling and pinch-zoom stay native. Not checked on a physical phone.
8. **Touch is single-finger only**; a vertical wheel or a touch start clears the remembered snap destination; a hidden tab or a blur ends a hold; destroy freezes a running snap (so it cannot carry on into the next page).
9. Modifier-key, composition and already-handled checks were added to the key handler; the focus jump skips while locked.
10. **Superseded destinations are detected** (the prototype kept a bare 2.4 s timer), **the chat opening interrupts** and **the freeze works**, as described under "Scroll ownership" (corrective pass).

### Verification (5B-3)

`tsc --noEmit`, ESLint and `next build` pass.

Against the prototype, same input sequences on both pages (CDP mouse wheel, key and touch events; where each lands in timeline units; tolerance 12 units): at 1440x900 12 scenarios, 1024x768 12 and 390x844 13 (including touch). The identical results include: wheel steps through all four carousel stops and back, the end swallowed; a 20 px wheel does nothing; shift + wheel; Left/Right; the ArrowDown beats from the top to the end and the ArrowUp beats back (9 steps each way); chained taps; the panel strip; a horizontal wheel between zones and ArrowDown or a wheel above the stage not default-prevented; and at 390 the touch swipes (a 150 px left swipe steps, right steps back, 40 px does nothing, a mostly vertical drag scrolls natively). 8 of 12 matched at 1440, 8 of 12 at 1024 and 11 of 13 at 390. The scenarios that differed are timing-dependent and not logic differences: the prototype's second wheel event 50 ms later was handled more than 220 ms later (its slower frames), so its gesture reset; mid-snap gestures and quick tap chains depend on where the animation is at that frame; once the prototype acted on a stale scroll position after a scripted `scrollTo`; and the hold covers far less distance than real life for both (frames run at a few per second in software GL, and the per-frame step is capped).

Deterministic checks of the real `snap.ts` and `engine.ts` (the actual files transpiled and run in the page against a fake Lenis, with synthetic events and frames): a tap targets the right stop at 0.9 s; the hold covers 2716 px in 1.5 s at 60 fps (analytic 2732) and coasts 220 px after release (expected about 238) then unsubscribes; a hold ends at the reel's end and coasts on past it as the prototype does; wheel thresholds (29 no, 31 yes, two lines, 20 + 20 in one gesture, later events ignored, a new gesture after 260 ms steps, ctrl + wheel and vertical wheel not taken, shift + wheel taken); key modifiers; isolation in an input, a dialog, a `data-lenis-prevent` element and an editable element, with a control on the body that does step; touch rules (50 px, the 1.5 ratio and its boundary, inside a dialog, while locked, between zones); `destroy()` three times mid-snap (the scroll is frozen), twice mid-hold, after 20 create and destroy cycles, with nothing handled afterwards and listeners and subscribers back to baseline.

Real page, production build: the focus jump goes to the stage start in both the near and the far-above case (prototype the same), does not move when the control is in view; reduced motion at load has 0 snap listeners, no focus listener, nothing default-prevented, and flips both ways live; 6 enter and leave cycles and 6 route round trips (+11 listeners and 1 subscriber while active: 4 engine, 7 snap; 0 idle; one focus listener); a route change 0.3 s after an ArrowDown tap, or while holding, leaves the next page still (scroll constant for 3 s, 0 subscribers); backgrounding the tab (a second tab activated) while holding cancels the hold (the scroll is frozen while hidden and does not drift on return) and a snap interrupted that way settles on a stop; clicking "Find a job" in the opening card while the snap is active scrolls to `#jobs`; plain vertical wheel above the stage scrolls; ArrowDown above the stage and ArrowUp or a horizontal wheel below it are not default-prevented.

### Corrective pass (stale destinations, chat interruption, keyboard)

- **Harness with a fake Lenis that mimics the real semantics** (`userData` replaced by every `scrollTo`, reset on immediate and on completion, `targetScroll` lagging, and the early return when the target equals `targetScroll`): consecutive taps chain (and many animation frames plus `scroll` events do not break it); an anchor-style smooth scroll, an immediate jump and a native scroll each make the next tap measure from the real position instead of the old destination; completion is harmless. The chat signal freezes a running vertical step and a running sideways step, stops a hold, clears the memory (the next tap measures from the frozen position) and causes no later scrolls; with nothing running it does nothing. The launcher inside `data-xc-chat` is not showreel input. The listener for the signal is added and removed with the snap.
- **Real page** (production build): the chat opened 250 to 800 ms into a vertical snap freezes it mid-flight on desktop (for example at 2379 and 2291, the destination being 2701) and holds there for 2 s and through closing; before the freeze fix the same test let the snap finish. On a phone the same test froze or never moved, with no resume. A sideways step in flight and a hold in progress also stop when the chat opens, and nothing moves on close. Navigating away 0.3 s after an ArrowDown tap now leaves the next page at scroll 0 (before: 429, the snap carrying on).
- **Keyboard:** arrow keys with focus on the chat launcher, in the chat input and on a dialog button are not default-prevented and do not step the reel (typing works); with focus on the page, ArrowRight is a real step. The stepping scenarios against the prototype were re-run at 1440 after the changes (10 of 12 identical; the other two are the slow-frame hold and the prototype's stale-state artefact, as before). The lifecycle counts (6 cycles, 6 route round trips) are unchanged apart from the extra listener (12 while active, 0 idle).
- **Focus jump:** unchanged and re-verified earlier (keyboard focus off screen jumps to the stage start, matching the prototype; in view does not move). The pointer-focus branch is still untested (below).

### Not tested, and limitations

- **No physical touch hardware**: touch is Chrome's touch emulation through the DevTools protocol. No real trackpad (momentum streams), no macOS back-swipe, no Safari, no Firefox, no real keyboard-only or screen-reader session (key events were dispatched through the protocol).
- **Software-GL Chromium renders a few frames per second**, so the real-time feel of snap timing and the hold speed was not assessed in the page; the hold's speed is verified only with synthetic 60 fps frames.
- The pointer-modality branch of the focus jump (a click that focuses a control must not jump) could not be exercised: Chrome reports a scripted `focus()` as `:focus-visible` even after a mouse click. The branch is the prototype's, read but not run.
- The tablet geometry bucket (portrait 640 to 1024 wide) was not run for snap (1440, 1024 landscape and 390 were).
- Interrupting a snap (the chat opening, or any `cancelAll`) leaves the page where it is, which is usually between two stops; the next tap steps to the next beat from there. By design, on desktop and phone alike.
- The freeze nudges the scroll by a hundredth of a pixel, which can move the page by one pixel.
- The chat's focus return to its launcher means arrow keys scroll natively after the chat closes until focus moves (above).
- Sideways wheel and touch inside the reel that are not in an isolated element are taken even over ordinary page content (as in the prototype).

## Stage 5B-4: WebGL infrastructure and the two gradients

Source: `landing-prototype-clean/js/showreel.js` (`GRADIENT_FRAG`, `CLIP_VERT`, `makeHeroGradient`, and how `initShowreel` creates, gates and draws them), read from the code.

### What is WebGL now, and what is still a stand-in

| Scene | Now |
|---|---|
| Opening card gradient (`hero-canvas`) | **WebGL** (the pointer pulls it, as in the prototype). The CSS gradient on `.hero` stays underneath as the fallback |
| Closing frame gradient (`target-bg`) | **WebGL** (no pointer pull). The CSS gradient on `.target` stays underneath as the fallback |
| Aurora (`aurora-canvas`) | CSS stand-in (5B-5) |
| Network sphere (`sphere-canvas`) | CSS stand-in (5B-5) |
| Closing 3D mark (`target-canvas`) | CSS stand-in `targetMark` (5B-6) |

`data-gl="ready"` on the section (which hides the three remaining stand-ins) is **not** set: they are still the only picture. The gradients use a different flag, `data-gl` on each canvas.

### Files

| File | Role |
|---|---|
| `src/lib/showreel/gl/shaders.ts` | `GRADIENT_FRAG` and `CLIP_VERT`, extracted mechanically from the prototype (lines 333 to 434) and checked byte-identical to its output |
| `src/lib/showreel/gl/three.ts` | `loadThree()`: a cached dynamic `import("three")` (a failed import is not cached) |
| `src/lib/showreel/gl/scene.ts` | The contract of one scene (`render`, `redraw`, `resize`, `lost`, `dispose`) and its hooks |
| `src/lib/showreel/gl/gradient.ts` | `createGradientScene`: the port of `makeHeroGradient`, used twice |
| `src/lib/showreel/gl/manager.ts` | `createGlManager(root)`: the scene table, lazy creation, the virtual clock, drawing gates, context-loss state, fallback attributes, canvas replacement |
| `src/lib/showreel/engine.ts` | Creates the manager in `attach()`, destroys it in `detach()`, ticks it from `onFrame`, forwards resize and tab-visible |
| `src/components/showreel/Showreel.module.css` | Canvas visibility by `data-gl`; a note that the section flag is still unset |

Three.js is a dynamic import, so it is a separate chunk (about 724 KB) that is not in the initial HTML, and it is requested only when a scene is first needed.

### Ownership, scheduling and lifecycle

- **One manager per active engine.** It exists exactly while the engine holds its subscription to the shared tick, so reduced motion (engine `off`), a hidden route and a stage far from the viewport have no manager, no Three.js, no renderer and no context. It has no loop, timer or listener of its own; `frame(t, p)` runs from the engine's `onScrollFrame` callback, after the DOM frame, with the same scroll progress, only while the stage is near.
- **A scene exists only where the timeline needs it.** The opening gradient is created at v below 1600 and drawn while `sceneVisibility(p).hero`; it is disposed past v 1900. The closing gradient is created from v 2600 and drawn once the closing beat is active (v above 2799); it is disposed below v 2400. The ranges leave gaps, so at most one gradient exists at a time and sitting on a boundary does not create and destroy it repeatedly. Scenes are created when first needed, not at load (the prototype created all five at load).
- **Drawing:** the prototype's gates are kept: a scene draws while its range is active; while animations are paused the virtual clock stands still and a scene redraws only when the scroll position changed or it was invalidated (resize, restore, tab visible). The gradient keeps its ~36 fps cap and its pointer easing.
- **One renderer per canvas, and the canvas is replaced after dispose.** A disposed renderer's context is lost for good (the same canvas would hand back the dead context), so dispose swaps in an empty clone of the server-rendered canvas. Canvases are looked up by `data-sr` in the engine's root each time. The canvas count stays at 5.
- **Dispose** marks the scene disposed and removes its listeners first, then frees geometry, material and renderer and forces the context loss (skipped when it is already lost), so nothing that happens during or after teardown can bring the scene back.
- **Creation is asynchronous** (Three.js loads on demand). It re-checks that the manager is still alive and that the timeline still wants the scene after the import resolves; a destroy that races it creates nothing.
- **Destroy** (deactivation, Activity hide, unmount, reduced motion switching on) is idempotent and disposes every scene.

### Fallback and context loss

The CSS gradients underneath are always present; the canvas is opacity 0 unless `canvas[data-gl="live"]`.

| `data-gl` | Meaning | Shown |
|---|---|---|
| absent | no scene | CSS fallback |
| `pending` | created and drawn once, not yet shown | CSS fallback |
| `live` | drawing | the canvas, faded in over 0.9 s |
| `lost` | context lost | CSS fallback at once (no transition) |
| `failed` | could not be created | CSS fallback; not retried until the next activation |

- **Context loss:** the default is prevented (the scene can recover), drawing stops, the canvas hides. On restoration Three.js re-initialises and recompiles, the scene redraws at once and is shown again on the next frame, if it still exists. If the scene was disposed meanwhile, nothing happens.
- **Creation failure** (no WebGL, a context that is lost at creation, or the Three.js chunk failing to load) is caught, logs one `console.warn`, leaves the CSS fallback and is not retried every frame; a later activation retries.
- **No blank frame:** the scene draws once before it is shown, and a canvas is shown only after a drawn frame.

### Deviations from the prototype

1. Scenes are created on demand and disposed (the prototype created all five renderers at load and never freed them).
2. The renderer no longer owns window listeners or a loop: resize comes from the engine's debounced re-measure (120 ms) instead of an immediate `resize` listener; the pointer listener exists only while the opening gradient does.
3. Context loss is handled (the prototype did not); a disposed scene's canvas is replaced.
4. The fade-in is driven by `data-gl="live"` set on the frame after the first drawn frame (the prototype used a one-shot `requestAnimationFrame`); the fade is the same 0.9 s.
5. The prototype drew the closing gradient only after `closeActive`; creation here starts 200 units earlier (v 2600), the prototype's own `sceneVisibility` margin.

### Verification (5B-4)

`tsc --noEmit`, ESLint and `next build` pass.

- **Shaders:** `GRADIENT_FRAG(true)`, `GRADIENT_FRAG(false)` and `CLIP_VERT` are byte-identical to the prototype's.
- **Visual comparison with the prototype** (Chromium with software GL; the gradients are animated, so positions of the glow differ with the animation phase and a pixel comparison is not meaningful): at 1440x900, 1024x768 and 390x844 the canvas buffer is the viewport size in both pages (pixel ratio 1, CSS-stretched over the card) at four timeline positions (v 0, 300, 3000, 3700). Mean colour agrees closely (opening gradient at v 0, 1440: 108,96,99 in both; average per-cell difference 1.5 to 4.7 at 1440 and 1024, up to 13.6 at 390 where the glow's phase matters more; the closing gradient 8 to 23). I looked at the 1440 screenshots: same palette, same structure (graphite room, red embers at the sides, silver spotlight from below). At v 3000 the pink glow on the Next side is the aurora CSS stand-in above the page, still intentionally in place. Not compared pixel-for-pixel: 390 and 1024 screenshots were compared numerically only.
- **Lifecycle (production build):** the hero scene appears at v 0, is released at v 1900; the closing gradient is created at 2650, shown at 2850, released at 2300; at most one scene exists. 8 enter/leave cycles and 5 route round trips: canvases always 5, contexts created equal contexts lost (13 and 13), listeners constant, subscribers 1 and 0, Shader, Buffer, Program and VertexArray creates equal deletes. Hidden route: 0 draw calls in 3 s. Tab backgrounded (second tab activated): 0 draw calls while hidden, the scene is kept, drawing resumes on return.
- **Failure and loss (page and real manager code with Three.js loaded from a local server):** creation failure (`getContext` returning null): `data-gl="failed"`, CSS fallback shown, one warning, no retry in 30 frames or 3 s, retried and live after leaving and re-entering the stage. `WEBGL_lose_context.loseContext()`: `lost`, canvas hidden at once, 0 draw calls while lost, 0 console output; `restoreContext()`: live again and drawing, program recompiled. Loss followed by navigation, by leaving the stage, or by destroy: restoring the old context afterwards draws nothing and brings nothing back. `destroy()` three times, a destroy racing creation (0 contexts created), a destroy while lost, 10 create and destroy cycles on one root (10 contexts created, 10 lost), and the Three.js chunk failing to load: all safe.
- **Reduced motion:** from load, 0 `getContext` attempts, 0 draw calls, canvases `display: none`; switching the OS setting off creates the scene when the stage is near, switching it back on disposes it (context lost) and stops all drawing.
- **Layout shift:** over a full walk through the reel the total is the same with WebGL (0.3185) and with it unavailable (0.3189), and no canvas is a shift source (the total is the reel's own choreography).
- **Hand-off:** at 4x CPU throttle the canvas goes `data-gl` absent, then `live` and fades in; brightness over the card's glow never dips below the fallback's own level (no blank frame).
- **Regression:** carousel keys, wheel and all ArrowDown beats unchanged (300, 467, 633, 800, 1470, 2000, 2465, 2680, 3700); listener delta while active is +13 (4 engine, 8 snap, 1 pointer-follow); the aurora, sphere and closing-mark stand-ins and the CSS they depend on are unchanged.

### Not tested, and limitations

- **Software GL only** (SwiftShader in headless Chromium). No real GPU, no frame-rate or GPU-memory measurement, no Safari, Firefox or mobile browser, so context limits, real context-loss behaviour under memory pressure and mobile GPU behaviour are untested. No claim is made about a safe number of contexts: the design keeps at most one WebGL scene alive at a time (two more arrive in 5B-5 and 5B-6, which the manager's table is designed for), and that is what was measured.
- **Context loss was simulated** with `WEBGL_lose_context`, not caused by the browser or driver; a loss that happens while a scene is being created was not provoked.
- **Three.js internals:** each renderer creates 4 textures and 3 framebuffers at construction that `renderer.dispose()` does not delete (Three.js behaviour); they are freed by the forced context loss. Programs, shaders, buffers and vertex arrays are deleted explicitly and balance.
- **Resize** goes through the engine's 120 ms debounce, so for a moment after a window resize the buffer keeps the old size (stretched by CSS), as the prototype's own debounced layout did.
- The gradients are animated and not deterministic in time, so fidelity is judged by colour statistics and by eye, not pixel equality.
- The first appearance of a scene waits for the Three.js chunk (about 724 KB, requested when the stage first needs a scene): on a slow connection the CSS fallback shows until it arrives.
- A test-only artefact: Three.js itself logs a `console.error` when the context cannot be created (the failure test), and Chromium warns when a test calls `restoreContext()` on an already-dead context; neither appears in normal operation.

## What was not done in 5B-1, on purpose (historical)

Scroll engine and Lenis frame hook (now done in 5B-2), snap, WebGL (hero gradient, aurora, sphere, closing gradient, chrome mark), video, the reduced-motion presentation, the `data-sr-ready` first-paint guard (only needed once an engine can restore a mid-reel position), and context-loss handling. The panels, the closing frame and the dive are hidden by CSS until the engine drives them, so a keyboard or screen-reader user cannot reach their text yet; the static reduced-motion presentation (below, Stage 5B-7) is where that content is exposed to users who ask for reduced motion. Until it is built this is the same for every visitor, and is not a regression.

## Verification (5B-1)

`tsc --noEmit`, ESLint and `next build` pass. Compared with the prototype at eight viewports (opening-frame rectangles, opacities and visibility of the card, slider, headline, lead, buttons, carousel button, side cards and backdrop all within 1.5 px; track heights identical). No horizontal overflow at any of them. Console: only the known "preloaded but not used" CSS notice. Marquee pauses with `html[data-motion="paused"]` and starts paused under OS reduced motion. Client navigation to `/about` and back leaves the stage intact. Not checked: a real GPU (no WebGL is drawn yet), Safari, real phones, a screen reader (only the accessibility tree).

Out of scope, noticed: the hero's heading reads "PEOPLE BEHIND THECARE" in the accessibility tree (a missing space between the last two words; Stage 3 code).
