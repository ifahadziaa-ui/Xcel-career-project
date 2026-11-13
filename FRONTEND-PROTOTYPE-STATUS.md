# Frontend prototype: scope, decisions, Definition of Done and status

> **Purpose.** The single place that says what the *homepage frontend prototype* has to be, what has been decided, what is done, and what is still open. It covers `landing-prototype/` only. Business facts are in [PROJECT-BRIEF.md](PROJECT-BRIEF.md); how to work in the repo is in [CLAUDE.md](CLAUDE.md).
>
> Related: [docs/LANDING-PROTOTYPE-GUIDE.md](docs/LANDING-PROTOTYPE-GUIDE.md), [docs/TESTING.md](docs/TESTING.md), [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md), [docs/BACKEND-HANDOFF.md](docs/BACKEND-HANDOFF.md).
>
> **Last updated:** 14 Nov 2026. **Branch:** `landing-prototype-merged` = `main` (second pass: shorter showreel ending, nine inner pages, candidate sign-in) merged with `landing-prototype-completion` (this plan's work). `main`'s functional content wins; the completion decisions below are applied on top of it, including on the inner pages.

Tags used below: **[C]** confirmed requirement (a document or the user states it) · **[I]** reasonably implied · **[R]** a recommendation made during the work · **[D]** a decision the user made.

---

## 1. Scope

- **Homepage first.** The existing one-page prototype is finished and reviewed before the other seven pages (Healthcare Staffing, Government Contracting, IT · Finance · Cyber, Jobs, Capability, About, Contact; `site-research/WEBSITE-CONTENT.md` §2) are designed. [D]
- Everything on the homepage counts: navigation, every section, the footer, the chat widget UI and every client-side interaction.
- **Deferred to production:** form delivery, the ATS jobs feed, résumé upload, the real capability PDF, call booking, lead routing to Barry Klasson, the live-AI chat mode, analytics, redirects from the old site, security and privacy work, formal cross-browser and screen-reader audits.
- Placeholders for photos, video and logos are expected at this stage (client assets are pending). They are listed in §5.

## 2. Decisions made (13 Nov 2026 unless stated)

| Topic | Decision |
|---|---|
| Hero image | Keep the heart specimen image. |
| Hero headline vs video card | Leave the headline behind the card, as the Superconscious brief specifies. |
| Mobile navigation | Keep the two-row bar (no menu). |
| Self-link buttons ("View all jobs", "Download PDF", "Request staff") | Superseded by `main`: they now go to their pages (`jobs.html`, `capability.html`, `contact.html`). |
| Contact section | `main`'s three-field request form (organization, role, work email) opens `contact.html` prefilled. It is checked first: an empty or malformed field shows an inline error and nothing is submitted. (Replaces the earlier "validate and send nothing" email teaser.) |
| Accessibility target | WCAG 2.1 AA, plus 2.4.11 Focus Not Obscured and 2.5.8 Target Size from 2.2. |
| Reduced motion | Stop what moves on its own (marquee, shaders, mark sway, cursor tilt, looping placeholders); scroll-linked 3D motion is left as it is. A pause toggle in the top bar covers WCAG 2.2.2 for everyone. |
| Chat launcher | Hides while scrolling, returns after 1 s of stillness. |
| Sideways snap | Implemented, with no on-screen hint. |
| Vertical snap (14 Nov 2026) | A tap on ↓ / ↑ inside the showreel steps to the next resting beat; holding the key scrolls freely. Wheel unchanged. |
| Text | Token-only sizes below the hero with an 11 px floor (`--type-min`). The Geist Mono labels in the showreel chips and the footer logo stay as they are. |
| Red | One red, `#ff2a45`. Text on red fills is graphite. The capability poster uses lighter paper and a dark caption. |
| Browsers | Latest Chrome and Safari. |
| Adaptive resolution | On (sphere and aurora canvases). |
| CDN files (three.js, Lenis, fonts) | Left for production. |
| White line during the hero transition | Dropped (judged to come from the user's setup). |
| Black closing-frame background in the user's Chrome | Left alone for now (see §4). The closing scene was redesigned on `main` (no 3D flight); its gradient keeps its own canvas and a CSS fallback. Needs a re-check on a real GPU. |
| Merge (14 Nov 2026) | Pause toggle, reduced motion, 11 px floor, one red, graphite on red, scroll padding and arrow-key vertical snap also apply to the inner pages' shared bar (`js/site.js`) and the new closing scene. The "Now staffing" status hides below 896 px to make room for the toggle and Sign in. Inner-page forms got 3:1 field borders, hover and a visible focus ring (also on the date field), the "optional" label reaches 4.5:1, and the job chips, save buttons, links and login tabs got hover states. Checked: no overflow or sub-11 px text on all ten pages at 1400, 768 and 390 px; contrast clean apart from the footer logotype; keyboard walk finds no focus hidden under the bar or launcher on jobs, contact and healthcare. |

## 3. Plan and progress

| Phase | Content | Status |
|---|---|---|
| 0 | Baseline measurements at 1400, 1024, 820, 768, 390, 360, 320 px | Done |
| 1 | Layout fixes (FAQ overflow, contact text vs photo card, badge row) and hover states | Done |
| 2 | Email teaser validation, chat launcher auto-hide | Done |
| 3 | Type scale and 11 px floor, one red | Done |
| 4 | WCAG 2.1 AA + 2.4.11 + 2.5.8, pause toggle, reduced motion | Done |
| 5 | Adaptive resolution, browser review (Chrome, Safari) | Done; Chrome closing-frame fixes added |
| 6 | Placeholder register; decisions on sample jobs, "(to confirm)" badge, NGA, testimonial and leadership slots | **Open** |
| 7 | Documentation | This update; refresh after phase 6 |
| 8 | Final check against §6 | **Open** |

## 4. Known issues and limits

- **Closing-frame background is flat black in the user's Chrome**, from the first frame. It was already present on `main`, and does not reproduce in headless Firefox or headless Chromium (software GL). Undiagnosed; likely GPU, driver or extension. The gradient now has its own canvas and a CSS fallback in case WebGL cannot draw it.
- Smoothness of the card parallax, the sphere dive and the showreel on a real GPU has not been confirmed.
- Not verified: a real trackpad and touch screen, Safari, screen readers, and the contrast of showreel text over its gradients.
- The pinned stage uses `100vh`, which can jump on iOS Safari as the address bar shows and hides.

## 5. Placeholder register (to be finalized in phase 6)

| Placeholder | Shown now | Replace with | Depends on |
|---|---|---|---|
| Hero image | `assets/specimen-placeholder.png` (a heart in a glass case) | Final hero image, or keep | User |
| Logo mark | Traced version of the PNG | Original vector logo | Client |
| Team pill | Initials QN, EF, BK | Headshots | Client |
| MBE / DBE / SBE badges | Letters plus an "Official badge" label | Official badge art | Client |
| "+ Contract vehicles (to confirm)" badge | Removed on `main` | Real vehicles once confirmed | Client (Q21) |
| Customer logos (7) | "Official logo" tiles | Logos | Client permission (Q20) |
| NGA | Named as a past customer and in the ledger | Decide; brief §1.9 says do not name until confirmed, the deck lists it with `[CONFIRM]` | Client (Q20), user decision |
| Showreel media (18 slots) and the three services-panel videos | "Photo or short loop · your asset" / "Video · your asset" | Real photos and clips, healthcare first | Client (Q25) |
| Jobs fan and `jobs.html` (12 sample listings) | Sample roles | ATS feed, or relabel as sample | ATS (Q11), user decision |
| Capability poster cover | "Photo · your asset" | First page of the healthcare capability PDF | Client |
| Contact photo card | "Barry Klasson or the client services team, real photo" | A photo | Client, user decision |
| "View all jobs", "Download PDF", "Upload résumé" | Scroll to their own section | Real destinations | Production |
| Email teaser | Validates, sends nothing | Form endpoint | Production |
| Chat "ticket" | Generated ID, nothing sent | Lead routing to Barry | Production |

## 6. Definition of Done (homepage)

**Scope and visual design**
- [x] All homepage sections in the deck's order, with the unified top bar and dock. [C]
- [x] Font split held (Mona Sans and Geist Mono in the hero and bar; Zen Kaku after). [C]
- [x] Token-only type scale with an 11 px floor, one red, no crowns, wire, ghost words or drip buttons. [C] [D]
- [x] One shared entrance motion for reveals. [C]
- [ ] Final hero image confirmed. [D]

**Interactions and forms**
- [x] Every anchor resolves; self-links agreed. [D]
- [x] Showreel, parallax, dock, sideways snap, FAQ and chat widget work with no console errors. [C]
- [x] Email teaser: empty and invalid errors, neutral note on a valid address, nothing sent. [D]
- [x] Hover and keyboard-focus states on all controls. [C] (research README lesson)
- [ ] Stage-button hover (closing frame, "See how we staff") measured on every state. [R] (checked in Chromium for the closing frame)

**Responsive**
- [x] No overflow at 1400, 1024, 820, 768, 390, 360 and 320 px. [C]
- [x] Showreel buckets follow the orientation rule. [C]
- [ ] 1920 px and landscape phones checked. [R]

**Accessibility (WCAG 2.1 AA + 2.4.11 + 2.5.8)**
- [x] Visible focus; keyboard reaches every control; focus clears the bar and the launcher; the pinned stage scrolls into view for keyboard focus. [C] [D]
- [x] Target size passes by the spacing exception. [D]
- [x] Contrast: page, chat panel and launcher text meet 4.5:1 (the footer outline wordmark is a logotype). [C]
- [x] Non-text contrast: email field and chat input borders. [C]
- [x] 2.2.2 pause toggle; reduced motion stops self-moving parts. [D]
- [x] Reflow to 320 px; text spacing overrides do not clip text. [C]
- [ ] Contrast of showreel text over gradients. [R] (cannot be computed reliably)
- [ ] Screen-reader pass. [R] (production)

**Performance and browsers**
- [x] Only visible WebGL scenes render; adaptive resolution on; no console errors. [C] [D]
- [x] Code reviewed for latest Chrome and Safari features. [D]
- [ ] Smooth on a real GPU in Chrome and Safari, including a phone. [D] (user to confirm)
- [ ] Closing-frame background confirmed on the user's Chrome. (§4)

**Content and media**
- [x] Only proof-bank facts on the page; no banned words. [C]
- [x] Title, description and one H1 match the deck. [C]
- [ ] Placeholder register finalized; sample jobs, "(to confirm)", NGA, testimonial and leadership slots decided (phase 6). [D]

**Handoff**
- [ ] Integration points documented for production: form delivery, ATS feed, résumé storage, PDF, call booking, lead routing, live chat AI. [R]
- [x] Docs updated through phase 5.

## 7. How to run and test

- Prototype: `python3 landing-prototype/serve.py` (http://127.0.0.1:3200). Servers stop when a session ends.
- Headless Firefox over Marionette (fresh profile) and headless Chromium over the DevTools protocol (see CLAUDE.md §9) are the test environments; both use software rendering.
- Switching versions: `git checkout main` shows the earlier prototype; `git checkout landing-prototype-completion` returns to this work.
