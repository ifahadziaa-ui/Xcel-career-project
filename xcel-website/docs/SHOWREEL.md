# Showreel (migration Stage 5)

Source of truth for behaviour: `landing-prototype-clean/js/showreel.js` and `css/showreel.css`. The audit that planned this stage (nine scenes, five WebGL renderers, lifecycle) was delivered as the Stage 5A report; this file records what has been built.

## Status

| Step | State |
|---|---|
| 5B-1 Static stage | **Done.** This file |
| 5B-2 Timeline, DOM engine, Lenis post-frame subscription | **Done**, plus a corrective pass (restoration guard, interim reduced-motion layout, lifecycle checks). See "Stage 5B-2" |
| 5B-3 Snap, navigation and focus | **Done.** See "Stage 5B-3" |
| 5B-4 WebGL infrastructure and the two gradients | **Done.** See "Stage 5B-4" |
| 5B-5 Aurora and network sphere | **Done.** See "Stage 5B-5" |
| 5B-6 Closing 3D mark | **Done.** See "Stage 5B-6". All five WebGL effects now exist |
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

Each stand-in is hidden by its own renderer once that renderer draws: all five (the opening and closing gradients, the aurora, the sphere and the closing mark; 5B-4 to 5B-6) step aside per canvas (`canvas[data-gl="live"]`) and come back at once on loss or failure. The section flag `.sr[data-gl="ready"]` that earlier notes anticipated is **not used and not set**: the per-canvas state replaced it.

| WebGL visual (stage) | Stand-in now |
|---|---|
| Opening card gradient (5B-4, **now WebGL**; this stays as its fallback) | `.hero` background: radial silver glow from below, red ember at the sides, on graphite (the card's palette) |
| Aurora (5B-5, **now WebGL**; this stays as its fallback) | `.aurora::before`: red glow along the top and bottom edges, faded by `auroraOpacity` like the shader would be |
| 34,000-point network sphere (5B-5, **now WebGL**; this stays as its fallback) | `.sphereCanvasWrap::before`: a soft dotted globe with a red underside and an open centre, about 58vh across (the sphere's rest size), scaled by the engine's `sphereScale` |
| Closing gradient (5B-4, **now WebGL**; this stays as its fallback) | `.target` CSS gradient (already in the prototype as its no-WebGL fallback) |
| Closing 3D chrome mark (5B-6, **now WebGL**; this stays as its fallback) | `.targetMark`: the brand mark (silver blades, red figure) at the right of the copy (top right on portrait), faded and scaled in by `markReveal` |

They keep the reel coherent; they do not reproduce the shaders' motion, particles, depth or the mark's extrusion and assembly.

### Complete in 5B-2

Timeline module; DOM engine for scenes 1 to 9 (marquee, carousel formation, rotation and fly-back, mark assembly, dive and portal, sphere scene and headings, aurora layer, service panels, closing frame and its copy, carousel button, opening-card cursor tilt); the post-frame subscription; lifecycle; the CSS stand-ins; the restored-scroll guard; the interim OS-reduced-motion layout and the engine's behaviour under it.

### Remaining

- **5B-3:** done (see "Stage 5B-3").
- **5B-5:** done (see "Stage 5B-5").
- **5B-6:** done (see "Stage 5B-6"). The section flag `data-gl="ready"` was dropped in favour of per-canvas states.
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

- **Software GL only** (SwiftShader in headless Chromium). No real GPU, no frame-rate or GPU-memory measurement, no Safari, Firefox or mobile browser, so context limits, real context-loss behaviour under memory pressure and mobile GPU behaviour are untested. No claim is made about a safe number of contexts: the 5B-4 design kept at most one WebGL scene alive at a time; 5B-5 raises that to three (see "Stage 5B-5").
- **Context loss was simulated** with `WEBGL_lose_context`, not caused by the browser or driver; a loss that happens while a scene is being created was not provoked.
- **Three.js internals:** each renderer creates 4 textures and 3 framebuffers at construction that `renderer.dispose()` does not delete (Three.js behaviour); they are freed by the forced context loss. Programs, shaders, buffers and vertex arrays are deleted explicitly and balance.
- **Resize** goes through the engine's 120 ms debounce, so for a moment after a window resize the buffer keeps the old size (stretched by CSS), as the prototype's own debounced layout did.
- The gradients are animated and not deterministic in time, so fidelity is judged by colour statistics and by eye, not pixel equality.
- The first appearance of a scene waits for the Three.js chunk (about 724 KB, requested when the stage first needs a scene): on a slow connection the CSS fallback shows until it arrives.
- A test-only artefact: Three.js itself logs a `console.error` when the context cannot be created (the failure test), and Chromium warns when a test calls `restoreContext()` on an already-dead context; neither appears in normal operation.

## Stage 5B-5: the aurora and the network sphere

Source: `landing-prototype-clean/js/showreel.js`, read from the code: `AURORA_VERT/FRAG`, `SIMPLEX3`, `SPHERE_VERT/FRAG` (lines 436 to 571), `glCanvas`, `clipPlane`, `makeAurora`, `makeSphere` (577 to 711), `auroraOpacity`, `sphereDisperse`, `sceneVisibility`, the adaptive-resolution governor (941 to 967) and how `initShowreel` draws them (1099 to 1108).

### What is WebGL now

| Scene | Now |
|---|---|
| Opening card gradient (`hero-canvas`) | WebGL (5B-4) |
| Aurora (`aurora-canvas`) | **WebGL (5B-5)**. The CSS glow `.aurora::before` stays underneath as the fallback |
| Network sphere (`sphere-canvas`) | **WebGL (5B-5)**. The CSS dotted globe `.sphereCanvasWrap::before` stays underneath as the fallback |
| Closing frame gradient (`target-bg`) | WebGL (5B-4) |
| Closing 3D mark (`target-canvas`) | CSS stand-in `targetMark` (5B-6); `data-gl="ready"` on the section is still not set |

### What each scene is, and who owns what

- **Aurora.** A full-screen clip-space quad with `AURORA_FRAG`: a domain-warped (`warp3d`) signal-red band, shaped by `smoothstep`s so it hugs the top-left and bottom-right edges, written with a computed alpha (premultiplied over the stage). It is a **fixed layer**: the engine owns its container's `opacity` (`auroraOpacity`: in over v 1200 to 1550, out over v 2900 to 3250) and `visibility` (only while the stage is pinned); the renderer owns the canvas. `u_time` is the showreel's virtual clock in seconds (the shader multiplies it by 1.5). Pixel ratio `min(devicePixelRatio, 2)`, transparent, no antialiasing, a draw on every tick the manager asks for (no frame cap, as in the prototype).
- **Sphere.** 34,000 points (`N = 34000`, unchanged) on a Fibonacci sphere of radius 1, one `Points` object with `ShaderMaterial` (additive blending, no depth test or write), a 50 degree perspective camera at z 3.8. `SPHERE_VERT` displaces each point with two octaves of 3D simplex noise, opens a small hole at the centre for the mark (an HTML element, `core`), and blows the points outwards by the uniform `uDisperse` (`sphereDisperse`: 0 at v 1200, 1 at v 1800, as the service panels arrive); `SPHERE_FRAG` draws soft round sprites: silver globe, signal-red underside, near-white rim, bloom at the caps. The group turns slowly (y 0.12 rad/s, x `sin(0.1 s) * 0.12`). Its position, scale and fade are DOM (the engine's `sphereScene`, `sphereWrap` transforms and the black panel's portal clip); the canvas fills a 100vw by 100vh box. Pixel ratio `min(max(devicePixelRatio, 2), 3)`: **never below 2 at full quality** (as in the prototype), and a draw on every tick.
- **Shaders** are in `gl/shaders.ts`, extracted mechanically from the prototype and checked **byte-identical** (`CLIP_VERT`, `AURORA_VERT`, `AURORA_FRAG`, `SIMPLEX3`, `SPHERE_VERT`, `SPHERE_FRAG`, `GRADIENT_FRAG` both variants).
- **Ownership** is as in 5B-4: one renderer per canvas, created, drawn and disposed by the one manager from the engine's `onScrollFrame`; no new manager, loop, timer or scroll engine.

### Files

| File | Change |
|---|---|
| `src/lib/showreel/gl/shaders.ts` | The aurora and sphere shaders and `SIMPLEX3` appended (prototype lines 436 to 571) |
| `src/lib/showreel/gl/host.ts` | **New.** The renderer plumbing both scenes share: transparent renderer, buffer from the canvas's layout box, adaptive pixel ratio, context-loss handling, teardown, and `assertProgramLinked` |
| `src/lib/showreel/gl/aurora.ts`, `sphere.ts` | **New.** `createAuroraScene`, `createSphereScene` (`SPHERE_POINTS = 34000`) |
| `src/lib/showreel/gl/scene.ts` | `render(t, v)` and `redraw(v?)` take the scene's timeline value; optional `setQuality`; `hooks.quality()` |
| `src/lib/showreel/gl/manager.ts` | Two more scene specs (`sphere`, `aurora`), `drive` (the sphere's dispersal), the adaptive-resolution governor, `root[data-quality]` |
| `src/lib/showreel/gl/gradient.ts` | One addition: the shader-link check below (a latent gap in 5B-4, fixed with the same helper) |
| `src/components/showreel/Showreel.module.css` | The aurora and sphere canvases (hidden unless `data-gl="live"`), the two stand-ins fading out per canvas; the aurora glow moved from `.aurora`'s background to `.aurora::before` so it can fade independently |

`engine.ts`, `timeline.ts`, `snap.ts`, the Lenis files and the markup are **unchanged**.

### Timeline ranges (v = p x 3700, from the prototype's `sceneVisibility`)

| Scene | Created | Drawn | Disposed |
|---|---|---|---|
| Opening gradient | v < 1600 | v < 1600 (`gp < 0.8`) | v > 1900 |
| Sphere | 590 < v < 3300 | **790 < v < 3100** (`gp > 0.395`, up to the end of the service panels) | v < 390 or v > 3400 |
| Aurora | 800 < v < 3450 | **1000 < v < 3450 and `auroraOpacity > 0`, i.e. 1200 < v < 3250** | v < 600 or v > 3550 |
| Closing gradient | v > 2600 | v > 2799 | v < 2400 |

The drawn ranges are the prototype's exactly. Creation starts about 200 v (roughly one screen of scrolling) ahead and disposal 100 to 200 v after, so a reader hovering at a boundary does not create and destroy a scene repeatedly (scrubbing back and forth across v 500 to 700 and 3300 to 3600 created 6 contexts in all: the 4 scenes of the walk, plus the sphere and the aurora once more on the way back, and none repeatedly at a threshold). **At most three scenes exist at once** (hero, sphere, aurora between v 800 and 1900; sphere, aurora, closing gradient between v 2600 and 3300), against all five the prototype kept for the page's whole life; 5B-6 adds the closing mark's. No assumption is made about a safe context count; see the limitations.

### Adaptive resolution (ported, scoped to these two scenes)

The prototype lowers the pixel ratio of the aurora and the sphere (never the gradients or the closing frame) when frames stay slow: levels 1, 0.75, 0.6, 0.5 of the base ratio, never below 0.6 absolute; an exponential average of the frame time above 28 ms for 1.5 s steps down, below 14 ms for 8 s steps back up (once, and not again if going up made it slow). It is in the manager now (`governed: true` on the two specs), fed by the frame times of the shared tick, **only while a governed scene draws and animations are not paused** (the prototype also measured during the gradient-only stretch of the reel, so it could lower the quality of a scene that did not exist yet). A scene created after the level was lowered starts at that level (`hooks.quality()`). The level is `root[data-quality]` (0 = full). It starts at 0 each time the engine activates. At full quality a 1440x900 viewport at devicePixelRatio 1 gives a **2880x1800 sphere buffer** and a 1440x900 aurora buffer (measured; 2048x1536 / 1024x768 at 1024x768, 780x1688 / 390x844 at 390x844).

### Fallback, context loss, failure

Same states as 5B-4 (`data-gl` absent, `pending`, `live`, `lost`, `failed`). The CSS stand-in of the aurora and the sphere fades out over 0.9 s while the canvas fades in (selector `:has(canvas[data-gl="live"])`), and is back **at once** when the state leaves `live` (loss or failure), because only the way out has a transition. The stand-ins are therefore never visible together with a live canvas for longer than the crossfade.

- **Shader failure:** Three.js does not throw when a shader fails to compile or link; it logs and draws nothing, which would have hidden the fallback behind an empty canvas. `assertProgramLinked` (host.ts) checks the program's `LINK_STATUS` after the warm-up draw; a broken program makes creation fail, the scene is disposed, its context released, the canvas replaced, `data-gl="failed"` set, one `console.warn` logged and the CSS fallback stays. The same check was added to the 5B-4 gradient, which had the same gap.
- **Failure in one scene does not touch the others** (tested: each of hero, aurora and sphere broken in turn).

### Deviations from the prototype

1. Scenes are created on demand and disposed (the prototype created all five at load and never freed them); at most three exist at once.
2. No `ResizeObserver` per canvas: the two canvases fill the viewport (or a viewport-sized box), so their layout size changes only with the window; the engine's one debounced resize (120 ms) calls `resize()`. The drawing buffer therefore keeps its old size for up to 120 ms after a window resize, stretched by CSS (the prototype resized at the next ResizeObserver callback).
3. Context loss is handled, a disposed scene's canvas is replaced and the shader link is verified (none of this was in the prototype).
4. Adaptive resolution measures only while a governed scene draws (see above) and is not carried across engine activations.
5. The fade-in uses `data-gl="live"` and CSS (the same 0.9 s) instead of the prototype's one-shot `requestAnimationFrame`; the aurora was always visible in the prototype's canvas (its container's opacity did all the work), here the canvas is also faded in from the first drawn frame, over the container's own timeline fade.
6. The sphere is drawn on every tick of its range as in the prototype, **including v 2000 to 3100, where the black panel that carries it has left the screen** (its transform lifts it by 100vh between v 1600 and 2000). That is the prototype's range and is kept; see "Measurements" for why it matters. A possible, not applied, saving is to stop drawing (and release) the sphere once the panel is gone.

### Measurements (production build, Chromium 1254, **software GL (SwiftShader)**, 1440x900)

- **Geometry and buffers:** sphere: 34,000 points, `position` 408,000 B (Float32 x 3) + `aRand` 136,000 B = 544,000 B (531 KiB), uploaded once at creation. Aurora: the 2 x 2 plane (48 + 48 + 32 + 12 B).
- **Draw calls per rendered frame:** sphere 1 (`drawArrays(POINTS, 0, 34000)`: all 34,000 points are drawn, none culled or reduced); aurora 1 (`drawElements(TRIANGLES, 6)`). The two gradients 1 each.
- **Render frequency:** one draw per shared-tick frame for each scene in its range (the sphere and aurora have no frame cap, as in the prototype; the gradients keep ~36 fps). In software GL the tick runs at about 4 to 5 frames per second with three scenes, so the numbers are 1 draw per tick, not frames per second.
- **Only while active:** v 0 draws only the hero (other canvases 300x150, no context); at v 3700 only the closing gradient exists (aurora and sphere disposed); animations paused and the scroll position still: **0 draw calls** in 5 s; tab backgrounded: 0 draws in 3 s, scenes kept, drawing resumes on return, no new contexts.
- **Adaptive resolution under software GL:** frames are slow, so the governor steps the level down to 3 within a few seconds of the sphere and aurora drawing (sphere buffer 2880x1800 to 1440x900, aurora 1440x900 to 864x540), as designed; it is not a measure of real hardware. With animations paused the level stays 0.
- **CPU:** main-thread script time while the three scenes draw is about 3.6 ms per tick (68 ms per second at 19 ticks per second), but in software GL the GL calls run in the same flow, so this is not a measure of a real GPU's cost either.
- **No claim is made about real-hardware frame time, GPU memory or battery.** The sphere at full quality is a 5.2 megapixel additive buffer over the viewport at devicePixelRatio 1 (more at 2 or 3), drawn up to v 3100; it is the scene to measure first on real devices.

### Verification (5B-5)

`tsc --noEmit`, ESLint and `next build` pass; the server on port 3000 serves this build.

- **Shaders:** all seven sources byte-identical to the prototype's (a script compares the module's exports with the prototype's text).
- **Visual comparison with the prototype** (both pages paused so the virtual clock is 0 and the scenes are deterministic; the DOM text, SVG, images and the service-panel strip hidden in both so only canvases and backgrounds compare; 1440x900, 1024x768, 390x844; v 850, 1000, 1150, 1400, 1700, 2200, 3000, 3200): mean absolute difference per pixel (of 255) is 0.01 to 0.33 at v 1000, 1150, 1400 (the sphere's entrance and rest, the aurora fading in) and 0.08 to 0.33 at v 3000 (the aurora at full strength) at all three sizes; 0.9 to 1.2 at v 1700 (the sphere dispersing: a 3 px scroll offset between two runs of this very build gives the same 0.9, so that is scroll sensitivity of the dispersal, not an implementation difference); about 2.4 to 3.3 at v 2200 and 2.2 to 3.2 at v 3200. The remaining differences are outside this stage: the unapproved photos and the closing 3D mark (5B-6) that the prototype shows and this build replaces with placeholders and a CSS stand-in, and DOM text the hide list did not cover at v 850. Viewed side by side (v 1400 at all three sizes, v 2200 and 3000 at 1440 and 390), the sphere's silhouette, size, point density, red underside, hole for the mark and the aurora's shape and colour are the same. (A first run without hiding the DOM showed larger differences only from the withheld "300,000+" wording and the prototype's photographs.)
- **Not compared pixel for pixel while playing:** the rotation, noise and the aurora's warp depend on the clock, so animation and transition timing were not compared frame by frame; the code paths (virtual clock, `u_time`, rotation, disperse) are the prototype's.
- **Lifecycle (production build):** a pass through the reel: v 0 hero only; v 700 sphere created (not yet shown); v 850 hero, sphere, aurora live; v 2100 hero gone; v 2700 closing gradient created; v 3600 only the closing gradient. Reversing recreates them. 8 enter/leave cycles of the stage: always 3 contexts created per entry and all released on leaving (Program, Shader, Buffer, VertexArray creates equal deletes; every context force-lost), listeners constant, subscribers 1 then 0. 5 route round trips: canvases always 5, subscribers 0 on the other route and 1 on return, 0 draw calls on a hidden route over 3 s. Totals after all of it: 43 contexts created, 43 lost, 43 programs created and 43 deleted.
- **Context loss (simulated with `WEBGL_lose_context`):** losing the aurora's or the sphere's context sets `data-gl="lost"`, hides its canvas at once and shows its stand-in (computed opacity 0 and 1), the lost canvas draws 0 times in 3 s while the other scenes keep drawing, 0 console output; restoring brings it back to `live` and the stand-in out; both lost, then a route change, then restoring the old contexts: 0 draws, nothing alive, subscribers 0, and the scenes are recreated on return.
- **Creation failure:** `getContext` returning null: all three scenes `failed`, stand-ins at opacity 1, 3 warnings, no retry in 3 s, recreated after leaving and re-entering. A shader whose link fails (injected for one scene at a time): that scene `failed` with its stand-in visible and one warning, the other scenes live; Three.js itself logs its own `console.error` for the broken program (expected in this test).
- **Reduced motion:** from load: 0 `getContext` attempts, 0 contexts, 0 draw calls, the Three.js chunk never requested, canvases `display: none`. Switching the OS setting to no-preference at v 1400 creates the scenes; switching back disposes them within a second (`data-sr-state="off"`, no scenes, no draws).
- **Regression:** `engine.ts`, `timeline.ts`, `snap.ts` and the Lenis files are unchanged (the diff is confined to `gl/*` and the stage's CSS). Carousel keys (300, 467, 633, 800, back 633), a horizontal wheel back a stop (467), all ArrowDown beats (300, 467, 633, 800, 1470, 2000, 2465, 2680, 3700) and listeners while active (+13) are as in 5B-4; a vertical wheel tick outside a zone scrolls continuously, a horizontal wheel in the carousel zone steps to the next stop; at 390 px a horizontal touch swipe in the carousel zone steps to the next stop and a vertical swipe scrolls freely; opening the chat 0.25 s into a keyboard snap stops it where it was (2048, target 2465), and an ArrowDown with focus inside the chat only scrolls natively (about 40 px), it does not snap. Console: no errors or WebGL warnings in any run (the CSS-preload notice Chromium prints for the page's stylesheet appears on `/about`, which has no showreel, as well).
- **Layout shift:** the shifts in a walk come from the reel's own opening card (identical with and without WebGL in the same run) and none has a canvas as its source; the total varied between runs of the same build (0.008 once, 0.318 twice, in the CSS-only case too), which was not diagnosed in this stage.
- **Media:** no photo, video or other asset was added; the stage changes no content.

### Not tested, and limitations

- **Software GL only.** No real GPU, so no frame time, GPU memory, thermal or battery measurement, no Safari, Firefox or phone, and no statement about context limits on any device: up to three contexts are alive at once now (the prototype held five for the whole visit), and the closing mark adds a fourth in 5B-6.
- **Adaptive resolution** was observed stepping down under software GL; stepping back up, and the "stay down if it was slow again" rule, were not exercised.
- **Creation cost** (shader compile, uploading 34,000 points, a 5.2 megapixel buffer) happens about one screen before the sphere is needed; on a slow device it may still land during scrolling. It was not measured on hardware.
- **Context loss was simulated**, as in 5B-4; a loss during creation was not provoked.
- **The sphere keeps drawing between v 2000 and 3100 while its panel is off-screen** (prototype behaviour, see deviation 6).
- The aurora and the sphere are animated by the clock, so fidelity while playing is judged by the code being the prototype's and by paused comparisons, not by pixel equality over time.
- Not changed, still open from earlier stages: panels, sphere text and the closing frame are hidden from assistive technology in the pinned reel until 5B-7.

## Stage 5B-6: the closing 3D mark

Source: `landing-prototype-clean/js/showreel.js`, read from the code: `chromeEnvironment`, `markObject`, `assembleMark`, `makeTargetStar` (lines 713 to 854), `markReveal`, `closeActive`, `sceneVisibility`, how `initShowreel` draws it (lines 1099 to 1108), and `js/mark.js` `readMark()`; the numbers `readMark()` reads out of the sprite's DOM are `src/lib/mark/geometry.ts`.

### The scene, and how it relates to the closing frame

The closing frame (`.target`, scene 9) holds two stacked canvases and the DOM copy: `target-bg` (the 5B-4 gradient), `target-canvas` (the mark, **transparent**, drawn over the gradient), then the vignette, the CSS fallback `targetMark`, and the copy. The mark's own drawing range is the prototype's: it is created with the closing gradient and drawn on the same condition (`closeActive`), with `markReveal(p)` as its only timeline input.

| | v (= p x 3700) |
|---|---|
| Created | v > 2600 (`sceneVisibility(p).target`, 200 v before the closing beat opens) |
| Drawn | v > 2799 (`closeActive`) |
| Reveal (`markReveal`, assembly) | 0 until v 2890, 1 from v 3340; then the hold to 3700 |
| Disposed | v < 2400 |

### Ported, and kept on purpose

- **Geometry:** the nine blades and the figure are `ExtrudeGeometry` from the traced polygons, mark height normalised to 2 units; depth 0.1 (figure 0.125), a four-segment bevel (thickness 0.022, size 0.01), the head a 48-segment extruded disc; blade i at z = -0.03 i, the figure at z 0.03, the stack centred in depth. 11 meshes, no merged or simplified geometry.
- **Materials:** two `MeshPhysicalMaterial`s. Satin silver: colour 0xdedee2, metalness 0.82, roughness 0.24, envMapIntensity 1.6, clearcoat 1, clearcoat roughness 0.08. Glossy signal red: 0xff2a45, metalness 0.4, roughness 0.26, envMapIntensity 1, clearcoat 1, clearcoat roughness 0.06. There are no custom shaders: this scene's "shader" is Three.js's physical shader, as in the prototype.
- **Environment:** a 1024 x 512 equirect painted on a 2D canvas (graphite room gradient, a bright shelf band, two white softboxes, a red bounce) turned into an environment map with `PMREMGenerator` (the filtered map is 768 x 1024 texels).
- **Lights and camera:** ambient 0.25, white key 2.0 at (2.5, 3, 4), signal-red rim 0.9 at (-3, -1.5, 2); ACES filmic tone mapping at exposure 1.1; a 45 degree camera at z 4. Placement: landscape, to the right of the copy (x = min(1.45, 0.55 half-width)); portrait, scale 0.62, top right.
- **Animation:** `assemble(r)` (blades smallest first, each scaled about the hub and sliding forward in z, then the body and head from above), the entrance turn, then the slow sway (position, scale, three rotation axes). The scene keeps its own clock exactly as the prototype did: seconds, advanced by the time between drawn frames capped at 0.1 s, not advanced while animations are paused, and its frame gap forgotten whenever the scene is not drawn (`pause()`).
- **Renderer:** antialiased, transparent, pixel ratio `min(devicePixelRatio, 2)`, **left out of adaptive resolution** (the prototype left the closing canvas alone because resizing it had shown a black gradient), buffer from the canvas's layout box (the 100vw by 100vh closing frame), a draw on every tick the manager asks for.

### Deviations from the prototype

1. **The warm-up draws the assembled mark.** The prototype's warm-up drew it at reveal 0, when every piece is hidden, so its two physical programs were compiled at the first visible frame, mid-scroll. Here both programs are compiled and the geometry uploaded at creation, and their link status is checked (`assertProgramLinked`, host.ts).
2. **The environment map is rebuilt when the context is restored.** A PMREM render target's pixels live only in GPU memory and Three.js does not regenerate them. Measured: with the rebuild a restored mark is pixel-identical to the one before the loss (mean difference 0.00 of 255 when paused); with the rebuild removed (a temporary experiment) the restored mark differed (mean 3.37, 6.4% of pixels by more than 24). `host.ts` got an `onRestored` option for this, called before the buffer is redrawn.
3. The old environment target is **dropped, not disposed**, after a restore: its GPU objects died with the old context, and disposing it asked the new context to delete them (Chromium warned "object does not belong to this context"; verified gone).
4. Lifecycle, loss handling, fallback states, disposal and the shader-link check are the manager's, as for the other scenes (none was in the prototype); the scene exists only while the closing frame is near.
5. `host.ts` gained `antialias` and `fixedPixelRatio` options and `scene.ts` an optional `pause()`; the manager calls it for a live scene outside its drawn range. Nothing else in the shared code changed.
6. The canvas fades in over 0.9 s (like the other scenes) where the prototype's was always visible. Because the canvas is created ahead of the reveal and only becomes live after a drawn frame, in a normal scroll it is long since visible (and empty) before the first blade appears.

### Resource ownership and disposal

Owned by the scene: one `WebGLRenderer` and its context, 11 `ExtrudeGeometry`s, 2 materials, the environment render target, the lights (no GPU resources). `dispose()` marks the scene disposed and removes the loss listeners first, then disposes the geometries, both materials and the environment target, then the renderer, and forces the context loss (skipped if already lost); the canvas is replaced by an empty twin. The temporary `CanvasTexture` and the `PMREMGenerator` are disposed as soon as the map exists. Three.js's own default textures and framebuffers (4 textures and 3 framebuffers per renderer) are not deleted by `renderer.dispose()`; the forced context loss frees them, as in 5B-4. Context loss: the mark's canvas hides at once and the CSS mark returns; on restoration the environment is rebuilt, the buffer is redrawn and only then is the canvas shown.

### Fallback

The CSS mark (`.targetMark`, an SVG of the brand mark driven by the engine's `markReveal` opacity and scale) stays underneath. While the canvas is `pending`, `failed`, `lost` or absent it is what shows. When the canvas is `live` it fades out over 0.9 s (`.target:has(canvas[data-sr="target-canvas"][data-gl="live"]) .targetMark { opacity: 0 !important; transition: ... }`; `!important` because the engine writes its opacity inline every frame, and the transition exists only while the rule matches so the way back is instant).

### All five WebGL effects, and what is not WebGL

| Effect | Canvas | Created | Drawn | Disposed |
|---|---|---|---|---|
| Opening gradient | `hero-canvas` | v < 1600 | v < 1600 | v > 1900 |
| Network sphere | `sphere-canvas` | 590 < v < 3300 | 790 < v < 3100 | v < 390 or v > 3400 |
| Aurora | `aurora-canvas` | 800 < v < 3450 | 1200 < v < 3250 | v < 600 or v > 3550 |
| Closing gradient | `target-bg` | v > 2600 | v > 2799 | v < 2400 |
| Closing 3D mark | `target-canvas` | v > 2600 | v > 2799 | v < 2400 |

Up to **four contexts at once** (v 2600 to 3300: sphere, aurora, closing gradient, mark; all four are *drawn* between v 2800 and 3100). Not WebGL, by design: the marquee, backdrop, the card carousel and its 3D transforms, the mark-building SVG of card 03 and its dive and portal, the sphere's central mark (`core`, an SVG), the service panels, the vignette, the closing copy.

### Measurements (production build, Chromium 1254, **software GL**, 1440x900)

- **Geometry:** 7,428 vertices, non-indexed: ten extruded shapes at 168 vertices each (nine blades and the body) and the head disc at 5,748; position + normal + uv buffers = 33 buffers, **237,696 bytes (232 KiB)**, uploaded once at creation.
- **Draw calls:** 11 per frame (one per mesh), `drawArrays`; measured 264 draws over 24 frames. The creation-time PMREM work adds a few dozen draws once.
- **Textures and render targets:** the painted 1024 x 512 equirect (immutable storage, deleted after PMREM), the PMREM cube-UV target, 768 x 1024 texels (kept while the mark lives; its texel format was not checked), one equal-size ping-pong target (deleted with the generator), plus Three.js's defaults.
- **Canvas:** 1440 x 900 at devicePixelRatio 1 (2880 x 1800 at 2), antialiased. Not governed by adaptive resolution.
- **Render frequency:** one draw per shared-tick frame while drawn; nothing is drawn outside v > 2799, when animations are paused and the scroll position is still (0 draws), or in a hidden tab.
- **Time:** about 6 ms of main-thread script per second at 4 frames per second in software GL, which says nothing about a real GPU. No hardware figure is claimed.

### Verification (5B-6)

`tsc --noEmit`, ESLint and `next build` pass; the server on port 3000 serves this build.

- **Fidelity to the prototype** (both pages paused, so the scene clock is 0 and everything is deterministic; DOM text and SVG hidden in both; the closing gradient is in the picture, as it is behind the mark): at 1440x900, 1024x768 and 390x844 and at v 2900, 3000, 3100, 3200, 3340, 3550 and 3700 (the first blade, mid assembly, fully formed, the hold) the mean absolute difference is 0.00 to 0.22 of 255 per pixel and below 0.02% of pixels differ by more than 24, except 0.72 and 0.30% at 390 px, v 2900 (the first moments of the entrance). Viewed side by side (1440 at v 3100, 390 at v 3200, 1024 at v 2900) the two are not distinguishable.
- **Animation:** a paused comparison cannot show motion, so the clock was compared. A hook on `Math.sin` recorded the mark's clock at each drawn frame: here it starts at the first drawn frame, advances by exactly 0.1 s per frame (software frames are slower than that) and stops when animations are paused, as the prototype's does (it also records 0.016 s steps where its frames were faster than 100 ms). Both pages were paused at clock 2.017 s (this build) and 2.033 s (prototype): the pose is the same and the only difference is a thin edge of sway from that 16 ms and a different phase of the animated gradient behind it (mean difference 5.9, but all of it gradient grain and edge). The sway formulas are the prototype's text; a frame-by-frame comparison of motion while playing was not made.
- **Hand-off:** with the canvas `pending` the CSS mark shows; at `live` it fades out as the canvas fades in. Sampled in the page on every frame: a jump from v 2300 to 3500 (scene not yet created), a walk from v 2700 to 3500 (created, empty) and the same jump at 4x CPU throttle showed no frame where the CSS mark was removed before the canvas existed. Frames are seconds long in software GL, so the 0.9 s crossfade itself was not resolved frame by frame; in the walk case the stand-in is never shown (the first WebGL frame was already drawn) and the canvas simply fades in.
- **Failure:** `getContext` null for every scene: the aurora, sphere, closing gradient and mark all `failed`, stand-ins visible (the CSS mark at its reveal opacity), 0 draws, no retry in 3 s, everything recreated after leaving and re-entering. A shader link failure injected into the mark alone, and into `target-bg` alone: that scene `failed` with its fallback visible, the others live, one warning each.
- **Context loss and restoration** (`WEBGL_lose_context`, animations paused, v 3000, all four scenes drawing): each of the mark, the closing gradient, the sphere and the aurora lost in turn: its canvas hides and its fallback returns at once, the other three keep drawing, 0 console output on loss or restoration; after restoration the scene is live again and the whole picture is pixel-identical to before the loss (mean difference 0.00 to 0.07, apart from the frames where the lost scene's fallback was showing). Restoring the contexts of scenes whose page had been left: 0 draws, nothing alive.
- **Lifecycle:** a pass through the reel (v 0 to 3700 and back): hero only; v 700 sphere created; v 850 hero, sphere and aurora; v 2100 sphere and aurora; v 2700 the closing gradient and the mark created; v 3600 only the closing gradient and the mark; the way back recreates them. 8 enter/leave cycles at v 3200: four scenes each time, 4 contexts created and released per entry, listeners constant at 164, subscribers 1 then 0, Programs, Shaders, Buffers and VertexArrays created equal deleted; 5 route round trips: canvases 5, subscribers 0 on the other route and 1 on return, 0 draws on a hidden route over 3 s; totals 55 contexts created, 55 lost, programs 81 and 81, buffers 998 and 998; scrubbing the create and release thresholds created 7 contexts in all (the hero, sphere, aurora, closing gradient and mark once each, then the sphere and the aurora again on the way back), none repeatedly at a boundary. A tab sent to the background: 0 draws in 3 s, all four scenes kept, 4 contexts, drawing resumes on return.
- **Reduced motion:** from load 0 contexts, 0 `getContext` calls, 0 draws, the Three.js chunk never requested; switching the OS setting to no-preference at v 3200 creates the scenes, back to reduce disposes all of them (`data-sr-state="off"`, no draws, subscribers 0).
- **Regression (5B-2, 5B-3):** `engine.ts`, `timeline.ts`, `snap.ts` and the Lenis files are unchanged. Carousel keys 300, 467, 633, 800, back 633; the horizontal wheel back a stop (467); all ArrowDown beats (300, 467, 633, 800, 1470, 2000, 2465, 2680, 3700); listeners while active +13; a vertical wheel tick scrolls continuously and a horizontal one in the carousel zone steps; at 390 px a horizontal swipe steps and a vertical one scrolls freely; opening the chat 0.25 s into a keyboard snap stops it where it was (2126, target 2465) and an ArrowDown with focus in the chat only scrolls natively; Layout shift over a full walk is the same with and without WebGL (0.318), no canvas is a source. Console: no errors or WebGL warnings in any run except the Chromium CSS-preload notice (also on `/about`) and the Three.js `console.error` that the injected link failures cause on purpose.
- **A harness lesson:** with four scenes the software-GL frames can last more than a second, so a test that decides a snap has finished because the scroll position was still for 1.2 s can stop early (two ArrowDown checks seemed to fail and then passed with a 3 s quiet period). The snap code is unchanged and its destinations are as before.
- **Media:** none added.

### Not tested, and limitations

- **Software GL only.** No real GPU, so no frame time, GPU memory, thermal or battery figure, no Safari, Firefox or phone, and no claim about context limits: four contexts can now be alive at once (the prototype held five for the whole visit), the heaviest being the sphere (2880 x 1800 at full quality) and the mark (antialiased, physical materials, a 768 x 1024 half-float environment).
- **Creation cost** (two physical programs, 7,428 vertices, the PMREM pass) happens about one screen before the frame is needed; on a slow device it may still land during scrolling. Not measured on hardware.
- **Animation while playing** was checked through the clock and the pose at equal clocks, not frame by frame.
- **The crossfade** was reasoned and sampled, not resolved frame by frame (multi-second frames in software GL).
- **Context loss was simulated**; a loss during the mark's creation was not provoked. If the environment cannot be rebuilt after a restore, the scene stays lost (CSS mark) until it is disposed.
- **The mark keeps the prototype's frame-time dependence:** its clock advances at most 0.1 s per drawn frame, so on a slow device the sway runs slower than real time.
- Still open from earlier stages: the panels, the sphere's text and the closing frame are hidden from assistive technology in the pinned reel until 5B-7; video (5B-7) and the final validation on real devices (5B-8).

## What was not done in 5B-1, on purpose (historical)

Scroll engine and Lenis frame hook (now done in 5B-2), snap, WebGL (hero gradient, aurora, sphere, closing gradient, chrome mark), video, the reduced-motion presentation, the `data-sr-ready` first-paint guard (only needed once an engine can restore a mid-reel position), and context-loss handling. The panels, the closing frame and the dive are hidden by CSS until the engine drives them, so a keyboard or screen-reader user cannot reach their text yet; the static reduced-motion presentation (below, Stage 5B-7) is where that content is exposed to users who ask for reduced motion. Until it is built this is the same for every visitor, and is not a regression.

## Verification (5B-1)

`tsc --noEmit`, ESLint and `next build` pass. Compared with the prototype at eight viewports (opening-frame rectangles, opacities and visibility of the card, slider, headline, lead, buttons, carousel button, side cards and backdrop all within 1.5 px; track heights identical). No horizontal overflow at any of them. Console: only the known "preloaded but not used" CSS notice. Marquee pauses with `html[data-motion="paused"]` and starts paused under OS reduced motion. Client navigation to `/about` and back leaves the stage intact. Not checked: a real GPU (no WebGL is drawn yet), Safari, real phones, a screen reader (only the accessibility tree).

Out of scope, noticed: the hero's heading reads "PEOPLE BEHIND THECARE" in the accessibility tree (a missing space between the last two words; Stage 3 code).
