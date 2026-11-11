# Site research: XcelCareers redesign

> **Client answers are in (9 Nov 2026).** The completed questionnaire is [XcelCareers_-_Client_Questions_COMPLETED.docx](XcelCareers_-_Client_Questions_COMPLETED.docx). The brief, proof bank, sitemap and all website copy built from it are in **[WEBSITE-CONTENT.md](WEBSITE-CONTENT.md)**. Where this file disagrees with the questionnaire, the questionnaire wins.
>
> What changed from the old positioning:
> - **Healthcare staffing comes first.** Government contracting is second. IT, finance and cybersecurity are specialties across both. Engineering is no longer a service line.
> - **Address:** 6013 Bricker Rd, Dayton, MD 21036.
> - **Contact:** main line 240.579.0466. All website enquiries go to Barry Klasson, bklasson@xcelcareers.com.
> - **CAGE:** 89AK6.
> - **Certifications:** Maryland MBE/DBE/SBE, No. 19-286.
> - **Customers:** current are Montgomery County and Prince George's County (OIT). Past are Raytheon, Pearson, Capstone, Indeed and NGA. Northrop Grumman and General Dynamics are no longer claimed.
> - **Transition Into Tech** is on hold pending confirmation.

Two websites captured in full on 8 Nov 2026, stored separately:

| Folder | Site | Role | Pages captured |
|---|---|---|---|
| [xcelcareers-current-site/](xcelcareers-current-site/SITE-OVERVIEW.md) | xcelcareers.com | **Client's current site.** Source of content and facts; shows what to fix. | 12 |
| [trecig-reference-site/](trecig-reference-site/SITE-OVERVIEW.md) | trecig.com | **Design-philosophy reference.** Borrow principles, not looks. | 43 |

**Start with each folder's `SITE-OVERVIEW.md`** (human summary). For exact measurements, open `pages/<page>/PAGE.md`. It lists every section top to bottom, and every element's position, size, font, colour, spacing, hover state and mobile layout, with screenshots beside it.

### How it was captured
Every page was rendered in real Chrome at **1440px (desktop), 820px (tablet) and 390px (mobile)**, scrolled fully so lazy content loaded. For each page the capture includes:
- raw and rendered HTML, plus all visible text
- the full element tree with computed styles
- full-page, per-section and viewport screenshots
- sticky-header state before and after scrolling, nav, dropdowns and the mobile menu
- measured hover states
- forms, images and links
- every CSS file, font and image the site loaded

The scripts are in [_tools/](_tools/) and can be re-run.

---

## Side-by-side

| | **XcelCareers (now)** | **TRECIG (reference)** |
|---|---|---|
| Platform | WordPress + Spectra One block theme + Spectra blocks | WordPress + Hello Elementor + Elementor Pro |
| Font | Inter (500 headings, 18px body) | Poppins (800 uppercase headings, 16px body) |
| Accent | Red #B42117 + black | Red #B22239 + black + navy (patriotic) |
| Header | Black, 153px, static, 4 links + phone button | White, 170px, **sticky translucent**, 6 links with dropdowns |
| Hero | Photo + 48% overlay, H1 + 1 CTA, **curved bottom-right corner (120px radius)** | Full-bleed **video**, no text |
| Interior pages | Each page different; two are untouched theme demos | **One banner template on every page** (title, tagline, breadcrumbs) |
| Proof / credentials | Logo carousel; the best proof (600+ placements, past performance) sits on an unlinked page | Certifications + awards **directly under the hero** |
| Signature device | Curved hero corner, blob SVG, soft-shadow cards | **Angled video panels**, two-tone uppercase headings |
| Motion | None | Looping background videos; colour-fill hovers |
| Forms | None (mailto only) + plugin-default job apply | **Sectioned project-intake** form, partnership form, boxed job-apply form |
| Jobs | 3 generic posts, "Posted 2 years ago", no titles on detail pages | Filterable board, location-specific roles, HOT badge, full structured descriptions |
| Footer | Red band: blurb, address, email | White: logo + CTA pill, phone/email, HQ, social, legal links |

---

## What to take from TRECIG (principles, not visuals)

These are the ideas behind TRECIG's site. The look itself is not to be copied.

1. **Lead with credibility.** Put proof straight after the hero.
   - TRECIG has certifications, awards and CMMC.
   - Xcel has (confirmed by the client):
     - minority veteran-owned small business, Maryland MBE/DBE/SBE No. 19-286
     - CAGE 89AK6, UEI KQGDQLETUZ43 and five NAICS codes
     - current customers Montgomery County and Prince George's County (OIT)
     - past performance with Raytheon, Pearson, Capstone, Indeed and NGA
     - 120+ staff in 45 days, 600+ DoD/IC placements, a 300,000+ candidate database and 125+ years combined
2. **Use one interior-page template everywhere.** A consistent page header plus breadcrumbs makes the site feel like one organisation.
3. **Have one recognisable typographic move.** TRECIG uses a highlighted keyword in the accent colour. Xcel can create its own version.
4. **Build rhythm by contrast.** Alternate light content with full-bleed dark or media bands, and alternate media sides.
5. **Own one signature shape.** TRECIG has the angle. Xcel already has a candidate in its **curved corner**, so that could become the system motif rather than borrowing the angle.
6. **Bring motion and atmosphere, done better.** If video is used, self-host short, compressed loops with poster images. No YouTube player chrome or black frames, and still images on mobile.
7. **Treat forms seriously.** Add an employer staffing-request form (roles, headcount, clearance level, location, timeline, contract type) and a candidate form. This would replace today's mailto-only path.
8. **Run a proper job board.** Filters, role-and-location titles, status badges, structured descriptions (clearance, certs, education) and an apply form next to the description.
9. **Show real people.** Leadership bios with veteran credentials build trust. Xcel's current About page shows stock demo people.
10. **Use a sticky header with dropdown information architecture.** The agreed Xcel structure is the sitemap in [WEBSITE-CONTENT.md](WEBSITE-CONTENT.md): Home, Healthcare Staffing, Government Contracting, IT · Finance · Cyber, Jobs, Capability, About and Contact.

## What *not* to repeat (from either site)

- TRECIG: hero with no message or CTA, YouTube chrome on video panels, no H1s, the phone-link mismatch, typos, dark-on-dark text.
- Xcel: live demo pages (About, Pricing), hidden proof, broken logo images, untitled job pages, two slightly different reds, no hover or focus states, mobile horizontal overflow, no meta descriptions.

## Open questions from the capture: answered 9 Nov 2026

1. **Address:** 6013 Bricker Rd, Dayton, MD 21036. The Ellicott City address is retired.
2. **CAGE:** 89AK6.
3. **Logos and past performance:** the customers listed above are named. Logo permission and agency naming (NGA) are still [CONFIRM].
4. **Old job posts:** remove them. New jobs should pull automatically from their applicant tracking system; which system is [CONFIRM].
5. **Transition Into Tech:** [CONFIRM] whether it's still active. It's off the home page until then.

The remaining open items are listed at the end of [WEBSITE-CONTENT.md](WEBSITE-CONTENT.md).
