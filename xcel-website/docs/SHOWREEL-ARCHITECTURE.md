# Showreel architecture (overview)

The one-page overview of how the home page's scroll showreel is built, why, and what it costs. The stage-by-stage detail, measurements and test results are in `SHOWREEL.md`; this file is the map. Facts here come from the code and from the tests recorded there (software GL only: no real GPU, Safari, Firefox or phone).

## The idea

The reel is **a pure function of scroll progress**. One tall track and a sticky stage; every visual value is computed from `p` (0 to 1 through the track, `v = p x 3700`). Nothing animates by itself except a few slow shader clocks. Three layers, each with one owner:

| Layer | Owner | Where |
|---|---|---|
| **Markup** | React, rendered once on the server, never re-rendered. Visible before any JavaScript runs. | `components/showreel/Showreel.tsx`, `ShowreelStage.tsx`, `Showreel.module.css` |
| **Choreography** | A pure timeline (`p` in, styles out) and an imperative DOM engine that writes only inline styles, SVG attributes and canvases, found by `data-sr` (never ids). | `lib/showreel/timeline.ts`, `engine.ts` |
| **WebGL** | One GL manager that creates, draws and disposes five scenes by timeline range. | `lib/showreel/gl/*` |

Alongside: `snap.ts` (wheel, touch, keyboard and focus navigation), `lib/scroll/lenis.ts` (the shared scroll), `lib/mark/geometry.ts` (the mark's one source of geometry), and `preScript.ts` (the restoration guard).

## One frame

```
Lenis ticker (one rAF)
  -> lenis.raf(t)
  -> notifyScrollFrame(t)                  (post-frame subscription)
       -> engine.onFrame
            -> renderAt(scrollY): p -> inline styles (timeline functions)
            -> gl.frame(t, p): for each scene spec
                 not alive and create(p)  -> load Three.js, build scene (async, re-checked)
                 alive and release(p)     -> dispose, replace canvas
                 alive and draw(p)        -> scene.render(virtualClock, drive(p))
                 else                     -> scene.pause()
```

There is **no other loop, timer or scroll engine**. Snap holds run on the same tick. The virtual clock stands still while the visitor has paused animations.

## Lifecycle

- **States:** `idle`, `active`, `off`, `destroyed` (`data-sr-state`). The engine is active only while the stage is near the viewport (200 px margin); active means a scroll-frame subscription, a handful of listeners, the snap and the GL manager. Leaving, React Activity hiding the route, unmounting, or OS reduced motion tears all of it down (idempotent).
- **Scenes** are created about one screen ahead of their range, drawn only inside it, and disposed just after, with a gap so a reader parked at a boundary does not thrash.
- **Reduced motion** (OS setting) never starts the engine: a static stacked layout of the same content, no pinned track, no WebGL, no Three.js request.

## The five WebGL scenes

| Scene | Canvas | Created | Drawn | Disposed |
|---|---|---|---|---|
| Opening gradient | `hero-canvas` | v < 1600 | v < 1600 | v > 1900 |
| Network sphere (34,000 points) | `sphere-canvas` | 590 < v < 3300 | 790 < v < 3100 | v < 390 or v > 3400 |
| Aurora | `aurora-canvas` | 800 < v < 3450 | 1200 < v < 3250 | v < 600 or v > 3550 |
| Closing gradient | `target-bg` | v > 2600 | v > 2799 | v < 2400 |
| Closing 3D chrome mark | `target-canvas` | v > 2600 | v > 2799 | v < 2400 |

Up to four contexts exist at once. Each scene is a `GlScene` (`render`, `redraw`, `resize`, `pause?`, `setQuality?`, `lost`, `dispose`) built on one renderer and one canvas; `host.ts` holds the plumbing the sphere, aurora and mark share. The aurora and sphere use adaptive resolution; the mark is fixed. Shaders are byte-identical to the prototype's.

**Fallbacks.** Every scene has a CSS stand-in underneath its canvas. The canvas carries a state (`data-gl`: absent, `pending`, `live`, `lost`, `failed`) and is visible only while `live`, so the stand-in shows before the first drawn frame, after a failure and during a context loss (instantly), and fades out only while the scene is drawing.

## What this buys

1. **One broken effect does not break the page.** Creation failure, a shader that fails to link (Three.js only logs; we check the program), a lost context: each leaves that scene on its CSS stand-in and the others running. Tested for each scene.
2. **Bounded GPU use.** Scenes exist only near their range; a hidden route holds none; a lost or restored context is handled (including the mark's environment map, which lives only in GPU memory and must be rebuilt).
3. **Normal navigation.** Client-side routing and React Activity work, with 0 draws and 0 subscriptions on a hidden route. Nothing forces a full page load to free the GPU.
4. **One scheduler.** One ticker, so snap, DOM and GL cannot drift, and the work per frame is predictable.
5. **Accessibility baseline.** A real reduced-motion presentation (not a slowed-down one), server-rendered content, snap that steps aside for dialogs, inputs and the chat.
6. **No flashes on load or restore.** Server markup in its frame-0 state; a guard for reloads and Back.
7. **Maintainable and checkable.** Typed and linted; the timeline is pure and testable; the engine, snap and GL manager have narrow contracts; the behaviour is documented with measured results.

## What it costs

- **More code** (about 2,250 lines under `lib/showreel/`) than wrapping the prototype's script, and the prototype can no longer be dropped in unchanged: changes to the prototype must be ported (timeline functions, shaders and geometry were ported verbatim, which keeps this mechanical).
- **Only software-GL tested.** Frame time, GPU memory and context limits on real devices are unmeasured. Four contexts at once is more than any earlier stage but fewer than the prototype's five held for the whole visit.
- **Imperative engine over static markup** is a pattern to learn: markup changes need the matching `data-sr` hooks, and React must not re-render the subtree.
- **Still open:** assistive-technology access to the panels, sphere text and closing frame in the pinned reel (hidden by `visibility` until the engine reveals them, as in the prototype), video, and real-device validation.

## The alternative, and when it would be right

The other way to bring the prototype into Next is to copy its scripts and markup into a client component that injects the HTML and runs the original code (a "wrapper"). It is much less code and stays pixel-close to the prototype. It also, as built that way: creates every renderer at load and never frees them, has no context-loss or failure fallback, runs several independent frame loops, needs full page loads on navigation to release the GPU, shows nothing before JavaScript runs, and has no typed or linted showreel code. It is the better choice for a short-lived demo or while the design is still changing daily; the engine above is the better choice for a production page that must be reliable, accessible and maintainable. A port of design changes from a wrapper onto this engine means porting timeline functions, shaders and markup, not rewriting the architecture.
