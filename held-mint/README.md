# HELD-MINT: "Rare cards behind steel"

Single-file implementation of the HELD-MINT landing brief in [../held-mint_prompt.md](../held-mint_prompt.md). Entry: [index.html](index.html), pure HTML, CSS and JS, no build step. External code: **Lenis 1.3.26** (import map, jsDelivr) and Google Fonts (Barlow Condensed, Sedgwick Ave Display, Sora). All imagery loads from the brief's bucket (`ASSET_BASE_URL` in the script).

```bash
cd Xcel-career-project
python3 -m http.server 3300
# open http://127.0.0.1:3300/held-mint/
```

## Important: the brief file is truncated

`held-mint_prompt.md` ends mid-sentence in the **hero's right column** ("Plate width desktop 256, laptop 23…"). Everything after that point is missing: the rest of the hero's button widths and drips, sections 02 to 12 (intro, barbed wire, process, vault, drop, record, questions, join, footer), the barbed-wire layouts, the full asset list and any fixed-parameter section.

**Implemented (everything the file specifies):**
- Page shell, reset, the four faces, `:root` tokens (copied verbatim from the brief), the four-frame rem grid.
- Motion engine: shared ticker, react-spring-style springs, string-map animation, the `MOTION` set, gated "seen" reveals with replay on range change, line-by-line copy reveal, scroll parallax.
- Shared components: eyebrow, headline mark and scribble, plate button with drips, sprayed-underline nav links.
- "Pile + stamp" preloader (four cards, counter and bar, SEALED stamp, curtain lift) with real image-load progress.
- Header (desktop, laptop, tablet, mobile variants) and the handheld poster menu with its springy trail.
- **01 Hero.**

**Not implemented (not in the file):** sections 02 to 12 and the footer. A clearly labelled placeholder block ("Sections 02–12 are not in the supplied brief yet") sits under the hero and carries the `#vault` and `#join` anchors so links do not dead-end.

**Guessed values (not in the file):** the "Request access" plate width on laptop, tablet and mobile (232) and its drip positions (scaled from the menu's Buy NFT button). Everything else follows the brief's numbers.

## Verified
Tested in headless Firefox 154 (Marionette, software WebGL) at 1400, 800 and 420 px wide: preloader, hero, reveals, header, the poster menu and its cascade all render with no console errors. Not yet checked: the 1024 px (laptop) frame, and hover or keyboard states.

## Next step
Re-save the complete prompt (or the missing remainder) and the remaining sections can be added to this file.
