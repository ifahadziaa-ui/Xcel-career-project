# TRECIG — design reference audit (trecig.com)

> **What this is:** a full capture of the *reference* site whose design philosophy we want to learn from. The new XcelCareers design will look entirely different.
> Captured 8 Nov 2026 in real Chrome at desktop 1440px, tablet 820px and mobile 390px. All 43 public URLs are included: 21 pages, 6 blog posts, 6 job posts, plus category, job-taxonomy and author archives.
> This file is the human summary. Exact per-element measurements are in `pages/<page>/PAGE.md`. Site-wide fonts, colours and tokens are in [SITE-DATA.md](SITE-DATA.md).

---

## 1. Who TRECIG is (context for why the site looks the way it does)

| Item | Value |
|---|---|
| Company | **TRECIG, LLC**: technology, cybersecurity, logistics, supply-chain, manufacturing and mission-support contractor |
| Status | **SDVOSB** (service-disabled veteran-owned small business) · **CMMC Level 2 Certified, UID L200003036** · VetHUB, MBE, DBE certified |
| Leadership | **Dr. Roy L. Rucker Sr.**, Founder, Chairman and CEO (retired Army CW5, 30+ yrs) · **Martha Key**, President (retired Army CW4) |
| HQ / contact | Rockwall, Texas · (469) 653-9009 · info@trecig.com · careers@TRECIG.com · Mon–Fri 8am–5pm CST |
| Proof shown | DOL HIRE Vets Gold (2019, 2020) and Platinum (2021–2025) · Alignable Local Businessperson of the Year 2020–21 · BBB Torch Award for Ethics 2022 and BBB A+ · Forbes top cyber-security founder to watch 2025 · AFCEA TechNet speaker |
| Partners | KUOG Corporation ("Key Inroad Integrator"), Rucker Foundation 501(c)(3) |
| Tagline | "**TRECIG is more than a name — it's a promise.**" · "Uniquely purposed. Timely connected. Dots delivered." |

TRECIG sells to the same kind of buyer as Xcel's employer side (DoD and federal contracting), and its jobs are cleared cloud and DevOps roles at military bases. That overlap is why it's a useful reference.

---

## 2. Site map and navigation

```
HOME
ABOUT ▾            → The Mission · The Values · The Legacy · The Trecig Team · Careers
AWARDS & RECOGNITION ▾ → Partnerships
EXPERTISE ▾        → Industries We Serve
PRESS & MEDIA
CONTACT
(footer) Privacy Policy · Terms & Conditions
(other) /job-openings/ (Jobs archive) · /jobs/<role>/ · blog posts · /category/* · /job-category|job-type|job-location/*
```

| Page | What's on it (top → bottom) |
|---|---|
| **Home** | Full-bleed **background-video hero with no text** → "CMMC Level 2 Certified — UID" line → certification badge row + 8 award badges → 4 centred intro paragraphs → **quote band** on video ("UNIQUELY PURPOSED. **TIMELY CONNECTED.** DOTS DELIVERED.") → **black "globe" section**: rotating hologram-earth video in the centre, 5 callouts linked to dots on the globe by thin lines → "JOIN THE **JOURNEY**" band on video with 2 ghost pill buttons → footer |
| About | Page banner → "THE **HEARTBEAT** OF TRECIG (SDVOSB)" text column + **angled video panel** bleeding off the right edge |
| The Mission / Values / Legacy | Page banner → angled video panel on one side and a two-tone heading + copy on the other |
| The Trecig Team | Banner → angled image + intro copy → "MEET TEAM **TRECIG**" → leader rows: portrait at left with an italic quote caption, name/title/bio at right |
| Awards & Recognition | Banner → large featured badge (2025 Platinum) → 4-column grid of badge + uppercase caption → closing badge |
| Partnerships | Banner (video; captured black before YouTube loaded) → "AN INROAD TO **OUR ECOSYSTEM**…" → black band "OUR **KEY INROAD** INTEGRATORS" → "OUR SHARED **VISION**" rocket list → angled video + "WHY **INTEGRATE**" list → "READY TO **COLLABORATE?**" → angled video + **Partnership Inquiry form** |
| Expertise | Banner → "CORE **SERVICES**" → **2×2 dark image tiles** (Technology Integration / Cybersecurity Consulting & PM / Defense & Government Contracting / Specialized Industry Solutions) with bold-lead bullet lists → angled video + "WHY CHOOSE **TRECIG?**" |
| Industries We Serve | Banner → intro → "CORE **INDUSTRIES**." → **3×2 light cards** with rocket bullets → angled video + "OUR **COMMITMENT** TO YOUR INDUSTRY." |
| Press & Media | Banner → "FEATURED IN" (BBB A+ and Alignable badges) → event title + date/venue → large video embed → **4-column press list** (uppercase title + red date) |
| Careers | Banner → "**CAREERS** AT TRECIG" → **3 filter dropdowns** (Category / Type / Location) → **2-column job cards** ("HOT" badge, category, location, red "More Details →") → angled video + "WHY WORK AT **TRECIG?**" → black band "YOUR **FUTURE** STARTS HERE" + careers email |
| Job detail | Banner with job title and breadcrumb → 2 columns: **long structured description** (Position Summary, Key Responsibilities, Required Qualifications incl. TS/SCI and Security+, Education, Desired) on the left and a **boxed "APPLY FOR THIS POSITION" form** on the right → category/type/location meta |
| Contact | Banner → "**CONNECT** WITH US." → **3-item info strip** (HQ / Let's Talk / We Get It Done hours) → **sectioned intake form**: Contact Information · Project Information · Project Specifications · Confidentiality Agreement → black pill "SUBMIT YOUR REQUEST" |
| Blog post | "BLOG" eyebrow → uppercase title with red dot → featured image → article; sidebar with Recent Posts and Newsletter; dark "Something to say? Get in touch" form band |

---

## 3. Technology

- **WordPress 7.1.4** with the **Hello Elementor** theme (plus a child theme), **Elementor 4.3.6** and **Elementor Pro 3.31**.
- **WP Job Openings (AWSM) 4.2.1** runs jobs with category, type and location filters. **Contact Form 7** plus a date-time picker runs all forms.
- Hosted on **GoDaddy** (GoDaddy mu-plugin present). A **TrustedSite** "Certified Secure" badge is fixed bottom-right on every page (z-index 1000003).
- **Poppins** is self-hosted through Elementor's Google-fonts mirror, all weights 100–900. Icons come from Ionicons and a custom icon pack (outline rocket, phone, mail, globe, clock).
- **Background videos** use Elementor's YouTube integration (IDs such as `gg193xV0eM8`, `_nNe7OnA1z4`, `PXAvRUYTov0`, `OzwCnEEadts`, `R7xS8Fvt-Rw`, `jgk3fMDfoTc`). There is also one **self-hosted** video, the globe hologram, saved at `assets/medias/…/animation-of-the-earth-revolve-around-holographic-…mov` (8 MB).

---

## 4. Design system: how it's displayed (measured)

### Grid
- Boxed container **1270px** wide with about **85px side margins** at 1440px. Content columns often narrow to about 780px (centred intro copy) or 480px (text beside media).
- Elementor breakpoints: **1024px** (tablet) and **767px** (mobile).

### Colour
| Role | Value | Used for |
|---|---|---|
| **Accent red** | **#B22239** (`--e-global-color-accent/secondary`) | Highlighted heading words, nav hover and active, dropdown hover fill, button hover fill, dates, icons |
| Black | #000000 (`primary/text`) | Headings, body, bands, pill submit buttons |
| White | #FFFFFF | Page background, header, footer |
| Navy | #1F3864 | The "CMMC Level 2 Certified" statement |
| Dark navy | #191C26 | Dark form band on blog posts |
| Grey-blue | #A9AFC3 | Global secondary tone |
| Link pink | #CC3366 | Default `<a>` colour (a theme leftover). It shows on the careers email and contact links. |
| Light grey gradient | (#F2F2F2 → white) | Industry cards, press list, contact info strip |

The palette is deliberately **patriotic** (red / navy / white plus a chrome logo) and very **high-contrast** (pure black on white, white on video).

### Typography: Poppins only, one strong voice
| Use | Spec |
|---|---|
| Page title (banner) | **36px / 800, uppercase, line-height 1.0**, white, centred (coded as H2, not H1) |
| Banner tagline | 18px / 600 uppercase white, "TRECIG IS MORE THAN A NAME—IT'S A PROMISE." on every banner |
| Breadcrumb | 12px / 400 uppercase white, ">" chevrons |
| **Two-tone section title** | **36px / 800 uppercase, line-height 1.0, black, with 1–2 key words in red #B22239**. Some end with a **red full stop** ("CORE INDUSTRIES.", "CONNECT WITH US."). |
| Tile / card heading | 18px / 700 uppercase, line-height 1.2 |
| Callout heading (home globe) | 16px / 700 uppercase white |
| Body | **16px / 400 (or 300), line-height 24px**, often with **bold lead-ins** ("**Strategic Planning:** Collaborate…") |
| Small caps labels | 12–14px uppercase (award captions 12px / 600, nav 14px / 400, dropdown 13px / 400) |
| Footer column heads | 18px / 700 uppercase ("LET'S TALK:", "TRECIG HQ:", "CONNECT WITH US:") |

Everything structural is uppercase. Weight contrast (800 headings vs 300–400 body) does the hierarchy work instead of colour.

### Shape language
- **Square corners everywhere**: cards, tiles, dropdowns and fields all have 0 radius.
- **The only round things are pill buttons** (30px radius) and circular social icons.
- **Diagonal / angled media panels:** a half-width video or image with one slanted edge. It's made with a CSS border triangle: an absolute `::after` with `border-top: 600px solid transparent; border-right: 100px solid #fff`. Panels alternate between the left and right side across pages. See `pages/industries-we-serve/interactions/angled-video-panel-live.png`.
- **Full-bleed bands** (video, black, grey) alternate with white content blocks to set the rhythm.
- **Shadows:** almost none. Only the sticky header has `0 0 12px rgba(0,0,0,.1)`.

### Components
| Component | Look and placement |
|---|---|
| **Header** | White, **170px tall**. Large chrome globe logo (200×150) at left. Nav at right in Poppins 14px uppercase black, with chevrons on items that have submenus. The **active page is red**. |
| **Sticky header** | After scrolling, the header section becomes `position: fixed`, **white at 90% opacity** with a soft shadow, z-index 9999. Compare `screenshots/desktop-viewport-top.png` and `desktop-viewport-scrolled.png`. |
| **Dropdown menu** | Flat white panel, min-width 200px, **no shadow, no radius**. Items are 13px uppercase with 10px padding. The **hovered item fills red with white text**. See `pages/home/interactions/dropdown-0.png`. |
| **Page banner** (every interior page) | About 400px tall, **video background + dark overlay**. Centred uppercase title, tagline and breadcrumbs. This is the main consistency device of the site. |
| **Home hero** | Full-bleed YouTube background video (~675px) with a 40% black overlay and **no text or CTA**. Pure atmosphere. |
| **Proof strip** | Directly under the hero: certification statement, then a row of cert badges (VetHUB / MBE / DBE / SDVOSB / Rucker Foundation), then 8 award badges with captions. |
| **Quote band** | Video background, big uppercase two-tone quote. |
| **Globe callout section** | Black. A centre video of a rotating hologram globe, with 5 short text callouts arranged left and right and connected to glowing dots on the globe by thin diagonal lines. This is the visual "wow" moment. |
| **Angled split section** | Half-width angled video on one side. The other side has a two-tone heading + paragraph or a **red outline-rocket icon list**. |
| **Dark service tiles** | 2×2 grid, each tile on a dark photographic background. White uppercase heading, light body, bold lead-in bullets. |
| **Light industry cards** | 3×2 grid, pale grey gradient, centred uppercase heading, rocket bullets. |
| **Team row** | Portrait on the left with an italic quote caption under it. Right side: name (24px / 800 uppercase), titles (uppercase), multi-paragraph bio. ⚠ The second leader (Martha Key) is styled differently: name and title are plain 16px bold paragraphs, not headings. |
| **Job card** | Bordered white card in a 2-column grid. Uppercase title 18px / 600, grey category and location, red "More Details →", red **"HOT"** badge. Filter selects sit above the grid. |
| **Job detail** | Long structured description on the left, **boxed apply form** on the right (Full name, Email, Phone, Bio, CV upload limited to .pdf/.doc/.docx, consent checkbox, black pill Submit). |
| **Forms** | **Underline-only fields** (no boxes), small grey labels, selects with chevrons, sectioned with uppercase sub-headings. Submit is a **black pill**. |
| **Buttons** | Ghost pill (1px border, 30px radius, 15×30px padding, uppercase 14px). On hover it **fills red #B22239** (0.3s). Solid black pill for form submits. |
| **Footer** (every page) | White, 4 columns: huge logo + ghost "LET'S TALK" pill · "LET'S TALK:" phone and email with red outline icons · "TRECIG HQ:" city · "CONNECT WITH US:" black circular LinkedIn icon (turns red on hover). Then a thin rule, centred Privacy \| Terms links, and "©2026 TRECIG, LLC". |
| **Floating** | TrustedSite badge, fixed bottom-right. |

### Motion and interaction (measured in Chrome)
- **Motion comes from video, not animation.** No scroll or entrance animations exist (no Elementor animation settings in the markup). Atmosphere comes from looping, muted background videos in the hero, banners, quote and CTA bands, and the angled panels.
- **Hover:** nav text black → red (0.4s). Ghost pills fill red (0.3s). Dropdown items fill red. Social icons black → red. Footer links pink → red.
- **Sticky translucent header** after scrolling.
- **Dropdowns:** in automated Chrome they opened on **click, not hover** (SmartMenus treated the session as touch). Mouse users on desktop probably get hover-open.
- **Mobile menu:** a hamburger opens a full-width list under the header. The current page is a red bar with white text, and submenus have chevrons. See `pages/home/screenshots/mobile-menu-open.png`.

### Responsive behaviour
- Grids collapse to 1–2 columns. The award badges become a long 2-column stack (the home page is 5,810px tall on mobile).
- Two-tone headings stay uppercase and wrap to 2–3 lines.
- In the mobile capture, the hero video area showed as a **flat grey block**. YouTube backgrounds often don't autoplay on phones, which leaves an empty space.

---

## 5. What TRECIG does well (the philosophy worth borrowing)

1. **Credentials first.** Certifications, awards and "CMMC Level 2" appear right under the hero, before any sales copy. Trust is the opening argument.
2. **One page system, repeated perfectly.** Every interior page uses the same banner (title, tagline, breadcrumbs), so the site feels like an organisation, not a collection of pages.
3. **A single, confident typographic voice.** One typeface, heavy uppercase headings, and *one highlighted keyword in the accent colour*, repeated everywhere.
4. **Rhythm by contrast.** White content blocks alternate with full-bleed dark or video bands, and media sits on alternating sides.
5. **Cinematic atmosphere** from looping footage (military, operations centres, flags, globe) instead of stock photos, so it feels "mission" rather than "office".
6. **A signature graphic device** (the angled panel) that's cheap to build and instantly recognisable.
7. **Mission language:** "mission", "promise", "legacy", "ecosystem", "dots delivered". The copy and visuals tell the same story.
8. **Serious, structured forms**: project-intake with sections, a confidentiality agreement and specific fields. They signal "we handle real contracts".
9. **Job board done properly**: filters, location-specific cards, "HOT" flags, full structured job descriptions (clearance, certs, education) and an apply form beside the description.
10. **Real leadership with credentials** (retired CW5 / CW4, degrees) on the team page.

## 6. What to avoid (observed problems)

- **YouTube player chrome shows through** on angled video panels (video title, channel avatar, pause and share buttons). See `pages/industries-we-serve/interactions/angled-video-panel-live.png`. The panels also render **black** until YouTube loads.
- **Heavy dependence on YouTube embeds** costs performance, shows a grey or black block on mobile, and adds third-party tracking.
- **The home hero has no message and no CTA.** A visitor sees video and has to scroll to learn what TRECIG does.
- **No H1 on any page** (banner titles are H2s).
- **Phone link mismatch:** the footer shows (469) 653-9009, but the link dials `tel:(254) 338-6131`.
- **Typos on badges and copy:** "202O HIRE VETS GOL AWARD", "RUKER RECEIVED", "withing", "Triceg".
- **Contrast bug:** on blog posts the "Something to say? Get in touch" heading and labels are dark on a dark band.
- The **pink #CC3366 default link colour** leaks into a few links. The **footer logo is very large** (about 400px). Job taxonomy archives are bare plugin pages.

---

## 7. Where to find everything in this folder

```
trecig-reference-site/
├─ SITE-OVERVIEW.md      ← this file
├─ SITE-DATA.md          ← generated: page index, type scale, colours, Elementor global tokens, fonts, breakpoints, stylesheets, scripts
├─ crawl-summary.json
├─ assets/               ← all CSS, fonts, images + the globe video; manifest.json maps URL → file
└─ pages/<page>/
   ├─ PAGE.md            ← section map + element-by-element layout (position, size, font, colour, spacing), nav, hover states, forms, images, links, mobile outline
   ├─ content.txt · raw.html · rendered.html · layout-*.json · page.json
   ├─ screenshots/       ← desktop/tablet/mobile full page, one crop per section, top vs scrolled header, mobile menu
   └─ interactions/      ← (home, industries) open dropdowns, hover before/after crops, live angled-video panel
```
