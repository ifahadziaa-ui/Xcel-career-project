# Verification and reconciliation report: `landing-prototype-clean/`

Date: 14 Nov 2026. Scope: the clean copy only. Nothing outside `landing-prototype-clean/` was modified; nothing was committed.
Tested in headless Chromium 1254 (software rendering, MP4 and WebM both report playable). Not tested: Safari, Firefox, a real GPU, touch, a screen reader.

Source order used: (1) the client questionnaire (Q1 to Q25), (2) `js/content.js` and `site-research/WEBSITE-CONTENT.md`, (3) `PROJECT-BRIEF.md`. The old site, my earlier reports, code comments and wording already on the site are **not** treated as evidence.

---

## A. Executive summary

The clean copy is now a reliable basis for the next stage **with the withheld items kept withheld**. It looks and behaves like the original, no page throws errors, no link is broken, and no screen claims a submission, a ticket, a response time, a live agent or a current vacancy that does not exist.

What changed in this pass (beyond the first cleanup):
- **Inner pages, which the first cleanup had not read line by line, still carried the problems.** Government, About, Capability, Jobs, Contact, Login and Account were fixed.
- **Veteran-owned:** the hero line no longer pairs certificate 19-286 with "Veteran-owned", and About no longer headlines "Certified" over "Minority veteran-owned".
- **Prime:** "Ready to prime or sub" was replaced everywhere with the client's own wording (Q15, "ready to contract at the local, state and federal level"), because priming is a goal (Q17, Q22), not an established fact.
- **Applications to example roles:** the apply form (which produced a fake "You applied… we will be in touch" state) is gone; example roles now point to the résumé form.
- **Accessibility fix:** keyboard focus now returns to the chat launcher after Escape (it did not before).

Still true, and not mine to decide: the stock imagery, the abstract main reel, the unconfirmed customer permissions, the unconfirmed "veteran-owned" public wording and the hero status labels "Now staffing" and "Accepting requests". They are listed in G.

---

## B. Business-claim verification

Status key: **Confirmed** (authoritative source) · **Partial** (source supports less than the wording) · **Unconfirmed** (client approval needed) · **Contradicted** · **Illustrative** (decorative or descriptive).

| Claim | Where | Evidence | Status | Action |
|---|---|---|---|---|
| Minority veteran-owned small business | Home H2, hero lead-in, About, Capability row, gov list, meta descriptions, chat, AI prompt | Q1, Q15, Q21 (the client's statement). Q12 (keep/remove) is marked [CONFIRM]. No VOSB/SDVOSB certificate, certifier or date appears anywhere. Q14 asks the founder's veteran background [CONFIRM] | **Partial**: stated by the client as a self-description; not shown as a certification, not shown to be current, public wording not approved | Kept only as a statement of ownership, never attached to the certificate or to "Certified" (fixed in this pass). Client to confirm basis and wording (G1) |
| "Cert. 19-286" | Hero | Q21: certificate 19-286 is the Maryland MBE/DBE/SBE certification (since 05/01/2019; current certifications effective 9/4/2025) | **Confirmed** for MBE, DBE, SBE. It does **not** cover veteran status | Hero now reads "Cert. 19-286 · MBE · DBE · SBE" |
| Maryland MBE · DBE · SBE, No. 19-286, since May 2019, certifier named | Home, Gov, Capability, About, footer | Q21 | **Confirmed** | Keep |
| "Current certifications effective 9/4/2025" | Gov, Capability | Q21 | **Confirmed** | Keep |
| CAGE 89AK6, UEI KQGDQLETUZ43, five NAICS codes | Home, all pages | Q21, Q24 | **Confirmed** | Keep. No healthcare NAICS shown (Q21 [CONFIRM]) |
| Ready to contract at local, state and federal level | Hero card, capability point, About, Capability page, closing text | Q15 (client's sentence) | **Confirmed** (readiness, not a record) | Keep |
| Acts as a **prime** contractor | Previously "Ready to prime or sub" in 8 places, FAQ "Both", chat | Q17 "want to grow… contracts as prime"; Q22 "holding our own prime contracts" (a three-year goal); Q16: the Montgomery County work came *through* a prime (so XC was the sub); Q18 lists primes as clients | **Unconfirmed**; the established fact is subcontract/staff-augmentation work | **Removed everywhere.** Government page now speaks to "agencies and primes" (audience, Q18). Client to say whether any prime contract is held (G2) |
| Works with prime contractors | Gov intro, panel 02, FAQ | Q16, Q18 | **Confirmed** (as the clients and partners it serves) | Keep |
| Task orders / IDIQ | Panel tag, Gov, Capability, FAQ | Q7 (internal), Q8 (listed as a line of business), Q16 (a task order staffed 120+ in 45 days) | **Partial**: task-order work is supported; holding an IDIQ vehicle is not (Q21 [CONFIRM]) | Wording changed to "staffing for task orders and IDIQ contracts" and never "vehicles" |
| Contract vehicles | None shown | Q21 [CONFIRM] | n/a | Correctly absent |
| 120+ personnel in 45 days | Home, Gov, Healthcare, ledger | Q16, Q20 | **Confirmed** (one task order; not healthcare-specific) | Keep |
| 600+ DoD and IC placements | Home, Gov, Specialists | Q20 | **Confirmed** | Keep |
| 400 hires in 2018 | Gov, ledger | Q20 | **Confirmed** | Keep |
| 300,000+ candidates | Home, chat, pages | Q20 | **Confirmed** (size only; no healthcare split) | Keep; the sentence about what the database contains was removed in the first pass |
| 125+ years combined | Home, About, Capability | Q14, Q20 | **Confirmed** | Keep. "20+ years" stays retired |
| Montgomery County Government: health and human services staffing (Current) | Home, ledger, Gov, Capability, chat | Q20 lists it as a current customer; Q16 says the work is for a Montgomery County HHS contract via a national healthcare staffing prime (about 17 staff); Q20 [CONFIRM] "which agencies can be named publicly" | **Partial**: relationship documented, **possibly as a subcontractor**; public naming of agencies is [CONFIRM] | Kept as text per brief §1.9 proof bank; flagged (G3) |
| Prince George's County Government (OIT) (Current) | Same | Q20; same [CONFIRM] on agencies | **Partial** (relationship documented; naming approval [CONFIRM]) | Kept as text; flagged (G3) |
| Raytheon Technologies: Codex, through 2024 | Home, ledger, Gov, Capability | Q20. The old site attributed Codex to Northrop Grumman (retired, not authoritative) | **Partial**: named in Q20; naming approval implicit; attribution to confirm | Kept as text, logo removed (G3) |
| Pearson 2021–2023; Capstone 2019–2021; Indeed 2022 | Same | Q20 | **Partial** (relationship documented; naming approval implicit; logos not approved) | Kept as text; logos removed (G3) |
| NGA, 2018 | Removed | Q20 [CONFIRM]; brief §1.9 says not to name | **Unconfirmed** | Withheld |
| Customer logos | Removed | Q20 [CONFIRM] | **Unconfirmed** | Withheld |
| Healthcare staffing is the main focus; settings (hospitals, clinics, long-term care, behavioral health, county and state HHS) | Hero, Home, Healthcare | Q8 | **Confirmed** (focus and service offering) | Keep |
| Healthcare **track record** | Anywhere | Q16 (one HHS story, prime unnamed), Q17 (most work is county government, hard-to-fill IT/finance/cleared). Brief §1.3 guardrail | **Unconfirmed** as a track record; none is claimed | The page does not claim healthcare placements, volumes or healthcare clients |
| Specific clinical roles (RN, LPN, CNA, medical assistant, billing/coding) | Was FAQ pills, Healthcare "Roles we fill", Healthcare block lines | Q19 "[CONFIRM] suggested" | **Unconfirmed** | **Withheld** (pills, list, per-setting role lines). Healthcare page now lists specialists (Q8/Q19, not marked confirm) |
| "One nurse. Or 120+ staff." / "from one nurse" | Closing headline, FAQ, About | Q15 (client's own words) | **Confirmed** as the client's wording; illustrative of range | Keep |
| "Credentialed people for every level of care" | Healthcare H1 | No source for "every level" | **Unconfirmed** (breadth) | Replaced with "for the teams behind the care" (brief's big idea) |
| Cleared roles up to TS/SCI with Full Scope Poly | Panels, FAQ, Specialists, chat | Q19 | **Confirmed** | Keep; "including cleared roles" avoids implying all are |
| Locations Maryland, DC, Virginia, remote; Dayton, MD | Home, pages | Q19, Q24 | **Confirmed** | Keep |
| Employer process (intake, source, verify, short list, onboarding, employer of record) | Home, About, Contact, FAQ | Q5 | **Confirmed** | "You interview, decide and run the work site" matches Q5 |
| Candidates always free; interview prep; credentialing guidance; stay in contact | Home, About, FAQ, chat | Q6 | **Confirmed** | Keep |
| Barry Klasson, Director of Business Development and Client Services | Home, Contact, chat | Q13, Q24 | **Confirmed**; **Q14 words it "…and Director of Client Services"** (About leadership uses that) | Inconsistent between pages; client to pick one (G6) |
| Quan Nguyen CEO; Erika Finley; Barry Klasson | About | Q14 | **Confirmed** | Keep (initials and cards, no photos) |
| Address 6013 Bricker Rd, Dayton, MD 21036; 240.579.0466; bklasson@… | Everywhere | Q24 | **Confirmed** | Keep |
| "XcelCareers (XC), LLC" (legal entity) | Was footer, Capability "Company" row | Not in the questionnaire; only in `WEBSITE-CONTENT.md`, the brief and the old site | **Unconfirmed** | Footer now "© 2026 XcelCareers"; Capability row "XcelCareers" (G5) |
| "Now staffing" (bar), "Accepting requests" (hero placard) | Every page, hero | Deck copy; no questionnaire source | **Unconfirmed** (availability wording) | Left (locked hero design); removed from the chat. Client to confirm (G7) |
| Response time ("within one business day") | Removed | None | **Unconfirmed** | Withheld |
| "Online" / live agent | Removed from chat | None; the chat is automated | n/a | Chat says "Automated" and "Guided answers" |
| Capability statement PDF | Removed everywhere | Q25 [CONFIRM] not supplied | n/a | No download offered |
| Sample jobs (12) | Home fan, Jobs, chat | Deck §3.05 "sample cards"; brief §2.2 forbids placeholder listings | **Illustrative** | Labelled "Example" on every card, row, dialog, page note, chat reply, page title and meta |
| "A 15-minute call" | Contact | None (Q4 says "a short call") | **Unconfirmed** | Now "a short call" |
| "Call you when the right role opens" | Jobs | Q6 says "stay in contact" | **Partial** | Now "match you to roles as they open" |
| Healthcare imagery and clips | Cards, panels, fan | Stock (Unsplash, Pixabay); no business claim in captions | **Illustrative** | Kept (G, visuals) |

**Search for other implied claims.** I searched all ten pages and the chat for "prime", "vehicle", "within", "hour", "available", "trusted", "proven", "leading", "placed" and for named organizations, and read every page's rendered text. No other claim of completed work, active contracts, vehicles or awards was found beyond those above.

---

## C. Page-by-page content audit

| Page | Correct | Misleading or unsupported (found) | Placeholder | Corrected | Still needs approval |
|---|---|---|---|---|---|
| **index** | Certs, codes, stats, process, customers (as text), FAQ, contact | Hero "Veteran-owned" next to the cert number; "Ready to prime or sub" (hero card, capability point, panel 02, FAQ); "Accepting requests" | Recruiter slide, capability cover, contact photo (quiet mark panels); stock photos and clips; abstract main reel | Hero line; prime wording; FAQ "government contracts"; panel 02; chat Status row | Veteran-owned wording; customer naming; hero status labels; main reel |
| **healthcare** | Settings (Q8), proof stats, certs, process | "Roles we fill" list and per-setting role lines (Q19 [CONFIRM]); H1 "every level of care" | None | List replaced by specialists; settings lines made role-neutral; H1 changed | Clinical role list; whether to name healthcare clients (none shown) |
| **government** | Services, codes, proof, ledger | "ready to prime or sub" (H1, block); meta "as prime or subcontractor"; meta pairing "certified minority veteran-owned" | None | H1 "for agencies and primes"; block "Staffing for task orders and IDIQ contracts"; meta rewritten in Q1's wording | Prime status; customer naming |
| **specialists** | Roles (Q19), cleared roles, locations | None found | None | None needed | None beyond Q19 healthcare IT list [CONFIRM] only for the healthcare roles, not shown here |
| **jobs** | Résumé route, free for candidates | Title "Open Jobs", meta "Open … roles", "View & apply", apply form and "You applied" state, "Prototype / applicant tracking system" notice, "call you when one opens" | 12 example roles (kept, labelled) | Title, meta, eyebrow, notice, button "View role", dialog now "Example role" with a résumé link and no apply form, honest toast | Real roles need the ATS (Q11) |
| **capability** | Certs, codes, stats, ledger, customers | "Ready to prime or sub" (row and card); "Company: XcelCareers (XC), LLC"; intro paired "certified" with "veteran-owned"; disabled "Download PDF" and its notice (first pass) | None | All reworded; PDF removed | PDF; legal name; veteran wording |
| **about** | Intro (Q1), process, candidates, leadership | "Certified: Minority veteran-owned" (two places); "Ready to prime or sub" | Leadership photos (quiet panels) | Certified now MBE/DBE/SBE only; ownership stated separately; prime wording replaced | Barry's title; headshots; founding story (not shown) |
| **contact** | Form, contact card, process | "Every request goes to Barry" (nothing is sent); "15-minute call"; tab "Book a call"; "Browse open … roles"; toast "Prototype: captured" | Photo none on this page | Intro cut to the Q4 ask; "Request a call"; "short call"; example roles; toast now says nothing was sent and gives phone and email | Call booking tool (Q9) |
| **login** | Honest notice | "Prototype" label; "Apply to roles with your saved résumé", "track your applications"; meta | Design-only accounts (the user's request; Q9 did not tick a login) | Notice rewritten ("Accounts are not live yet…"); meta neutral; reset toast "not available yet" | Whether to keep a sign-in at all (Q9) |
| **account** | Profile stored in the browser (stated) | "With the recruiting team" status on applications; "No applications yet" implied a flow | None | Status removed; empty state says applications are not available and points to the résumé form | Same as login |
| **Footer** (all) | Address, links, codes | Legal entity "(XC), LLC" | None | "© 2026 XcelCareers" | Legal name |
| **Chat** | Greeting, certs, clearance, customers, process, FAQ replies | Status "Online/Online now" (first pass), reply time and ticket (first pass), "Book a short call" (first pass), "prime or subcontractor", Status "Accepting requests" (this pass) | None | Wording replaced; welcome shows "Mode: Guided answers" | Real routing and response time |

---

## D. Showreel and design verification (headless Chromium, 1440×900)

Scroll positions were computed from the timeline (0 to 3700 units over the pinned track) and each scene was captured and its elements inspected.

| # | Scene (timeline) | Result |
|---|---|---|
| 1 | Opening card (v≈20) | Works. Headline, lead, buttons, team pill, right pill ("Maryland MBE · DBE · SBE certified. Ready to contract, local to federal."). **reel-main.mp4 is PLAYING** (readyState 4). |
| 2 | Marquee (v≈170) | Works. Marquee visible and blurred as the card rotates. |
| 3 | Carousel forms (v≈270) | Works. "Both sides of every hire" card, "See how we staff" button. |
| 4 | Carousel rotates (v≈560) | Works. Employer and candidate cards with photos. |
| 5 | Mark assembles on card 03 (v≈740) | Works. Red card with the building mark. |
| 6 | Dive (v≈1050) | Works. Mark zooms through the hub; stage dims. |
| 7 | Network sphere (v≈1450) | Works. "300,000+ profiles on file", body text. **Body text sits over bright particles and is hard to read in places** (carried over from the original). |
| 8 | "What we staff" panels (v≈2200, 2750) | Works. Panel videos play in turn (healthcare, government, specialists WebM). |
| 9 | Closing frame (v≈3550) | Works. Headline, lead, both buttons and the trust line visible; mark assembled. |

- **Scene transitions, scroll-driven animation and panel movement:** all scenes appeared in order with no console errors.
- **Video playback:** the main reel and the three panel clips play only while on screen and stop otherwise; the pause toggle stops all four (tested earlier, and with reduced motion).
- **Closing-frame CTAs and keyboard:** nine ArrowDown taps reach the closing frame (vertical snap). Tab from the top then passes the bar and reaches "Request staff", "Capability statement" and "or call 240.579.0466" in order. They are skipped by Tab only while the frame is not on screen.
- **Reduced motion:** with `prefers-reduced-motion: reduce` the page starts paused (marquee, all videos, shaders, tilt), wheel smoothing is off, and the toggle resumes motion. The scroll-linked scenes still run (card rotation 33° → 90°, ring turn to −216° measured). This is the standing decision, not a defect.
- **Main reel vs the words (your question):** the reel is now an abstract glowing particle clip on a black ground. There is no caption or text in the clip. The only "healthcare montage" wording is the code label for the slot, which visitors never see. So there is **no visible text contradiction**, but the visual does not show people or care. Its black ground also appears as a hard black rectangle against the maroon opening card and during the card's rotation (scene 2). **Decision for you:** keep the abstract clip, or use real footage (Q25).
- **Panel clips:** the Healthcare panel shows a neonatal ward and the Government panel an open-plan office; both are stock and carry no caption.
- **Design preservation:** all sections are intact. The quiet placeholders read as intentional (graphite or paper with the mark). The customers grid, job fan and ledger sit correctly with the removed content.

---

## E. Accessibility and responsive testing

**Widths tested:** 360, 390, 768, 1024, 1440, 1920 (homepage at all six; the eight inner pages at 360, 768 and 1920). Method: scroll the whole page, wait for reveals, then measure.

| Check | Result |
|---|---|
| Horizontal overflow | None at any tested width once animations settle. (Two mid-run readings of 1440 were test artefacts from a stale viewport; re-measured clean.) |
| Record stamps | Not clipped once settled: right edge 992 px at 1024 px, and clean at 360. The earlier "clipping" was the entrance animation (scale 2.1×). The shorter labels ("Past", "Active", "Staffed", "Closed") also help. |
| Capability poster meta line | It overflowed at 360 and 390 px. Shortened to "Certs · codes · past performance" and allowed to wrap on phones. Re-measured clean at 360. |
| Text under 11 px | None at 1440 and 1920. Below that, only the top bar and hero labels (nav and logo ≈ 9.4 to 10.6 px, placard) fall under 11 px. Decision on record: the hero and bar keep their own mono sizes. |
| Keyboard | 36 tab stops in visual order; every stop has a visible outline; none hidden under the bar or the launcher. |
| Keyboard traps | None found. |
| Chat | Opens with Enter on the launcher; Escape closes; **focus returns to the launcher (fixed in this pass)**. Dialog role present; `aria-modal` is "true" only on phones, where the chat takes over the screen, and "false" on desktop where the page stays usable. |
| Launcher overlap | At the end of the page the footer legal row clears the launcher (measured earlier). Mid-page, when you stop scrolling, it can sit over content such as the footer ID line; it shrinks to its round icon while the showreel is on screen. Pre-existing design behaviour; not changed. |
| Targets | Nav and footer links are under 24 px tall and pass the target-size spacing exception only. |
| Contrast | Earlier contrast passes found no failures except the footer logotype; **text over the shaders, panel videos and particle sphere is not measured** and is the weakest area. |
| Not tested | Screen reader, 200% zoom and text-spacing overrides on the changed pages, touch, Safari. |

WCAG 2.1 AA was used as a proposed target only. This is a list of tests, not a compliance claim.

---

## F. Changes made (all inside `landing-prototype-clean/`)

Made in the **verification pass** (this one):

| File | What and why |
|---|---|
| `index.html` | Hero line "· Veteran-owned" → "· MBE · DBE · SBE"; meta description rewritten in Q1's wording (no certification/veteran pairing) |
| `js/content.js` | "Ready to prime or sub" → "Ready to contract…" (hero pill, capability point, About card); panel 02, FAQ "government contracts", Government H1 and block reworded; About "Certified" card cut to MBE/DBE/SBE; legal line "© 2026 XcelCareers"; Healthcare H1, setting lines and role list replaced; capability meta shortened |
| `js/pages.js` | Jobs (title note, button, dialog, empty state, résumé toast, résumé blurb); Contact (intro, tab names, call text, work tab, toast); Capability (company, contracting, card, intro); About (credentials block, button); Login and Account notices and toasts; account empty state and button; note tag "Prototype" → "Note"; role section label |
| `js/main.js` | Certification note punctuation (UEI and NAICS were read as certified) |
| `js/chat.js` | "Prime or sub" wording and capability row; welcome Status → "Mode: Guided answers"; focus returns to the launcher after closing; `aria-modal` set on phones |
| `css/sections.css` | Capability poster meta wraps on phones |
| `jobs.html`, `government.html`, `login.html`, `account.html`, `contact.html` | Titles and meta descriptions |

Made in the **first cleanup** (already reported in `CONTENT-CLEANUP.md`): `js/ph.js`, `js/showreel.js`, `js/site.js`, `css/base.css`, `css/chat.css`, `serve.py`, the removal of NGA, the three logos, the PDF button and the visible internal notes, the chat summary card, and the "Example" job labels.

---

## G. Questions the client must answer before the remaining claims are published

1. **Veteran-owned.** What is the exact status (self-described, or a VA/SBA designation such as VOSB or SDVOSB)? Is it current? May we publish "minority veteran-owned small business" in those words, and the founder's veteran background (Q12, Q14)?
2. **Prime.** Does XcelCareers hold any prime contract today, or is priming a goal (Q17, Q22)? Do any IDIQ or other vehicles exist (Q21)?
3. **Customers.** May we name each organization, and the two counties, publicly (Q20 "which agencies can be named")? May we use logos, and may we have official files? Is Montgomery County work done directly or through the healthcare prime (Q16)? Is Codex a Raytheon contract (Q20), given the old site said Northrop Grumman? May NGA be named?
4. **Healthcare.** Which clinical roles are actually filled (Q19)? Which healthcare clients, if any, can be named (Q20)? Which featured story: Montgomery via the prime (and may the prime be named) or 120+ in 45 days (Q16)?
5. **Legal name.** Is "XcelCareers (XC), LLC" the registered name?
6. **Barry Klasson's title.** "Director of Business Development and Client Services" (Q13, Q24) or "…and Director of Client Services" (Q14)?
7. **Availability labels.** May the site say "Now staffing" and "Accepting requests"? Is there a real response time to state?
8. **Call booking and candidate accounts.** Is a call-booking tool wanted, and which (Q9)? Sign-in was not ticked in Q9: keep or drop?
9. **Database.** Anything to say about the make-up of the 300,000+ candidates, for example healthcare share (Q20)?
10. **Assets.** The healthcare capability PDF, badge art, headshots, a contact photo, real healthcare footage and who sends it and by when (Q25), and the vector logo.

---

## H. Remaining work

**Essential blockers before launch**
- Answers to G1 to G3 (veteran-owned, prime, customer permissions) and G5 (legal name).
- Replace stock imagery and the main reel decision (G, D).
- A real form endpoint and live jobs feed (ATS).

**Decisions for you**
- Keep or replace the abstract main reel; keep or drop candidate sign-in; keep "Now staffing" and "Accepting requests" until confirmed.
- Customers: keep names as text per brief §1.9, or withhold all names until Q20 is answered. This is a one-array change in `js/content.js` (`CUSTOMERS`, `LEDGER`).

**Optional improvements**
- Measure text contrast over the shaders and videos; screen-reader pass; 200% zoom and text-spacing tests on the changed pages.
- The launcher can still cover content when idle mid-page.
- Particle sphere text is hard to read over the brightest particles.

---

## I. Git status

Run `git status --short` from the repository root. At the end of this pass it showed:

| Path | State | Origin |
|---|---|---|
| `landing-prototype/css/sections.css`, `landing-prototype/js/chat.js`, `landing-prototype/js/main.js` | modified, **uncommitted** | **Pre-existing**: the FAQ-tag and chat-launcher fixes from before the cleanup. Not touched in the cleanup or in this pass. |
| `landing-prototype-clean/` | untracked, new directory | Created in the first cleanup; this pass changed the files listed in F. |

Nothing else is modified: `superconscious/`, `held-mint/`, the root documents and the original `landing-prototype/` files are unchanged by the cleanup and by this pass. Nothing was committed, deleted or moved. The clean copy is served at http://127.0.0.1:3201 (the original stays on 3200).
