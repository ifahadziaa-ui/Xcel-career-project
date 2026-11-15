# Customer logos

Supplied by the user on 14 Nov 2026 in `Assets/Companies worked with logos/` (originals kept there). Permission to show customer logos is still marked [CONFIRM] in the Q20 answer (Montgomery and Prince George's County seals and the NGA seal are government marks): confirm before launch.

Each original is processed by a script into a silver silhouette on transparency (`logo-*.webp`), so it sits on the dark section instead of showing as a white box. Logos on white: brightness becomes opacity, so white clears and ink and colour stay. The NGA seal already had transparency: it is greyscaled and lifted. The originals' own colours are not shown; use the originals if the client wants full colour.

| File | Customer | Original |
|---|---|---|
| logo-montgomery.webp | Montgomery County Government | Montgomery County Maryland Government official logo SVG.png (225 px, small: the seal is soft when enlarged) |
| logo-pg-county.webp | Prince George's County Government (OIT) | Prince George's County Maryland Government official logo PNG.png |
| logo-raytheon.webp | Raytheon Technologies | Raytheon Technologies official logo transparent PNG.jpg (a JPG on white, not transparent) |
| logo-pearson.webp | Pearson | Pearson Education official logo SVG.png |
| logo-indeed.webp | Indeed | Indeed official company logo SVG.png |
| logo-nga.webp | NGA | National Geospatial Intelligence Agency NGA official logo PNG.png (the official name is hyphenated: National Geospatial-Intelligence Agency) |

Shown as a name tile (no logo supplied): Capstone Corporation.
Trademarks belong to their owners. A copy of the six files is in `xcel-website/public/logos/` for the Next.js home page (phase 2).

## Update, later on 14 Nov 2026: full colour
The user asked for the logos' own colours. The silver silhouettes were replaced: each company logo is now its original artwork, trimmed, on a light plate (multiply blend, so white backgrounds vanish). The three certification badges the user added (`Assets/Certifications logos/`: MBE, DBE, SBE) replace the placeholder seals as `cert-mbe.webp`, `cert-dbe.webp`, `cert-sbe.webp`, with their outer white background removed so they sit on the dark section in colour. Scripts: scratchpad `make_logos2.py`. Copies of all nine files are in `xcel-website/public/logos/`.
