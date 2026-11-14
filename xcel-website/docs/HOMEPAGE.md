# Homepage (migration Stage 3: static sections)

Built from `landing-prototype-clean/index.html`, `css/sections.css`, `css/hero.css`. Page: `src/app/page.tsx`. Foundations: [FOUNDATIONS.md](FOUNDATIONS.md). Shell: [SHELL.md](SHELL.md).

## Sections, in the prototype's order

| Section | Component | Notes |
|---|---|---|
| Hero (`#top`) | `components/hero/Hero.tsx` + `hero.module.css` | XcelCareers copy; no header of its own (an empty, hidden spacer keeps the stacked-layout room); `data-chat-hero` keeps the chat launcher out of its corner |
| 02 Certifications and customers (`#certifications`) | `home/Certifications.tsx` | Customers as name tiles only (no logos: permission unconfirmed) |
| 03 Showreel (`#services`) | `showreel/Showreel.tsx` | Static stage (Stage 5B-1): the opening frame with the real page height, no motion yet. See `docs/SHOWREEL.md` |
| 04 Process (`#process`) | `home/Process.tsx` | Four steps and the split line |
| 05 Example roles (`#jobs`) | `home/Jobs.tsx` | Five-card fan; every card says "Example"; card photos are `MediaSlot` placeholders |
| 06 Capability (`#capability`) | `home/Capability.tsx` | Paper poster; the cover image is a `MediaSlot`; button goes to `/capability` (no PDF exists) |
| 07 On the record (`#record`) | `home/Record.tsx` | Four stat placards and the ledger |
| 08 FAQ (`#faq`) | `home/Faq.tsx` | Native `<details name="faq">`: one open at a time, Enter/Space, no JavaScript; example tags under two answers |
| 09 Contact (`#contact`) | `home/ContactSection.tsx` + `ContactForm.tsx` (client) | See below |

Shared: `home/home.module.css` (the prototype's section CSS, camelCased, same values and breakpoints), `home/parts.tsx` (eyebrow, button), `home/MediaSlot.*` (the single isolated placeholder for photos and clips: the media stage replaces its body).

Server components throughout except `ContactForm`. All wording comes from `src/content/content.ts` except the hero's short labels (hard-coded in the prototype's `index.html`, copied exactly; CAGE and the certificate number read from the content module).

## Contact form

The three fields (organization, role, work email) are validated on submit: one message at a time, the first problem is focused and marked `aria-invalid`, the message is a live region (`role="alert"` when an error), typing clears it. When all three are valid the page navigates to `/contact` **with no query string**: the inputs have no `name`, the values are never put in the URL, sent, stored or logged, and no success message is shown. Actual submission awaits a future backend; the request form lives on `/contact` (a placeholder until its stage), so the typed details are not carried over.

## Deliberately not in this stage

Scroll reveals, parallax, tilt, line-split copy animation (the prototype's `data-m` motion), the preloader, the showreel and all media (photos, clips, logos). Every element is in its final, revealed state.

## Differences from the prototype

- No reveal or parallax transforms; job-card positions are the static design coordinates.
- Job cards, poster cover and contact card show the quiet placeholder (mark on graphite or paper) instead of photos.
- The showreel stage stands where the showreel will be (static until Stage 5B-2; `docs/SHOWREEL.md`).
- The hero's original header is replaced by the shared fixed bar; its hidden spacer is empty.

## Content points

- **Corrected:** `CAPABILITY.points[0]` (poster) no longer pairs "Minority veteran-owned" with the certificate number: "Maryland MBE · DBE · SBE No. 19-286. CAGE 89AK6." This and the next item are the only places the homepage differs from the cleaned prototype's wording.
- **Placement decision (certifications section):** the heading is now "Certified in Maryland" over the MBE/DBE/SBE badges, followed by the certifier line (certificate number, since). The CAGE code is shown separately with UEI and NAICS (`CAGE 89AK6 · UEI … · NAICS …`), and "Minority veteran-owned small business" (`CERT_LINE.text`) sits on its own ruled line at the end of the section, apart from both. Nothing places the self-description beside the certificate or the CAGE code, and nothing implies either establishes veteran-owned status.
- **Same decision for the Government Contracting page migration:** keep the MBE/DBE/SBE certification, the certificate number, CAGE/UEI/NAICS and the veteran-owned self-description as three separate items. In `SERVICE_PAGES.government`, the list item "A minority veteran-owned small business" is mixed into the prime-contractor list next to "A certified Maryland MBE, DBE and SBE partner" and the `checks` row ("MBE, DBE, SBE, CAGE, UEI"): when that page is built, move the ownership item out of the certification group into its own separated line, and never put it in the `checks` row or beside the certificate number.
