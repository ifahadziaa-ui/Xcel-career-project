# Backend and production handoff

What the frontend prototype does today at each point where production wiring will go, where it lives in the code, and what a real implementation must supply. Nothing here is implemented yet: backend integration was deliberately deferred ([../FRONTEND-PROTOTYPE-STATUS.md](../FRONTEND-PROTOTYPE-STATUS.md) §1). Business context is in [../PROJECT-BRIEF.md](../PROJECT-BRIEF.md) §2.

All website enquiries and chatbot leads go to **Barry Klasson, bklasson@xcelcareers.com** (brief §1.9, §2.4). The business model (markup, fees) must never appear in copy or chatbot answers (brief §1.6).

## 1. Integration points

| # | Feature | Client priority | Today | Where | What production needs |
|---|---|---|---|---|---|
| 1 | **Staffing request, contact teaser** | #1 (Q10) | The home form (organization, role, work email) validates, then opens `contact.html` prefilled (GET). Nothing is sent; the contact page's own form is a prototype ("not sent" notice). | `index.html` `#join-form`, `#join-email`, `#join-msg`; handler in `js/main.js` ("the email teaser") | An endpoint that accepts the email and delivers it to Barry reliably; a real success and failure state replacing the "not connected" note; spam protection; a privacy notice (brief §4.3). |
| 2 | **Full staffing request form** | #1 (Q10) | Not designed. The home page is specified as email + button only. | Fields are listed in `site-research/WEBSITE-CONTENT.md` §4 (Contact page outline): organization, name, role, email, phone, type of staff, number of people, shifts, pay range (optional), license / certification / clearance, location, contract type, start date, notes | Decide whether it lives on a Contact page (scope decision) and design its states. |
| 3 | **Chat staffing request** | not ranked | A 5-step guided flow (staff type, requirement, headcount, start, email) ends in a ticket card with an ID like `XC-04217` generated in the browser from the clock. Nothing is sent. The confirmation text promises a reply "within one business day (SAMPLE)". | `js/chat.js`: `FLOW` (line ~316), end of `flowInput` (~line 547), `case "ticket"` renderer | POST the collected data (`fn`, `clr`, `n`, `when`, `email`) to the same lead endpoint as #1; return a real reference; the response-time promise needs the client's confirmation. |
| 4 | **Live AI chat** | not ranked | Off unless `serve.py` finds the `anthropic` package and `ANTHROPIC_API_KEY`. Guided mode (answers from `content.js`) is the default. | `serve.py`: `GET /api/chat/status`, `POST /api/chat` (streamed). Env: `ANTHROPIC_API_KEY`, `XC_CHAT_MODEL` (default `claude-opus-5-5`), `XC_PORT` (3200). The key never leaves the server. Tools: `show_jobs`, `start_talent_request`, `show_contact`, `show_certifications`. | A host for the endpoint (not a static host), the key in server config, rate limiting, and a check that answers never expose the business model. Guided mode needs nothing. |
| 5 | **Jobs feed** | #2 (Q10) | Five sample roles. They look real and are not labelled as samples on the page. | `js/content.js` `JOBS` (fields: `fn`, `title`, `where`, `need: [label, value]`, `type`, `art`) and `FEATURED_JOB`; rendered by `js/main.js` into `#fan`; the chat's job cards read the same data | Pull openings automatically from the client's ATS (not yet named, Q11); never show stale or placeholder listings (brief §2.2); decide the empty state. |
| 6 | **Job detail, filters, apply, résumé upload** | #2 (Q10) | None. "Upload résumé" and "View all jobs" scroll to `#jobs`. | Footer links in `index.html`; `.btn` in the jobs section | Jobs page, detail view, apply form (the old site asked first name, last name, email, résumé, all required), file storage and malware scanning, and where applications are delivered (not stated by the client, brief §4.2). |
| 7 | **Capability statement PDF** | #3 (Q10) | "Download PDF" scrolls to `#capability`; `CREDENTIALS.pdf` is `"#capability"`. | `index.html` `#cap-pdf`; `js/content.js` `CREDENTIALS.pdf`; the poster cover is a placeholder | The client's healthcare-focused PDF (not yet supplied), hosted at a stable URL; set `CREDENTIALS.pdf` and the button's `href`. |
| 8 | **Call booking** | not ranked | Not built. | none | A tool (not named by the client) and a UI. |
| 9 | **Testimonials** | wanted, none supplied | Slot hidden. | none | Real quotes with permission only (brief §1.9). |
| 10 | **Analytics, SEO, redirects** | n/a | Title, description and one H1 only. | `index.html` `<head>` | Redirects for the old URLs (`/transition-into-tech/`, `/jobs-2/`, `/jobs-3/*`, `/contact/`; brief §3.4), analytics continuity (the old site had Site Kit), sitemap, social-sharing tags. |

## 2. Production tasks that are not features

- **Port to the Next.js app** (`xcel-website/`): the prototype is vanilla and is the visual and behavioural reference. Copy comes from `content.js`; the showreel's logic is one self-contained module.
- **Libraries:** three.js, Lenis and Google Fonts load from CDNs with no fallback. Self-host or degrade gracefully before launch.
- **Compatibility:** latest Chrome and Safari were the stated targets; Safari was only reviewed in code, not run.
- **Security and privacy:** input handling, consent, key management, and a privacy policy and equal-opportunity statement (brief §4.3).
- **Open client confirmations** that gate content: brief §4.1 and `site-research/WEBSITE-CONTENT.md` §5.
