# Site shell (migration Stage 2)

The shared header, footer, chatbot and scroll system, mounted once in the root layout. Reference: `landing-prototype-clean/`. Foundations (tokens, fonts, motion preference, content module) are in [FOUNDATIONS.md](FOUNDATIONS.md).

## Architecture

```
src/app/layout.tsx            html / body, fonts, metadata, inline motion script
  IconSprite                  server  (Stage 1)
  MotionSync                  client  (Stage 1) data-motion + OS changes
  LenisController             client  the one Lenis instance, one rAF subscription, anchors
  SiteHeader                  client  fixed bar -> glass dock, pause toggle, sign-in (design-only)
  {children}                  each page renders its own <main>
  SiteFooter                  server
  Chat                        client  guided chatbot, one instance
```

| Piece | File |
|---|---|
| Lenis owner | `src/components/shell/LenisController.tsx` |
| Lenis accessor, counted scroll lock | `src/lib/scroll/lenis.ts` (`getLenis`, `onLenisChange`, `lockScroll`, `unlockScroll`) |
| Ticker and spring (one rAF loop) | `src/lib/motion/spring.ts` |
| Header | `src/components/shell/SiteHeader.tsx` + `.module.css` |
| Footer | `src/components/shell/SiteFooter.tsx` + `.module.css` |
| Chat UI | `src/components/chat/Chat.tsx` + `Chat.module.css` (the prototype's CSS, class names kept) |
| Chat brain (intents, replies, request flow) | `src/components/chat/brain.ts`, `md.ts` (pure, no DOM) |
| Route paths and `.html` mapping | `src/content/routes.ts` |
| Temporary route placeholders | `src/components/shell/RoutePlaceholder.tsx` and `src/app/<route>/page.tsx` |

## Routes

`/`, `/healthcare`, `/government`, `/it-finance-cyber`, `/jobs`, `/capability`, `/about`, `/contact`. `content.ts` keeps the prototype's `.html` hrefs; `routeFor()` maps them (`specialists.html` becomes `/it-finance-cyber`). `login.html` and `account.html` have no route (accounts are design-only), so `routeFor` returns `null` and the header and footer render a disabled "Sign in" button with an explanation for assistive technology.

**Temporary placeholders.** The seven inner routes each render `RoutePlaceholder` (title, "Temporary placeholder", one sentence, `noindex`). They keep every link working and the shell testable on every path. When a real page is built, replace that route's `page.tsx`; when all exist, delete `RoutePlaceholder.*`.

## Lenis lifecycle

- Created in a `LenisController` effect, destroyed in its cleanup (removes its listeners and the `lenis` classes), published through `lib/scroll/lenis.ts`. The showreel's sideways snap (Stage 5) must call `getLenis()` / `onLenisChange()` and attach and detach in its own effect; it must not create another scroll engine.
- Driven by the shared ticker, so there is a single `requestAnimationFrame` loop for the site (measured: about 58 calls per second when idle).
- `smoothWheel` is off whenever animations are paused (the OS setting unless the visitor chose) and follows later changes. The prototype followed the OS media query only; the pause toggle now also turns eased wheel scrolling off.
- Anchors: one capturing click handler on `document`. Links to the current page scroll with Lenis: `#id` lands below the fixed bar, `#top`, or a link to the current path with no hash, scrolls to the top. Everything else goes to `next/link`. Because Lenis also honours `html { scroll-padding-top }`, a section lands `--bar-h + 32px` from the top, as on the prototype's home page.
- `history.scrollRestoration` is not forced to `"manual"` (the prototype did). Next.js and the browser restore position on back and forward; forward navigation starts at the top. Lenis re-measures after each route change.
- Scroll lock (`lockScroll`/`unlockScroll`) is counted, so the phone chat sheet and the later preloader cannot release each other's lock. Created while locked, Lenis starts stopped.

## Hidden routes (Cache Components / Activity)

The shell lives in the layout, which React does not hide, so its effects run once. Everything the shell starts in an effect is stopped in the same effect's cleanup (listeners, ResizeObserver, springs, timers, ticker subscription), and effects are idempotent, so a hide/show cycle or Strict Mode's double mount cannot double anything (checked: listener counts on `window` and `document` are identical after 8 route changes and 6 chat open/close cycles). A page that starts its own work (video, WebGL, observers, scroll-linked loops) must stop it in its own effect cleanup and restart it on show; an effect cleanup can mean "hidden", not "gone". `html[data-motion]` and `onPauseChange` are the shared pause signals.

## Header

Markup and wording from the prototype: brand mark, five links (`NAV` in `content.ts`), pause toggle, "Sign in" (design-only), "Now staffing". At the top it is the flat bar; after 40px of scroll a spring floats it into the glass dock (`--dock` and the backdrop opacity are written to refs, not through React renders). `--bar-h` on `<html>` follows its height. Toggle icons follow `html[data-motion]` so they are right on first paint. `aria-current="page"` marks the current route.

Measured against the prototype at 360, 390, 768, 1024, 1440 and 1920 px: bar, logo, nav links, toggle and status positions are identical at the top and when scrolled.

## Footer

Server component, structure and wording from the prototype. Contact block: address only, as on the prototype's home page (its inner pages also print phone and email; add `CONTACT.phone` and `CONTACT.email` lines if the inner pages should keep that). The letter-by-letter wordmark animation belongs to the homepage motion stage.

## Chat

Guided mode only. Same launcher, panel, welcome, cards, chips and request flow as the prototype; answers come from `content.ts`. Nothing is sent: the flow ends in "Request summary · Not sent yet" with a link to `/contact?role=...&email=...`. Not ported: the live AI mode (`/api/chat`, tool calls), generated ticket ids, "Online", reply-time promises. A transcript of 19 steps (greeting, nine questions, the full request flow, a bad email) is identical to the prototype's.

Behaviour: Escape closes; focus goes into the field on open (not on phones) and back to the launcher on close; `aria-modal` and the page scroll lock apply only to the phone sheet while it is open; a route change closes the panel and keeps the conversation.

Page contract (optional attributes on a page's elements): `data-chat-hero` keeps the launcher hidden while that element is on screen; `data-chat-reel` shrinks the launcher to its orb while it is on screen. The Stage 3 hero and Stage 5 showreel should set them.

## Known interim state

- The `<Link href="/">` in the header prefetches the home route, so on other routes the browser logs a "preloaded but not used" notice for the hero's stylesheet. Harmless.
- (Resolved in Stage 3: the old VESSEL hero and its own header are gone, and the hero sets `data-chat-hero`.)
