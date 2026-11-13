# XcelCareers website project

Redesign of the XcelCareers marketing site (healthcare staffing first, government contracting second, with IT, finance and cybersecurity specialists across both). This repo holds the research, the approved content, and several front-end builds.

**Read order for a new contributor or an LLM:** [CLAUDE.md](CLAUDE.md) (how to work here), then [PROJECT-BRIEF.md](PROJECT-BRIEF.md) (what the project is and where it stands).

## What is in the repo

| Path | What it is | State |
|---|---|---|
| [xcel-website/](xcel-website/) | Next.js 16 production app (React 19, Tailwind 4). | Hero only; still carries placeholder VESSEL copy |
| [landing-prototype/](landing-prototype/) | Static one-page XcelCareers site: hero, showreel, credentials, process, jobs, capability, record, FAQ, contact, chatbot. Copy lives in `js/content.js`. | Most complete; reference implementation |
| [superconscious/](superconscious/README.md) | Scroll-driven WebGL showreel. `index.html` is vanilla Superconscious; `xcelcareers.html` is the XcelCareers variant. | Working; checked in headless Firefox |
| [held-mint/](held-mint/README.md) | Vanilla HELD-MINT landing build. | Hero and earlier only (its brief is truncated) |
| [docs/](docs/) | Developer docs for the landing prototype: [LANDING-PROTOTYPE-GUIDE.md](docs/LANDING-PROTOTYPE-GUIDE.md) (architecture and conventions), [TESTING.md](docs/TESTING.md) (headless Firefox and Chromium recipes), [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) (WCAG status), [BACKEND-HANDOFF.md](docs/BACKEND-HANDOFF.md) (production integration points). Status and Definition of Done: [FRONTEND-PROTOTYPE-STATUS.md](FRONTEND-PROTOTYPE-STATUS.md). | Current |
| [site-research/](site-research/README.md) | Captures of the old site and a reference site, capture scripts, and [WEBSITE-CONTENT.md](site-research/WEBSITE-CONTENT.md) (the approved copy deck). | Reference data |
| `superconscious_prompt.md`, `held-mint_prompt.md` | The two design briefs the showreel and HELD-MINT builds follow. The HELD-MINT one ends mid-hero. | Inputs |
| `Assets/`, `Hero page design/`, `Animation videos/`, `Landing page prompts/`, `XcelCareers - Client Questions.docx` | Logo, design inputs, the client questionnaire. | Inputs |

## Running things

```bash
# Next.js app (http://localhost:3000)
cd xcel-website && npm ci && npm run dev

# Landing prototype (http://127.0.0.1:3200)
python3 landing-prototype/serve.py

# Superconscious and HELD-MINT (serve from the repo root, port 3300)
python3 -m http.server 3300
#   /superconscious/  /superconscious/xcelcareers.html  /held-mint/
```

The Superconscious XcelCareers variant imports `../landing-prototype/js/content.js`, so it must be served from the repo root. `file://` does not work for any of the module pages.

## Source of truth for content

1. The client questionnaire (`site-research/XcelCareers_-_Client_Questions_COMPLETED.docx`).
2. `landing-prototype/js/content.js` and `site-research/WEBSITE-CONTENT.md`.
3. `PROJECT-BRIEF.md`.

The old live site is outdated and not authoritative. Items marked **[CONFIRM]** still wait on the client.

## Status

The homepage prototype is the current focus (the other seven pages follow after its review). Its completion plan, decisions, Definition of Done and open issues are in [FRONTEND-PROTOTYPE-STATUS.md](FRONTEND-PROTOTYPE-STATUS.md). The work of phases 0 to 5 is on the branch `landing-prototype-completion`; `main` holds the earlier prototype work. The pages were checked in headless Firefox and headless Chromium (software rendering); a real GPU, touch, Safari and screen readers are not yet checked. Details, open decisions and known gaps are in [PROJECT-BRIEF.md](PROJECT-BRIEF.md) §10 and §11.
