# Content-cleaned copy of the homepage

> **Update, 14 Nov 2026:** a verification pass followed this cleanup. Where this file and `VERIFICATION-REPORT.md` differ (for example "Ready to prime or sub", the footer legal name, the hero's "Veteran-owned" line, the inner pages), the verification report is current.

**What this is.** A separate copy of `landing-prototype/` (taken from the working tree on 14 Nov 2026, including the uncommitted FAQ-tag and chat-launcher fixes) with the unsupported or misleading content removed. Design, motion, layout, assets and interactions are unchanged. The original `landing-prototype/` was not touched.

**Run it.** `python3 landing-prototype-clean/serve.py` serves http://127.0.0.1:3201 (the original uses 3200, so both can run side by side). Entry point: `landing-prototype-clean/index.html`.

**Basis.** The homepage content audit of 14 Nov 2026, the client questionnaire (Q1 to Q25), `PROJECT-BRIEF.md` §1.9 and `site-research/WEBSITE-CONTENT.md`. Nothing new was invented; every replacement wording traces to the questionnaire.

## 1. Verified and kept
Certifications (MBE/DBE/SBE No. 19-286), CAGE, UEI, NAICS, 300,000+, 125+ years, 120+ in 45 days, 600+ DoD/IC, 400 hires in 2018, current customers (Montgomery and Prince George's County), past customers Raytheon (Codex), Pearson, Capstone, Indeed (as names), the employer process (Q5), candidates always free, locations, contact details, leadership initials and the healthcare, government and specialist positioning.

## 2. Removed (restore from the original when confirmed)
| Removed | Why | Restore when |
|---|---|---|
| NGA: customer tile, ledger row, chat mentions | Brief §1.9: no agency named until confirmed (Q20) | The client confirms NGA may be named |
| Raytheon, Pearson and Indeed logos (files deleted from `assets/img/`; they are in the original) | Logo permission unconfirmed (Q20); Pearson and Indeed were recoloured brand marks | Permission and official logo files |
| "Currently hiring" and "View all jobs" (home) | The five cards are invented samples, not vacancies (brief §2.2) | A live ATS feed (Q11) |
| Chat: "within one business day (SAMPLE)", "Online" and "Online now", fake request ID and "Received" stamp, "Book a short call" | Undocumented promises; nothing is sent from the chat | The client's real response time, and a real back end |
| "PDF" in the capability meta; the "Download PDF" button and its notice on `capability.html` | The PDF has not been supplied (Q25) | The healthcare-focused capability statement |
| Role-list pills RN, LPN, CNA, medical assistants, billing and coding (home FAQ) | Q19 marks the list "suggested, [CONFIRM]" | The client confirms the roles |
| Sphere sentence listing who is in the database | No source; Q20 gives only the size | The client describes the database |
| Ledger categories (Defense, Technology, Education, Contract, Federal) and "Delivered" stamps | Not in any source; Q20 says "past" only | Only if the client confirms |
| Visible internal notes: "official badge", "Photo · your asset", "real photo / no stock", "Headshot to come" | Internal production notes | Not needed |

## 3. Changed (wording)
| Where | Before | After |
|---|---|---|
| Hero card, capability, panel 02, FAQ, About, capability page, chat | "Prime or sub" / "We work as prime or subcontractor" / "Both." | "Ready to prime or sub" (Q15 "ready to contract"; Q17 and Q22 call priming a goal) |
| Jobs section | "Currently hiring", "Openings from the agencies and prime contractors we staff…" | "Example roles", "Examples, not current openings. Send your résumé and we'll match you to open roles." Each card is labelled "Example" |
| Footer and chat | "Open jobs", "See open roles" | "Jobs", "See example roles" |
| Process note | "…We handle the rest." | "You interview, decide and run the work site. We handle the rest." (Q5) |
| Opening lead | "…so you can focus on patients." | "…so you focus on patients and the mission." (Q1) |
| Panel 03 | "…cleared up to TS/SCI" | "…including cleared roles up to TS/SCI" (Q19) |
| Sphere text | database description | the Q5 sourcing and vetting steps |
| FAQ roles | "Which healthcare roles do you fill?" | "What healthcare staffing do you provide?" with the Q8 settings as pills |
| Ledger | "Delivered" and categories | "Past" and "Past customer" |
| Chat summary | Generated ticket "XC-nnnnn" | "Request summary · Not sent yet" with a "Continue to the request form" link (prefilled) |
| Chat status | "Online" | "Automated"; welcome status "Accepting requests" (as in the hero) |
| Capability buttons | self-link to `#capability` | the capability page |

## 4. Layout adjustments to keep the design
- Customers: six name tiles (was seven), grid set to six columns on desktop and three on tablet and phone.
- Placeholders that remain (recruiter slide, capability cover, contact photo, leadership headshots) are now a neutral graphite or paper panel with the XcelCareers mark and no label (`.ph--quiet`, `js/ph.js`).
- Badge seals show the code only. Job cards keep their photos and add "Example".
- Ledger shows eight rows.

## 5. Withheld pending client confirmation
See `site-research/WEBSITE-CONTENT.md` §5 and the audit's client questions. In short: prime contracts held today; logo permission and official files; NGA; healthcare roles and nameable healthcare clients; the featured story (Q16); real response time; call booking; Codex attribution (Q20 says Raytheon, the old site said Northrop Grumman); legal name "(XC), LLC"; Barry's title (Q13/Q24 vs Q14); ATS; capability PDF, badge art, headshots and contact photo; real healthcare footage; the makeup of the 300,000+ database.

## 6. Not changed, and why
- **Stock photos and clips** (job cards, carousel cards, panels, main reel): legitimate temporary visuals that make no business claim without a caption. The audit's concerns about the abstract main reel and the neonatal-ward clip are decisions for you.
- **Hero "Cert. 19-286 · Veteran-owned"**, "Now staffing", "Accepting requests": from the deck; low priority in the audit.
- **Inner pages** were not audited line by line. They share the cleaned data (customers, ledger, steps, FAQ-free copy), and `capability.html`, `about.html` placeholders were cleaned because the homepage links to them. Still to review: the Healthcare page's "Roles we fill" list (Q19 unconfirmed), the 12 sample jobs (already labelled "Sample listing"), and the "Prototype: … captured, not sent" toasts, which are honest.
- The mid-page chat launcher can still sit over content when idle.
