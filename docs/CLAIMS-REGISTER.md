# Claims register: what the website may say, and on what evidence

One place for the status of every significant business claim on the site. It exists so that nobody treats wording already on a page, a code comment or an earlier report as proof. **Evidence order:** (1) the client questionnaire (Q1 to Q25, `site-research/XcelCareers_-_Client_Questions_COMPLETED.docx`), (2) `js/content.js` and `site-research/WEBSITE-CONTENT.md`, (3) `PROJECT-BRIEF.md`. The old live site is not evidence. Last reviewed: 14 Nov 2026, against `landing-prototype-clean/` (see [CLEAN-COPY.md](CLEAN-COPY.md)).

Status: **Verified** (an authoritative source says it) · **Partial** (the source supports less than the wording) · **Unconfirmed** (client approval needed) · **Withheld** (not shown on purpose) · **Illustrative** (decorative or a labelled example).

## 1. Claims that may be shown

| Claim | Source | Status |
|---|---|---|
| Healthcare staffing is the main focus; the settings (hospitals, clinics, long-term care, behavioral health, county and state HHS) | Q8 | Verified |
| Government contracting is the second line: staff augmentation, contract staffing, task orders, consulting | Q8 | Verified |
| IT, finance and cybersecurity specialists across both (roles in Q19) | Q8, Q19 | Verified |
| Maryland MBE, DBE and SBE certified, No. 19-286, since 05/01/2019, current certifications effective 9/4/2025, certifier named | Q21 | Verified |
| CAGE 89AK6, UEI KQGDQLETUZ43, NAICS 561311, 561320, 541330, 541511, 541512 | Q21, Q24 | Verified |
| Ready to contract at the local, state and federal level | Q15 | Verified (readiness, not a record) |
| 120+ personnel staffed for one task order in 45 days | Q16, Q20 | Verified |
| 600+ placements for DoD and Intelligence Community clients; 400 hires in 2018; 300,000+ candidates; 125+ years combined | Q14, Q20 | Verified |
| Cleared roles up to TS/SCI with Full Scope Poly | Q19 | Verified |
| Employer process (intake, source, verify, short list, onboarding; employer of record for contract staff) | Q5 | Verified |
| Candidates always free; interview preparation; credentialing guidance; contact after placement | Q6 | Verified |
| Locations Maryland, DC, Virginia, remote; Dayton address; phone and email; Barry Klasson receives enquiries | Q13, Q19, Q24 | Verified |
| Leadership names Quan Nguyen, Erika Finley, Barry Klasson | Q14 | Verified (see Barry's title below) |
| Twelve example roles | deck §3.05 | Illustrative: always labelled "Example" |
| Task orders / IDIQ as a service | Q7, Q8, Q16 | Partial: the work is supported, holding an IDIQ vehicle is not. Never say "vehicle" |
| Customer names as text: Montgomery County Government (HHS staffing, current), Prince George's County Government (OIT, current), Raytheon Technologies (Codex, through 2024), Pearson (2021 to 2023), Capstone Corporation (2019 to 2021), Indeed (2022) | Q20; brief §1.9 proof bank | Partial: relationship documented, public naming approval not explicit (Q20 [CONFIRM] "which agencies"). Montgomery work came through a national healthcare staffing prime (Q16), so the relationship may be as a subcontractor |
| "Minority veteran-owned small business" | Q1, Q15, Q21 (the client's statement); Q12 is [CONFIRM] | Partial: a self-description. No VOSB or SDVOSB certificate, certifier or date exists in the sources. **Never pair it with the certificate number or call it certified.** |

## 2. Withheld, and why

| Withheld | Reason | Restore when |
|---|---|---|
| Prime-contract status ("Ready to prime or sub", "Both") | Q17 and Q22 call priming a goal; Q16 shows a sub role | The client says any prime contract is held |
| Clinical role list (RN, LPN, CNA, medical assistants, billing and coding) | Q19: "[CONFIRM] suggested" | The client confirms the roles. (The twelve example roles on the Jobs page still contain these titles: see [../site-research/INNER-PAGES-AUDIT.md](../site-research/INNER-PAGES-AUDIT.md).) |
| NGA | Q20 [CONFIRM]; brief §1.9 | The client confirms it may be named |
| Customer logos (Raytheon, Pearson, Indeed) | Q20 [CONFIRM] permission; two were recoloured brand marks | Permission and official files |
| Healthcare track record, healthcare clients | Brief §1.3 guardrail; none are in the proof bank | Q16 and Q20 answered |
| Legal name "XcelCareers (XC), LLC" | Not in the questionnaire; only in the deck, the brief and the old site | The client confirms the registered name |
| Response times, "online" or live-agent wording, call-booking | No source; the chat is automated | The client states them; a real tool exists |
| Capability statement PDF | Not supplied (Q25) | The PDF exists |
| Testimonials | None supplied (Q21) | Real, permitted quotes |
| Contract vehicles; healthcare NAICS 621399 and 624190 | Q21 [CONFIRM] | Confirmed and registered |
| Founding story, founder, year, Navy credential, "20+ years" | Q14 [CONFIRM] | Supplied |
| Minority status "Asian American Pacific" | Brief §1.9: show only if the client asks | Client asks |

## 3. Unconfirmed items still on the site (low risk, decide before launch)

- **"Now staffing"** (top bar) and **"Accepting requests"** (hero placard): deck wording, no questionnaire source.
- **Barry Klasson's title:** Q13 and Q24 say "Director of Business Development and Client Services"; Q14 says "…and Director of Client Services". The About page uses the second, everything else the first.
- **Stock photographs and video clips** (Unsplash, Pixabay): they carry no caption claim, but the client asked for real people (Q23, Q25). Licences and release caveats: `assets/video/LICENSES.md`.

## 4. Rules for editing copy

1. A new factual claim needs a source in the order above, cited in the commit or the report that adds it.
2. Never present an example as real: example jobs say "Example"; forms say nothing was sent; the chat says it is automated and never gives a reference number or reply time.
3. Keep the markup and fee model out of copy and chat answers (brief §1.6).
4. Banned words: "solutions", "world-class", "cutting-edge", "passionate", "one-stop shop".
5. When two sources conflict, record the conflict here and ask; do not choose silently.

The full, line-by-line verification is in `landing-prototype-clean/VERIFICATION-REPORT.md` §B; the questions for the client are in its §G.
