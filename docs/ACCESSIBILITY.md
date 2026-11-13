# Accessibility: target, status and how to re-test

**Target (decided 13 Nov 2026):** WCAG 2.1 Level AA, plus two criteria from 2.2: **2.4.11 Focus Not Obscured (Minimum)** and **2.5.8 Target Size (Minimum)**. Source: CLAUDE.md §7 asks for keyboard, focus and reduced-motion care; PROJECT-BRIEF §4.3 and §11 name WCAG 2.1 AA as the usual target and say the showreel needs keyboard and reduced-motion fallbacks. Everything here concerns `landing-prototype/`. Tested in headless Firefox and Chromium only; no screen reader and no real touch device.

## 1. Criteria and where they stand

| Criterion | Status | How it is met, or what is open |
|---|---|---|
| 1.1.1 Non-text content | Partial | The hero image has alt text. Decorative SVGs are `aria-hidden`. Real photos will need alt text when they replace placeholders. |
| 1.3.1 Info and relationships | Met (checked in markup) | Landmarks: `header`, `nav` (labelled), `main`, `footer`; sections labelled with `aria-labelledby` or `aria-label`; one `h1` (the hero). |
| 1.4.3 Contrast (Minimum) | Met, one gap | Measured on the page, the chat panel and the launcher: all text 4.5:1 or 3:1 for large text. Text on the red fill is graphite (5.1:1). The poster caption is dark. The footer outline wordmark is a logotype (exempt). **Not measured:** showreel text over its gradients. |
| 1.4.4 Resize text | Not tested | |
| 1.4.10 Reflow | Met | No overflow at 320, 360, 390, 768, 820, 1024, 1400 px. |
| 1.4.11 Non-text contrast | Met | Email field and chat input borders are 3:1 or better; the pause toggle border is stronger. Focus outlines are red on dark. |
| 1.4.12 Text spacing | Met | With the WCAG spacing overrides applied before load, no text was clipped (decorative placeholder art collapses). |
| 2.1.1 Keyboard | Met | Tab order: bar → showreel buttons → jobs and poster buttons → FAQ questions → email field and button → footer links → chat launcher. Sideways snap also works with ← / →; ↓ / ↑ step through the showreel's resting beats (hold for free scrolling). |
| 2.2.2 Pause, stop, hide | Met | The pause toggle in the top bar (`js/pause.js`) stops the marquee, shader animation, the mark's sway, the cursor tilt, looping placeholders, the four looping videos (`js/video.js`; the poster shows while paused) and the chat orb's spin and pulse. |
| 2.4.1 Bypass blocks | Met by landmarks | No skip link. |
| 2.4.3 Focus order | Met | Follows the visual order. |
| 2.4.7 Focus visible | Met | 1px outlines on every control. The chat composer shows a 3:1 border and a glow. |
| **2.4.11 Focus Not Obscured** | Met | `scroll-padding` on `html` clears the fixed bar (`--bar-h`) and the chat launcher; in the pinned showreel, keyboard focus brings the stage into view (`focusin` in `js/showreel.js`). Tested by tabbing through all controls. |
| **2.5.8 Target Size** | Met by exception | Nav, footer and "or call" links are under 24 px tall but pass the spacing exception; the pause toggle is 28 px; buttons and FAQ rows are larger. |
| 3.3.1 / 3.3.3 Errors | Met for the email field | `aria-invalid`, an inline message in a live region (`role=alert` for errors, `status` for the note), focus returns to the field. |
| 4.1.2 Name, role, value | Partial | The toggle uses `aria-pressed` with a fixed label; the launcher has `aria-expanded` and `aria-controls`; the chat panel is a labelled dialog. Not audited with a screen reader. |
| Reduced motion (not an AA item; CLAUDE.md §7) | Met for self-moving parts | The toggle starts paused under `prefers-reduced-motion`; springs resolve instantly; wheel smoothing and anchor animation are off. Scroll-linked 3D motion is **deliberately unchanged** (user decision). |

## 2. Known gaps and decisions

- Showreel text contrast over gradients: needs a visual or tool-assisted check.
- A screen-reader pass (NVDA/JAWS/VoiceOver) is a production task.
- Scroll-linked 3D motion still runs under reduced motion by decision; a static alternative layout was considered and not chosen.
- The 3D carousel and flight are decorative scroll effects; the same content is reachable by normal scrolling and by the labelled sections.

## 3. Re-testing

Recipes are in [TESTING.md](TESTING.md) §4: contrast, text floor, overflow, keyboard walk (with the bar and launcher overlap check), reduced motion and pause, hit-testing. Re-run them after any change to the bar, the launcher, the stage buttons, colours or type tokens.

## 4. Rules for new work

- New text is at least 11px (`--type-min`) and 4.5:1 (3:1 only when large: at least 24px, or 18.66px and bold).
- Text on the red fill is graphite; do not put small red text on a light surface.
- Interactive elements get a hover and a visible keyboard-focus state; borders that identify a field are 3:1.
- Anything that moves on its own respects `html[data-motion="paused"]`.
- Do not put a fixed element where it can fully cover a focusable one without scroll padding.
