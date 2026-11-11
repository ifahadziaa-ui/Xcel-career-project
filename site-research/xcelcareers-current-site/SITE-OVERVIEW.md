# XcelCareers — current site audit (xcelcareers.com)

> **What this is:** a full capture of the client's *current* website, taken 8 Nov 2026 in real Chrome at three widths (desktop 1440px, tablet 820px, mobile 390px).
> This file is the human summary. Exact measurements for every element are in each page's `pages/<page>/PAGE.md`. Site-wide fonts, colours and tokens are in [SITE-DATA.md](SITE-DATA.md).

---

## 1. Business facts found on the site (content to carry over)

| Item | Value | Where it appears |
|---|---|---|
| Trading name | **XcelCareers Staffing Solutions** | logo, titles, footer |
| Legal name | **XcelCareers (XC), LLC** | `/elementor-2611/` (capability statement) |
| Positioning | "Top Talent Solutions: Expert Staffing for Systems Engineers, Cloud Engineers, and Software Engineers" | home H1 |
| Ownership status | **Minority veteran-owned small business** | capability statement |
| Experience claim | "Over 20 years of staffing expertise" / "combined 20+ years" | home, footer, contact |
| Phone | **410.865.9558** (`+1 410.865.9558`) | header CTA button, contact page |
| Email | **HRservices@xcelcareers.com** | hero CTA (mailto), footer, contact, job pages |
| Address (main) | 10155 Baltimore National Pike, Ste 105, Ellicott City, MD 21042, United States | footer and contact page |
| Address (alt.) | ⚠ 6013 Bricker Rd, Dayton, MD 21036 | `/contact-2-2/` "Company Data" page. **This conflicts with the main address; confirm with the client.** |
| UEI | **KQGDQLETUZ43** | `/contact-2-2/` |
| CAGE code | ⚠ "XXXXX" (placeholder, never filled in) | `/contact-2-2/` |
| NAICS codes | 561311 Employment Placement Agencies · 561320 Temporary Help Services · 541330 Engineering Services · 541511 Computer Programming Services · 541512 Computer Systems Design Services | `/contact/`, `/contact-2-2/` |
| WP author account | "Kevin Gay" (`kevthedev00`), probably the previous developer | `/author/kevthedev00/` |

### Proof points: the strongest copy on the site, currently hidden on an unlinked page (`/elementor-2611/`)
- "Sourced and placed over **600+** Cyber Security, Systems Engineers, DevOps, Developers… throughout the **DOD, Intelligence Community**, and other government agencies."
- "Place candidates **70% faster** than industry average."
- **Past performance:** General Dynamics (Huntsville AL, 2017: MBSE engineers) · Indeed (2022: market research for AI-ethics data scientists and ML engineers) · Northrop Grumman (Falls Church VA, current: Codex contract, 8 cleared cyber engineers placed).
- **Differentiators:** Navy's top recruiter for the Northeastern Region (2006) · 400 hires closed in 2018 · a 120+ person task order staffed in 45 days · supported the top 5 defense contractors · **internal database of 300,000+ candidates**.
- **Core competencies:** Direct Hire / Contract-to-Hire · Contract / Temporary Hire · Rapid Task Order, IDIQ and Proposal Staffing · AI tools for global market data research · Candidate Screening Support · Advanced Training with Sourcing Tools · Staffing Matrix Development and Compliance Support · Salary Analysis and Competition Support · Hard-to-recruit positions (unfilled 30+ days).

### Client / partner logos used in the "Companies We Work With" carousel
US Army · US Air Force · US Navy · US House of Representatives (seal) · Microsoft · Amazon · Boeing · Raytheon Technologies · Lockheed Martin · Northrop Grumman · General Dynamics · Parsons · Alion · Georgia Tech · NewWave Telecom & Technologies · UnitedHealthcare · Farmers Insurance.
The image files are in `assets/images/xcelcareers.com/wp-content/uploads/2022/03/` and `/2023/08/`.

### Two audiences the site is trying to serve
1. **Employers / government contractors** hiring Systems, Cloud and Software engineers (home page, capability statement, NAICS/UEI data).
2. **Job seekers and career-changers** ("Transition Into Tech" coaching: consultations, resume reviews, bootcamp/cert advice, GovTech and clearance guidance for veterans, sample resumes), plus the job board.

---

## 2. Page inventory

| URL | In main nav? | State | What it is |
|---|---|---|---|
| `/` | ✅ Home | Live, real content | Hero → black "find your next opportunity" band → "Your Partner…" intro + 4 "Why choose us" cards → "Comprehensive Staffing Solutions" 2-col with 4 icon bullets → client-logo carousel → footer |
| `/transition-into-tech/` | ✅ | Live, real content, but the embedded job list looks broken | Hero → job-board widget (3 jobs, grey placeholder images, unstyled keyword search) → "Your Path to Tech Success" → 9 service cards (3×3) → "Our Core Competencies" list beside a satellite image → logo carousel |
| `/jobs-2/` | ✅ Jobs | Live | Simple Job Board listing: keyword search on a grey panel, 3 job cards (Software / Cloud / Systems Engineers), each "Posted 2 years ago" with *Quick Apply* and *Read More* |
| `/jobs-3/{systems,cloud,software}-engineers/` | via Jobs | Live, ⚠ **job title doesn't render**, description is one line | Job detail: "Compensation varies… email HR" + "Apply For This Job" form (First name, Last name, Email, Resume upload, Submit) |
| `/contact/` | ✅ | Live | "Get In Touch" intro → 3 cards (Location / Call / Email) on a blob background → "NAICS Codes" as 5 dark tiles. **No contact form.** |
| `/elementor-2611/` "Home-Elementor" | ❌ orphan | Unfinished, but has the **best content** | Long single-column **Capability Statement**: About Us, Core Competencies, Past Performances, "And Many More…" (16 **broken logo images**, showing only alt text), Differentiators |
| `/contact-2-2/` "Contact" | ❌ orphan | Unfinished | "Company Data": second address, UEI, CAGE placeholder, NAICS list as huge red headings |
| `/about-us/` | ❌ orphan | ⚠ **Untouched theme demo** | Co-working-space template: "About Our Co-Working Place", fake team (Kristen Lewis / James O'Neil / Nataliya Stepulev), "Get your place" buttons, logoipsum logos |
| `/pricing/` | ❌ orphan | ⚠ **Untouched theme demo** | "Pricing Plans": Membership $29/mo, Dedicated Desk $89/mo, Dedicated Office $228/mo… desk-rental copy |
| `/author/kevthedev00/` | ❌ | WP archive | Empty author page |

The site has 4 nav items plus one phone button, and no dropdowns. Everything else is reachable only by URL or the sitemap.

---

## 3. Technology

- **WordPress 7.1.4** with the **Spectra One** block theme (v1.1.6, from Brainstorm Force/Astra) and the **Spectra (Ultimate Addons for Gutenberg) 2.19.26** and **Spectra Pro 1.2.9** blocks. Pages were started from *Astra Pro Sites* starter templates (that is where the co-working demo pages came from).
- **Simple Job Board 2.14.5** plugin runs the jobs, applications and resume uploads. It loads Roboto from Google Fonts even though the site uses Inter.
- **Google Site Kit** (analytics).
- The host runs **ModSecurity**, which returns 406 to non-browser requests (sitemap.xml and robots.txt fail with curl). Browser requests work.
- Carousels use **Slick** (Spectra image gallery); Swiper is also loaded.
- Font Awesome 5 is loaded for icons.

---

## 4. How it's displayed: global layout and design system

### Grid and spacing
- Content width is **1164px** (header, footer, groups) or **1200px** (Spectra containers), centred. That leaves side margins of about 120–138px at 1440px.
- Section rhythm is mostly **72px** top and bottom padding (`--wp--preset--spacing--x-large` = 4×18px), with 100px spacer blocks between home sections.
- Two-column blocks use a **108px** gap. Card rows use 16–20px gaps.
- Breakpoints are WordPress core defaults: **600 / 782 / 960px**.

### Colour (measured)
| Role | Value | Notes |
|---|---|---|
| Brand red | **#B42117** (also #B42217) | Headings, buttons, footer background, icons. Two near-identical reds are both in use. |
| Black | #000000 | Header background, CTA band, body text |
| White | #FFFFFF | Page background, text on dark |
| Dark grey | #282828 | NAICS tiles on Contact |
| Light grey | #F2F2F2 | Job search panel |
| Hero overlay | #000 at 48% opacity | Over hero photos |
| *Leftover theme palette* | #1A0B32 / #251047 / #382A51 (purples) | Spectra One defaults, still defined. #382A51 shows up as the `<hr>` colour on the home page. |

### Typography
**Inter only** (self-hosted weights 100–700). Headings use negative letter-spacing.

| Use | Size / weight / line-height | Colour |
|---|---|---|
| H1 (hero) | 56px / 500 / 67.2px, letter-spacing −2px | white |
| H2 section titles | 44px / 500 / 52.8px, −1px | red #B42117 (mostly centred) |
| H3 (CTA band) | 36px / 500 / 46.8px, −1px | white |
| Card titles (H5) | 22px / 600 / 31.9px | red |
| Body | **18px / 400 / 28.8px** (1.6) | black |
| Nav, footer text, buttons | 16px / 400–500, nav letter-spacing 0.25px | white |
| Small / copyright | 14px | white |

The site defines a fluid type scale (`clamp()` sizes from 12px to 56px, listed in SITE-DATA.md).

### Shape and depth
- **Signature shape:** each hero has a **large rounded bottom-right corner**, `border-radius: 0 0 120px 0` on desktop and 40px on mobile.
- Card radius is 8px, button radius 5–6px, icon circles 50%.
- Card shadow is very soft and diffuse: `0 40px 100px -40px rgba(0,0,0,.24)`. The logo cards use `0 24px 80px -24px`.
- A large pale **blob SVG** (`blob-grad.svg`) sits behind the intro and card sections on Home, Contact and Transition.

### Components
| Component | How it looks / where |
|---|---|
| **Header** (all pages) | Full-width black bar, **153px tall** (also 153px on mobile). Logo at left (square PNG shown at 153×153). Nav at right: Inter 16px white, 36px gaps. Then a red **phone-number button** ("410.865.9558", 6px radius, about 153×41). Not sticky: it scrolls away. |
| **Hero** | Full-bleed photo with a 48% black overlay, min-height **900px**, text block on the left about 540–600px wide, one red button, curved bottom-right corner. Home uses a woman in an office, Transition a B&W city skyline, About a team at a table. |
| **CTA band** | Black box in the container (54px padding). H3 + paragraph on the left, red button right-aligned ("Explore Job Listings"). |
| **Feature cards** | White cards on a blob background, red check icon in a circle, red 22px title, 18px body. Home: 4 in a row, each only 200px wide on desktop, so text wraps one or two words per line (see layout issue below). Transition: a 3×3 grid at a better width. |
| **Icon bullet grid** | 2×2 small duotone icons with one-line statements, beside a tall rounded image (home "Comprehensive Staffing Solutions"). |
| **Logo carousel** | "Companies We Work With": Slick slider, 3 logos visible, 17 dot buttons. Logos have mixed sizes and backgrounds (some on white, some on grey). |
| **Contact cards** | 3 white cards: grey icon circle, red title, text or link. |
| **NAICS tiles** | 5 dark-grey (#282828) tiles, big white code + name, set very large (about 40px). |
| **Job list** | Plugin default styling: grey search panel, bordered cards, plain black-outlined buttons. It doesn't match the brand. |
| **Footer** (all pages) | Full-width **red #B42117**, 72px top padding. 3 columns: (1) white logo + company blurb, (2) "Address:", (3) "Contact:" email (underlined). Centred copyright line "© 2025 · XcelCareers Staffing Solutions · All rights reserved". No social links, no footer nav. |

### Behaviour and interaction (measured by hovering and scrolling in Chrome)
- **No hover effects detected** on nav links, buttons or cards. Colours, background, shadow and transform stay the same.
- **No scroll or entrance animations.** No animation settings were found in the markup.
- **Header is static** (not sticky or fixed).
- **Mobile menu:** a hamburger opens WordPress's default **full-screen white overlay** with centred black links in a system font and an "X" close button. It has no branding. See `pages/home/screenshots/mobile-menu-open.png`.
- **Carousel:** auto-advancing logo slider with dots.

### Responsive behaviour (mobile 390px)
- Columns stack to one; hero text is centred. The H1 drops to 40px / 48px line-height and wraps to **8 lines** in a 282px column.
- The home page grows from 4,903px (desktop) to **6,028px** tall, and Transition to **9,859px**.
- ⚠ The **logo carousel overflows sideways**: the page renders 398px wide on a 390px screen, so it scrolls horizontally.
- The header stays 153px tall on mobile, about 18% of the first screen.

---

## 5. Problems to fix in the redesign (observed)

1. **Two public demo pages** (`/about-us/`, `/pricing/`) show co-working-space content, fake staff and fake prices. They're live and indexable.
2. **Best content is hidden:** the capability statement (600+ placements, past performance, differentiators) and the company data (UEI, NAICS) are on unlinked draft pages.
3. **Broken images:** 16 logos on `/elementor-2611/` show only their alt text.
4. **Job detail pages have no visible job title**, and the descriptions are one line ("Compensation varies…"). Every job says "Posted 2 years ago", so the board looks abandoned.
5. **Job board styling** is plugin default (different font, bordered boxes, grey placeholder "company" images). The Transition page embeds the listing with large empty placeholder images.
6. **Address conflict** (Ellicott City vs. Dayton, MD), and the **CAGE code is a placeholder**.
7. **No meta descriptions or Open Graph tags** on any page. No social links.
8. **Home "Why choose us" cards are 200px wide** (four at `max-width:33%` inside an 864px container), which gives tall, narrow cards with one or two words per line.
9. **Inconsistent reds** (#B42117 and #B42217) and leftover purple theme colours.
10. **No hover, focus or motion feedback** anywhere, and the header isn't sticky.
11. **Mobile:** horizontal overflow from the carousel, a 153px header, and an unbranded menu overlay.
12. **Copyright year** is hard-coded to 2025.
13. **No contact or enquiry form.** The only conversion paths are a mailto link and the phone number.

---

## 6. Where to find everything in this folder

```
xcelcareers-current-site/
├─ SITE-OVERVIEW.md      ← this file (human summary)
├─ SITE-DATA.md          ← generated: site-wide type scale, colours, CSS tokens, fonts, breakpoints, stylesheets, scripts
├─ crawl-summary.json
├─ assets/               ← every stylesheet, font and image the site loaded (mirrors original paths); manifest.json maps URL → file
└─ pages/<page>/
   ├─ PAGE.md            ← section map + element-by-element layout (position, size, font, colour, spacing), nav, hover states, forms, images, links, mobile outline
   ├─ content.txt        ← all visible text, in order
   ├─ raw.html           ← HTML as served
   ├─ rendered.html      ← DOM after JavaScript ran
   ├─ layout-desktop|tablet|mobile.json ← full element tree with computed styles + coordinates
   ├─ page.json          ← meta, tokens, usage stats, sections, header/nav/hover behaviour
   └─ screenshots/       ← desktop/tablet/mobile full page, one crop per section, viewport top & scrolled, mobile menu open
```
