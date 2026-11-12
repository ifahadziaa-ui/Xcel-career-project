# Superconscious

This folder holds **two** single-file pages built from the same brief ([../superconscious_prompt.md](../superconscious_prompt.md)):

| File | What it is |
|---|---|
| [index.html](index.html) | **Vanilla Superconscious.** The brief as written: violet palette, star logo, Superconscious copy ("Prompts that think ahead", Catalist cards, Archin / Zumar / Nova portfolio), Zen Kaku Gothic New. Shaders, timeline, grid and visibility rules are pulled verbatim from the brief. Assets load from the brief's public bucket (stone.jpg, card-2/3.jpg, star.svg, `model.glb` for the chrome star (Draco-compressed; the page loads the Draco decoder from unpkg), three portfolio videos, nine grid PNGs, pravatar avatars). **No XcelCareers content.** |
| [xcelcareers.html](xcelcareers.html) | The XcelCareers-derived variant described in the rest of this file (graphite and red palette, the XcelCareers mark, copy read from `../landing-prototype/js/content.js`). |

**Fonts:** the vanilla page uses Zen Kaku Gothic New. The landing prototype now uses that same font after its hero (see `../PROJECT-BRIEF.md` §5); this folder's pages are unaffected by those prototype changes except that `xcelcareers.html` still reads the prototype's `js/content.js`.

Serve both from the **repo root**: `python3 -m http.server 3300`, then open `http://127.0.0.1:3300/superconscious/` (vanilla) or `.../superconscious/xcelcareers.html`. The vanilla page has no dependency on `landing-prototype/`; the XcelCareers variant does.

Everything below describes the **XcelCareers variant** unless it says otherwise. The mechanics (scroll model, geometry buckets, scenes) are identical in both.

---

# The XcelCareers variant (`xcelcareers.html`)

A single-file, scroll-driven WebGL showreel for XcelCareers. It is built from a "Superconscious" design brief (a dark, full-bleed, pinned-stage experience driven by one scroll value) and **derived from the landing prototype**: the copy, the facts and the logo all come from `../landing-prototype`. It is deliberately kept outside the prototype and is **not fused with it**.

- Entry: [xcelcareers.html](xcelcareers.html), pure HTML, CSS and JS in one file. No build step, no framework.
- Libraries: Three.js r0.185, loaded from unpkg through an import map. The only other external call is Google Fonts (Mona Sans, Geist Mono).
- Status: working. Tested in headless Firefox 154 at 1400 and 420 px wide: loader, hero, carousel, mark-shaped reveal into the particle sphere, portfolio panels, flight and the final chrome mark. Not yet checked at 1024 or 768.

## Run it

The page imports `../landing-prototype/js/content.js`, so it must be served from the **project root** (the folder that holds both `landing-prototype/` and `superconscious/`). Opening it from `file://` will not work (ES module import).

```bash
cd Xcel-career-project
python3 -m http.server 3300
# open http://127.0.0.1:3300/superconscious/
```

The landing prototype has its own server (`python3 landing-prototype/serve.py`, port 3200). The two are independent and can run side by side.

## How it relates to the landing prototype

| | Landing prototype | Superconscious |
|---|---|---|
| Location | `landing-prototype/` | `superconscious/` |
| Role | The full one-page site (certs, process, jobs, capability, record, FAQ, contact, chatbot) | The scroll showreel only |
| Copy source | `js/content.js` | **Reads the same `js/content.js`**, no copy |
| Changed by this work | Nothing (git-clean) | Everything here |

- Facts and wording live in `landing-prototype/js/content.js` (`SHOWREEL`, `FUNCTIONS`, `FLIGHT`, `CONTACT`). Edit them there and both pages follow.
- Links in the nav and CTAs point into `../landing-prototype/index.html#services | #capability | #jobs | #contact | #process`.
- Deleting this folder cannot break the prototype.

## What the page does

One tall scroll track (2000vh on desktop) with a sticky, pinned stage. A single normalised scroll value `p` (0 → 1) drives **every** animated style, as a pure function of `p`, each frame.

1. **Loader.** A chrome XcelCareers mark spins over a red bloom for at least 2.6 s (0.7 s with `prefers-reduced-motion`), then lifts away. Page scroll is frozen until it finishes, then the header fades in.
2. **Hero card.** Full-screen card with a cursor-reactive graphite and red mesh-gradient shader. Headline "Vetted. Credentialed. Ready.", the lead, **Request staff** and **Find a job** buttons, the QN · EF · BK team pill, and a tilting image card.
3. **Carousel.** The hero shrinks and flips into a 4-card 3D carousel in front of the running role marquee. Cards: hero, 01 For employers, 02 For candidates, 03 Our network. A "See how we staff" pill sits underneath.
4. **Sphere.** The network card opens through a mask shaped like the XcelCareers mark into a black panel holding a 34,000-particle sphere (red to silver, additive bloom), a white mark, and the headings "300,000+ / profiles / on file" with supporting copy. The page background fades from white to black and a corner aurora shader shows through.
5. **Portfolio.** A fixed section flies up and pans three panels sideways, then exits left: Healthcare, Government, IT · Finance · Cyber. They are video-ready; with no files they show gradients.
6. **Flight.** The camera rig flies through 14 floating tiles (captioned from `FLIGHT`).
7. **Landing.** It arrives at a block holding a polished chrome 3D version of the mark (red metal figure) over its own gradient, with "One nurse. Or 120+ staff.", **Request staff** and the phone number, and a white frame snapping in.

## How it works

### The scroll model
- `p = clamp01(scrollY / (trackHeight - innerHeight))`. The track height depends on the layout bucket.
- A "virtual scroll" compresses the track: `vScroll = p * VSCROLL_MAX` where `VSCROLL_MAX = (TRACK_VH - 100) / 0.4`. Phase boundaries are defined in that space (`PS = 1600` portfolio start, `PF_DUR = 1500`, `GRID_START`, `P7_START/END`, and so on).
- Native scroll (no Lenis). The scrollbar is hidden.
- Timeline functions (`phase1..4`, `card1Transform`, `carouselTransform`, `portfolioTransform`, `cameraRigTransform`, and the rest) are all in the module script near the top, under "constants & timeline". Change a timing there.

### Responsive geometry
Chosen on load and on resize or orientation change (debounced), from orientation and width: landscape is **desktop**, portrait under 640px is **mobile**, portrait up to 1024px is **tablet**.

| | desktop | tablet | mobile |
|---|---|---|---|
| track height | 2000vh | 1700vh | 1300vh |
| card w / h | 42 / 62 vmin | 54 / 80 | 64 / 94 |
| carousel radius | 27 vmin | 35 | 41 |
| fly-back | 40 vmin | 52 | 60 |
| sphere heading 1 / 2 | 18 / 24 vmin | 13 / 16 | 10 / 12 |

The values are written as `--sr-*` CSS variables on `<html>`. The perspective is fixed at 1500px.

### WebGL scenes (four canvases)
| Scene | Host | Notes |
|---|---|---|
| Hero gradient | `#heroGl` | 1x pixel ratio, about 36 fps, follows the pointer |
| Aurora | `#aurora` (fixed, z 30) | alpha overlay; opacity from `auroraOpacity(p)` |
| Particle sphere | `#sphereWrap` | 34k points on a Fibonacci sphere; `uDisperse` follows scroll |
| Target mark | `#targetGl` | ACES tone mapping, procedural chrome environment map |

- Each scene renders only while visible, using the brief's `sceneVisibility` flags: hero `gp < 0.8`; aurora `1000 < v < PF_END + 350`; sphere `gp > 0.1` and `v < GRID_START + 400`; target `v > GRID_START - 300`. The portfolio videos are mounted and unmounted with `PS - 600 < v < PF_END + 350`.
- Canvas buffers are sized from the window, never re-measured while the stage zooms.
- The shaders are the brief's, with the **colours retuned**: graphite, silver and signal red (`#ff2a45`) in place of violet.

### The mark
- The logo polygons (nine blades, the figure body, the head circle) are copied from the prototype's `#i-mark` symbol into `MARK_POLY` and `MARK_FIG` in the script. They are used four ways: inline SVG, a CSS mask (`--mark`), a mask with a solid hub (`--markm`, used for the reveal) and extruded 3D geometry.
- The reveal mask is scaled about the mark's **hub** (the point the blades converge on), which is pinned to the card centre so the dive-through fills the screen. Early in the reveal the small mark therefore sits off-centre.
- If the logo changes, update `MARK_POLY` / `MARK_FIG` and the two CSS data URIs. A script in the history of this work generated them from the same points.

### Palette and type
Graphite `#101012`, silver `#d0d0d2`, ink `#f3f3f5`, signal red `#ff2a45` (the same palette as the prototype's hero). Fonts: **Mona Sans** for display and body, **Geist Mono** for small labels. Tokens live in `:root` at the top of the file.

## Editing guide

| To change | Where |
|---|---|
| Any wording or fact | `landing-prototype/js/content.js` |
| Colours, radii, sizes | `:root` tokens and the `--sr-*` table in `index.html` |
| Phase timing | the "timeline" functions in the module script |
| Shader colours | `heroFrag`, `AURORA_FRAG` and `SPHERE_FRAG` in the script |
| Particle count, sizes | the sphere block (`N = 34000`, `uSize`, `uAmp`) |
| Card layouts | the builder section, "content-driven markup" |
| Link targets | `href()` and the header markup |

## Assets

Photos and videos are not supplied yet. Gradients stand in, so the page works without them. Files go in [assets/showreel/](assets/showreel/README.md), which lists names, sizes and what each shows.

## Known gaps

- **Verification is partial.** See Status above; tablet widths and hover states are untested.
- **Placeholder media only** (see Assets). The page shows gradients plus captions until real files arrive.
- **Showreel only.** Certifications, process, jobs, capability, FAQ, contact and the chatbot exist only in the landing prototype. The CTAs link there.
- **Heavy on weak GPUs.** The sphere renders at a pixel ratio of 2 to 3 over the full viewport with additive blending.
- **Not wired to the chatbot** or to any form.
- **Client items still open** (from the content deck): logo permission for customer names, the original vector logo, headshots for the team pill.

## Provenance

Built in November 2026 from a "Superconscious" design brief, then re-skinned with XcelCareers copy from the landing prototype. The brief arrived truncated in chat; the complete text is now in `../superconscious_prompt.md`, and the visibility rules, fixed parameters and asset list were checked against it.
