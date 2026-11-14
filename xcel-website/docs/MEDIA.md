# Media (migration Stage 4)

What media the website uses, what was approved, and what is deliberately still a placeholder. Claims context: `docs/CLAIMS-REGISTER.md` (repository root).

## Asset inventory (14 Nov 2026)

**1. Approved and integrated**

| Asset | Where | Why approved |
|---|---|---|
| `public/media/jobs/spec-analytics.webp` (1200x800, 46 KB) | "Revenue Cycle Specialist" example card | Unsplash License (free commercial use, no attribution). Shows an analytics screen: no people, logos, places or clients |
| `public/media/jobs/spec-cyber.webp` (1200x673, 120 KB) | "Cybersecurity Engineer" example card | Same licence. Server racks: no people or identifiers |
| `public/hero/specimen-placeholder.png` | Hero centrepiece | Already in the application since the original hero; unchanged. It is the template's heart-in-a-case art, kept as the cleaned prototype keeps it |
| XcelCareers mark (`IconSprite`, traced from `Assets/Logo.png`) | Header, footer, chat, cards | The client's own logo |

**2. Available but requiring confirmation (not published)**

| Asset (in `landing-prototype-clean/assets/`) | Intended use | Why it is held |
|---|---|---|
| `img/hc-long-term.webp`, `img/hc-nurse-care.webp`, `img/spec-it.webp` | Example job cards | Stock photographs of identifiable people. The licence record (`images_web/LICENSE-IMAGES.md`) names Unsplash but no per-photo source, photographer or model release; the client asked for real staff and no stock look (Q23, Q25); the care photographs could read as a healthcare track record, which the claims register withholds |
| `img/hc-admin.webp`, `img/hc-clinic.webp` | Showreel portrait cards | Same reasons; also showreel (later stage) |
| `video/panel-*.mp4/.webm` and posters (Pixabay) | Showreel panels | Showreel stage. Licence file notes model releases are not guaranteed for clips with clear faces |
| `video/reel-main.mp4` and poster | Showreel opening card | **Pixabay stock** (clips 229069, 49813, 143376, 143378, see `video/LICENSES.md`), not a generated render (this row said so before 5B-1; that was wrong). Model releases not guaranteed |

**3. Referenced by the design but missing:** the capability statement cover (no PDF exists, Q25), the Barry Klasson / client-services photo, team headshots, real staff photography, customer logos (permission unconfirmed, Q20), a social-share image.

**4. Intentionally retained as placeholders:** the three withheld job-card photos (quiet placeholder), the capability poster cover, the contact card photo, and, in the showreel (Stage 5B-1), the opening card's video, the two carousel portraits and the three service-panel clips: all quiet placeholders until approved.

## How media is wired

- `src/components/home/media.ts`: the only list of approved photographs, keyed by job id. No entry means the placeholder. To approve another photograph, copy it to `public/media/jobs/` and add an entry.
- `MediaSlot` (server component): placeholder underneath, `next/image` (`fill`, `object-fit: cover`, the prototype's `object-position`) on top. The slot's box is the card's own aspect-ratio box, so loading causes no layout shift; images are lazy-loaded (the far cards are hidden on phones and so are never fetched there); `sizes="(max-width: 699px) 36vw, 22vw"`; if an image fails the placeholder stays visible.
- Alt text is empty: the card text already names the role, and a photograph of a screen or racks adds nothing a screen reader needs.
- No video is used on the static homepage (no placement calls for one). All clips belong to the showreel stage.

## Open decision for the client

The prototype used stock people photographs on the example cards. The client's brief asks for real people and no stock look. Until the client supplies photographs (or approves specific stock images and their model releases), those slots stay as placeholders.
