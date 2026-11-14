# Inner pages audit: XcelCareers prototype

Date: 14 Nov 2026. Read-only audit; this file is the only file created. Nothing else was edited, moved or committed.

**What was audited.** The seven inner pages in `landing-prototype-clean/`, the verified reference (its homepage passed `VERIFICATION-REPORT.md`). The same seven pages also exist in the original `landing-prototype/`; they share the same template and code but still carry the claims removed during the cleanup and verification passes (prime wording, "Roles we fill", "XcelCareers (XC), LLC", the apply form and "You applied" state, "Prototype" notices, the disabled "Download PDF"). Anything said here about content applies to the clean copy unless stated.

**Sources used**, in the project's order: the client questionnaire (Q1 to Q25), then `js/content.js` and `site-research/WEBSITE-CONTENT.md` (§4 lists the intended content of each inner page), then `PROJECT-BRIEF.md`. The TRECIG principles in `site-research/README.md` are design suggestions, not client requirements. The old site is not treated as evidence.

**How it was tested.** Headless Chromium 1254 (software rendering) on the local server (`landing-prototype-clean/serve.py`, port 3201): full rendered text and structure of every page, full-page screenshots at 1440, 768 and 390 px, an overflow and text-size sweep at 360, 390, 768, 1024, 1440 and 1920 px, heading text overflow at 360/390/768, a keyboard Tab walk per page, a solid-background contrast scan, and scripted interaction tests (filters, search, dialog, forms, tabs, deep links, prefill, reduced motion). Limits are in §I.

---

## A. Executive summary

| Status | Pages |
|---|---|
| Complete | 0 |
| Mostly complete | 6: Healthcare, Government, IT · Finance · Cyber, Jobs, Capability, Contact |
| Partially complete | 1: About |
| Early implementation | 0 |
| Placeholder | 0 |

**Overall state.** All seven pages are real, working pages, not shells. They are rendered from `content.js` by one shared template (`js/pages.js`, `css/pages.css`) inside the same header, footer, chat and motion as the homepage. They load without errors, have no horizontal overflow at any tested width, pass the keyboard walk, and every link resolves. The frontend interactions that exist (jobs search and filters, job dialog, forms with validation, contact tabs, chat-to-form prefill) work and now say honestly that nothing is sent.

What keeps them from "complete":
1. **One template, no media.** Every page is the same stack (hero, card grid, list/panel split, proof row, credential strip, ask band). There is no photography, video or media band on any inner page, and the right half of every desktop hero is empty. They are consistent with the homepage's type and colour, but far plainer than it, and the pages look alike.
2. **Client-blocked content.** About has no story, bios or headshots; Healthcare's clinical role list, prime status, customer permissions, the capability PDF and the ATS all wait on the client.
3. **A few real defects**, one introduced by the verification pass: the Government H1 is clipped on phones; the Capability hero's only button is the secondary style; two heading-level skips; contact tabs without arrow-key support; and the Jobs examples reintroduce the clinical roles that were withheld elsewhere.

---

## B. Page inventory

| Page | File / URL | Implementation | Design | Content | Main outstanding work |
|---|---|---|---|---|---|
| Healthcare Staffing | `healthcare.html` (`servicePage("healthcare")`) | Mostly complete | Template complete; no imagery; empty hero right half | Cleaned; clinical role list withheld | Media and visual distinction; client role list; any healthcare proof |
| Government Contracting | `government.html` | Mostly complete | Template complete; **H1 clipped at 360 to 390 px** | Cleaned; prime and naming pending | Fix H1; prime status and agency naming (client) |
| IT · Finance · Cyber | `specialists.html` | Mostly complete | Shortest page; no credential strip; thin | Supported by Q19 | More substance per specialty; visual distinction |
| Jobs | `jobs.html` | Mostly complete (frontend) | Good list and filter design | Examples labelled; clinical example roles conflict with withheld list | ATS feed (backend); decide example-role set; heading level |
| Capability | `capability.html` | Mostly complete | Hero's only CTA is a ghost button; customers shown twice | Cleaned; PDF absent | PDF (client); primary CTA; de-duplicate |
| About | `about.html` | Partially complete | Leadership block is three large blank mark panels | No story, bios, headshots (client) | Client content; leadership treatment |
| Contact | `contact.html` | Mostly complete (frontend) | Good; tabs wrap awkwardly on phones | Honest; no response-time promise | Form endpoint (backend); tabs keyboard; booking tool decision |

Also present but out of scope: `login.html` and `account.html` (candidate sign-in, design only; Q9 did not ask for it).

---

## C. Detailed page-by-page audit

### C1. Healthcare Staffing (`healthcare.html`)

**Section inventory (rendered, 1440 px, page height 3,375 px).**
1. Hero: eyebrow "Healthcare staffing · our main focus"; H1 "Credentialed people / for the teams / **behind the care**"; intro (Q8 settings); "Request staff" (primary) and "or call 240.579.0466".
2. Settings, "Who we staff for": 5 numbered cards (Hospitals & health systems, Clinics, Long-term care, Behavioral health, County & state HHS), one line each.
3. Split: "Specialists behind the care" bulleted list (4 items) | panel "Verified before you see a name" with 6 check pills and a note.
4. "How we engage / Four ways to work with us": 4 cards (Contract, Contract-to-hire, Direct hire, Staff augmentation) and a note on what the employer keeps.
5. Proof row (120+, 300K+, 125+) and credential strip (MBE, DBE, SBE, No. 19-286, CAGE, UEI).
6. Ask band "One nurse. / **Or a full team.**" with "Request staff" and the phone.

**Design.** Matches the homepage's type system (Zen Kaku display, red last line, mono eyebrows, graphite surfaces, 1 px borders). Hierarchy is clear. Weaknesses: no image or video anywhere, although this is the primary-positioning page and the homepage leads with healthcare imagery; the hero's right half is empty at desktop; three of five setting cards now read "Clinical and non-clinical staff for …", which is accurate but repetitive.

**Content.** Positioning is right (Q8). No clinical role list, no healthcare track record, no healthcare client. "Credentialed … screened, credentialed and compliant" follows Q15. The engagement types come from Q7/Q17 (see E).

**Interactions.** Both CTAs work (contact.html, tel:). Reveals work; with reduced motion they appear at once.

**Responsive.** No overflow at any width; H1 37 px at 360, 99 px at 1920.

**Accessibility.** Headings H1 → H2 → H3 in order. 26 tab stops, all visible, none hidden. No contrast failures on solid backgrounds. "or call" link is 19 to 23 px tall (passes target size only by spacing).

**Defects.** None functional. Repetitive card copy.

**Missing.** Imagery or a media band; a healthcare proof point (only available if the client confirms Q16 or names a client); the clinical role list (client).

**Next steps.** Add a media treatment using existing assets (`hc-*.webp`, `panel-healthcare` clip) in the empty hero side or a band; vary the setting lines once the client confirms roles.

### C2. Government Contracting (`government.html`)

**Section inventory (4,116 px).** Hero (eyebrow "Government contracting · local, state and federal"; H1 "A certified / small-business partner / **for agencies and primes**"; intro; "Capability statement" and phone) · "What we deliver" 4 cards · split "For prime contractors" list (4) | panel "Registered and certified" pills (MBE, DBE, SBE, CAGE, UEI) and dates · "NAICS" table (5) · "Past performance / Who we have worked with" ledger (8 rows with stamps) · proof row (120+, 600+, 400) and credential strip · ask band "Certifications, codes / and past performance".

**Design.** Consistent with the template; the NAICS table and ledger give it more texture than Healthcare. Same empty hero right half and no media.

**Content.** Prime claims removed; services follow Q8; "Staffing for task orders and IDIQ contracts" avoids claiming a vehicle. The ledger heading "Who we have worked with" also lists "120+ personnel… task order" and "400 hires closed in one year", which are records, not customers (minor mismatch). The ask's lead mentions requesting staff, but the band has only the capability button.

**Interactions.** CTAs work.

**Responsive.** **Defect:** the H1's red line "for agencies and primes" is `white-space: nowrap` and runs about 25 px past the screen at 360 and 390 px (text right edge 383 and 415 px), so its end is cut off. It was introduced by the verification pass's wording change. Fine at 768 and up.

**Accessibility.** One H1, H2s in order, H3 for the panel. 26 tab stops, no issues.

**Missing.** Agency-naming approval and prime status (client); a past-performance narrative if the client approves Q16.

**Next steps.** Shorten or allow wrapping of that H1 line; give the ask band a "Request staff" button too, or change its lead.

### C3. IT · Finance · Cyber (`specialists.html`)

**Section inventory (2,739 px).** Hero (H1 "The specialists / behind care and / **government**") · "What we place" 4 cards (Healthcare & government IT, Finance, Cybersecurity, Delivery) · split "Where" list (4 locations) | panel "Cleared and verified" pills and note · proof row (600+, TS/SCI, 300K+) · ask band "The specialist / **you need**".

**Design.** Same template, shortest page, no credential strip (unlike Healthcare and Government), no media. The three specialist areas get one card line each; the page has the least visual or informational depth of the set.

**Content.** Roles match Q19 (healthcare IT, finance, cyber, BAs and PMs); cleared roles Q19; 600+ DoD/IC Q20. Nothing unsupported. "Where" (a list of four places) is thin as a whole section.

**Interactions, responsive, accessibility.** CTAs work; no overflow; headings in order; 26 tab stops, no issues.

**Missing.** Depth per specialty (for example the role lists already in Q19, which are not marked [CONFIRM]); a visual identity of its own (the homepage's panel 03 clip exists).

### C4. Jobs (`jobs.html`)

**Section inventory (3,570 px).** Hero (eyebrow "Example roles"; H1 "Find your / **next role**"; intro) · Note pill "These are example roles, not current openings…" · bar: search input, field chips (All, Healthcare, IT, Finance, Cyber), Location and Type selects, live count · list of 12 rows (field · Example, title, location · type · key requirement, Save, View role) · "No match yet? / Send us your résumé" with a form (first, last, email, field, résumé file, Send résumé) · `<dialog>` for role details.

**Design.** The strongest inner page functionally: a clean list with clear meta and filters. Consistent buttons and pills. No imagery (the homepage's job fan uses photos).

**Content.** Every row, the dialog ("Example role"), the note, page title and meta say "example". The dialog now offers "Send your résumé" instead of an apply form. **Conflict:** the 12 examples include Registered Nurse, Licensed Practical Nurse, Certified Nursing Assistant, Medical Assistant and Medical Billing & Coding, exactly the clinical roles withheld from the Healthcare page and the homepage FAQ pending Q19. Example settings ("Hospital system", "Washington, DC") are invented illustrations.

**Interactions (tested).**

| Interaction | Result |
|---|---|
| Field chips | Working (12 → Healthcare 5) |
| Search | Working ("nurse" → 2) |
| Location / type selects | Working (Remote → 3) |
| Empty state | Working ("No roles match. Send your résumé…") |
| View role → dialog | Working: native modal `<dialog>`, focus moves in, Escape closes, focus returns to the button |
| Deep link `jobs.html#job-cna` | Working (opens that role) |
| "Send your résumé" in dialog | Working (closes, scrolls to the form) |
| Résumé form validation | Working (browser's native required-field messages) |
| Résumé submit | Visually present, nothing sent; honest message "Nothing was sent: this form isn't connected yet…" (backend-dependent) |
| Save | Partially working: redirects to sign-in when signed out; saving needs the design-only account (stored in the browser) |
| Live openings | Not implemented (ATS-dependent, Q11) |

**Responsive.** No overflow; rows and filters stack well at 390.

**Accessibility.** **Heading skip:** H1 then H3 job titles, with no H2 for the list. 60 tab stops, all visible. Search and selects have labels.

**Next steps.** Decide the example set while Q19 is open (keep IT/finance/cyber and setting-led healthcare examples, or keep all with the label); add an H2 for the list; decide whether "Save" stays without real accounts.

### C5. Capability (`capability.html`)

**Section inventory (4,192 px).** Hero (eyebrow "Contract-ready"; H1 "Capability / **statement**"; intro in Q1/Q15 wording; one button "Request staff") · "Company data / At a glance" two-column definition list (9 rows: Company, Status, Certifications, CAGE, UEI, Contracting, Cleared talent, Where, Point of contact) · "Core capabilities / What we deliver" 4 cards · split "NAICS" table | "Customers / Current and past" table · "Past performance / On the record" 4 stats and the 8-row ledger · ask band "Ready to / **staff it**".

**Design.** Well structured for its job (one page of facts). **Defect:** after the PDF button was removed, the hero's only button is the ghost (secondary) style, so the page has no primary action at the top. Customers appear twice (table, then ledger).

**Content.** No PDF is offered anywhere (correct, Q25 not supplied). Company row "XcelCareers" (legal name withheld). Status "Minority veteran-owned small business" kept as the client's statement, separate from the certification row. Point of contact uses the Q13/Q24 title.

**Interactions.** CTAs work. No download exists, so none can mislead.

**Responsive.** No overflow; the definition list stacks at phone width.

**Accessibility.** H1, H2s, H3s in order; 25 tab stops, no issues.

**Missing.** The PDF and its download (client). The visual "document" treatment the homepage poster has (cover art) is absent here.

**Next steps.** Make the hero button primary; merge or differentiate the two customer lists; add the download when the PDF exists.

### C6. About (`about.html`)

**Section inventory (3,930 px).** Hero (H1 "The people / behind the / **care**"; intro; Request staff and Find a job) · "Why XcelCareers / Four reasons clients choose us" 4 cards (Certified, Contract-ready, Both sides of care, Vetted and fast) · "Leadership / 125+ years of combined experience" 3 people (quiet mark panels as photos; name and title) · split "How we hire" 4 steps | panel "For candidates" list (5) and "See example roles" · "Credentials / Certified in Maryland" strip and an address line with the ownership statement · ask band "Tell us who / **you need**".

**Design.** Coherent, but the leadership block is the visual centre of the page and is three large blank panels (the section is 882 px tall at 1440). No story or narrative section.

**Content.** Intro is a short version of Q1. Leadership names Q14. Barry's title here is Q14's "…and Director of Client Services", differently from Contact and the homepage (Q13/Q24). The founding story, founder, year, veteran background and Navy credential are correctly not shown (Q14 [CONFIRM]). "Four reasons clients choose us" is promotional wording, not a sourced claim.

**Interactions, responsive, accessibility.** CTAs work; no overflow (leadership 2 + 1 grid at 390); headings in order; 27 tab stops; the placeholder panels are `aria-hidden`.

**Status: partially complete,** because the page's core purpose (story and people) cannot be fulfilled with current information.

**Next steps.** Client: story, bios, headshots, Barry's title. Design: a leadership treatment that works with initials or without photos until headshots arrive (smaller cards, no tall empty panels).

### C7. Contact (`contact.html`)

**Section inventory (2,364 px).** Hero (H1 "Tell us who / **you need**"; intro listing what to send) · two columns: tabs (Request staff, Request a call, I'm looking for work) with the full staffing request form (14 fields: organization, name, role, email, phone, type of staff, number, contract type, shifts, pay range optional, credential, location, start date, notes) | side card "Client services": Barry Klasson, title, phone, email, address, codes · "What happens next / From request to short list" 4 cards.

**Design.** Clear and purposeful; the form matches the homepage field style (3:1 borders, focus ring). On phones the three tab pills wrap into a large rounded box with "I'm looking for work" alone on a second row.

**Content.** No response-time promise; no claim that a request was received. Intro no longer says requests "go to" Barry (nothing is sent). "Request a call" is a short call, no length promised.

**Interactions (tested).**

| Interaction | Result |
|---|---|
| Tabs (click) | Working |
| Tabs (arrow keys) | Not implemented (ARIA tab pattern expects ←/→; each tab is a separate Tab stop) |
| Request form validation | Working (native; org, name, email required) |
| Request form submit | Visually present, nothing sent; honest message with phone and email (backend-dependent) |
| Request a call form | Same (validation works; nothing sent) |
| Prefill from homepage form and chat summary | Working (email and role carried into the form) |
| Phone, email links | Working (`tel:`, `mailto:`) |
| Call booking | Not implemented (tool undecided, Q9) |

**Responsive.** No overflow; form stacks to one column.

**Accessibility.** **Heading skip:** H1 then H3 "Barry Klasson", then H2. All fields have labels; required fields are marked by the browser only (no visible "required" marker; only "optional" is marked). The tab buttons have no `type` (they default to "submit" but sit outside any form, so they do nothing harmful). 45 tab stops, no issues.

**Next steps.** Arrow-key tabs and `tabindex` management; a visible required marker or note; fix the heading level; tidy the phone tab layout; wire the endpoint in production.

---

## D. Cross-page consistency findings

**Consistent and good.**
- Header, dock, pause toggle, footer, chat, reveals and reduced motion are shared (`js/site.js`) and identical on all pages.
- Type and colour tokens are shared; every H1 uses the homepage's red-last-line move; buttons, pills, panels and cards are one system.
- Every page ends with one ask and the phone number (as `WEBSITE-CONTENT.md` §4 intends).

**Inconsistent or weak (to standardize, not to make identical).**
1. **No media on any inner page.** The homepage carries the identity through photography, video and 3D; the inner pages have none. Rhythm-by-contrast (TRECIG principle 4) and "show real people" (principle 9) are absent.
2. **Empty hero right half** on all seven pages at desktop (text column only).
3. **Same template, same rhythm.** Healthcare, Government and Specialists are nearly interchangeable visually; the specialist page is notably thinner.
4. **Navigation.** The bar links Healthcare, Government, Jobs, About, Contact. IT · Finance · Cyber and Capability are reachable only from the footer and in-page buttons. No breadcrumbs or page banner pattern (TRECIG principle 2 suggests one).
5. **Repetition.** The same proof row (120+, 300K+, 125+, 600+) appears on Home, Healthcare, Government, Specialists and Capability; the credential strip on Healthcare, Government, About and the footer; the ledger on Home, Government and Capability (and twice on Capability with the customer table); the four process steps on Home, About and Contact.
6. **Form patterns differ.** The homepage form uses custom inline errors (`aria-invalid`, message); inner forms rely on the browser's validation bubbles and show no visible required markers.
7. **Heading levels.** Jobs and Contact skip from H1 to H3.
8. **Barry Klasson's title** differs between About (Q14 wording) and the rest (Q13/Q24 wording).
9. **Footer.** The outline wordmark runs under the legal line ("© 2026 XcelCareers") on every page (decorative overlap; legible).
10. **The original `landing-prototype/` inner pages** still carry every claim fixed in `landing-prototype-clean/`; the two copies have diverged.

---

## E. Factual claim verification (inner pages, clean copy)

Status: **Verified** · **Partial** · **Unconfirmed** · **Contradicted** · **Illustrative**.

| Claim | Pages | Evidence | Status | Treatment |
|---|---|---|---|---|
| Healthcare staffing is the main focus; settings | Healthcare, Capability | Q8 | Verified | Keep |
| Clinical role list (RN, LPN, CNA, medical assistant, billing & coding) | Withheld on Healthcare; **appears as Jobs examples** | Q19 "[CONFIRM] suggested" | Unconfirmed | Decide the example set; confirm with client |
| Healthcare track record or clients | None claimed | Brief §1.3; Q16, Q17, Q20 | n/a | Keep absent |
| "Screened, credentialed and compliant"; vetting checks | Healthcare | Q5, Q15 | Verified | Keep |
| Engagement types (contract, contract-to-hire, direct hire, staff augmentation) | Healthcare, Contact form | Q7 (internal, not for publication), Q17 question text, Q8 | Partial | Fine as service types; keep the markup and fee model out (brief §1.6) |
| Employer of record for contract staff | Healthcare, Capability | Q5 | Verified | Keep |
| Prime contracting | Removed everywhere | Q17, Q22 goal; Q16 sub | Unconfirmed | Keep withheld (client G2) |
| Works with agencies and prime contractors | Government | Q16, Q18 | Verified | Keep |
| Task orders / IDIQ | Government, Capability | Q7, Q8, Q16; vehicles Q21 [CONFIRM] | Partial | Keep "staffing for task orders and IDIQ contracts"; no vehicle claim |
| MBE, DBE, SBE No. 19-286, since May 2019, effective 9/4/2025, certifier | Government, Capability, About, Healthcare | Q21 | Verified | Keep |
| Minority veteran-owned small business | Capability (status row, intro), Government list, About, metas | Q1, Q15, Q21 (client statement); Q12 [CONFIRM]; no designation | Partial | Keep as statement, never as a certification (client G1) |
| CAGE, UEI, NAICS (5) | Government, Capability | Q21 | Verified | Keep |
| Montgomery County Government (HHS staffing), Current | Government, Capability | Q20; Q16 via a prime; Q20 [CONFIRM] agencies | Partial | Text only; client to approve naming |
| Prince George's County Government (OIT), Current | Government, Capability | Q20 | Partial | Same |
| Raytheon (Codex, through 2024), Pearson, Capstone, Indeed | Government, Capability | Q20 | Partial | Text only, no logos; client to approve; confirm Codex |
| NGA | Absent | Q20 [CONFIRM] | Unconfirmed | Keep withheld |
| 120+ in 45 days; 600+ DoD and IC; 400 hires in 2018; 300,000+; 125+ years | Healthcare, Government, Specialists, Capability, About | Q14, Q16, Q20 | Verified | Keep |
| Cleared roles up to TS/SCI with Full Scope Poly | Government, Specialists, Capability | Q19 | Verified | Keep |
| Specialist roles (EHR, systems, network, service desk, cloud, financial/budget/cost analysts, revenue cycle, BAs, PMs) | Specialists, Healthcare list | Q8, Q19 (not marked confirm) | Verified | Keep |
| Locations MD, DC, VA, remote; Dayton address | All | Q19, Q24 | Verified | Keep |
| Leadership names and titles | About, Contact | Q14; Q13/Q24 for Barry's title | Partial (title inconsistent) | Client to choose Barry's title |
| Legal entity "XcelCareers (XC), LLC" | Withheld | Not in questionnaire | Unconfirmed | Keep withheld |
| Capability statement PDF | Absent | Q25 | n/a | No download until supplied |
| Testimonials | None | Q21 none supplied | n/a | Keep absent |
| Response time | None | None | n/a | Keep absent |
| Example job details (settings, locations, types, requirements) | Jobs | Deck "sample cards" | Illustrative | Keep labelled |
| "Four reasons clients choose us", "Vetted and fast" | About | Q15 ("fast" is the client's word) | Partial / promotional | Acceptable |
| "Now staffing" (bar on every page) | All | Deck only | Unconfirmed | Client G7 |

No contradicted claim remains on the inner pages of the clean copy.

---

## F. Remaining work (prioritized)

Each item is tagged: **[E]** doable now with existing information · **[C]** needs client confirmation · **[A]** needs assets · **[B]** needs backend.

**Priority 1, critical**
1. Government H1 "for agencies and primes" clipped at 360 to 390 px. **[E]**
2. Jobs examples reintroduce the withheld clinical roles (RN, LPN, CNA, MA, billing & coding): decide the example set or confirm Q19. **[C]** (or **[E]** if you choose to adjust examples)
3. Customer and agency naming approval, prime status, veteran-owned basis (shared with the homepage). **[C]**
4. Staffing request, call request and résumé forms are not connected. **[B]** (honest messages are in place)

**Priority 2, important**
5. No imagery or media on any inner page; empty hero right half. Use existing assets (`assets/img/*.webp`, panel clips) to give each page a media moment. **[E]** (final imagery **[A]**)
6. Capability hero has no primary button (ghost only). **[E]**
7. Heading skips on Jobs (no H2 for the list) and Contact (H3 before H2). **[E]**
8. Contact tabs: arrow-key navigation and roving `tabindex`; explicit `type="button"`. **[E]**
9. Inner forms: visible required markers and inline errors consistent with the homepage. **[E]**
10. Navigation: IT · Finance · Cyber and Capability are footer-only; consider adding them to the bar or a page banner with breadcrumbs. **[E]** (decision)
11. About: leadership treatment while headshots are missing; story, bios, headshots. **[E]** for treatment, **[C][A]** for content
12. Specialists: more substance per specialty using Q19. **[E]**
13. De-duplicate repeated proof rows, credential strips and the double customer list on Capability. **[E]**
14. Capability PDF and download. **[A]**
15. Jobs live feed (ATS). **[B][C]**
16. "Save" depends on design-only accounts; decide whether sign-in stays (Q9). **[C]**

**Priority 3, refinement**
17. Repetitive "Clinical and non-clinical staff for …" lines on Healthcare. **[E]**
18. Contact tab pills wrap awkwardly on phones. **[E]**
19. Government ask band: add "Request staff" or adjust the lead. **[E]**
20. Government ledger heading "Who we have worked with" includes records that are not customers. **[E]**
21. Footer wordmark under the legal line. **[E]**
22. Sync the original `landing-prototype/` inner pages or retire them, so the two copies don't drift. **[E]** (decision)

---

## G. Client questions and required assets

1. Clinical healthcare roles actually filled (Q19), and any healthcare clients that can be named (Q20).
2. Prime contract status; any IDIQ or other vehicles (Q17, Q21, Q22).
3. Public naming of Montgomery County, Prince George's County, Raytheon, Pearson, Capstone, Indeed, NGA; logo permission and files; whether Montgomery work is direct or via the prime; Codex attribution (Q16, Q20).
4. Basis and public wording of "minority veteran-owned" (Q1, Q12, Q14).
5. Barry Klasson's official title (Q13/Q24 vs Q14).
6. Registered legal name.
7. ATS name and who posts jobs (Q11); where applications and résumés should go (brief §2.4).
8. Call booking tool, if any (Q9).
9. Whether a candidate sign-in is wanted at all (Q9 said no; built at the user's request).
10. Founding story, founder name and year, veteran background, Navy credential (Q14).
11. Assets: healthcare capability statement PDF, leadership headshots, real healthcare and specialist photography or footage (Q25), official MBE/DBE/SBE badge art, vector logo.
12. Testimonials, if any (Q21).

---

## H. Recommended implementation order

1. **Cross-page P1 and quick fixes first** (H1 clipping, Capability primary button, heading levels, tabs keyboard, form required markers): small, no decisions needed, and they touch the shared template, so every later page benefits.
2. **Healthcare** next. It is the primary positioning page (Q8) and the first link in the nav, and it is where the template most needs a media treatment. Solving the inner-page media and hero-right-half pattern here sets the pattern for the rest.
3. **Government**, then **IT · Finance · Cyber**: same template, apply the Healthcare pattern; Specialists also needs more substance.
4. **Contact**: already functional; polish tabs, errors and phone layout; it is the conversion endpoint for every CTA.
5. **Jobs**: settle the example-role set (client or your decision) and the Save/sign-in question.
6. **Capability**: de-duplicate and finish the hero; add the PDF when supplied.
7. **About** last: it is blocked on the client's story, bios and headshots; do only the interim leadership treatment earlier if needed.

---

## I. Testing limitations

**Actually tested (headless Chromium 1254, software GL, served from `landing-prototype-clean/`):**
- Rendered text, structure, headings, links, form labels, images (none on inner pages) on all seven pages.
- Overflow and sub-11 px text at 360, 390, 768, 1024, 1440, 1920 px (five readings taken at a stale viewport were re-measured; all clean). Heading text overflow at 360, 390, 768 (found the Government H1).
- Full-page screenshots at 1440, 768, 390 and visual review.
- Keyboard Tab walk on each page (25 to 60 stops), checking visible focus and that nothing is hidden under the bar or the chat launcher.
- Solid-background contrast scan (no failures found; text over gradients not measurable this way).
- Jobs: chips, search, selects, empty state, dialog open, focus and Escape, deep link, Save signed out, résumé validation and message.
- Contact: required validation, request and call submit messages, tabs click and arrow keys, prefill from URL, phone and email links.
- Reduced motion on About: page starts paused and reveals show at once.

**Not tested / needs manual verification:**
- Safari, Firefox, real mobile devices, touch, a real GPU.
- Screen readers (NVDA, JAWS, VoiceOver): announcement of the dialog, tabs, toasts and form errors.
- 200% zoom and WCAG text-spacing overrides on the inner pages.
- Hover states (verified in an earlier pass, commit `f2787ea`, not re-run here).
- Contrast of text over the hero gradients and the ask-band radial gradient.
- Signed-in account flows beyond the redirect (design-only accounts).
- The original `landing-prototype/` inner pages were not re-tested; they share the code and differ in content (see the introduction).

WCAG 2.1 AA was used as a proposed evaluation target only; this report is not a compliance statement.
