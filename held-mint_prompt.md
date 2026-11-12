# Recreate this site as a single HTML file: HELD-MINT — Rare cards behind steel

You are an expert creative front-end developer. Produce a **single self-contained `index.html`**
that reproduces the project below **exactly**: same layout, copy, visuals, motion and interaction.
Use pure HTML/CSS/JS in one file, with no build step, framework or bundler. ES modules go inline in a
`<script type="module">`. **Lenis 1.3.26 is the only external code**, pulled through an import map; the
four type faces come from one Google Fonts `<link>`. You write everything else by hand: the spring
engine, the shared ticker, the reveal triggers, the scroll parallax, the line-by-line and
letter-by-letter text reveals, the spray-paint underline, the poster menu and the "pile + stamp"
preloader. Hardcode every value given here as a fixed constant. Where this document gives code, it is
the shipped behaviour: use it as it stands, and treat every number in it as the shipped default.

```js
const ASSET_BASE_URL = "https://storage.getlayers.ai/assets/held-mint-78f917a508";
```

Every image below loads from that base. A path written like `hero/hero-vault.png` in this document
means `${ASSET_BASE_URL}/hero/hero-vault.png` (the bucket sends `Access-Control-Allow-Origin: *`).
The full list is in **Assets** at the end.

## What it is

The one-page landing of **HELD-MINT**, a Swiss card vault: rare collectible cards (cartoon "Ape" cards,
NFT-style art printed on physical cards) bought outright, graded, sealed and shelved in a strongroom in
Zug, with ownership, votes and audits kept on a public ledger. The look is **street poster on black
steel**: a near-black blue ink ground (`#070a10`), paper-white Barlow Condensed **Black Italic**
display type in huge uppercase, one electric blue accent (`#4a8cff`) used as hand-sprayed graffiti — a
Sedgwick Ave Display script word tilted over every headline with a sprayed scribble under it, crowns,
paint drips running off every button — and real card art scattered across the page at angles, as if
slapped down on a table. Barbed-wire strands cross the page between sections. A screen-blended film
grain sits over everything.

Order, top to bottom:

0. **Preloader — "pile + stamp".** A black curtain. Four of the site's cards slap down onto the table
   one by one as the page loads while a big `000 → 100` counter and a blue bar fill along the bottom;
   at 100 a blue **SEALED** rubber stamp hits the pile and the whole curtain lifts off upward,
   uncovering the hero, whose reveals start as it lifts.
1. **Header** (fixed): HELD-MINT logo, locale, four nav links with a sprayed underline on hover,
   Log In, a "Buy NFT" paint plate; a burger on tablets/phones opens a tilted poster menu.
2. **Hero** (full viewport): the vault-door photo easing back as its lights come on, "RARE CARDS /
   BEHIND *steel*", a lead and a "Request access" plate; a tilted card peeking out of the bottom.
3. **Cards + statement**: two big tilted cards and a long display statement ending in blue "and
   nothing else.", an aside and four tag chips.
4. Barbed wire.
5. **Process**: "FROM THE TABLE / TO THE ~~SHOEBOX~~ *VAULT*" — four tilted step cards.
6. **Vault**: "CURRENTLY *held*" — a five-card fan opening with the scroll, a stats plate, a CTA.
7. **Featured drop**: a light paper poster "DROP I *KR777*" with a big card, wrapped in barbed-wire arcs.
8. **Record**: "EVERYTHING IS / ON THE *record*" — four stat stickers and an audit ledger with stamps
   pressed onto each row.
9. **Questions**: "ASK US / THE HARD *stuff*" — a native one-open-at-a-time accordion.
10. Barbed wire.
11. **Join**: "PUT YOUR CARDS / BEHIND THE *door*" — email field + "Enter the vault".
12. **Footer**: address, three link columns, legal, and a giant outlined HELD-MINT wordmark whose
    letters stand up one by one.

**Springs are the motion model.** Every entrance, hover and parallax is a spring (react-spring
semantics, exact tension/friction below); the only CSS transitions are the 250 ms colour swaps on hover.
Smooth scroll is Lenis.

## Page shell & libraries

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#070a10">
<title>HELD-MINT — Rare cards behind steel</title>
<meta name="description" content="Rare trading cards bought outright, graded, sealed and stored in a Swiss strongroom in Zug — every shelf, seal and signature published on a public ledger.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;1,900&family=Sedgwick+Ave+Display&family=Sora:wght@400&display=swap" rel="stylesheet">
<script type="importmap">
{ "imports": { "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs" } }
</script>
```

**Faces** — exactly four, and only these are drawn:
- **Sora 400** — body copy (the page default, `font-family: var(--font-sans)`).
- **Barlow Condensed 600 upright** — every caps label, nav, chip, stat label, ledger row (`type-caps`).
- **Barlow Condensed 900 italic** — every display headline, button label, logo, number (`type-display`).
- **Sedgwick Ave Display 400** — the hand-written graffiti words, eyebrows and ghost words (`type-script`).

```css
:root { --font-sans: "Sora", sans-serif; --font-display: "Barlow Condensed", sans-serif; --font-script: "Sedgwick Ave Display", cursive; }
.type-display { font-family: var(--font-display); font-weight: 900; font-style: italic; text-transform: uppercase; white-space: nowrap; line-height: 1; }
.type-caps    { font-family: var(--font-display); font-weight: 600; text-transform: uppercase; white-space: nowrap; line-height: 1; }
.type-script  { font-family: var(--font-script);  font-weight: 400; white-space: nowrap; line-height: 1; }
```

**Reset** (Tailwind v4 preflight equivalent): `*, ::before, ::after { box-sizing: border-box; margin: 0;
padding: 0; border: 0 solid; }`, `html { line-height: 1.5; -webkit-text-size-adjust: 100% }`,
`h1,h2,h3,p { font-size: inherit; font-weight: inherit }`, `ol, ul { list-style: none }`,
`a { color: inherit; text-decoration: inherit }`, `img, svg, picture { display: block; max-width: 100% }`
(an `<img>` inside a `<picture>` is still `display:block`), buttons and inputs unstyled
(`background: none; font: inherit; color: inherit`), `button, summary { cursor: pointer }`, and `.sr-only`
(the standard visually-hidden clip). `body { background: var(--background); color: var(--foreground);
font-family: var(--font-sans) }`.

**Page structure.** `<body>` holds one `<main style="position:relative; overflow-x:clip;
background:var(--background)">` with, in order: header · hero · intro · barbed wire 1 · process · vault ·
drop · record · questions · barbed wire 2 · the Join + Footer wrapper · the grain overlay · the preloader
overlay. The poster menu overlay is appended to `<body>` (outside `<main>`).

**Grain overlay** (Figma "Texture — grain (screen)", over the whole page, header included):
`<div aria-hidden style="pointer-events:none; position:absolute; inset:0; z-index:30;
background-image:url(${ASSET_BASE_URL}/shared/texture-grain.webp); background-size:32rem;
opacity:.2; mix-blend-mode:screen">` as the last child of `<main>` before the preloader. (`32rem` = 512
design px; it tiles and scales with the frame.)

**Smooth scroll**: on load call `window.scrollTo(0, 0)`, then `const lenis = new Lenis({ smoothWheel: true })`
driven by its own `requestAnimationFrame(t => { lenis.raf(t); … })` loop. **Stopping scroll** (while the
preloader is up and while the menu is open) means `lenis.stop()` plus
`html.style.position = "relative"; html.style.overflow = "hidden"; html.style.height = "100%"`.
**Starting it** means `lenis.start()` and removing those three properties. Hash links (`#join`,
`#process`, `#vault`) are plain anchors.

## Tokens (copy verbatim into `:root`)

The design is dark-only. Tier 1 holds literals, Tier 2 names roles; every role is re-pointed per
breakpoint (so `--type-display` is 150 px on desktop and 48 px on mobile). Copy both tiers and the three
media blocks as they stand.

```css
:root {
  --raw-color-ink-1000: #05070b;
  --raw-color-ink-975: #07090d;
  --raw-color-ink-950: #070a10;
  --raw-color-ink-900: #080c11;
  --raw-color-ink-850: #0c1119;
  --raw-color-paper-50: #f2f4f8;
  --raw-color-paper-200: #e6e7ea;
  --raw-color-slate-200: #d5dae3;
  --raw-color-slate-250: #c9d0db;
  --raw-color-slate-400: #8f98a8;
  --raw-color-blue-500: #4a8cff;
  --raw-color-blue-600: #2a63f0;
  --raw-color-white: #ffffff;

  --raw-gradient-header-scrim: radial-gradient(110.46% 100% at 50% 0%, rgb(8 12 17 / 1) 0%, rgb(8 12 17 / 0) 100%);
  --raw-gradient-header-shade: linear-gradient(180deg, rgb(7 10 16 / 0.92) 0%, rgb(7 10 16 / 0.55) 50%, rgb(7 10 16 / 0) 100%);
  --raw-gradient-hero-vignette: radial-gradient(52.63% 66.67% at 47.37% 50%, rgb(7 10 16 / 0) 0%, rgb(7 10 16 / 0) 55%, rgb(7 10 16 / 0.72) 100%);
  --raw-gradient-hero-fade: linear-gradient(180deg,
    rgb(7 10 16 / 0) 0%, rgb(7 10 16 / 0.06) 8.8235%, rgb(7 10 16 / 0.24) 17.647%, rgb(7 10 16 / 0.52) 26.471%,
    rgb(7 10 16 / 0.76) 33.824%, rgb(7 10 16 / 0.92) 41.176%, rgb(7 10 16 / 1) 48.529%, rgb(7 10 16 / 1) 65.441%,
    rgb(7 10 16 / 0.88) 73.529%, rgb(7 10 16 / 0.55) 82.353%, rgb(7 10 16 / 0.2) 91.176%, rgb(7 10 16 / 0) 100%);
  --raw-gradient-hero-fade-compact: linear-gradient(180deg, rgb(7 10 16 / 0) 0%, rgb(7 10 16 / 0.88) 60%, rgb(7 10 16 / 1) 100%);
  --raw-gradient-card-fade: linear-gradient(180deg, rgb(7 10 16 / 0.96) 0%, rgb(7 10 16 / 0.8) 25%, rgb(7 10 16 / 0.35) 60%, rgb(7 10 16 / 0) 100%);

  --raw-shadow-card: 0.5rem 0.875rem 1.5rem 0 rgb(0 0 0 / 0.35);
  --raw-drop-shadow-wire: 0.5rem 0.75rem 0.625rem rgb(0 0 0 / 0.4);
  --raw-drop-shadow-wire-compact: 0.375rem 0.625rem 0.625rem rgb(0 0 0 / 0.4);

  /* Type scale — Figma px ÷ 16 */
  --raw-font-size-380: 23.75rem; --raw-font-size-360: 22.5rem; --raw-font-size-337: 21.0625rem;
  --raw-font-size-330: 20.625rem; --raw-font-size-300: 18.75rem; --raw-font-size-280: 17.5rem;
  --raw-font-size-260: 16.25rem; --raw-font-size-248: 15.5rem; --raw-font-size-240: 15rem;
  --raw-font-size-220: 13.75rem; --raw-font-size-200: 12.5rem; --raw-font-size-190: 11.875rem;
  --raw-font-size-186: 11.625rem; --raw-font-size-170: 10.625rem; --raw-font-size-153: 9.5625rem;
  --raw-font-size-150: 9.375rem; --raw-font-size-140: 8.75rem; --raw-font-size-132: 8.25rem;
  --raw-font-size-130: 8.125rem; --raw-font-size-128: 8rem; --raw-font-size-122: 7.625rem;
  --raw-font-size-120: 7.5rem; --raw-font-size-106: 6.625rem; --raw-font-size-101: 6.3125rem;
  --raw-font-size-98: 6.125rem; --raw-font-size-96: 6rem; --raw-font-size-94: 5.875rem;
  --raw-font-size-92: 5.75rem; --raw-font-size-88: 5.5rem; --raw-font-size-82: 5.125rem;
  --raw-font-size-80: 5rem; --raw-font-size-79: 4.9375rem; --raw-font-size-73: 4.5625rem;
  --raw-font-size-72: 4.5rem; --raw-font-size-70: 4.375rem; --raw-font-size-64: 4rem;
  --raw-font-size-59: 3.6875rem; --raw-font-size-58: 3.625rem; --raw-font-size-54: 3.375rem;
  --raw-font-size-53: 3.3125rem; --raw-font-size-49: 3.0625rem; --raw-font-size-48: 3rem;
  --raw-font-size-44: 2.75rem; --raw-font-size-42: 2.625rem; --raw-font-size-40: 2.5rem;
  --raw-font-size-38: 2.375rem; --raw-font-size-36: 2.25rem; --raw-font-size-34: 2.125rem;
  --raw-font-size-32: 2rem; --raw-font-size-30: 1.875rem; --raw-font-size-28: 1.75rem;
  --raw-font-size-26: 1.625rem; --raw-font-size-24: 1.5rem; --raw-font-size-22: 1.375rem;
  --raw-font-size-21: 1.3125rem; --raw-font-size-20: 1.25rem; --raw-font-size-19: 1.1875rem;
  --raw-font-size-18: 1.125rem; --raw-font-size-17: 1.0625rem; --raw-font-size-16: 1rem;
  --raw-font-size-15: 0.9375rem; --raw-font-size-14: 0.875rem;

  --raw-leading-094: 0.94; --raw-leading-096: 0.96; --raw-leading-112: 1.12;
  --raw-leading-130: 1.3; --raw-leading-150: 1.5; --raw-leading-155: 1.55;

  --raw-tracking-003: 0.03em; --raw-tracking-006: 0.06em; --raw-tracking-008: 0.08em;
  --raw-tracking-010: 0.1em; --raw-tracking-012: 0.12em; --raw-tracking-016: 0.16em;

  --raw-radius-6: 0.375rem; --raw-radius-7: 0.4375rem; --raw-radius-10: 0.625rem; --raw-radius-11: 0.6875rem;
  --raw-radius-13: 0.8125rem; --raw-radius-14: 0.875rem; --raw-radius-15: 0.9375rem; --raw-radius-17: 1.0625rem;
  --raw-radius-20: 1.25rem; --raw-radius-21: 1.3125rem; --raw-radius-22: 1.375rem;

  --raw-duration-fast: 150ms;
  --raw-duration-normal: 250ms;
}

:root {
  --background: var(--raw-color-ink-950);
  --foreground: var(--raw-color-paper-50);
  --foreground-muted: var(--raw-color-slate-200);
  --foreground-soft: var(--raw-color-slate-250);
  --foreground-subtle: var(--raw-color-slate-400);
  --surface: var(--raw-color-ink-850);
  --surface-inverse: var(--raw-color-paper-50);
  --surface-poster: var(--raw-color-paper-200);
  --on-inverse: var(--raw-color-ink-1000);
  --on-poster: var(--raw-color-ink-975);
  --accent: var(--raw-color-blue-500);
  --accent-strong: var(--raw-color-blue-600);
  --border-strong: var(--raw-color-white);

  --header-scrim: var(--raw-gradient-header-scrim);
  --header-shade: var(--raw-gradient-header-shade);
  --hero-vignette: var(--raw-gradient-hero-vignette);
  --hero-fade: var(--raw-gradient-hero-fade);
  --hero-fade-compact: var(--raw-gradient-hero-fade-compact);
  --card-fade: var(--raw-gradient-card-fade);

  --elevation-card: var(--raw-shadow-card);
  --elevation-wire: var(--raw-drop-shadow-wire);

  --type-ghost-xl: var(--raw-font-size-380);
  --type-ghost-lg: var(--raw-font-size-360);
  --type-ghost-md: var(--raw-font-size-330);
  --type-ghost-sm: var(--raw-font-size-300);
  --type-wordmark: var(--raw-font-size-337);
  --type-script-xl: var(--raw-font-size-170);
  --type-script-lg: var(--raw-font-size-153);
  --type-script-md: var(--raw-font-size-150);
  --type-script-sm: var(--raw-font-size-128);
  --type-script-xs: var(--raw-font-size-122);
  --type-display: var(--raw-font-size-150);
  --type-display-sm: var(--raw-font-size-120);
  --type-step-number: var(--raw-font-size-120);
  --type-stat-lg: var(--raw-font-size-140);
  --type-stat: var(--raw-font-size-130);
  --type-stat-ring: var(--raw-font-size-150);
  --type-poster-title: var(--raw-font-size-132);
  --type-statement: var(--raw-font-size-58);
  --type-card-title: var(--raw-font-size-42);
  --type-footer-logo: var(--raw-font-size-40);
  --type-eyebrow: var(--raw-font-size-34);
  --type-eyebrow-sm: var(--raw-font-size-30);
  --type-bracket: var(--raw-font-size-30);
  --type-button: var(--raw-font-size-26);
  --type-row-title: var(--raw-font-size-26);
  --type-stamp: var(--raw-font-size-26);
  --type-logo: var(--raw-font-size-26);
  --type-row-date: var(--raw-font-size-22);
  --type-poster-meta: var(--raw-font-size-22);
  --type-footer-link: var(--raw-font-size-22);
  --type-button-sm: var(--raw-font-size-20);
  --type-plate: var(--raw-font-size-20);
  --type-meta: var(--raw-font-size-18);
  --type-nav: var(--raw-font-size-18);
  --type-fine: var(--raw-font-size-17);
  --type-column: var(--raw-font-size-16);
  --type-legal: var(--raw-font-size-15);
  --type-body: var(--raw-font-size-16);
  --type-caption: var(--raw-font-size-15);
  --type-body-sm: var(--raw-font-size-14);
  --type-poster-copy: var(--raw-font-size-14);

  /* Figma snaps every text line to whole design pixels (15px × 1.5 → 23px). */
  --line-copy: round(nearest, calc(var(--raw-leading-150) * 1em + 0.001rem), 0.0625rem);
  --line-statement: round(nearest, calc(var(--raw-leading-094) * 1em + 0.001rem), 0.0625rem);
  --line-row: round(nearest, calc(var(--raw-leading-112) * 1em + 0.001rem), 0.0625rem);
  --line-meta: round(nearest, calc(var(--raw-leading-130) * 1em + 0.001rem), 0.0625rem);
  --line-poster: round(nearest, calc(var(--raw-leading-155) * 1em + 0.001rem), 0.0625rem);

  --letter-row: var(--raw-tracking-003);
  --letter-nav: var(--raw-tracking-006);
  --letter-address: var(--raw-tracking-008);
  --letter-caps: var(--raw-tracking-010);
  --letter-caps-wide: var(--raw-tracking-012);
  --letter-column: var(--raw-tracking-016);

  --corner-plate: var(--raw-radius-10);
  --corner-sticker: var(--raw-radius-14);
  --corner-card: var(--raw-radius-20);
  --corner-art-xs: var(--raw-radius-7);
  --corner-art-sm: var(--raw-radius-13);
  --corner-art-md: var(--raw-radius-15);
  --corner-art-lg: var(--raw-radius-17);
  --corner-art-xl: var(--raw-radius-21);
  --corner-art-2xl: var(--raw-radius-22);
  --corner-art-tilt: var(--raw-radius-14);

  --duration-hover: var(--raw-duration-normal);
  --ease-entrance: cubic-bezier(0.2, 0, 0, 1);
}

@media (width < 1200px) {
  :root {
    --type-ghost-lg: var(--raw-font-size-280); --type-ghost-md: var(--raw-font-size-260); --type-ghost-sm: var(--raw-font-size-240);
    --type-wordmark: var(--raw-font-size-248);
    --type-script-xl: var(--raw-font-size-106); --type-script-lg: var(--raw-font-size-98); --type-script-md: var(--raw-font-size-96);
    --type-script-sm: var(--raw-font-size-96); --type-script-xs: var(--raw-font-size-82);
    --type-display: var(--raw-font-size-96); --type-display-sm: var(--raw-font-size-80);
    --type-step-number: var(--raw-font-size-88);
    --type-stat-lg: var(--raw-font-size-92); --type-stat: var(--raw-font-size-92); --type-stat-ring: var(--raw-font-size-101);
    --type-poster-title: var(--raw-font-size-96);
    --type-statement: var(--raw-font-size-44);
    --type-card-title: var(--raw-font-size-34);
    --type-footer-logo: var(--raw-font-size-36);
    --type-eyebrow: var(--raw-font-size-28); --type-eyebrow-sm: var(--raw-font-size-28);
    --type-button: var(--raw-font-size-24); --type-row-title: var(--raw-font-size-24);
    --type-stamp: var(--raw-font-size-22); --type-row-date: var(--raw-font-size-21);
    --type-poster-meta: var(--raw-font-size-20); --type-footer-link: var(--raw-font-size-20);
    --type-button-sm: var(--raw-font-size-18); --type-nav: var(--raw-font-size-17);
    --type-fine: var(--raw-font-size-18); --type-column: var(--raw-font-size-18); --type-legal: var(--raw-font-size-18);
    --type-body: var(--raw-font-size-15); --type-body-sm: var(--raw-font-size-15);
    --type-poster-copy: var(--raw-font-size-18);
    --line-statement: round(nearest, calc(var(--raw-leading-096) * 1em + 0.001rem), 0.0625rem);
    --line-poster: round(nearest, calc(var(--raw-leading-150) * 1em + 0.001rem), 0.0625rem);
    --elevation-wire: var(--raw-drop-shadow-wire-compact);
  }
}
@media (width < 896px) {
  :root {
    --corner-art-tilt: var(--raw-radius-11);
    --type-ghost-lg: var(--raw-font-size-220); --type-ghost-md: var(--raw-font-size-200); --type-ghost-sm: var(--raw-font-size-190);
    --type-wordmark: var(--raw-font-size-186);
    --type-script-xl: var(--raw-font-size-79); --type-script-lg: var(--raw-font-size-73); --type-script-md: var(--raw-font-size-72);
    --type-script-sm: var(--raw-font-size-72); --type-script-xs: var(--raw-font-size-73);
    --type-display: var(--raw-font-size-72); --type-display-sm: var(--raw-font-size-72);
    --type-step-number: var(--raw-font-size-80);
    --type-stat-lg: var(--raw-font-size-64); --type-stat: var(--raw-font-size-64); --type-stat-ring: var(--raw-font-size-70);
    --type-poster-title: var(--raw-font-size-72);
    --type-statement: var(--raw-font-size-38);
    --type-card-title: var(--raw-font-size-32);
    --type-eyebrow: var(--raw-font-size-26); --type-eyebrow-sm: var(--raw-font-size-26);
    --type-button: var(--raw-font-size-22); --type-row-title: var(--raw-font-size-22);
    --type-row-date: var(--raw-font-size-20); --type-poster-meta: var(--raw-font-size-19);
    --type-plate: var(--raw-font-size-19); --type-meta: var(--raw-font-size-17);
    --type-fine: var(--raw-font-size-17); --type-column: var(--raw-font-size-17); --type-legal: var(--raw-font-size-17);
    --type-poster-copy: var(--raw-font-size-16);
  }
}
@media (width < 700px) {
  :root {
    --corner-art-tilt: var(--raw-radius-6);
    --type-wordmark: var(--raw-font-size-94);
    --type-script-xl: var(--raw-font-size-53); --type-script-lg: var(--raw-font-size-49); --type-script-md: var(--raw-font-size-48);
    --type-script-sm: var(--raw-font-size-48); --type-script-xs: var(--raw-font-size-49);
    --type-display: var(--raw-font-size-48); --type-display-sm: var(--raw-font-size-48);
    --type-step-number: var(--raw-font-size-72);
    --type-stat-lg: var(--raw-font-size-54); --type-stat: var(--raw-font-size-54); --type-stat-ring: var(--raw-font-size-59);
    --type-poster-title: var(--raw-font-size-48);
    --type-statement: var(--raw-font-size-30);
    --type-card-title: var(--raw-font-size-30);
    --type-footer-logo: var(--raw-font-size-32);
    --type-eyebrow: var(--raw-font-size-22); --type-eyebrow-sm: var(--raw-font-size-22);
    --type-button: var(--raw-font-size-20); --type-row-title: var(--raw-font-size-20);
    --type-stamp: var(--raw-font-size-20); --type-row-date: var(--raw-font-size-18);
    --type-poster-meta: var(--raw-font-size-17); --type-footer-link: var(--raw-font-size-18);
    --type-plate: var(--raw-font-size-17); --type-meta: var(--raw-font-size-15);
    --type-fine: var(--raw-font-size-15); --type-column: var(--raw-font-size-15); --type-legal: var(--raw-font-size-15);
    --type-poster-copy: var(--raw-font-size-15);
  }
}
```

Alpha colours used below, written out: `foreground/75` = `rgb(242 244 248 / .75)` (and so on for /5,
/3, /10, /14, /15, /16, /18, /20, /22, /28); `background/80` = `rgb(7 10 16 / .8)`, `background/40` =
`rgb(7 10 16 / .4)`; `on-inverse/60…/88` = `rgb(5 7 11 / …)`; `on-poster/85` = `rgb(7 9 13 / .85)`.
`drop-shadow-wire` = `filter: drop-shadow(var(--elevation-wire))`; `shadow-card` =
`box-shadow: var(--elevation-card)`. Rounded utilities: `md` 6 px, `lg` 8 px, `xl` 12 px, `2xl` 16 px.

### The four frames, the breakpoints and the rem grid

The page is drawn as four Figma frames and each viewport range renders **its own frame, scaled**:

| range | name | frame | viewport |
|---|---|---|---|
| desktop | `≥ 1200` | 1400 (Figma "Concept 16 — 1440") | `@media (width >= 1200px)` |
| laptop | `896 – 1199` | 1024 | `@media (896px <= width < 1200px)` |
| tablet | `700 – 895` | 768 | `@media (700px <= width < 896px)` |
| mobile | `< 700` | 390 | `@media (width < 700px)` |

Group names used below: **compact** = `< 1200` (laptop + tablet + mobile), **handheld** = `< 896`
(tablet + mobile). The four ranges never overlap.

**Every length in this document is in design px of the range's own frame. Write each one in CSS as
`rem = px / 16`.** The root font-size tracks the viewport so each frame renders 1:1 at its reference
width:

```css
html { font-size: 1.142857vw; }                                         /* 16 · 100 / 1400 — keeps growing above 1400 */
@media (width < 1200px) { html { font-size: 1.5625vw; } }               /* / 1024 */
@media (width < 896px)  { html { font-size: 2.083333vw; } }             /* / 768 */
@media (width < 700px)  { html { font-size: min(4.102564vw, 19.2px); } } /* / 390, capped at 1.2× */
```

Mobile stops growing at a 468 px viewport (19.2 px rem); the mobile content column is
`max-width: 24.375rem` (390 design px) with `margin-inline: auto`, so wider phones get the 390 column
centred. Every compact section below carries that on mobile ("mobile column"). The hero is `100svh`
tall on every range. Where a value is in `vw` (the barbed wire on mobile) it is literal `vw`.

**Desktop layout model.** The 1400 frame is laid out as absolute layers: each desktop section is a
`position: relative` box of a fixed height and every element in it sits at `top/left` design px within
it (the coordinates below), exactly as in Figma. **Compact layout model.** The 1024 / 768 / 390 frames
are auto-layout: flex columns with paddings and gaps, given per section.

### Two layout helpers used everywhere

**`Rotated`** — how Figma exports a rotated layer: a **bounding box** (positioned and sized per range)
that is `display:flex; align-items:center; justify-content:center`, holding the un-rotated content as a
`display:block; flex:none` child that carries the `rotate`. Every "box … rotate …" below is this
structure. With **parallax** (see Motion) the box is the static measured layer and an inner
`display:flex; width/height:100%; align-items:center; justify-content:center; will-change:transform`
layer between box and content takes the parallax transform. Default parallax tilt is
`0.3° per rem` of travel unless a tilt is given.

**`Vector`** — a decorative SVG/PNG layer: `<span aria-hidden style="position:relative; display:block;
width; height">` (the layer box) holding `<span style="position:absolute; inset:…">` (the art inset —
Figma bleeds strokes past the layer, so insets are negative percentages, `top/bottom` first then
`left/right`, default `0`) holding a `<picture>` with per-range art:

```html
<picture>
  <source media="(width < 700px)"  srcset="…-mobile.svg">  <!-- only if a mobile file exists -->
  <source media="(width < 896px)"  srcset="…-tablet.svg">  <!-- only if a tablet file exists -->
  <source media="(width < 1200px)" srcset="…-laptop.svg">  <!-- only if a laptop/compact file exists -->
  <img src="….svg" alt="" style="display:block; width:100%; height:100%">
</picture>
```

Sources fall through: a layer that only has a "laptop/compact" file uses it on every compact range.
These vector `<img>`s are eager (no `loading` attribute). Every raster card/wire/arc image other than
the hero photo and the preloader cards is `loading="lazy"` and covers its box (`position:absolute;
inset:0; width:100%; height:100%`, `object-fit` as stated).

**`CardImage`** — a collectible card: a reveal wrapper `<div style="width:fit-content">` (motion kind
**card**, see Motion) around the card box `<div style="position:relative; overflow:hidden; width;
height; border-radius">`. The image inside is `object-fit: cover`. With a **crop**, the image instead sits
in an absolutely positioned crop box (`top/left/height/width` in %, given per card) at `object-fit: cover`.

## Motion engine you write

### Springs (react-spring 10 semantics)

Integrate exactly like react-spring: 1 ms sub-steps, `springForce = −tension × 0.000001 × (pos − to)`,
`dampingForce = −friction × 0.001 × vel`, `vel += (springForce + dampingForce) / mass`, `pos += vel`
(mass 1); at rest when `|vel| ≤ restVelocity` and `|to − pos| ≤ precision`
(`precision = min(1, |to − from| × 0.001)`, `restVelocity = precision / 10`). Retargeting keeps the
velocity. A `delay` (ms) holds the spring at its current value before it starts toward the target.
A style map with string values (`"translateY(18%) scale(1.18)"`, `"blur(6px)"`, a gradient) animates as
**one progress spring `p: 0 → 1`** and lerps every number in the strings by `p` (react-spring's
`AnimatedString`); numeric keys (`opacity`) use the same config and start together, so one `p` per element
drives the whole map. Overshoot extrapolates past the target (scale under 1, rotation past 0) — that is
the "slap". A **keyframe chain** (`to: [step1, step2, step3]`, each step with its own config) plays its
steps in sequence, each from where the last one rested. `immediate` jumps to the value.
**Reduced motion** (`prefers-reduced-motion: reduce`, watched live) makes every spring immediate.

```js
// ticker.add(fn): fn(now) runs every frame until it returns false (see "One shared ticker").
function spring({ from = 0, to = 1, tension = 170, friction = 26, delay = 0, onUpdate, onRest }) {
  let pos = from, vel = 0, target = to, startAt = performance.now() + delay, last = null, done = false, running = false;
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const run = () => { if (!running) { running = true; ticker.add((now) => (running = step(now))); } };
  const s = {
    get value() { return pos; },
    set(v, { delay: d = 0, immediate = false, config } = {}) {
      if (config) ({ tension, friction } = config);
      target = v; from = pos; startAt = performance.now() + d; done = false; last = null;   // velocity is kept
      if (immediate || reduce()) { pos = v; vel = 0; onUpdate?.(pos); done = true; onRest?.(); }
      else run();
    },
  };
  function step(now) {
    if (done) return false;
    if (now < startAt) return true;
    const dt = Math.min(64, last == null ? 16 : now - last); last = now;
    const precision = Math.min(1, Math.abs(target - from) * 0.001) || 0.001, restV = precision / 10;
    for (let i = 0; i < Math.ceil(dt); i++) {
      const f = -tension * 0.000001 * (pos - target) - friction * 0.001 * vel;
      vel += f; pos += vel;
    }
    if (Math.abs(vel) <= restV && Math.abs(target - pos) <= precision) { pos = target; vel = 0; done = true; }
    onUpdate?.(pos);
    if (done) onRest?.();
    return !done;
  }
  if (reduce()) { pos = to; onUpdate?.(pos); } else run();
  return s;
}
```

### One shared ticker

A single app-wide `requestAnimationFrame` loop. Every per-frame job (springs, parallax measurement,
the preloader's progress poll) subscribes to it; each subscriber has its own minimum gap in ms (the
parallax/scroll trigger polls at **10 ms**). The loop is reference-counted: it stops when the last
subscriber leaves. A subscriber that throws is isolated (logged) and never kills the loop. Lenis runs
on its own rAF.

### Gated reveals — "seen"

Nothing reveals until the preloader **releases** (350 ms after the stamp lands, as the curtain starts
to lift — see the loader). From then on, each reveal element is watched by two IntersectionObservers:

- `deep` with `rootMargin: "0px 0px -15% 0px"` — intersecting ⇒ **seen** (the viewer has actually
  reached it: its top is 15 % above the viewport bottom).
- `any` with no margin — while it is on screen, if the page is scrolled to the bottom
  (`scrollY + innerHeight >= scrollHeight − 4`, re-checked on scroll) ⇒ **seen** (for elements at the very
  end that can't climb that high).

A reveal plays its **in** spring (with its delay) once seen **and** intersecting, plays once, and stays.
A `repeat` reveal (the FAQ answers) resets to its *from* state **immediately** when it leaves the
viewport (or is hidden) and replays on the next entry. A tagless reveal (the scribbles, which start at
zero visible extent) is observed through an unscaled `display:block` wrapper span.

**Replay on range change.** Crossing into another of the four ranges (resizing, rotating a tablet)
resets every reveal to its *from* state and plays them again for the new layout — those on screen at
once, the rest as they scroll in.

### The motion set — one spec per element kind (verbatim)

```js
const PUNCH = { tension: 420, friction: 22 };
const SOFT  = { tension: 120, friction: 26 };
const HEAVY = { tension: 60,  friction: 30 };
const DRIP  = { tension: 140, friction: 13 };

// Spray-can reveal: a soft-edged mask sweeps left→right while the paint settles from a blur.
const sprayMask = (edge) => `linear-gradient(90deg, rgba(0, 0, 0, 1) ${edge}%, rgba(0, 0, 0, 0) ${edge + 22}%)`;
const SPRAY_FROM = { filter: "blur(6px)", maskImage: sprayMask(-22) };
const SPRAY_TO   = { filter: "blur(0px)", maskImage: sprayMask(100) };

// A real rubber stamp: lifted and tilted above the page, it drops, squashes on impact (ink "blooms"
// from a blur), then settles. Played as a keyframe chain.
const STAMP_FROM = { opacity: 0, transform: "translateY(-55%) scale(2.1) rotate(-14deg)", filter: "blur(3px)" };
const STAMP_TO = [
  { opacity: 0.6, transform: "translateY(-30%) scale(1.6) rotate(-9deg)", filter: "blur(2px)", config: { tension: 260, friction: 26 } },
  { opacity: 1,   transform: "translateY(0%) scale(0.9) rotate(1deg)",   filter: "blur(0px)", config: { tension: 900, friction: 30 } },
  { opacity: 1,   transform: "translateY(0%) scale(1) rotate(0deg)",     filter: "blur(0px)", config: { tension: 400, friction: 18 } },
];

const MOTION = {
  // Headlines: each line punches in with a scale overshoot, like a poster stamp.
  headline: { type: "inview", from: { opacity: 0, transform: "translateY(18%) scale(1.18)" }, to: { opacity: 1, transform: "translateY(0%) scale(1)" }, config: PUNCH, stagger: 110 },
  // Graffiti words, then their underlines: sprayed on.
  mark:     { type: "inview", from: SPRAY_FROM, to: SPRAY_TO, config: { tension: 55, friction: 20 }, delay: 300 },
  scribble: { type: "inview", from: SPRAY_FROM, to: SPRAY_TO, config: { tension: 70, friction: 20 }, delay: 700 },
  // Paragraphs: lines slide up from under a mask, one after another.
  copy:     { type: "text", layer: "line", out: { transform: "translateY(100%)" }, in: { transform: "translateY(0%)" }, config: { tension: 170, friction: 26 }, stagger: 70, overflow: true },
  // Buttons drop in; their drips run down with an overshoot.
  button:   { type: "inview", from: { opacity: 0, transform: "translateY(-30%)" }, to: { opacity: 1, transform: "translateY(0%)" }, config: SOFT },
  drip:     { type: "inview", from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" }, config: DRIP, delay: 350, stagger: 70, style: { transformOrigin: "50% 0%" } },
  // Hero vault photo: the lights come on as it eases back.
  photo:    { type: "inview", from: { transform: "scale(1.16)", filter: "brightness(0.25)" }, to: { transform: "scale(1)", filter: "brightness(1)" }, config: HEAVY },
  // Every card: slapped down onto the table.
  card:     { type: "inview", from: { opacity: 0, transform: "scale(1.35) rotate(-8deg)" }, to: { opacity: 1, transform: "scale(1) rotate(0deg)" }, config: PUNCH, stagger: 90 },
  chip:     { type: "inview", from: { opacity: 0, transform: "scale(1.4)" }, to: { opacity: 1, transform: "scale(1)" }, config: PUNCH, stagger: 70 },
  step:     { type: "inview", from: { opacity: 0, transform: "scale(1.12)" }, to: { opacity: 1, transform: "scale(1)" }, config: PUNCH, stagger: 100 },
  sticker:  { type: "inview", from: { opacity: 0, transform: "scale(1.5) rotate(-12deg)" }, to: { opacity: 1, transform: "scale(1) rotate(0deg)" }, config: { tension: 420, friction: 18 }, stagger: 120 },
  // Ledger rows fade in; each stamp is pressed like a real one.
  ledger:   { type: "inview", from: { opacity: 0 }, to: { opacity: 1 }, config: SOFT, stagger: 70 },
  stamp:    { type: "inview", from: STAMP_FROM, to: STAMP_TO, config: SOFT, delay: 200, stagger: 160 },
  // FAQ answers drop open each time.
  faq:      { type: "inview", from: { opacity: 0, transform: "translateY(-30%)" }, to: { opacity: 1, transform: "translateY(0%)" }, config: SOFT, repeat: true },
  // Footer HELD-MINT outline: letters stand up one by one.
  wordmark: { type: "text", layer: "letter", out: { y: 80, opacity: 0 }, in: { y: 0, opacity: 1 }, config: { tension: 200, friction: 22 }, stagger: 45 },
};
```

An **inview** element starts at its `from` styles (set inline before first paint), and plays to `to`
with `delay = (spec.delay ?? 0) + index × (spec.stagger ?? 0)`, where `index` is its position in its
group (given per element below; 0 when not given). `maskImage` is the CSS `mask-image` (set
`-webkit-mask-image` too). The `transform` of a reveal composes with any positioning `translate` /
`rotate` the element already has — keep positioning in the individual `translate`/`rotate`/`scale` CSS
properties and the reveal in `transform`.

A **text** element is split by you, in place:
- **line** layer (`copy`): split into words (keep inline children such as the accent `<span>` as
  their own styled words), lay them out as a `display:flex; flex-wrap:wrap; white-space:pre-wrap`
  row whose `column-gap` equals the **measured width of a space** in that element's font (measure
  `"x x"` minus `"xx"` in a hidden probe, divide by the font-size, use `em`), so lines break as in the
  design. Group the words by line (same `offsetTop`), wrap each line in a clip span
  (`display:inline-block; overflow:hidden; padding-block:.12em; margin-block:-.12em`) and translate the
  inner line `translateY(100%) → translateY(0%)` with `{170, 26}`, line `i` delayed
  `index × 120 + i × 70` ms. A `text-align:center` element gets `justify-content:center` on its rows.
  Re-split on resize.
- **letter** layer (`wordmark`): each letter its own `display:inline-block` span starting at
  `translateY(80px)` and `opacity 0`, springing to `0 / 1` with `{200, 22}`, letter `i` delayed `i × 45` ms.
  No clipping.
Keep a visually hidden copy of the full string for screen readers (`aria-hidden` on the split copy).

### Scroll parallax

A parallax layer is the `Rotated` box (static, measured) plus its inner moving layer. Every 10 ms while
the box is on screen (and for 10 more ticks after it leaves) measure the box and compute

```js
const r = box.getBoundingClientRect(), vh = window.innerHeight;
const progress = Math.min(Math.max(0, (vh - r.top) / (vh + r.height)), 1); // "top bottom" → "bottom top"
const offset = reducedMotion ? 0 : progress - 0.5;   // centred: mid-viewport = the designed place
ySpring.set(offset * distance);   // rem
rSpring.set(offset * tilt);       // deg
// inner.style.transform = `translate3d(0, ${y}rem, 0) rotate(${r}deg)`
```

with both springs at `{ tension: 280, friction: 40 }`. Positive `distance` drifts down as the page scrolls
(reads as further away); negative drifts up (closer, faster). Reduced motion snaps both to 0. The layers,
with `distance` (rem) and `tilt` (°):

| layer | distance | tilt |
|---|---|---|
| hero vault photo | 24 | 0 |
| hero desktop left card | −14 | −4.2 |
| hero compact card | −8 | −2.4 |
| intro tucked card | 6 | 1.8 |
| intro front card | −12 | −3.6 |
| barbed wire 1 | 10 | 3 |
| barbed wire 2 | −8 | −2.4 |
| vault fan: far left / far right / left / right / centre | 10 / 7 / −4 / −7 / −12 | −3 / 3 / −2.5 / 2.5 / 1 |
| drop card | −10 | −3 |
| drop wire arcs 1 / 2 / 3 / 4 | 8 / −6 / 12 / −9 | 2.4 / −1.8 / 3.6 / −2.7 |
| join card | −10 | −3 |

### Hover — colour swaps

Hover/focus colour changes are CSS transitions: `transition: background-color, color, filter
var(--duration-hover) var(--ease-entrance)` (250 ms, `cubic-bezier(0.2, 0, 0, 1)`).

## Shared components

### Eyebrow (crown + hand-written label)

`<div class="eyebrow">`: compact `display:flex; align-items:center; gap:12`; desktop
`display:contents` and both children become absolute tilted layers at the section's coordinates
(`crownBox`, `labelBox`, given per section).
- **Crown**: `Rotated` box (compact `position:relative; flex-shrink:0`), rotate desktop `8deg`
  (compact upright), holding a `Vector` of `shared/crown-label.svg` (laptop `shared/crown-label-laptop.svg`,
  tablet `shared/crown-label-tablet.svg`, mobile `shared/crown-label-mobile.svg`), size desktop 31 × 38
  (h × w), laptop `1.73125rem × 2.15625rem`, tablet `1.6375rem × 2.0375rem`, mobile `1.45rem × 1.8rem`;
  inset desktop/laptop/tablet `-4.05% -3.26%` (laptop/tablet `-4.06% -3.26%`), mobile `-4.31% -3.47%`.
- **Label**: `Rotated` box (compact `position:relative`), rotate desktop `-3deg`, holding
  `<p class="type-script" style="font-size:var(--type-eyebrow); color:var(--accent)">` — lowercase copy.

### Headline marks and scribbles

Every section headline is `type-display` (900 italic uppercase, line-height 1) in `--foreground`, one
line per span. The graffiti **mark** is a `type-script` span in `--accent` (the drop poster uses
`--accent-strong`), `text-transform:none; font-style:normal`, inside a `Rotated` box at `-4deg`
(process: `-5deg`); on compact the mark also gets `translate: 0 -0.04em`. Under it a **scribble**:
a `Rotated` box at `-3deg` holding a `Vector` 5 px tall (`h-1.25`) at the given width with per-range SVGs.
On compact the mark + scribble live in a fixed-size `position:relative; flex-shrink:0` **holder** that
flows inline after the second headline line; the mark and scribble boxes are absolute inside it.

Compact headline structure (all sections): `<h2 class="type-display" style="display:flex;
flex-direction:column; width:100%; font-size:var(--type-display)">` → line 1 `<span style="display:block">`
with a negative bottom margin (laptop −13, tablet −10, mobile −7) → a row `<span style="display:flex;
flex-wrap:wrap; align-items:center; column-gap: laptop 17 / tablet 13 / mobile 9">` holding line 2 and the
holder. Desktop: `display:block`, every span absolute at its coordinates.

Motion: line 1 = **headline** index 0, line 2 = **headline** index 1, the mark = **mark**, the scribble
= **scribble** (through a `display:block` wrapper span).

### GhostWord

A huge 5 %-opacity script word behind a heading: an absolute, `pointer-events:none` `Rotated` box holding
`<span aria-hidden class="type-script" style="color:rgb(242 244 248 / .05); font-size:…">`. Static.

### Brackets

`[` and `]` are `<span aria-hidden class="type-caps" style="font-size:var(--type-bracket);
color:var(--accent)">` around a short paragraph. Compact: a `display:flex; align-items:flex-start;
gap:10` row `[ · p(flex:1) · ]`, the closing `]` is `display:flex; width:10; align-self:stretch;
align-items:flex-end` (bottom-aligned). Desktop: all three absolute.

### PlateButton — the "RS Button" (paint plate + drips)

An `<a class="plate">` (`position:relative; display:block; width:fit-content`), motion **button**. Inside:
1. **Offset** `<span aria-hidden>`: `position:absolute; background:var(--accent)`, same width as the plate,
   at a small down-right offset.
2. **Drips**: seven `<span aria-hidden>` `position:absolute; background:var(--accent);
   border-radius: 0 0 9999px 9999px`, hanging from just above the plate's bottom edge, each motion
   **drip** with its own index 0…6 (`delay 350 + i × 70`, `scaleY 0 → 1` from the top).
3. **Plate** `<span class="type-display">`: `position:relative; display:flex; align-items:center;
   justify-content:space-between; background:var(--surface-inverse); color:var(--on-inverse)`, the label
   then an arrow `Vector` (`shared/icon-arrow.svg`, compact `shared/icon-arrow-compact.svg`; 16 tall,
   desktop 26 wide, compact 24; inset desktop `-9.38% -5.77%`, compact `-9.38% -6.25%`).

**Hover / keyboard focus inverts it** (the 250 ms swap): plate → `background:var(--accent);
color:var(--foreground)`; offset and drips → `var(--surface-inverse)`; the ink arrow →
`filter: invert(1)`.

Sizes (h = height):

| | root h / padding-right | plate h · padding · font | offset top/left · h | drip top |
|---|---|---|---|---|
| `md` desktop | 65 / 7 | 58 · `0 26` · `--type-button` | 7/7 · 58 | 63 |
| `md` laptop | 62 / 6 | 56 · `0 22` | 6/6 · 56 | 60 |
| `md` handheld | 58 / 6 | 52 · `0 22` | 6/6 · 52 | 56 |
| `sm` desktop | 49 / 5 | 44 · `0 16 0 18` · `--type-button-sm` | 5/5 · 44 | 47 |
| `sm` compact | 46 / 6 | 40 · `0 22` | 6/6 · 40 | 44 |

Desktop drips have per-button `left · height · width`; every compact range draws the same seven sizes
(h × w): `18×6, 10×4, 30×7, 13×4, 22×6, 8×4, 16×7`, only their `left`s move. Each button's plate widths
and drip lists are given where it appears.

### SprayLink — the sprayed underline on hover

A `<span style="position:relative; display:block">` holding the link and an inline SVG underline
(`viewBox="0 0 75.2 21.1" preserveAspectRatio="none" overflow="visible" fill="currentColor"`,
`position:absolute; pointer-events:none; color:var(--accent)`, positioned per use). At rest it is
`opacity:0`. Its paths, verbatim (Figma "header-spray-underline", 75.2 × 21.1):

```js
const LINE = "M8.6 8.1C17.4 4.6 38.1 2.9 67.6 4.1C69.6 4.3 69.6 8.5 67.6 8.9C44 7.7 23.4 10.3 11.6 12.7C9 13.1 7.2 9.3 8.6 8.1Z";
const DRIPS = [
  "M23.4 8.6C23.4 7.77157 22.7284 7.1 21.9 7.1C21.0716 7.1 20.4 7.77157 20.4 8.6V14.6C20.4 15.4284 21.0716 16.1 21.9 16.1C22.7284 16.1 23.4 15.4284 23.4 14.6V8.6Z",
  "M43.7 8.4C43.7 7.68203 43.118 7.1 42.4 7.1C41.682 7.1 41.1 7.68203 41.1 8.4V19.8C41.1 20.518 41.682 21.1 42.4 21.1C43.118 21.1 43.7 20.518 43.7 19.8V8.4Z",
  "M59.2 8.2C59.2 7.59249 58.7075 7.1 58.1 7.1C57.4925 7.1 57 7.59249 57 8.2V13C57 13.6075 57.4925 14.1 58.1 14.1C58.7075 14.1 59.2 13.6075 59.2 13V8.2Z",
];
const DOTS = [
  "M3.6 7.1C4.15229 7.1 4.6 6.65228 4.6 6.1C4.6 5.54772 4.15229 5.1 3.6 5.1C3.04772 5.1 2.6 5.54772 2.6 6.1C2.6 6.65228 3.04772 7.1 3.6 7.1Z",
  "M5.1 14.3C5.4866 14.3 5.8 13.9866 5.8 13.6C5.8 13.2134 5.4866 12.9 5.1 12.9C4.7134 12.9 4.4 13.2134 4.4 13.6C4.4 13.9866 4.7134 14.3 5.1 14.3Z",
  "M0.6 10.7C0.931371 10.7 1.2 10.4314 1.2 10.1C1.2 9.76863 0.931371 9.5 0.6 9.5C0.26863 9.5 0 9.76863 0 10.1C0 10.4314 0.26863 10.7 0.6 10.7Z",
  "M71.6 3.5C72.0971 3.5 72.5 3.09706 72.5 2.6C72.5 2.10294 72.0971 1.7 71.6 1.7C71.1029 1.7 70.7 2.10294 70.7 2.6C70.7 3.09706 71.1029 3.5 71.6 3.5Z",
  "M74.6 8.2C74.9314 8.2 75.2 7.93137 75.2 7.6C75.2 7.26863 74.9314 7 74.6 7C74.2686 7 74 7.26863 74 7.6C74 7.93137 74.2686 8.2 74.6 8.2Z",
  "M63.6 13.3C63.9866 13.3 64.3 12.9866 64.3 12.6C64.3 12.2134 63.9866 11.9 63.6 11.9C63.2134 11.9 62.9 12.2134 62.9 12.6C62.9 12.9866 63.2134 13.3 63.6 13.3Z",
  "M33.4 14.7C33.7314 14.7 34 14.4314 34 14.1C34 13.7686 33.7314 13.5 33.4 13.5C33.0686 13.5 32.8 13.7686 32.8 14.1C32.8 14.4314 33.0686 14.7 33.4 14.7Z",
  "M49.9 1.2C50.2314 1.2 50.5 0.931371 50.5 0.6C50.5 0.268629 50.2314 0 49.9 0C49.5686 0 49.3 0.268629 49.3 0.6C49.3 0.931371 49.5686 1.2 49.9 1.2Z",
  "M15.7 2.3C16.0866 2.3 16.4 1.9866 16.4 1.6C16.4 1.2134 16.0866 0.9 15.7 0.9C15.3134 0.9 15 1.2134 15 1.6C15 1.9866 15.3134 2.3 15.7 2.3Z",
];
```

Pointer enter on the wrapper (or focus on the link) sprays it on; leave/blur takes it off:
- layer `opacity` → 1 at once (on) / springs → 0 with `{260, 30}` (off);
- the line's `clip-path` `inset(0% 100% 0% 0%) → inset(0% 0% 0% 0%)` with `{300, 32}` — a left-to-right
  stroke;
- each drip path `transform: scaleY(0) → scaleY(1)` (`transform-box: fill-box; transform-origin: 50% 0%`),
  delay `160 + i × 70`, `{110, 9}` — paint running down with an overshoot;
- each dot `scale(0) → scale(1)` (`transform-box: fill-box; transform-origin: 50% 50%`), delay
  `(i × 37) % 180` (= 0, 37, 74, 111, 148, 5, 42, 79, 116 ms), `{420, 16}` — overspray popping.
- **Off**: the line, drips and dots snap back to their unsprayed state immediately (no spring), so the
  underline vanishes at once.

The link text itself swaps to `--accent` on hover with the 250 ms transition.

## The loader / reveal — "Pile + stamp" (the hero moment)

A black curtain over everything from the very first paint. Four cards from the site slap down onto the
table one by one as the page loads — overlay card, tucked card, the drop card, the front card — while a
huge zero-padded counter climbs `000 → 100` and a blue bar fills beside it. At 100 a blue **SEALED**
stamp slams onto the middle of the pile; 350 ms later the whole curtain lifts off upward and the page's
own reveals start under it (the vault photo's lights come on, the headline punches in).

**Markup** (first thing in the page; present in the served HTML, never injected late):

```html
<div data-preloader role="status" aria-label="Loading" class="preloader">
  <style>html{overflow:hidden}</style>   <!-- the scroll lock leaves with the curtain -->
  <noscript><style>[data-preloader]{display:none!important}html{overflow:auto!important}</style></noscript>
  <div aria-hidden class="preloader-grain"></div>
  <p class="type-script preloader-caption">card custody · zug</p>
  <div class="preloader-stage"><div class="preloader-box">
    <!-- four card slots, then the stamp -->
    <span class="type-display preloader-stamp">Sealed</span>
  </div></div>
  <div class="preloader-count"><p class="type-display">000</p><div class="bar"><div class="fill"></div></div></div>
</div>
```

**Curtain**: `position:fixed; inset:0; z-index:70; display:flex; flex-direction:column; overflow:hidden;
background:var(--background); --edge: max(4.5svh, 18px); padding: var(--edge) 5vw;
transform: translateY(calc(-1 × v × 105%))` (the lift, below). Grain: the page's grain layer exactly
(`position:absolute; inset:0; pointer-events:none; background:url(shared/texture-grain.webp) 0 0/32rem;
opacity:.2; mix-blend-mode:screen`).

**Caption**: `position:relative; flex-shrink:0; align-self:center; font-size:clamp(18px, 3.4vmin, 2.25rem);
white-space:nowrap; color:var(--accent)` — "card custody · zug". It sits as far from the top as the
bar sits from the bottom (`--edge`).

**Stage**: `position:relative; margin-top:2svh; margin-bottom:2.5svh` (landscape `3svh`);
`display:flex; flex:1; min-height:0; align-items:center; justify-content:center; container-type:size`.
The **composition box** inside is fitted into it with container units:

| layout | media | aspect | width |
|---|---|---|---|
| wide | default (landscape) | `1550 / 870` | `min(100cqw, 178cqh)` |
| portrait | `(orientation: portrait)` | `1000 / 1300` | `min(100cqw, 77cqh)` |
| tall | `(max-aspect-ratio: 5/8)` — wins over portrait | `1000 / 1900` | `min(100cqw, 52.6cqh)` |

A wide spread on landscape screens, a 2×2 pile on portrait tablets, a zig-zag column on tall phones —
the box always fills the screen's height. Track which layout is showing with the same two
`matchMedia` queries (tall first, then portrait, else wide) and re-target the cards on change.

**Cards** (back → front = their landing order). Each is a wrapper `position:absolute;
translate:-50% -50%` at `left/top/width` in % of the box, holding the animated card `position:relative;
aspect-ratio:3/4; width:100%; filter:drop-shadow(var(--elevation-wire))`, holding the image
(`object-fit:contain`, `loading="eager" fetchpriority="low"`, `alt=""`):

| # | image | lands at | wide: left / top / w · tilt | portrait | tall |
|---|---|---|---|---|---|
| 1 | `intro/intro-card-tucked-overlay.png` | 0.05 | 19.7 / 40.8 / 28.2 · −20° | 30 / 27 / 47 · −12° | 36 / 22 / 62 · −10° |
| 2 | `intro/intro-card-tucked.png` | 0.30 | 58.7 / 43.7 / 24.6 · 2° | 71 / 26 / 41 · 6° | 68 / 40 / 52 · 7° |
| 3 | `drop/drop-card.png` | 0.55 | 40.2 / 68.6 / 19.2 · 4° | 31 / 71 / 37 · 4° | 32 / 60 / 46 · −4° |
| 4 | `intro/intro-card-front.png` | 0.78 | 77.1 / 53.4 / 32.8 · 20° | 67 / 68 / 51 · 12° | 64 / 77 / 64 · 10° |

Card 1's art has white corners baked in, so its image sits in an `overflow:hidden;
border-radius:4.8% / 3.6%` clip. Each card is a spring with **`SLAP = { tension: 420, friction: 20 }`**:
not landed (`target < at`) → `opacity:0; transform: scale(1.6) rotate(${tilt − 10}deg)`; landed →
`opacity:1; transform: scale(1) rotate(${tilt}deg)` — an overshooting scale, quick settle.

**Stamp**: `position:absolute; top:50%; left:50%; translate:-50% -50%; border-radius:.12em;
border:.09em solid var(--accent); background:rgb(7 10 16 / .4); padding:.06em .28em;
white-space:nowrap; color:var(--accent)`, `type-display` (so it reads **SEALED**), font-size
`calc(min(100cqw, 178cqh) * 0.09)` (portrait `calc(min(100cqw, 77cqh) * 0.15)`, tall
`calc(min(100cqw, 52.6cqh) * 0.2)`). Spring `{ tension: 520, friction: 22 }`: hidden
`opacity:0; transform: scale(2.6) rotate(-24deg)` → done `opacity:1; transform: scale(1) rotate(-8deg)`.

**Counter + bar**: `position:relative; display:flex; flex-shrink:0; align-items:flex-end; gap:3vw`;
in landscape it overlays the stage's lower-left corner: `position:absolute; left:5vw; right:5vw;
bottom:var(--edge)` (portrait keeps it in flow below the pile). The counter
`<p class="type-display" style="font-size:clamp(44px, 13vmin, 8rem); line-height:.8;
color:var(--foreground)">` shows `String(Math.round(p * 100)).padStart(3, "0")`. The bar
`flex:1; height:.6vmin; min-height:0.25rem; background:rgb(242 244 248 / .15)` holds a fill
`height:100%; transform-origin:left; background:var(--accent); transform:scaleX(p)`.

**Progress** — real image loading blended with a minimum run time, so even a cached page shows the whole
animation:

```js
const MIN_MS = 1500, EXIT_MS = 750, LIFT_DELAY = 350, SETTLE = 175;
const STOPS = [0.05, 0.3, 0.55, 0.78];          // each card's landing
const progress = spring({ from: 0, to: 0, tension: 480, friction: 52, onUpdate: renderCounterAndBar });
stopScroll();                                    // Lenis stop + html lock
const t0 = performance.now(); let last = 0, target = 0;
function tick() {
  // Lazy images below the fold never load while scroll is locked — count eager ones only,
  // and give up waiting after 2× the minimum run time.
  const imgs = [...document.images].filter((i) => i.loading !== "lazy");
  const loaded = imgs.length ? imgs.filter((i) => i.complete).length / imgs.length : 1;
  const elapsed = performance.now() - t0;
  const time = Math.min(1, elapsed / MIN_MS);
  const next = elapsed > MIN_MS * 2 ? 1 : Math.min(time, 0.15 + loaded * 0.85);
  progress.set(next);
  if (next >= 1 || STOPS.some((at) => at > last && at <= next)) { last = next; target = next; landCards(target); }
  if (next >= 1) { setTimeout(onDone, SETTLE); return; }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

The cards re-target only when a stop is crossed (and at 1); the counter and bar follow the progress
spring every frame.

**Sequence after 100**: `SETTLE` (175 ms) after the target reaches 1 → **done**: the stamp springs in;
`LIFT_DELAY` (350 ms) after done → **release** (the page's reveal observers attach — see Motion) and the
lift spring `v: 0 → 1` with **`{ tension: 480, friction: 48 }`** starts (`translateY(−v × 105%)`, the
curtain leaves upward); `EXIT_MS` (750 ms) after done → the curtain is removed from the DOM (its `<style>`
lock goes with it) and scroll starts again. Total intro ≈ 1.5 s on a cached page. The page under the
curtain is fully laid out and painted (the hero photo is the LCP and loads at high priority under it).

## The header (fixed, over every block)

`<header>`: `position:fixed; left:0; right:0; top:0; z-index:25`. Desktop: `height:97;
background-image:var(--header-scrim)`, every child absolute. Compact: `display:flex;
align-items:center; justify-content:space-between; padding-block:14`, padding-inline laptop 32,
tablet 40, mobile 20.

- **Backdrop** (fades in once the page scrolls, so the nav stays legible over any section): `position:absolute;
  inset:0; z-index:-1; pointer-events:none; border-bottom:1px solid rgb(242 244 248 / .1);
  background:rgb(7 10 16 / .8); backdrop-filter:blur(12px)`; desktop `bottom:auto; height:75`. Opacity
  springs `0 ↔ 1` with `{ tension: 220, friction: 30 }` on `window.scrollY > 40`.
- **Shade** (compact only): `position:absolute; left:0; right:0; top:0; z-index:-1; height:130;
  pointer-events:none; background-image:var(--header-shade)`.
- **Logo** `<a href="/" aria-label="HELD-MINT">`: `position:relative; display:flex; align-items:center;
  gap:9`; desktop `position:absolute; top:12; left:31; display:block; height:47; width:173`.
  - Mark: a span `display:flex; align-items:center; justify-content:center` (desktop
    `position:absolute; top:16; left:23; height:22; width:23`) with a `Vector` of
    `header/header-logo-mark.svg` (compact `header/header-logo-mark-compact.svg`), 22 tall, desktop 19
    wide and `transform: skewX(-11.31deg)`, compact 24 wide.
  - Wordmark: `<span class="type-display" style="font-size:var(--type-logo)">HELD-MINT</span>`, white on
    desktop (`position:absolute; top:18; left:52; text-box: trim-both cap alphabetic`),
    `--foreground` on compact.
- **Right group**: desktop `display:contents`; compact `display:flex; align-items:center`, gap laptop
  34, tablet 18. In order:
  - **Locale** `<button>` "En": `type-caps`, `font-size:var(--type-nav); letter-spacing:var(--letter-nav);
    color:rgb(242 244 248 / .75); display:flex; align-items:center`, desktop `line-height:var(--line-copy);
    position:absolute; top:24; left:380; gap:4`, laptop gap 5; hidden on handheld. Then a
    `header/icon-chevron.svg` Vector `0.97222rem` square.
  - **Nav** `<nav aria-label="Main">`: desktop `position:absolute; top:12; left:50%;
    translate:-50% 0`; hidden on handheld. `<ul>` `display:flex; align-items:center; gap:34`, desktop
    `padding:12 39`. Items, each a **SprayLink** with the same caps text style (75 % white, hover →
    `--accent`): **Marketplace** `#` · **Vault** `#vault` (`aria-current="page"`) · **White Paper** `#` ·
    **Contact Us** `#`. Underline box: `left:-17; height:21`; desktop `top:25; width:calc(100% + 1.952rem)`;
    laptop `top:15; width:calc(100% + 2.104rem)`.
  - **Log In** `<a href="#">`: same caps style, `display:flex; align-items:center`, desktop
    `position:absolute; top:24; left:977; gap:4`, laptop gap 5; hidden on handheld; then a
    `header/icon-user.svg` Vector `0.97222rem` square, inset `0 -1.57% -6.1% 0`.
  - **Buy NFT** PlateButton `sm`, href `#`: plate width desktop 133, compact 139; desktop
    `position:absolute; top:12; left:1230`; hidden on mobile. Desktop drips (left · h · w):
    `16·15·5, 32·8·4, 50·27·6, 68·11·4, 89·20·5, 109·7·4, 125·14·6`; compact lefts
    `17, 34, 53, 71, 94, 114, 131`.
  - **Burger** (handheld only): `<button aria-label="Open menu" aria-expanded="false">` with a
    `header/icon-menu.svg` Vector 22 tall × 30 wide, inset `-7.27% -5.33% 0 -5.33%`; `position:relative;
    z-index:50`.

So desktop shows everything; laptop shows logo · En · nav · Log In · Buy NFT in one row; tablet shows
logo · Buy NFT · burger; mobile shows logo · burger.

### The menu (handheld) — the Featured-drop poster drops over the page

Appended to `<body>`: `position:fixed; inset:0; z-index:60`; while closed `pointer-events:none`,
`aria-hidden="true"` and `inert`.
- **Backdrop**: `position:absolute; inset:0; background:rgb(7 10 16 / .8)`, opacity `0 ↔ 1` with
  `{ tension: 200, friction: 30 }`; click closes.
- **Sheet**: `position:absolute; left:12; right:12; top:12; bottom:12; display:flex;
  flex-direction:column; overflow:hidden; background:var(--surface-poster); color:var(--on-inverse);
  padding:20 24 32` (tablet: inset 24 all round, `padding:40 48 48`). Transform spring
  `{ tension: 210, friction: 22 }`: closed `translateY(-115%) rotate(-7deg)` → open
  `translateY(0%) rotate(-1.5deg)` — it drops in at a tilt and settles crooked, like a poster slapped up.
  - Top row `display:flex; align-items:center; justify-content:space-between`: a `display:flex;
    align-items:center; gap:12` group of a `drop/drop-crown-mobile.svg` Vector (23 × 29; tablet 32 × 40)
    and `<span class="type-script" style="font-size:var(--type-eyebrow); color:var(--accent-strong)">menu</span>`
    (tablet `font-size:2rem`); then the close `<button aria-label="Close menu">` with a
    `questions/icon-close-compact.svg` Vector 22 square, inset `-9.38%`.
  - Nav `<nav aria-label="Menu">`: `margin-top:40; display:flex; flex:1; flex-direction:column; gap:12`
    (tablet `margin-top:64; gap:20`). The four links, `type-display`, `position:relative; width:fit-content;
    font-size:3.5rem` (tablet `6rem`), colour `--on-inverse`, the current one (**Vault**) in
    `--accent-strong` with a `drop/drop-scribble-mobile.svg` Vector under it (5 tall, full width, inset
    `-42.35% -1.59%`, `position:absolute; bottom:-2; left:0; rotate:-2deg`). Clicking a link closes.
  - Bottom block `display:flex; flex-direction:column; gap:24`: a `type-display` row
    (`display:flex; align-items:center; gap:32; font-size:1.5rem`; tablet `gap:48; font-size:2.25rem`) of
    "En" (`<button>`, `rgb(5 7 11 / .6)`) and "Log In" + `header/icon-user.svg` (20 square, tablet 28;
    gap 8); then a **Buy NFT** PlateButton `md`, plate width 232, compact drip lefts
    `26, 54, 86, 116, 152, 187, 215`.
  - A barbed-wire arc in the corner: `position:absolute; right:-96; bottom:-112; width:360; height:360;
    rotate:200deg; pointer-events:none; filter:drop-shadow(var(--elevation-wire))`,
    `drop/drop-barbed-wire-arc.png` `object-fit:contain`, `fetchpriority="low"`.
- **Trail**: the five rows (four links, then the bottom block) spring `opacity 0 → 1`,
  `translateX(-12%) → translateX(0%)` with `{ tension: 260, friction: 24 }`, delay 180 ms when opening (0
  when closing), each row following the one before it (react-spring `useTrail`: each spring chases the
  previous one's value — a soft cascade).
- Burger toggles; Escape closes; while open, scroll is stopped (Lenis + html lock) and restarted on close.

## Layout & sections (in order)

### 01 Hero — `<section>` (full viewport)

`position:relative; z-index:10; display:flex; flex-direction:column; justify-content:flex-end;
height:100svh`; `min-height` desktop 450, compact 480; padding laptop `0 32 48`, tablet `0 40 40`,
mobile `0 20 32`. Media and fades are pinned to the bottom edge with each frame's offsets, so the
composition holds as the window gets taller or shorter than the frame.

1. **Desktop left card** (desktop only) — `Rotated` box `position:absolute; bottom:-446; left:86;
   height:470; width:409`, rotate `-19.7deg`, parallax −14. CardImage `intro/intro-card-tucked-overlay.png`
   (alt "Prime Ape card"), 395 × 293 (h × w), `border-radius:var(--corner-art-tilt)`; motion card index 0.
   It sits under the photo, peeking out below the hero into the next section.
2. **Photo frame** — `position:absolute; left:0; right:0; top:0; overflow:hidden`; `bottom` desktop 0,
   laptop 119, tablet 104, mobile 242. Inside, a parallax layer (`position:absolute; inset:0`, distance 24,
   no tilt — the vault recedes behind the copy) holding the photo slot (motion **photo**):
   desktop `position:absolute; left:0; right:0; top:50%; translate:0 -50%; aspect-ratio:2752/1536`;
   compact `position:absolute; inset:0`. The image `hero/hero-vault.png` (`alt=""`, `object-fit:cover`,
   `fetchpriority="high"`, eager; preload it with `<link rel="preload" as="image">`). On compact the 16:9
   photo is cropped to a taller box, so it renders wider than the viewport. Over it (desktop only) the
   vignette `position:absolute; inset:0; background-image:var(--hero-vignette)`.
3. **Compact card** (compact only) — an anchor `position:absolute; left:0; right:0; bottom:0; height:0;
   margin-inline:auto` (mobile column `max-width:24.375rem`, so it stays under the card row on wide phones)
   holding a `Rotated` box `position:absolute`, rotate `-21deg`, parallax −8:
   laptop `bottom:-387; left:28; height:482; width:423`; tablet `bottom:-330; left:12; height:370;
   width:325`; mobile `bottom:-187; left:-5; height:208; width:182`. CardImage
   `intro/intro-card-tucked-overlay.png`: laptop 401 × 299, tablet 308 × 230, mobile 173 × 129,
   radius `var(--corner-art-tilt)`.
4. **Hero fade** `aria-hidden; pointer-events:none; position:absolute; left:0; right:0`: desktop
   `bottom:-154; height:573; background-image:var(--hero-fade)`; compact `var(--hero-fade-compact)` at
   laptop `bottom:118; height:325`, tablet `bottom:103; height:460`, mobile `bottom:241; height:301`.
5. **Card fade** (compact only) `position:absolute; left:0; right:0; background-image:var(--card-fade)`:
   laptop `bottom:-146; height:281`; tablet `bottom:-145; height:225`; mobile `bottom:-83; height:144`.
6. **Copy** — `position:relative; display:flex`; desktop `position:absolute; left:0; right:0; bottom:0;
   display:block; height:338` (all desktop coordinates below are inside this 1400 × 338 band); laptop
   `align-items:flex-end; gap:48`; tablet `align-items:flex-end; gap:32`; mobile `flex-direction:column;
   align-items:center; gap:20; width:100%; max-width:350; margin-inline:auto`.
   - **Left column** `display:flex; flex-direction:column`; compact `flex:1`; laptop/tablet gap 12;
     mobile `width:100%; align-items:center; gap:10`.
     - Eyebrow "**card custody · zug**": crown box desktop `top:20; left:28; height:36; width:42`; label
       box desktop `top:0; left:88; height:48; width:268`.
     - `<h1 class="type-display" style="font-size:var(--type-display)">` (mobile `align-items:center`):
       line 1 "**Rare cards**" (desktop `top:54; left:32`; mobile `text-align:center`); line 2 "**behind**"
       (desktop `top:183; left:32`); mobile row `justify-content:center`. Holder: laptop 98 × 208 (h × w),
       tablet 73 × 156, mobile 49 × 107 (desktop: static — the mark and scribble use band coordinates).
       - Mark "**steel**" (`font-size:var(--type-script-lg)`), box: desktop `top:152; left:446;
         height:175; width:325`; laptop `top:-7; left:2; 112 × 208`; tablet `top:-5; left:2; 83 × 155`;
         mobile `top:-4; left:2; 56 × 104`.
       - Scribble `hero/hero-scribble.svg` (laptop/tablet/mobile `hero/hero-scribble-laptop.svg`,
         `-tablet.svg`, `-mobile.svg`), width desktop 290, laptop 186, tablet 138, mobile 93; inset desktop
         `-74.12% -1.21%`, laptop `-51.88% -1.32%`, tablet `-42.35% -1.45%`, mobile `-42.34% -2.15%`. Box:
         desktop `top:303; left:452; 20 × 290`; laptop `top:78; left:6; 14 × 186`; tablet `top:58; left:6;
         12 × 138`; mobile `top:39; left:6; 10 × 93`.
   - **Right column** `display:flex; flex-direction:column; align-items:flex-start; flex-shrink:0`;
     desktop `position:absolute; top:172; left:933; width:435; gap:32`; laptop `width:340; gap:24`; tablet
     `width:244; gap:24; padding-bottom:10`; mobile `width:100%; align-items:center; gap:20`.
     - Lead `<p>` (motion **copy**): `font-size:var(--type-body); line-height:var(--line-copy);
       color:var(--foreground-muted)`; mobile `width:332; text-align:center`. Copy: "**Rare cards kept in a
       Swiss strongroom — every shelf, seal and signature published on**" + " " + "**a public ledger.**"
       — on mobile only, a full-width break element sits between the two parts, so "a public ledger."
       starts its own line.
     - PlateButton `md` "**Request access**" → `#join`. Plate width desktop 256, laptop 23