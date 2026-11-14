# PROJECT BRIEF: the XcelCareers website project (whole repository)

> **Purpose of this file.** One self-contained document to hand to an LLM (or a new developer) so it knows everything about the **whole project**, not just one part of it: who the client is, what is being built and why, every component in the repository and how they relate, how it is being built, what exists today, what is missing, what went wrong along the way, and what to do next. Read it top to bottom before touching any code. It lives at the repo root so it is the first thing found.
>
> First written 12 Nov 2026; **revised 12 Nov 2026** to add the client's completed questionnaire (received 9 Nov 2026) and an audit of the live old site at https://xcelcareers.com/. Question numbers such as **Q5** refer to that questionnaire.
>
> **Updated 13 Nov 2026:** the frontend work is now scoped to the **homepage prototype first** (the other seven pages come after its review). The decisions, the Definition of Done and the open issues are in [FRONTEND-PROTOTYPE-STATUS.md](FRONTEND-PROTOTYPE-STATUS.md); §5 below lists every design change made to `landing-prototype/`.
>
> **Order of authority for facts and wording:** (1) the client questionnaire, (2) `landing-prototype/js/content.js` and `site-research/WEBSITE-CONTENT.md`, (3) this file. The live old site is **not** an authority: it is out of date and still carries retired facts (§3). Where this file and the code disagree, the code is the truth for *behaviour*.

---

## 0. The project at a glance

**What the project is:** a redesign of the XcelCareers marketing website, and a **change of positioning**. The old site sells a tech-only recruiter (Systems, Cloud and Software Engineers). The new site must present a **healthcare-first** staffing company that is also a certified government contractor, with IT, finance and cybersecurity as its specialist depth (§1, §3). The repo holds the research, the content, three generations of front-end work, and the design material they were built from.

**Read first:** §1 (who the client is and what the site is for), §2 (what the site must do, ranked), §3 (the old site being replaced), §4 (what is still unconfirmed).

**Components and their state**

| Component | Path | What it is | State |
|---|---|---|---|
| Client research and copy deck | `site-research/` | Captures of the client's old site and a design-reference site, capture scripts, and `WEBSITE-CONTENT.md` (the approved copy and sitemap) | Done; the source of truth for content |
| Client questionnaire | `XcelCareers - Client Questions.docx` (and the COMPLETED version in `site-research/`) | The client's answers (received 9 Nov 2026), now folded into §1 to §4 | Done; the open **[CONFIRM]** items are listed in §4 |
| Live old site | https://xcelcareers.com/ (captured in `site-research/xcelcareers-current-site/`) | The WordPress site this project replaces; audited in §3 | Still live, tech-only, **out of date**; never copy its facts |
| Design inputs | `Assets/Logo.png`, `Hero page design/`, `Animation videos/`, `Landing page prompts/` | Logo, the hero mock-up, two reference animations, the two long design prompts | Inputs only |
| **Static prototype** | `landing-prototype/` | The full one-page site: hero, credentials, a scroll showreel, process, jobs, capability, record, FAQ, contact, chatbot | Most complete; the reference implementation; **protected: edit only with the user's authorization for a stated task**. The homepage prototype is the current focus |
| **Next.js app** | `xcel-website/` | The intended production site | **Only the hero exists** (and it still carries the reference design's placeholder copy, see §5) |
| **Superconscious showreel** | `superconscious/` | A standalone single-file scroll experience derived from the prototype | Working; two single-file pages (vanilla `index.html`, XcelCareers `xcelcareers.html`); checked in headless Firefox at desktop and phone widths; not fused |

**How the pieces relate.** Content flows one way: `site-research/WEBSITE-CONTENT.md` (human deck) becomes `landing-prototype/js/content.js` (machine-readable, also feeds the chatbot), which `superconscious/index.html` imports at runtime. The Next app does not yet read any of it. The long-term plan is for `xcel-website/` to become the production site, with the prototype as the visual and behavioural reference.

**History in git:** `main` holds the research, the prototype and the sideways-snap commit (`e171a85`). All later homepage work (phases 0 to 5 of the completion plan) is on the branch `landing-prototype-completion`, pushed to GitHub and **not merged into `main`**. `superconscious/` and `held-mint/` are on `main`.

---

## 1. The client and the business goal

**XcelCareers (XC), LLC** is a Maryland healthcare staffing and government contracting company. It places nurses and care staff with hospitals, clinics, long-term care, behavioral health providers, and county and state health departments. It supports local, state and federal government with staff augmentation, contract staffing, task orders and consulting. IT, finance and cybersecurity specialists work across both lines. It is a **minority veteran-owned small business**, certified Maryland MBE / DBE / SBE.

This repository is a **website redesign** for XcelCareers. The previous site is captured in `site-research/xcelcareers-current-site/` and audited in §3. It presents the company as a tech-only recruiter, which is **not** how the client now describes itself.

### 1.1 In the client's own words (Q1)

> XcelCareers is a healthcare staffing and government contracting company. We find and place skilled people with hospitals, clinics and health agencies, and we support local, state and federal government through staffing, staff augmentation and contract work, with specialist expertise in IT, finance and cybersecurity. We handle the search, screening, credential checks and compliance so our clients can focus on their mission. We are a minority veteran-owned small business, MBE/DBE/SBE certified in Maryland.

Use this as the base for the About copy, the meta description and the chatbot's self-description.

### 1.2 The website's job, in priority order (Q2)

1. **Win clients:** show healthcare organizations (hospitals, clinics, health agencies), government buyers and prime contractors that XcelCareers is a certified, trusted partner for staffing, staff augmentation and contract support, and make requesting staff easy.
2. **Prove it is contract-ready:** certifications, CAGE, UEI, NAICS, past performance, with a downloadable capability statement.
3. **Attract candidates:** healthcare, IT, finance and cyber professionals.

**Audiences, by priority (Q3):** (1) employers and hiring managers; (2) government and defense contracting officers, and primes; (3) healthcare job seekers; then IT and cyber job seekers, and candidates already in the network. **Not** a target audience: veterans moving into tech (the client left it unticked).

**The one action per visitor (Q4):** healthcare employers, government buyers and primes **submit a staffing request**, download the **capability statement**, or **book a short call**. Job seekers **apply for an open job** or **upload a résumé**.

**Feature priorities (Q10):** (1) staffing request form for healthcare employers, (2) job board with candidate applications and résumé upload, (3) capability statement download. The full feature list is in §2.

**Big idea:** *the people behind the care.* XcelCareers staffs the bedside and everything behind it: the nurse, the case manager, the billing team, the systems and the security.

### 1.3 Positioning and focus (Q8, Q15, Q17, Q22)

- **Why hire XcelCareers (Q15, the client's sentence):** "We are a certified minority veteran-owned small business that is ready to contract at the local, state and federal level and understands both patient care and the IT, finance and security behind it, so clients get vetted, credentialed and compliant people fast, from one nurse to a 120+ person staff augmentation."
- **Main focus (Q8):** healthcare staffing for hospitals, clinics, long-term care, behavioral health, and county and state health and human services departments.
- **Second core line (Q8):** local, state and federal government contracting: staff augmentation, contract staffing, task orders / IDIQ, and consulting (business analysis, project and program management, talent management).
- **Specialist depth across both (Q8):** healthcare and government IT; finance (revenue cycle, billing, financial and budget analysts); cybersecurity.
- **Growth intent (Q8, Q17):** grow healthcare and government contracts **together**. Within that: clinical and non-clinical healthcare staffing; local, state and federal prime contracts including task orders / IDIQ; healthcare IT, finance and cyber placements.
- **Three-year direction (Q22, a direction and not copy):** a leading certified small-business partner in Maryland and the region for healthcare staffing and government contracting, holding its own prime contracts at local, state and federal level, with a recognized specialty in IT, finance and cybersecurity talent.

**Honesty guardrail.** The client says most of today's work is contract staffing and staff augmentation for **county government** (including health and human services) and hard-to-fill **IT, finance and cleared** roles (Q17). Healthcare is the declared *focus and growth line*, but the proof bank (§1.9) is mostly government, IT and defense. Lead with healthcare as the stated focus, but **do not claim healthcare placements, healthcare clients or healthcare volumes that are not in the proof bank.** No healthcare client may be named until the client confirms (Q20).

### 1.4 What XcelCareers does for an employer, step by step (Q5)

| # | What happens | Who |
|---|---|---|
| 1 | **Intake call** to understand the role, shifts, pay range, and license, certification or clearance requirements | XC |
| 2 | **Source** candidates from the network, job boards and referrals | XC |
| 3 | **Screen and interview**; verify licenses, certifications, health screenings, references and background checks | XC |
| 4 | **Submit a short list** of vetted candidates | XC |
| 5 | **Interview and pick** | Employer |
| 6 | **Offer, onboarding paperwork and compliance items** | XC |
| 7 | **For contract staff:** XC employs the worker, runs timesheets and payroll, tracks license and certification renewals, and stays in touch through the assignment | XC |

The employer keeps the final interview and hiring decision, the work site, and day-to-day supervision. The site's process section and the chatbot's "how hiring works" answers must match this flow.

### 1.5 What XcelCareers does for a job seeker (Q6)

- Matches job seekers to open healthcare roles, and to IT, finance and cyber roles in healthcare and government.
- Prepares them for interviews.
- Guides them through credentialing, licensing or clearance steps.
- Stays in contact after placement.
- **Always free for job seekers.**

### 1.6 Business model (Q7): internal, never publish

The client gave this "only for our understanding"; it **will not be published**. Keep the markup and fee model out of site copy and out of chatbot answers.

- Markup on contract, contract-to-hire and staff augmentation workers (bill rate over pay rate).
- Fees on direct-hire placements.
- Government contracts at local, state and federal level, as prime or subcontractor: task orders / IDIQ, health and human services staffing, IT staffing, and consulting (business analysis, project and program management, talent management).

### 1.7 Services, clients and roles (Q17 to Q19)

| | Detail |
|---|---|
| **Most work today** | Contract staffing and staff augmentation for county government (including health and human services); hard-to-fill IT, finance and cleared roles |
| **Want to grow** | Healthcare staffing (clinical and non-clinical); local, state and federal contracts as prime, including task orders / IDIQ; healthcare IT, finance and cyber placements |
| **Transition Into Tech** | Status **unconfirmed** (Q17 asks the client whether it is still active). Do not build or link it until they say so |
| **Ideal clients (Q18)** | Hospitals, health systems, clinics, long-term care and behavioral health providers; local and state agencies (especially Maryland county and state health and human services and IT departments); federal agencies; prime contractors who need a certified small-business partner for staff augmentation |
| **Government vs commercial split** | Unknown **[CONFIRM]** |

**Roles filled most often (Q19):**
- **Healthcare** (a suggested list, **[CONFIRM]**): registered nurses (RN), licensed practical nurses (LPN), certified nursing assistants (CNA), medical assistants, behavioral health and social services staff, case managers, medical billing and coding.
- **Healthcare IT and cyber:** EHR and systems administrators, network administrators, service desk, cybersecurity and cloud engineers.
- **Finance:** financial, budget and cost analysts; revenue cycle and billing specialists.
- **Also:** business analysts and project managers.
- **Cleared roles:** up to TS/SCI and Full Scope Poly.
- **Locations:** Maryland, DC, Virginia and remote.

### 1.8 Voice

Caring, trustworthy, professional (Q23). Plain words, short sentences, real numbers in context. **Off-limits:** cheesy stock photos, an overly casual tone, anything that looks like a generic job board. **Banned words:** "solutions", "world-class", "cutting-edge", "passionate", "one-stop shop".

### 1.9 Proof bank (use these facts and nothing else)

| Fact | Detail |
|---|---|
| Certification | Maryland MBE · DBE · SBE, issued by the Maryland Department of Social and Economic Mobility, No. **19-286** (certified since 05/01/2019; current certifications effective 9/4/2025). The record lists minority status as Asian American Pacific; do not display that unless the client asks |
| Status | Minority veteran-owned small business |
| CAGE / UEI | **89AK6** / **KQGDQLETUZ43** |
| NAICS | 561311 Employment Placement Agencies · 561320 Temporary Help Services · 541330 Engineering Services · 541511 Custom Computer Programming · 541512 Computer Systems Design (the old site shortened two of these names). Possible healthcare codes 621399 and 624190 **only if the client confirms they are registered** (Q21) |
| Scale | 120+ personnel staffed for one task order in 45 days |
| Defense / IC | 600+ placements for DoD and Intelligence Community clients |
| Record year | 400 hires closed in 2018 |
| Database | 300,000+ candidates |
| Team | 125+ years combined experience |
| Current customers | Montgomery County Government · Prince George's County Government (OIT) |
| Past customers | Raytheon Technologies (Codex, through 2024) · Pearson (2021–23) · Capstone Corporation (2019–21) · Indeed (2022) · NGA (2018, **[CONFIRM]** can it be named) |
| Cleared roles | up to TS/SCI with Full Scope Poly |
| Where | Maryland, DC, Virginia, remote |
| Candidates | always free |
| Leadership | Quan Nguyen (CEO) · Erika Finley (Director of Operations and Contracts) · Barry Klasson (Director of Business Development and Client Services; Q14 words it "Director of Business Development and Director of Client Services", see §4) |
| Leadership background | The capability statement highlights a Navy recruiting background: Navy's top recruiter, Northeast Region, 2006. **[CONFIRM]** whose it is, plus the founding story, founder name and year, and the founder's veteran background (Q14) before any of it is used |
| Healthcare proof | One candidate story only (§1.10). No healthcare client is cleared to be named yet |
| Contact | 6013 Bricker Rd, Dayton, MD 21036 · 240.579.0466 · bklasson@xcelcareers.com (all website and chatbot enquiries go to Barry) |

**Rules for using it.**
- Never invent a testimonial, quote, client name, statistic or healthcare track record. Testimonials were requested (Q9) but none have been supplied (Q21 **[CONFIRM]**): leave the slot empty or hidden until they arrive.
- Show customer names as text. Show logos only after the client confirms permission (Q20 **[CONFIRM]**).
- No healthcare client or agency (NGA included) is named until the client confirms (Q20).

### 1.10 Featured story (Q16, undecided)

The client offered two and asked to **[CONFIRM]** which to feature:
1. **Healthcare:** chosen by a national healthcare staffing prime to support a Montgomery County, MD health and human services contract (about 17 staff). Use it **only if the prime agrees to be named**.
2. **Scale:** staffing a task order that needed 120+ personnel in 45 days (already in the proof bank).

### 1.11 Retired, do not use

The Ellicott City address (10155 Baltimore National Pike Ste 105, Ellicott City, MD 21042), 410.865.9558, the HRservices@xcelcareers.com email, "70% faster", Northrop Grumman, General Dynamics, the old logo wall (names in §3), Engineering as a service line (code 541330 stays in the registration list, but engineering is not marketed), the old "booming tech industry" positioning and Systems / Cloud / Software Engineer headline, the old footer text, and the **"20+ years"** claim until the client confirms the founding year (Q14). "Transition Into Tech" is on hold pending the client's answer (Q17). Healthcare comes **first**; government second, and the client wants both to grow together (Q8).

Full copy deck: `site-research/WEBSITE-CONTENT.md`. Client answers: `site-research/XcelCareers_-_Client_Questions_COMPLETED.docx` (also `XcelCareers - Client Questions.docx` at the repo root). Items marked **[CONFIRM]** are still waiting on the client; the full list is in §4.

---

## 2. What the website must do (client requirements)

Source: questionnaire Q2, Q4, Q9 to Q13, Q24.

### 2.1 Features: wanted, ranked, not wanted

The client ticked seven features and ranked the top three (Q9, Q10).

| Feature | Client said | Rank | Notes |
|---|---|---|---|
| Hiring / staffing request form | Wanted | **#1** (healthcare employers) | Healthcare employers first; government buyers and primes too. On a first call XC collects: the role, shifts, pay range, and license / certification / clearance requirements (Q5). Submissions go to Barry |
| Job board with live openings | Wanted | **#2** | Should pull from the client's ATS automatically (Q11). ATS not yet named. See §2.2 |
| Candidate applications and résumé upload | Wanted | **#2** (with the job board) | The old site's form asked for first name, last name, email and résumé, all required (§3) |
| Capability statement download | Wanted | **#3** | A PDF. The client wants a **healthcare-focused general version** on the site (Q25); not yet supplied |
| Book a consultation / free call | Wanted | not ranked | No booking tool named; the old site only had a phone link |
| Chatbot that answers questions | Wanted | not ranked | Scope in §2.3 |
| Customer testimonials | Wanted | not ranked | None supplied yet (Q21) |
| News or blog | **Not wanted** | | Do not build |
| Candidate or client login area | **Not wanted** | | **Overridden by the user on 13 Nov 2026:** a candidate-only sign-in was asked for and built in the prototype as a **design only** (no real accounts, Google sign-in not connected). Employers get no account. Confirm with the client before any real build |
| Newsletter sign-up | **Not wanted** | | Do not build |

### 2.2 Jobs (Q11, Q12)

- Jobs come from the client's employer customers and from the prime contractors it supports.
- **[CONFIRM]** which applicant tracking system (ATS) is used and who posts. Preference: the site pulls openings **automatically** from the ATS rather than someone adding them by hand.
- Remove outdated jobs. The old site shows three generic cards, each "Posted 2 years ago" (§3). The new site must never show stale or placeholder listings. Until a feed exists, show a clear "upload your résumé" route instead of fake openings (guidance, not a client instruction).
- Healthcare roles come first, then IT, finance and cyber in healthcare and government.

### 2.3 Chatbot (Q13)

The chatbot should help with:
- open healthcare jobs and how to apply;
- licensing and certification questions (**general guidance only**);
- how hiring with XcelCareers works for healthcare employers and government buyers (§1.4);
- the IT, finance and cyber specialties;
- certifications and the CAGE code.

Leads go to **Barry Klasson** (Director of Business Development and Client Services), bklasson@xcelcareers.com. It must not discuss the business model (§1.6).

### 2.4 Contact and lead routing (Q4, Q13, Q24)

- Website enquiries, staffing requests and chatbot leads: Barry Klasson, bklasson@xcelcareers.com.
- Main line: 240.579.0466. Address: 6013 Bricker Rd, Dayton, MD 21036.
- **Not stated by the client:** where job applications and résumé uploads should be delivered (see §4).

### 2.5 Where each requirement stands in the repo (as far as this brief records)

| Requirement | State |
|---|---|
| Staffing request form | Built in the prototype (`contact.html`, fields from the intake call; a short version on the home page that carries over). **Not wired**: submissions show a prototype notice and go nowhere. No form in the Next app |
| Job board | Built in the prototype (`jobs.html`): search, field chips, location and type filters, a detail dialog with an application form. **12 sample listings**, clearly labelled; no ATS feed (ATS unknown) |
| Résumé upload and applications | Built in the prototype as forms (job application in the dialog, general résumé upload on `jobs.html#resume`). Not wired; where submissions go is undecided (§4) |
| Candidate sign-in | Prototype only (`login.html`, `account.html`, `js/auth.js`): accounts, saved roles and applications live in the browser's localStorage. See §2.1 |
| Capability statement | The prototype has a home section and a full page (`capability.html`); the PDF has not been supplied, so the download button says so |
| Call booking | A "Book a call" request form on `contact.html` (not wired); booking tool undecided |
| Chatbot | Built in the prototype (guided mode from `content.js`, optional live Claude mode). Lead routing to Barry is not wired |
| Testimonials | Nothing to show yet |

### 2.6 Sitemap

Home, Healthcare Staffing, Government Contracting, IT · Finance · Cyber, Jobs, Capability, About, Contact (from `WEBSITE-CONTENT.md`), plus Sign in and My account for candidates. **All of these exist in the prototype since 13 Nov 2026** (`index.html`, `healthcare.html`, `government.html`, `specialists.html`, `jobs.html`, `capability.html`, `about.html`, `contact.html`, `login.html`, `account.html`). The old site has four navigation items (§3).

---

## 3. The old site being replaced (live audit, 12 Nov 2026)

https://xcelcareers.com/ and its six linked pages were fetched one by one on 12 Nov 2026. It is a **WordPress** site (block theme *Spectra One*, *Site Kit by Google* 1.191.0, the *Simple Job Board* plugin, read from the page metadata and asset paths). The footer says © 2025. It is **tech-only**: none of the seven pages mentions healthcare, nursing, MBE / DBE / SBE or veteran-owned status, CAGE or UEI, leadership, testimonials or a capability statement.

**Navigation:** Home · Transition Into Tech · Jobs · Contact, with 410.865.9558 in the header. **Footer:** a short "empowers professionals to thrive in the booming tech industry" blurb, Facebook / Twitter / YouTube / LinkedIn icons that all link to `#` (dead), the Ellicott City address, HRservices@xcelcareers.com, © 2025.

### 3.1 Pages

| URL | Title / H1 | What it contains |
|---|---|---|
| `/` | "Top Talent Solutions: Expert Staffing for Systems Engineers, Cloud Engineers, and Software Engineers" | A mailto button "Email Us Your Staffing Needs" (no form); an "Explore Job Listings" button; a "20+ years" claim; four benefit blocks (Tailored Talent Solutions, Extensive Candidate Network, Streamlined Hiring Process, Industry Expertise You Can Trust); four feature lines (AI tools for hiring decisions, rigorous screening, fast fills of urgent and hard-to-fill roles, close collaboration); a 17-image "Companies We Work With" logo wall |
| `/transition-into-tech/` | "Transition into Tech with Confidence" | A résumé and career-coaching offer for people moving into tech: nine listed services (consultation, job-search strategy, bootcamp and certification advice, live applicant insights, sample résumés, a "Government Tech Consulting (GOVTech)" item for veterans using clearances, and others). The "Schedule a Free Consultation" button is only a phone link. Also a "Core Competencies" list, the same three job cards and the logo wall |
| `/jobs-2/` | Job Postings | A keyword box and three generic cards: Software Engineers, Cloud Engineers, Systems Engineers. Each says "Posted 2 years ago", has no location or description, says compensation varies, and tells people to email HRservices@ |
| `/jobs-3/software-engineers/`, `/jobs-3/cloud-engineers/`, `/jobs-3/systems-engineers/` | One per card | An "Apply For This Job" form: First Name*, Last Name*, Email Address*, Attach Resume* (all required) |
| `/contact/` | "Get In Touch" | Address, phone, email and the five NAICS codes. **No contact form** |

### 3.2 Old claims against the new rules

| On the old site | Rule for the new site |
|---|---|
| "Over 20 years" of staffing expertise (home, Transition, Contact, footer) | Not in the questionnaire or proof bank. **Do not use** until the client confirms the founding year (Q14) |
| Ellicott City address, 410.865.9558, HRservices@ | Retired. Use Dayton, 240.579.0466, bklasson@ (§2.4) |
| Positioning: "booming tech industry", Systems / Cloud / Software Engineers | Retired. Healthcare first, government second, IT / finance / cyber as specialist depth (§1.3) |
| "Leveraging AI tools for smarter hiring decisions"; "A.I. Tools for Global Market Data Research" | Not in the client's answers. Do not headline or reuse without confirmation |
| Core competencies: Direct Hire / Contract-to-Hire; Contract / Temporary Hire; Rapid Task Order, IDIQ and Proposal Staffing; Hard-to-fill positions (unfilled 30+ days) | The service types match Q17 and may be reused. The "30+ days" definition of hard-to-fill is a usable plain-words gloss |
| Other competencies: sourcing-tool training, staffing matrix development and compliance support, salary analysis | Unconfirmed. Ask before reusing |
| The Transition Into Tech page | Status unconfirmed (Q17). Veterans moving into tech was left unticked as an audience (Q3). Do not rebuild it by default |
| The logo wall | Retired. Names readable from the image file names: General Dynamics, Boeing, Amazon, Microsoft, Georgia Tech, Parsons, Alion, Raytheon Technologies, US Army, US Navy, US Air Force, the US House of Representatives seal. Five more images cannot be identified from the page text. Only Raytheon Technologies (past customer, through 2024) appears in the client's approved list (Q20) |
| Footer social icons linking to `#` | Dead links. Ask the client for real profile URLs, or leave social icons out |
| The three generic job cards | Outdated; remove (Q12) |

### 3.3 What the old site never had, and the new site needs

Healthcare content; certifications and certificate number; CAGE, UEI and past performance; a capability statement; leadership; a hiring request form; a live jobs feed; call booking; the chatbot; testimonials.

### 3.4 Migration notes

- The old URLs worth redirecting to their new equivalents: `/transition-into-tech/`, `/jobs-2/`, `/jobs-3/*` and `/contact/`.
- The old site has Google Site Kit installed, so Google Analytics and Search Console may already be in use. Ask the client for access so measurement carries over.
- The repo's capture (`site-research/xcelcareers-current-site/`) holds 12 pages; only these seven URLs were reachable by navigation on 12 Nov 2026. Reconcile the difference if the extra pages matter.

---

## 4. Open client confirmations and gaps

### 4.1 Items the client marked **[CONFIRM]** in the questionnaire

| Q | What is open | Needed for |
|---|---|---|
| Q11 | Which ATS the client uses, and who posts jobs | Live jobs feed (§2.2) |
| Q12 | The keep / remove list is itself marked **[CONFIRM]**. Proposed keep: logo and name, veteran-owned and MBE / DBE / SBE status. Proposed remove: outdated jobs, old contact details, anything that does not show healthcare as the main focus | Final content audit |
| Q14 | Founding story, founder name and year, founder's veteran background; whose Navy recruiting background it is | About page; the "20+ years" question |
| Q16 | Which story to feature (healthcare prime story or the 120+ in 45 days), and whether the prime may be named | Featured proof (§1.10) |
| Q17 | Whether Transition Into Tech is still active | Sitemap, old-page redirects |
| Q18 | Government vs commercial split | Positioning |
| Q19 | The healthcare role list (the current one is only suggested) | Healthcare page, jobs filters, chatbot |
| Q20 | Healthcare clients that can be named; permission to show logos; which agencies (NGA included) can be named | Customer section |
| Q21 | Contract vehicles; healthcare NAICS codes (621399, 624190, if registered); testimonials | Capability section, testimonials slot |
| Q25 | Who sends photos and videos, and by when. Healthcare clips first (nurses, clinical and care staff), then IT, finance and cyber | Showreel and page media |

**Assets still needed:** the original vector logo (the mark is currently a trace), headshots for the team pill, the capability-statement PDF (healthcare-focused general version preferred), the MBE / DBE / SBE badge art, logo files.

### 4.2 Gaps and inconsistencies found while comparing the questionnaire, the old site and this brief

- **Barry Klasson's title.** Q13 and Q24 say "Director of Business Development and Client Services". Q14 says "Director of Business Development and Director of Client Services". This brief uses the first (it appears twice). Confirm.
- **"20+ years"** is on the old site only. The questionnaire gives 125+ years of combined team experience instead (§1.9).
- **AI tools claims** are on the old site only; the client's answers never mention them.
- **Where do job applications and résumé uploads go?** The client named Barry for enquiries and chatbot leads, not for applications.
- **Call booking:** requested, but no calendar or booking tool is named.
- **The client's Q12 answer is only a proposal** (it is marked **[CONFIRM]**), so treat the keep / remove list as provisional.

### 4.3 Not raised in the questionnaire, worth raising (suggestions, not client requirements)

- **Privacy policy, terms and an equal-opportunity statement.** The site will collect résumés and personal details.
- **Accessibility** (WCAG 2.1 AA is the usual target). Government buyers are a top-two audience, and the scroll showreel will need keyboard and reduced-motion fallbacks.
- **Domain, hosting and DNS control**, and who runs the cutover from WordPress.
- **Reliable delivery of form mail** to Barry's mailbox.
- **Outside listings** (Google Business Profile, directories, email signatures) that may still show the old Ellicott City address and 410 phone number.

---

## 5. Repository layout

Repo root: `/home/abdullah/Documents/xcel_career/Xcel-career-project` (git, branch `main`, remote `origin`). The folder above it, `xcel_career/`, is not a repo. This file is at the repo root.

```
Xcel-career-project/
├── xcel-website/          Next.js app (the "real" site). ONLY the hero is built.
├── landing-prototype/     Static HTML/CSS/JS prototype: the full one-page site (homepage prototype, see §5 for every change made to it).
├── PROJECT-BRIEF.md       THIS FILE: the whole-project briefing.
├── superconscious/        Standalone scroll showreel derived from the prototype.
│   ├── index.html         the whole page (HTML + CSS + JS in one file)
│   ├── README.md          operational guide for this folder
│   └── assets/showreel/   (empty) media slots, see its README.md
├── site-research/         376 MB of captured reference sites, tools, copy deck (data, not code)
├── Assets/Logo.png        the client logo (raster)
├── Animation videos/      two reference mp4s
├── Hero page design/      hero mock-up jpeg + a stitch export zip
├── Landing page prompts/  prompt 1 and prompt 2 for the landing page (.docx)
└── XcelCareers - Client Questions.docx
```

### `xcel-website/` (Next.js)
Next 16.4.5, React 19.3, Tailwind 4, TypeScript. `src/app/page.tsx` renders a single `<Hero />` (in `src/components/hero/`). No other routes. **The hero still carries the reference design's placeholder copy** (brand "VESSEL", "Kept Never For Sale", an anatomical-heart placeholder image at `/hero/specimen-placeholder.png`); the layout, fonts (Mona Sans, Geist Mono) and styling are final, but the words were only swapped to XcelCareers in the *prototype* ("People Behind The Care", see `WEBSITE-CONTENT.md` §3 01), not here. Copy is in a `content` object at the top of `Hero.tsx` so it can be swapped without touching layout. The root layout sets the title "XcelCareers", dark colour scheme and theme colour `#0c0c0d`. `AGENTS.md` there warns this Next version has breaking changes and says to read `node_modules/next/dist/docs/` before writing code. `npm ci`, `npm run lint` and `npm run build` all pass. `npm audit` shows 7 moderate issues, from `minimatch` via ESLint (dev tooling only, not fixed). Run with `npm run dev` (port 3000).

### `landing-prototype/` (static prototype, the reference implementation)
A complete one-page XcelCareers site, no build step. Sections in order: top bar, hero, certifications and customers, **services (a scroll-driven showreel)**, process, jobs, capability, record, FAQ, contact, footer. Also an "XC Concierge" chatbot (`js/chat.js`) that answers from `js/content.js`, and optionally live Claude answers.
- `index.html`, `serve.py` (static server on port 3200 plus the chat endpoint), `css/{base,hero,showreel,sections,chat}.css`, `js/{main,motion,showreel,content,chat,mark,ph,video}.js`, `assets/specimen-placeholder.png`, `assets/img/` (stock photos as WebP, customer logos, `LOGOS.md`) and `assets/video/` (four looping clips with WebM, MP4 and poster, `LICENSES.md`).
- `js/content.js` is the **single source of copy and facts**, and the chatbot reads it too. It exports `BRAND`, `CERT_LINE`, `CERTS`, `CREDENTIALS`, `CUSTOMERS`, `SHOWREEL`, `FUNCTIONS`, `FLIGHT`, `CONTACT`, `LEADERSHIP` and more.
- It already contains its own showreel implementation (`js/showreel.js`, 1041 lines, `css/showreel.css`), built from the first of the two prompts in `Landing page prompts/`.
- Its `css/base.css` says the sections below the showreel use **"Prompt 2 (HELD-MINT)"** design tokens recoloured to the XcelCareers palette. So the HELD-MINT brief (see §9) describes the *lower* sections of this prototype, which already exist there.
- Palette: graphite `#101012`, silver `#d0d0d2`, ink `#f3f3f5`, signal red `#ff2a45` (deeper `#d4142f`).
- **Design changes made at the user's request (12 Nov 2026)** — these edited `landing-prototype/` files (see §10 for the file list and the CLAUDE.md conflict this raises):
  1. **Unified look.** The hero's header is now the fixed top bar on every section (logo, Healthcare · Government · Jobs · Contact, red NOW STAFFING; once scrolled it springs into a floating, rounded glass dock inset from the edges, driven by `--dock` in `initHeader`). Removed: crowns, barbed wire and arcs, ghost background words, graffiti script and scribbles, paint-drip buttons, bracket notes, the handheld poster menu. Buttons are plain red; panels use the hero's glass-placard style; the red accent word in each headline is styled like "CARE".
  2. **Fonts.** The hero and the top bar keep Mona Sans (condensed black headline) and Geist Mono. Everything after the hero uses **Zen Kaku Gothic New**, the font of the Superconscious page: sentence-case headlines in a regular weight with tight spacing, uppercase labels in a medium weight. Barlow Condensed, Sedgwick Ave Display and Sora are no longer loaded.
  3. **Type scale.** One token set in `css/base.css` for everything below the hero (display about 72 px on desktop, stepping down at 1200 / 896 / 700 px), with tighter section padding in `css/sections.css`.
  4. **Motion.** One shared entrance (`RISE`, a short rise with no bounce) for headlines, cards, steps, stat boxes and buttons. The "One nurse" closing frame now reveals the 3D mark (zoom from 45% with a soft overshoot, a turn and a fade) on the same scroll beat as the copy, which follows line by line.
  5. **Text centring.** Zen Kaku Gothic New sits low in its line box. Tags, badge seals, stamps, placeholder pills and the hero and closing-frame buttons use `text-box: trim-both cap alphabetic` with symmetric padding (`css/base.css`, `css/sections.css`, `css/showreel.css`); the flex `.btn` buttons keep a small bottom padding (0.2em) because `text-box` does not apply to flex containers. The top bar's row is centred in the bar rather than offset by a fixed number. Mona Sans on buttons was tried and rejected as too plain.
  6. **Card parallax.** `initParallax` in `js/motion.js` is scroll-linked: a card's offset and tilt are computed from where its box is on screen every frame (reads first, then writes), with no spring. The old spring lagged behind Lenis, froze off-screen and crawled up on return.
- **Changes made at the user's request (13 Nov 2026)**, authorized for that task:
  1. **Showreel ending.** The prompt's camera flight through 14 placeholder tiles into a box that zoomed up (1900 scroll units) is gone. The closing frame now opens through a wide, feathered radial mask (no hard edge) as the "What we staff" strip leaves; the 3D mark assembles with scroll (blades grow out of the hub, smallest first, then the figure settles; the head is a flat disc like the logo); the copy rises a step behind. The showreel track is about 1360vh on desktop instead of 2000vh (`CLOSE_START`, `CLOSE_END`, `VH_PER_UNIT` in `js/showreel.js`). `FLIGHT` is no longer used by the prototype but stays in `content.js` because `superconscious/xcelcareers.html` imports it.
  2. **Closing copy.** Eyebrow "Staffing request", "One nurse. / Or 120+ staff.", the intake fields in the lead, two buttons (Request staff, Capability statement) and a trust line (MBE · DBE · SBE No. 19-286 · CAGE 89AK6 · phone).
  3. **Home page.** Nav is Healthcare · Government · Jobs · About · Contact, plus "Sign in" (becomes "My account"). The unconfirmed "Contract vehicles (to confirm)" badge is gone. The contact block is a short staffing request (organization, role, work email) that opens `contact.html` prefilled. "View all jobs" and the capability button go to their pages. The Indeed ledger line no longer carries a project description that was not in the questionnaire.
  4. **Inner pages.** Nine static pages rendered by `js/pages.js` from new `content.js` exports (`NAV`, `SERVICE_PAGES`, `ABOUT`, `REQUEST_FORM`, and `JOBS` grown to 12 sample listings with `id`, `desc`, `reqs`), inside shared chrome (`js/site.js`: top bar, footer, Lenis, reveals, chatbot), styled by `css/pages.css` with the existing type tokens only. Icons and the mark now live in `js/sprite.js`, injected on every page.
  5. **Candidate accounts, design only** (`js/auth.js`): sign in, create account, "Continue with Google" (creates a demo account; Google is not contacted), saved roles, applications, profile and résumé name. All in localStorage. Every form shows a "Prototype: not sent" notice.
  - Known and open: the hero headline sits behind the video card by design (headline z-index 3, image 6, as the Superconscious brief says). A stray flat white line seen during the hero transition on a GPU browser could not be reproduced in headless Firefox.
- **Prototype completion pass (13 to 14 Nov 2026, merged with the changes above on `landing-prototype-merged`):**
  1. **Type scale and text floor.** Everything below the hero takes its size from the tokens in `css/base.css`. `--type-min: 11px` is the floor (`--type-micro`, `--type-label` and the small tokens are floored with `max()`); text inside scaled cards keeps container-relative sizing but cannot go under the floor. The hero and the top bar are exempt (the bar's "NOW STAFFING" is 10.5px on phones).
  2. **One red.** `#ff2a45` everywhere. The deeper red (`#d4142f`, `--accent-strong`) was removed. Text on red fills is graphite (5.1:1; white was 3.7:1). The capability poster uses lighter paper (`--surface-poster`, paper-50) and its small caption line is dark, not red.
  3. **Accessibility target: WCAG 2.1 AA plus 2.4.11 Focus Not Obscured and 2.5.8 Target Size (2.2).** Done: scroll padding so focus clears the fixed bar and the chat launcher; keyboard focus in the pinned showreel brings the stage into view; 3:1 borders on the email field and the chat input; chat label colours raised to 4.5:1; hover and keyboard-focus states on the stage buttons, FAQ questions and the email field. Target size passes by the spacing exception (nav and footer links are 22px or less tall).
  4. **Pause animations (2.2.2) and reduced motion.** `js/pause.js` keeps `html[data-motion]`; the toggle in the top bar pauses or resumes. It starts paused under `prefers-reduced-motion` and the choice is remembered. It stops the marquee, the shader animation, the mark's sway, the cursor tilt and the looping placeholders. Reduced motion also turns off eased wheel scrolling and smooth anchors. Scroll-linked motion is deliberately not changed. The toggle overlaps the bar's padding (negative margin) so the bar's height does not change.
  5. **Contact form checks.** The three-field request form (organization, role, work email) validates on submit: an empty or malformed field shows an inline error and focus returns to it; a complete form opens `contact.html` prefilled, as before. Nothing is sent from the home page. The chat launcher hides while the page scrolls and returns after one second of stillness (never while the chat is open or the launcher has keyboard focus).
  6. **Sideways snap.** A sideways swipe, shift + wheel or ← / → steps the carousel and the "What we staff" strip to the next or previous card (`attachSnap` in `js/showreel.js`). No on-screen hint, by decision.
  7. **Performance and Chrome.** `ADAPTIVE` in `js/showreel.js` lowers the pixel ratio of the sphere and aurora canvases when frames stay slow (28 ms) and restores it after 8 s of headroom. The closing scene's gradient has its own canvas (the hero's gradient code path) plus a CSS fallback. (The earlier flat-2D-at-arrival fix for Chrome hit-testing was dropped in the merge: the redesigned closing beat has no 3D camera flight.) Cards that have faded become `visibility: hidden`.
  8. **Vertical snap.** A tap on ↓ / ↑ inside the pinned reel steps to the next or previous resting beat (`vstops()` in `js/showreel.js`); holding the key scrolls freely. Quick taps chain. The wheel is untouched.
  - Layout fixes: the FAQ no longer overflows at phone widths (`minmax(0, 1fr)` tracks); the contact lines stay clear of the photo card; the certifications headline is balanced and the four badges stay on one row at tablet width.
  - Known and open: **The closing frame ("One nurse") background shows flat black in the user's Chrome, from the first frame.** It is not reproducible in headless Firefox or headless Chromium (software GL); it was already present before the completion work, and the merged closing scene has not been re-checked on a real GPU. Likely GPU- or extension-specific; undiagnosed. The white line seen earlier during the hero transition was judged to come from the user's setup and dropped.
- **Media pass (13 Nov 2026, authorized for that task; branch `landing-prototype-merged`, merged to `main`):**
  1. **Stock photos.** `ph()` takes an optional `src` and fills the slot with a real image (`.ph--img`). Seven licensed Unsplash photos (WebP, 33 to 117 KB) fill the five jobs-fan cards (`JOB_IMG` in `js/main.js`), the two portrait showreel cards and the loader's card pile. Slots the brief marks "real staff, no stock" (Barry Klasson / client services photo, team headshots, capability PDF cover, the rotated recruiter slide) stay placeholders. Raw downloads live in `images_web/` and `videos-web/`, which are git-ignored; one photo in `images_web/` shows a recognizable public figure and must not be used.
  2. **Looping videos.** `ph({ video: "name" })` renders a muted, looping, decorative `<video>` (WebM + MP4 + poster from `assets/video/`). `js/video.js` (`watchVideos`) plays a clip only while it is on screen and stops all of them under `html[data-motion="paused"]`. Opening card: `reel-main`, the rendered "Vesper" particle sequence (36 s, **native 3:4 portrait render, 720×960**, 5.3 MB, **MP4 only**: `ph({ ..., webm: false })`; a VP9 version came out 5x larger). Services panels: three Pixabay clips (1080p, 30 fps, 13.8 s, 0.7 to 2.5 MB) `panel-healthcare`, `panel-government`, `panel-specialists`, with a dark gradient behind the text (`.sr-pf .ph--vid::after`). The services posters are 1920×1080 WebP; the reel poster is the matching portrait render at 1080×1440. The opening card is portrait to square (aspect 0.74 to 1.1), so a 16:9 clip would show only 42 to 65% of its width. The dev server has no range-request support, so Safari may show only the poster locally.
  3. **Customers.** Q20 confirms the customer names and current/past status; permission to show logos and which agencies may be named are still **[CONFIRM]**. Customers without a logo now show their name as a tile (`.cust-logo--name`); Raytheon (old site capture), Pearson and Indeed (Simple Icons brand symbols, recoloured white) show a logo via `CUST_LOGO` in `js/main.js`. Not shown: the two county seals, NGA, and Capstone (right company not identifiable). The old site's logo wall has none of these six customers and no badge art; its other logos (Boeing, Lockheed Martin, Army, Navy, House seal, ...) are retired and were not reused.
- Optional chatbot live mode: `pip install anthropic`, set `ANTHROPIC_API_KEY`, default model `claude-opus-5-5` (`XC_CHAT_MODEL`), port `XC_PORT` (3200). Without them it runs in "guided" mode from `content.js`.

### `site-research/`
`xcelcareers-current-site/` (12 pages captured, the old site; re-checked live on 12 Nov 2026, see §3), `trecig-reference-site/` (43 pages, a **design-philosophy** reference, borrow principles not looks), `_tools/` (Python capture scripts needing `playwright` and `beautifulsoup4`, not installed), `WEBSITE-CONTENT.md` (the copy deck), `README.md`.

---

## 6. The Superconscious showreel (one component) and why it is kept apart

**Superconscious** is the name of a design brief (a fictional neural-engine brand, tagline "Prompts that think ahead"). The brief describes a **single-file, scroll-driven WebGL showreel**: a dark, full-bleed experience where one normalised scroll value `p` (0 to 1) over a very tall track (2000vh desktop) drives every animated style, with a sticky pinned stage. The user supplied it as a long spec ("recreate this site as a single HTML file") to serve as the **design and motion basis** for the XcelCareers landing experience.

**Decision (user, final):** the Superconscious work lives **apart from** `landing-prototype/`. The prototype stays exactly as committed. The Superconscious page is **derived from the prototype**, meaning it reuses the prototype's copy, facts and logo, but it is **not fused** into it yet. That is why this folder exists and why it imports `../landing-prototype/js/content.js` instead of keeping its own text.

So `superconscious/index.html` = the Superconscious brief's mechanics and visuals, re-skinned with the XcelCareers palette, logo and copy.

---

## 7. Approach

1. **Treat the brief as the engine, the prototype as the content.** The timeline formulas, geometry buckets, shader structure and component layout come from the brief verbatim. Wording, facts, logo and palette come from the prototype.
2. **One file, no build.** Pure HTML, CSS and JS. Three.js r0.185 from an unpkg import map (the only runtime dependency besides Google Fonts). Content is imported as an ES module from the prototype, which means the page must be served over HTTP from the repo root.
3. **Everything is a pure function of `p`.** Each frame: compute `p`, then apply styles to every element, then render whichever WebGL scenes are visible. Nothing keeps animation state except the cursor tilt and the loader.
4. **Derive, do not duplicate.** Anything that exists in `content.js` is read from it at runtime.
5. **Placeholders over blockers.** Missing photos and videos fall back to generated gradients (with captions on the flight tiles) so the page always runs.
6. **Keep the existing prototype safe.** Nothing under `landing-prototype/` is edited by this work.

### How the page was produced (so you can redo or repair it)
1. First pass: wrote the Superconscious page literally (violet palette, star logo, Superconscious copy) as a single `index.html`.
2. Re-skin pass: a Python patch script rewrote it with XcelCareers copy, palette and logo. The old star became the XcelCareers mark in every place (loader, header, reveal mask, sphere logo, 3D object). The patch replaced the hard-coded cards with a JS builder that fills them from `content.js`.
3. Placement: the result was moved from `landing-prototype/index.html` to `superconscious/index.html`, the prototype's original `index.html` was restored from git, and the import and link paths were repointed at `../landing-prototype/`.

---

## 8. What `superconscious/index.html` is and does

### Experience, in scroll order
0. **Loader.** Chrome XcelCareers mark spins over a red bloom, minimum 2.6 s (0.7 s for reduced motion), scroll frozen, then it lifts and the header fades in.
1. **Hero card.** Full-screen card with a cursor-reactive graphite and red mesh-gradient shader. Headline "Vetted. Credentialed. / Ready." (`SHOWREEL.heroLines`), lead, buttons **Request staff** (primary) and **Find a job**, team pill QN · EF · BK with "125+ years of combined experience", right line about MBE · DBE · SBE. A tilting image card and a rotated "Both sides / of every hire" label.
2. **Carousel.** The hero shrinks and flips 90 degrees into a 4-card 3D carousel in front of a role marquee (Nurses, Care staff, Human services, Healthcare IT, Revenue cycle, Cybersecurity). Cards: hero; **01 For employers** ("Your short list, already vetted."); **02 For candidates** ("Your next role, never a fee."); **03 Our network** ("Every placement starts here."). A "See how we staff" pill is pinned underneath.
3. **Sphere.** Card 03 opens through a **mask shaped like the XcelCareers mark** into a black panel holding a 34,000-particle sphere (red to silver, additive bloom), a white mark, and the headings "300,000+ / profiles / on file" plus two paragraphs. Page background fades white to black; a corner **aurora** shader shows through.
4. **Services panels.** A fixed section flies up and pans three panels sideways, then exits left: **01 Healthcare**, **02 Government**, **03 IT · Finance · Cyber** (tags and descriptions from `FUNCTIONS`). Video-ready, gradient when no file.
5. **Flight.** The camera rig flies through 14 floating tiles, captioned from `FLIGHT`.
6. **Landing.** It arrives at a block with a polished chrome 3D XcelCareers mark (red metal figure, nine chrome blades) over its own gradient, the CTA "One nurse. / Or 120+ staff.", the lead, **Request staff**, the phone number, and a white inner frame snapping in.

Header (fixed): mark tile, links Healthcare · Government · Jobs · Contact, CTA "Request staff"; a burger menu under 640px. All links go to `../landing-prototype/index.html#…`.

### Mechanics (condensed spec)

```js
const PERSP = 1500;
const TRACK_VH = 2000, STICKY_VH = 100, SCROLL_COMPRESS = 0.4, OLD_MAX = 2000;
const VSCROLL_MAX = (TRACK_VH - STICKY_VH) / SCROLL_COMPRESS;      // 4750 on desktop
const PS = 1600, PF_DUR = 1500, PF_END = 3100;
const GRID_START = PS + 0.72 * PF_DUR;                              // 2680
const P6_END = GRID_START + 1000, P7_START = P6_END, P7_END = P7_START + 900;
p       = clamp01(scrollY / (trackHeight - innerHeight));
vScroll = p => clamp01(p) * VSCROLL_MAX;
gp      = p => clamp01(vScroll(p) / OLD_MAX);
phase1  = clamp01(gp / (2/15));  phase2 = clamp01((gp - 0.1) / 0.05);
phase3  = clamp01((gp - 0.15) / 0.25);  phase4 = clamp01((gp - 0.4) / 0.35);
```
Every element's style is a function of those (hero size, carousel rotation `phase3 * -270deg`, fly-back `phase4²`, mask size `8 + phase4⁴ * 1500` vmin, sphere disperse, aurora opacity, portfolio enter/slide/exit, camera-rig `translate(-250vw·sin, -100vh·(1-cos)) translateZ(2250·ease)`, final frame reveal). All are in the module script under "constants & timeline". Native scroll, scrollbar hidden.

**Responsive geometry** (set as `--sr-*` variables on `<html>`, chosen by orientation and width, re-evaluated on resize/orientation change): landscape = desktop; portrait under 640 = mobile; portrait up to 1024 = tablet.

| | desktop | tablet | mobile |
|---|---|---|---|
| track height | 2000vh | 1700vh | 1300vh |
| side-card w / h | 42 / 62 vmin | 54 / 80 | 64 / 94 |
| carousel radius | 27 | 35 | 41 |
| fly-back | 40 | 52 | 60 |
| sphere heading 1 / 2 | 18 / 24 | 13 / 16 | 10 / 12 |

**WebGL scenes** (four canvases, each renders only while visible): hero gradient (`#heroGl`, 1x ratio, about 36 fps), aurora (`#aurora`, fixed overlay), particle sphere (`#sphereWrap`, 34k Fibonacci points, simplex-noise vertex shader, ratio 2 to 3), target mark (`#targetGl`, ACES tone mapping, procedural chrome environment map). Shaders are the brief's, with **colours retuned** to graphite, silver and signal red. Canvas buffers are sized from the window, never re-measured during the stage zoom.

**The mark.** Polygons for nine blades, the figure body and the head circle are copied from the prototype's `#i-mark` symbol into `MARK_POLY` and `MARK_FIG`. They feed inline SVGs, two CSS mask data URIs (`--mark`, and `--markm` with a solid hub added), and extruded 3D geometry. The reveal mask is scaled about the mark's hub (viewBox fractions 0.7309 / 0.7688) pinned to the card centre, so early in the reveal the small mark sits off-centre.

**Per-letter text** reveals (hero lines, rotated label, sphere headings sharing one stagger of `cnt(top) + cnt(line1) + cnt(line2)` letters) use the brief's `heroLetterStyle`, `templatesLetterStyle`, `blockLetterStyle`.

---

## 9. The other briefs the user has pasted (status)

Two long briefs were pasted in this work. **Both were truncated** by the chat's 50,000-character limit.

1. **Superconscious** (the one implemented). Cut off at the last section ("per-canvas visibility"). Visibility rules were filled in by judgement: hero renders until the carousel opens; sphere from the carousel rotation until the portfolio ends; aurora while its opacity is above zero; target once the flight reaches about 15%.
2. **HELD-MINT, "Rare cards behind steel"** (a Swiss card-vault landing: poster-on-black-steel style, springs-driven motion, Lenis 1.3.26, a "pile + stamp" preloader, sprayed-underline links, barbed wire, a five-card fan, a ledger, accordion FAQ and a giant outlined footer wordmark). It was cut off in the middle of the preloader's card table, so none of the section coordinates, copy or assets list arrived. **It was NOT implemented.** The assistant asked the user to re-send it in chunks. Note: the prototype's `base.css` indicates this brief ("Prompt 2") is already the basis of the prototype's *lower* sections, recoloured to XcelCareers. Do not rebuild it unless asked; if asked, request the full text first.

---

## 10. Current state (what is done)

- [x] Repo audited and installed. `xcel-website`: `npm ci`, lint and production build all succeed. No secrets found in the source (grep). `.gitignore` covers `.env*`, `node_modules`, `.next`.
- [x] Next hero runs on port 3000 (`npm run dev`). Prototype runs on 3200 (`serve.py`).
- [x] `superconscious/index.html` written, syntax-checked with `node --check`, served with HTTP 200, re-skinned and derived from the prototype.
- [x] `landing-prototype/` was restored to its committed state once, then **deliberately modified at the user's request** (unified top bar and fonts, type scale and spacing, shared reveal motion, closing-frame choreography, floating dock bar, button alignment, scroll-linked card parallax). Files: `index.html`, `css/base.css`, `css/sections.css`, `css/showreel.css`, `js/main.js`, `js/motion.js`, `js/showreel.js`. Committed on branch `landing-unify-and-new-briefs`, not merged to `main`.
- [x] `superconscious/index.html` is the vanilla Superconscious page; `superconscious/xcelcareers.html` is the XcelCareers variant. `held-mint/index.html` is a vanilla HELD-MINT build up to the end of the hero (its brief is truncated). All three were rendered and checked in headless Firefox (Marionette, software WebGL) at desktop and phone widths, and several bugs found that way were fixed. Not yet checked: 1024 and 768 px, hover and keyboard states.
- [x] `superconscious/README.md`, `superconscious/assets/showreel/README.md` and this file (`PROJECT-BRIEF.md`, repo root) written.
- [x] Completed client questionnaire and the live old site read and folded into this brief (§1 to §4).
- [x] The homepage prototype work is committed on `landing-prototype-completion` (latest `3fb8852`, pushed). It is not merged into `main`. Commit messages in this repo end with a `Co-Authored-By: Claude … <noreply@anthropic.com>` line naming the model in use; commit only when the user asks.
- [x] Phases 0 to 5 of the homepage completion plan are done (baseline, layout fixes, form and launcher, type scale and one red, accessibility, performance). Phases 6 to 8 (placeholders and `[CONFIRM]` items, documentation, final check) remain: see [FRONTEND-PROTOTYPE-STATUS.md](FRONTEND-PROTOTYPE-STATUS.md).

### Running processes (may need stopping or restarting)
- Next dev server: `npm run dev` in `xcel-website`, port 3000.
- Prototype server: `python3 landing-prototype/serve.py`, port 3200 (chat in guided mode).
- Showreel / HELD-MINT server: `python3 -m http.server 3300` from the repo root, then open `http://127.0.0.1:3300/superconscious/` (vanilla), `.../superconscious/xcelcareers.html`, or `.../held-mint/`.
- Background servers stop when a Claude Code session ends; restart them as above.
- Headless Firefox testing: start `firefox --headless --marionette --no-remote --profile <fresh dir>` and drive it over Marionette (port 2828). The user's own Firefox must not be the target; use a separate profile.

---

## 11. What is still required

**Blocking nothing, but needed for a finished product**
1. **Verification is partial.** Checked in headless Firefox (1400, 1024, 820, 768 and, through a same-origin iframe, 390, 360 and 320 px) and in headless Chromium 158 (software GL, driven over the DevTools protocol). Not checked: a real GPU, a real trackpad or touch screen, Safari, screen readers, and the showreel's own text over its gradients (contrast cannot be computed reliably there).
2. **Media**, in `superconscious/assets/showreel/` (names and specs in that folder's README): `recruiter.jpg`, `candidate.jpg`, `employer.jpg`, `seeker.jpg`, `flight-1..9.jpg`, `function-1..3.mp4`. Real people, healthcare first, no stock look.
3. **Client confirmations.** The full list of open questionnaire items is in §4. The asset-type ones are: the original vector logo (the mark is currently a trace), logo permission for customer names and whether NGA may be named, headshots for the team pill, the capability-statement PDF, the healthcare role list, the ATS feed for live jobs, the MBE/DBE/SBE badge art.

**Decisions still open**
- Whether and when to **fuse** the showreel into the prototype, or replace the prototype's own showreel (`js/showreel.js`) with this one. Not yet; the user said to keep them apart.
- Whether to build the remaining sections and routes in the **Next.js app** (today it has only the hero). Sitemap in `WEBSITE-CONTENT.md`: Home, Healthcare Staffing, Government Contracting, IT · Finance · Cyber, Jobs, Capability, About, Contact.
- Whether to re-send the HELD-MINT brief.
- Which services will handle the staffing request form, résumé upload and storage, call booking and the ATS jobs feed (§2). Nothing is chosen yet, and these carry the client's top three priorities (§2.1).

**Possible improvements**
- Fold the rest of the XcelCareers sections (certifications, process, jobs, capability, record, FAQ, contact) into the scroll page so it is not split across two files.
- Smooth the reveal's start: the mark mask is anchored at the hub, so the small mark is off-centre.
- Performance on weak GPUs (sphere at ratio 2 to 3, full-screen additive blending): add an adaptive ratio.
- Wire the CTAs and the chatbot to real form and lead endpoints (leads go to Barry Klasson).
- Replace the placeholder-colour tiles with real photography; add alt text and a reduced-motion pass beyond the loader.

---

## 12. Mistakes made on the way (do not repeat)

- The Superconscious brief was first built as a standalone page in a new folder, then overwritten into `landing-prototype/index.html` while the user actually wanted the prototype left alone. Fixed by restoring the prototype from git and moving the page here. **Rule: never overwrite `landing-prototype/` files. Derive instead.**
- The first literal build used the Superconscious brand and copy (violet, a star logo, "Prompts that think ahead"). That is **not** the XcelCareers product. The current file is the XcelCareers re-skin; do not reintroduce Superconscious copy.
- A previous 3D object placement had the centring offset applied before scaling (so the model sat off-centre); fixed by setting `position = -centre * scale`.
- The HELD-MINT paste was truncated and could not be built. Always check whether a pasted spec is complete before building from it.

---

## 13. Conventions for anyone continuing

- Edit **wording and facts only in** `landing-prototype/js/content.js`. It feeds the prototype, its chatbot and this page. That file sits inside the frozen prototype folder, so ask the user before changing it (see the rule below).
- Keep `superconscious/index.html` a single file. No build step, no framework.
- Do not modify anything outside `superconscious/` without asking, especially `landing-prototype/`.
- Match the surrounding code style: short comments only where the intent is not obvious.
- Serve over HTTP from the repo root; `file://` breaks the module import.
- When running servers, note ports 3000, 3200 and 3300 are used.
- Content rules in §1 apply to any copy you write: plain words, the banned-word list, only proof-bank facts, healthcare first.
- Authority for facts: the client questionnaire first, then `content.js` / `WEBSITE-CONTENT.md`, then this file. Never take a fact from the live old site (§3).
- Never invent testimonials, quotes, client names, statistics or healthcare track record (§1.9). Keep the business model (§1.6) out of copy and chatbot answers.
- Report outcomes honestly: if something was not run or not seen, say so.

---

## 14. Quick reference

```bash
# Next app
cd xcel-website && npm ci && npm run dev            # http://localhost:3000

# Static prototype (original, untouched)
python3 landing-prototype/serve.py                  # http://127.0.0.1:3200

# Superconscious showreel (serve from repo root)
python3 -m http.server 3300                         # http://127.0.0.1:3300/superconscious/

# Syntax check the showreel script
python3 - <<'E'
import re;s=open('superconscious/index.html').read()
open('/tmp/chk.mjs','w').write(re.search(r'<script type="module">(.*?)</script>',s,re.S).group(1))
E
node --check /tmp/chk.mjs
```

Key files: `FRONTEND-PROTOTYPE-STATUS.md` (homepage scope, decisions, Definition of Done) · `docs/` (prototype guide, testing, accessibility, backend handoff) · `PROJECT-BRIEF.md` (this) · `superconscious/index.html` · `superconscious/README.md` · `superconscious/assets/showreel/README.md` · `landing-prototype/js/content.js` · `site-research/WEBSITE-CONTENT.md` · `xcel-website/src/components/hero/Hero.tsx`.
