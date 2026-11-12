# CLAUDE.md

## 1. Start Here

Before making any changes, read `PROJECT-BRIEF.md` in full.

It contains the project context, business requirements, repository structure, content rules, design direction, known decisions, unresolved questions, and scope restrictions.

Do not treat this file as a replacement for `PROJECT-BRIEF.md`. This file defines how you should work; the project brief defines what the project is and what is currently known about it.

If instructions appear inconsistent, do not silently choose an interpretation. Identify the conflict and ask for clarification.

---

## 2. Project Overview

This repository contains the work for the XcelCareers website redesign.

XcelCareers is a Maryland-based healthcare staffing and government contracting company. The website is being repositioned to communicate its healthcare staffing capabilities first, government contracting second, and specialist IT, finance, and cybersecurity capabilities where relevant.

The primary audiences are:

1. Employers and hiring managers.
2. Government buyers and prime contractors.
3. Job seekers.

The website should build credibility and encourage meaningful enquiries, not simply act as a generic recruitment website.

Refer to `PROJECT-BRIEF.md` for the full business context and requirements.

---

## 3. Repository Structure

The repository contains several distinct projects. Understand their purpose before working in them.

### `xcel-website/`

The production Next.js application.

- Next.js 16.4.5
- React 19.3
- Tailwind CSS 4
- TypeScript
- Currently contains an initial hero implementation.
- Still contains placeholder VESSEL branding and copy.

This is the intended production application, but do not assume that every design or implementation decision has already been finalized.

### `landing-prototype/`

A complete static one-page website implementation.

- Contains the most complete reference implementation.
- Includes the chatbot and `js/content.js`.
- Serves as an important reference for the website's existing design, content, and interactions.

**This directory is protected. Do not modify its contents unless the user explicitly authorizes it.** Each authorization covers the task it was given for; it is not a standing permission.

Do not use it as a scratchpad, testing area, or place to make temporary changes.

History: on 12 Nov 2026 the user explicitly authorized edits here for the design pass that unified the top bar, fonts, type scale, spacing and reveal motion, and refined the "One nurse" closing frame (files: `index.html`, `css/base.css`, `css/sections.css`, `css/showreel.css`, `js/main.js`, `js/motion.js`, `js/showreel.js`). Those changes are uncommitted and documented in `PROJECT-BRIEF.md` §5. The protection applies again for any new work. In particular:

- The hero and the fixed top bar use Mona Sans and Geist Mono. Everything after the hero uses Zen Kaku Gothic New. Keep that split.
- The type scale lives in `css/base.css`; do not add per-section font sizes.
- Reveals share one entrance (`RISE` in `js/motion.js`).

### `superconscious/`

A standalone, one-file scroll-driven showreel derived from the prototype.

- Uses vanilla HTML, CSS, and JavaScript.
- Uses Three.js r0.185.
- Imports `../landing-prototype/js/content.js`.
- Has no build step.
- Contains two single-file pages: `index.html` (vanilla Superconscious, no XcelCareers content) and `xcelcareers.html` (the XcelCareers variant, which imports `../landing-prototype/js/content.js`).
- Has been rendered and checked in headless Firefox at desktop (1400 px) and phone (420 px) widths. Tablet widths, hover and keyboard states are not yet checked.
- Has not been fused with the prototype or production application.

Its brief is `superconscious_prompt.md` (complete).

The default authorized modification scope is `superconscious/` only (and `held-mint/`, see below). Anything else needs the user's say-so for that task.

Do not merge it into another project or change its relationship with the other directories without explicit permission.

### `held-mint/`

A vanilla, single-file HELD-MINT landing build (`index.html`, with its own README).

- Follows `held-mint_prompt.md`, which is **truncated mid-hero**. Implemented: shell, tokens, motion engine, preloader, header and menu, and the hero. Sections 02 to 12 and the footer are not implemented because they are not in the brief; do not invent them. Ask the user for the rest of the brief.
- Needs a server rooted at the repo root (`python3 -m http.server 3300`).
- Checked in headless Firefox at 1400, 800 and 420 px wide.
- Uses HELD-MINT's own copy and assets; it is not derived from the XcelCareers content.

### `site-research/`

Contains research material, website captures, and the approved content deck.

Use these materials when investigating existing content, references, and decisions.

---

## 4. Scope and File Protection

The current project brief establishes a strict modification boundary:

**Do not modify anything outside `superconscious/` and `held-mint/` without asking the user first.**

This includes, but is not limited to:

- `landing-prototype/`
- `xcel-website/`
- `site-research/`
- Root-level project files

Reading and inspecting files is permitted when necessary to understand the project. Modifying them is a separate matter and requires authorization.

Do not interpret a request to inspect, compare, analyze, or reference a directory as permission to modify it.

Root-level documentation (`README.md`, `PROJECT-BRIEF.md`, `CLAUDE.md`) may be updated when the user asks for documentation to be created or kept up to date.

If a task cannot be completed within the currently authorized scope, explain why and ask for permission before proceeding.

Never make changes outside the authorized scope merely because they seem necessary, convenient, or beneficial.

---

## 5. Source of Truth

Use the following source-of-truth hierarchy for business information and website content:

1. Client questionnaire.
2. `landing-prototype/js/content.js` and `site-research/WEBSITE-CONTENT.md`.
3. `PROJECT-BRIEF.md`.

The live, older XcelCareers website is outdated and is not an authoritative source for current business information or website claims.

For existing implementation behaviour, inspect the actual code. Do not assume that written descriptions accurately represent what the code currently does.

When sources conflict:

- Do not silently reconcile them.
- Do not select whichever version seems more plausible.
- Identify the conflicting information.
- Ask the user which source or interpretation should take precedence.

Do not invent missing information to make content or implementation appear complete.

---

## 6. Business Accuracy and Content Rules

Accuracy is more important than persuasive wording.

Never fabricate or imply any of the following:

- Healthcare staffing experience or track record.
- Client relationships or customer names.
- Statistics, placement numbers, or performance figures.
- Testimonials or case studies.
- Certifications, credentials, or qualifications.
- Government contracts, contract vehicles, or registrations.
- Client endorsements or permissions.
- Company history or founding details.

Do not reuse retired contact details, claims, or other outdated information from the old website.

Do not present an unconfirmed business capability as an established fact.

If information is missing, mark it as unresolved or ask for clarification. Do not fill gaps with plausible-sounding copy.

### Public-facing language

Maintain a tone that is:

- Caring.
- Trustworthy.
- Professional.
- Clear.
- Credible.

Avoid generic marketing language.

The following words and phrases are specifically prohibited in website copy:

- "solutions"
- "world-class"
- "cutting-edge"
- "passionate"
- "one-stop shop"

Do not expose internal business model details, markup, or other internal commercial information in public-facing content or chatbot responses.

---

## 7. Technical and Implementation Principles

Before changing code:

1. Inspect the relevant files and understand the existing implementation.
2. Identify dependencies and relationships with other parts of the project.
3. Determine whether the requested change is within the authorized scope.
4. Check whether the required behaviour already exists.
5. Make the smallest appropriate change.

Avoid unnecessary rewrites, abstractions, dependencies, and architectural changes.

Preserve existing functionality unless the user explicitly requests a change to it.

Do not introduce a new framework, library, service, or architectural pattern without a clear reason. Explain significant technical trade-offs before making decisions that affect the wider project.

### Design and user experience

The website should retain its intended identity and visual direction.

Avoid turning it into a generic SaaS landing page, generic job board, or template-driven recruitment website.

When implementing or adjusting interfaces:

- Maintain visual consistency.
- Consider desktop, tablet, and mobile layouts.
- Preserve the intended interaction behaviour.
- Avoid unnecessary visual complexity.
- Pay attention to loading performance.
- Consider accessibility, keyboard navigation, and reduced-motion preferences.
- Treat WebGL and other visually intensive features with performance in mind.

Do not claim that an interface has been visually verified unless it has actually been inspected.

---

## 8. Handling Uncertainty

**Do not assume.**

This is especially important for business requirements, content, design decisions, application behaviour, and architecture.

When something is unclear:

- First inspect the available project files and documentation.
- Determine whether the answer is already established somewhere in the repository.
- If it is not established, ask the user.
- Do not silently make a decision that could affect the project's direction.

Distinguish clearly between:

- Confirmed requirements.
- Existing implementation.
- Proposed changes.
- Temporary assumptions.
- Unresolved client decisions.

You may make small, reversible implementation decisions when they are genuinely necessary and do not alter established requirements. However, do not turn an uncertain requirement into a permanent project decision.

For significant decisions, present the options and their consequences before proceeding.

---

## 9. Working With Claude Code

Work incrementally rather than attempting large, uncontrolled changes.

For each task:

1. Understand the request.
2. Inspect the relevant code and documentation.
3. Check scope restrictions.
4. Identify uncertainties and ask questions where necessary.
5. Implement only what was requested.
6. Review the resulting changes.
7. Run relevant checks when possible.
8. Report the outcome honestly.

Do not make unrelated improvements simply because you notice something that could be changed.

Do not remove existing code or functionality without understanding its purpose.

Do not overwrite existing work without checking what it contains.

Do not claim that a task is complete if important parts remain unimplemented or unverified.

### Verification

For code changes, run the relevant checks where applicable.

For the Next.js application, existing project scripts and dependencies should be inspected before deciding which commands to run.

For visual changes, inspect the actual rendered result when the necessary environment is available. Headless Firefox works for this: start `firefox --headless --marionette --no-remote --profile <fresh dir>` and drive it over Marionette (port 2828); never target the user's own Firefox profile. Chromium/Playwright is not installed. Background servers (3000, 3200, 3300) stop when a session ends, so check them before testing. A successful build does not prove that the interface looks or behaves correctly.

If a check cannot be performed, state that explicitly.

---

## 10. Communication and Reporting

Keep communication direct and technically precise.

When reporting completed work, include:

- What was changed.
- Which files were modified.
- Why the changes were made.
- Which checks or tests were performed.
- Whether those checks passed.
- What remains incomplete or unverified.

When asking for clarification, ask only what is necessary to proceed.

If you identify a problem outside the current task or authorized scope, report it without automatically fixing it.

Do not hide limitations, unresolved questions, failed checks, or implementation compromises.

---

## 11. Final Rule

Protect the existing work, respect the authorized scope, and prioritize correctness over speed.

Do not invent requirements, business facts, or implementation details.

When the available information is insufficient to make a reliable decision, stop and ask rather than guessing.