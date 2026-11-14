# `landing-prototype-clean/`: the content-cleaned copy

**What it is.** A separate copy of the homepage and the other nine pages with the unsupported or misleading content removed, taken from `landing-prototype/` on 14 Nov 2026 (including the uncommitted FAQ-tag and chat-launcher fixes of that day). Design, motion, layout, assets and interactions are the same. It is the **verified reference** for the homepage and the intended source for the migration into `xcel-website/` ([MIGRATION-ASSESSMENT.md](MIGRATION-ASSESSMENT.md)).

**Relationship to the original.** `landing-prototype/` is untouched by the cleanup and stays as the earlier reference. The two now differ in content (below), so changes must not be assumed to apply to both. Neither copy is a branch of the other; they are two directories.

## Run it

```bash
python3 landing-prototype-clean/serve.py   # http://127.0.0.1:3201 (the original uses 3200)
```

`serve.py` is the original's server with the default port changed to 3201 and the live-chat prompt told that job cards are examples. Guided chat needs nothing else.

## What differs from the original

Full lists: `landing-prototype-clean/CONTENT-CLEANUP.md` (what was removed and changed) and `landing-prototype-clean/VERIFICATION-REPORT.md` (the evidence for each claim and the test results). In short:

- **Removed:** NGA; the Raytheon, Pearson and Indeed logos; "Currently hiring" and "View all jobs" (now "Example roles", every card labelled "Example"); the apply form and its fake "You applied" state; the capability PDF button; the clinical role list; ledger categories and "Delivered" stamps; the chat's reply-time promise, "Online", generated ticket ID and "Book a short call"; the "(XC), LLC" legal name; visible internal notes ("official badge", "Photo · your asset", "Prototype" labels).
- **Reworded:** "Ready to prime or sub" became the client's own "ready to contract at the local, state and federal level"; the hero line "Cert. 19-286 · Veteran-owned" became "Cert. 19-286 · MBE · DBE · SBE"; the About page no longer places "Certified" over "Minority veteran-owned"; contact and résumé forms say nothing was sent and give the phone and email.
- **New behaviour:** the chat ends with a "Request summary · Not sent yet" card that links to the contact form with the details prefilled; focus returns to the chat launcher after Escape; `aria-modal` is set only on phones; the quiet placeholder (`ph({ quiet: true })`, a graphite or paper panel with the mark and no label) replaces labelled placeholders.

## Rules

- **Edit only with the user's authorization for a stated task** (CLAUDE.md §3). Do not "sync" it from the original or the reverse without asking.
- A claim changed here is recorded in [CLAIMS-REGISTER.md](CLAIMS-REGISTER.md) and, if it came from a report, in `VERIFICATION-REPORT.md`.
- Restoring a withheld item means returning to the original's version of that string or file; the restore table is in `CONTENT-CLEANUP.md` §2.

## Reports that describe it

| File | What it is |
|---|---|
| `landing-prototype-clean/CONTENT-CLEANUP.md` | What was removed, changed and withheld in the first cleanup |
| `landing-prototype-clean/VERIFICATION-REPORT.md` | The second pass: claim table, page-by-page audit, showreel scenes, accessibility, changes, client questions |
| `site-research/INNER-PAGES-AUDIT.md` | Read-only audit of the seven inner pages |
