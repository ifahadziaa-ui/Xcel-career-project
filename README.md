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

Nothing from the recent work is committed. The prototype, Superconscious and HELD-MINT pages were checked in headless Firefox at desktop and phone widths; tablet widths and hover or keyboard states are not yet checked. Details, open decisions and known gaps are in [PROJECT-BRIEF.md](PROJECT-BRIEF.md) §10 and §11.
