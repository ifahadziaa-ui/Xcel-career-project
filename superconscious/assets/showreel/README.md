# assets/showreel/

Media for the Superconscious page. **Nothing here is required**: every slot has a gradient fallback, so the page runs with this folder empty. Drop files in with the names below and they replace the placeholders automatically (the page loads `assets/showreel/<name>` relative to `superconscious/index.html`).

Style guide, from the client: real people moving, healthcare first, no stock-photo look. Match the prototype's voice (caring, trustworthy, professional).

## Images

| File | Where it shows | Subject | Suggested size |
|---|---|---|---|
| `recruiter.jpg` | Hero card, image card, first slide | A recruiter with a candidate | 1200 x 1600, portrait |
| `candidate.jpg` | Hero card, image card, second slide (rotated -90 degrees, scaled 1.65x, so keep the subject central) | A candidate or nurse, candid | 1600 x 1200 |
| `employer.jpg` | Carousel card 01, For employers (full bleed) | A hospital, clinic or county office team | 1000 x 1500, portrait |
| `seeker.jpg` | Carousel card 02, For candidates (full bleed) | A job seeker, a nurse starting a shift | 1000 x 1500, portrait |
| `flight-1.jpg` to `flight-9.jpg` | The 14 floating tiles during the camera flight (nine images reused across the tiles) | One per entry in `FLIGHT` in `landing-prototype/js/content.js` (nurse at the bedside, case manager, EHR admin, CNA, budget analyst, ...) | 1600 x 1200, landscape or portrait |

Any of these can be `.jpg`. If you use `.png` or `.webp`, change the extension in `index.html` (search for `withAsset(` and `flight-`).

## Videos

| File | Where it shows | Subject |
|---|---|---|
| `function-1.mp4` | Services panel 01, Healthcare | Nurses and care staff at work: a ward, a clinic, a home visit |
| `function-2.mp4` | Services panel 02, Government | County health and human services staff with residents; a public-sector team |
| `function-3.mp4` | Services panel 03, IT · Finance · Cyber | Specialists at work: EHR systems, a billing team, a security floor |

Format: H.264 `.mp4`, 10 to 15 seconds, seamless loop, muted (audio is ignored), 16:9, about 1920 x 1080 or smaller. Keep each under roughly 6 MB; they autoplay and load only shortly before the services section scrolls in. A missing file just hides its `<video>` and shows the gradient.

## What is not an asset

- The logo mark, the star-like masks and the 3D chrome mark are drawn in code from the logo's polygons. They need no file here.
- Copy comes from `landing-prototype/js/content.js`.
