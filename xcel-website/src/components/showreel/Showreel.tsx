/* =====================================================================
   SHOWREEL, Stage 5B-1: the static stage. Server component, no state, no effects.

   Markup follows build() in landing-prototype-clean/js/showreel.js, from content.ts. The page
   is the opening frame (scroll progress 0): the CSS module carries that frame, the track has
   its real height, and nothing moves yet. The scroll engine (5B-2), snap (5B-3) and the five
   WebGL scenes (5B-4 to 5B-6) attach to this DOM later and own only inline styles, SVG
   attributes and canvases; React never re-renders this subtree, so there is nothing for it to
   reconcile. Engine hooks are data-sr="..." attributes (scoped to the section, never ids: a
   hidden route's DOM stays in the document under Cache Components).

   Differences from the prototype, markup only:
   - Slots that held stock photographs and clips (opening card video, cards 01 and 02, the three
     service panels) are quiet placeholders: those assets are not approved (docs/MEDIA.md).
   - Split headings get a screen-reader copy; the per-letter spans are aria-hidden.
   - Card headlines are h3 (the prototype's h4 skipped a level); the rotated caption is a
     paragraph. Appearance is class-based, so nothing visual changes.
   - Links use the site's routes (/contact, /capability); "#..." links stay on the page and are
     scrolled by the shell's single Lenis instance.
   ===================================================================== */
import Link from "next/link";
import { CONTACT, FUNCTIONS, SHOWREEL as S } from "@/content/content";
import { ROUTES } from "@/content/routes";
import { MARK_BODY_POINTS, MARK_BOX, MARK_HEAD, MARK_RAYS } from "@/lib/mark/geometry";
import s from "./Showreel.module.css";

/** the text, one span per letter, for the scroll-driven letter animation */
function Letters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch === "\n" ? <br key={i} /> : ch === " " ? " " : (
          <span key={i} className={s.sl} data-sl="">
            {ch}
          </span>
        ),
      )}
    </>
  );
}

/** a line of split letters, hidden from assistive technology (its heading carries the text) */
const Line = ({ text, dim }: { text: string; dim?: boolean }) => (
  <span className={`${s.slLine}${dim ? ` ${s.dim}` : ""}`} aria-hidden="true">
    <Letters text={text} />
  </span>
);

/** placeholder for a photograph or clip that is not approved: graphite or paper with the brand mark */
const Slot = ({ tone }: { tone?: "light" | "steel" }) => (
  <div className={`${s.ph}${tone === "light" ? ` ${s.phLight}` : tone === "steel" ? ` ${s.phSteel}` : ""}`} aria-hidden="true">
    <svg className={s.phMark}>
      <use href="#i-mark" />
    </svg>
  </div>
);

const MarkIcon = ({ className }: { className: string }) => (
  <svg className={className} aria-hidden="true" focusable="false">
    <use href="#i-mark" />
  </svg>
);

const Chip = ({ n, label }: { n: string; label: string }) => (
  <span className={s.chip}>
    <b>{n}</b>
    {label}
  </span>
);

const TEL = "tel:+1" + CONTACT.phone.replace(/\D/g, "");
const C = S.cards;

export default function Showreel() {
  return (
    <section className={s.sr} id="services" aria-label="What we do" data-chat-reel="" data-showreel="">
      <div className={s.aurora} data-sr="aurora" aria-hidden="true">
        <canvas data-sr="aurora-canvas" />
      </div>

      <div className={s.track} data-sr="track">
        <div className={s.sticky}>
          <div className={s.backdrop} data-sr="backdrop" />
          <div className={s.marquee} data-sr="marquee" aria-hidden="true">
            <div className={s.marqueeRow}>
              {[0, 1].flatMap((copy) =>
                S.marquee.flatMap((t) => [
                  <span key={`${copy}-${t}`} className={s.marqueeItem}>
                    {t}
                  </span>,
                  <span key={`${copy}-${t}-ring`} className={`${s.marqueeItem} ${s.marqueeGap}`}>
                    <span className={s.ring} />
                  </span>,
                ]),
              )}
            </div>
          </div>

          <div className={s.scene}>
            <div className={s.rig} data-sr="rig">
              <div className={s.carousel} data-sr="carousel">
                {/* 1 · opening card (it later shrinks into the first carousel card) */}
                <div className={s.card1} data-sr="card1">
                  <div className={s.hero}>
                    <canvas data-sr="hero-canvas" />
                    <div className={s.heroHead} data-sr="hero-head">
                      <h2 data-sr="hero-h">
                        <span className="sr-only">{S.heroLines.join(" ")}</span>
                        <Line text={S.heroLines[0]} />
                        <Line text={S.heroLines[1]} dim />
                      </h2>
                    </div>
                    <div className={s.heroRot}>
                      <p className={s.rotText} data-sr="hero-rot">
                        <span className="sr-only">{S.heroRotated.replace("\n", " ")}</span>
                        <span aria-hidden="true">
                          <Letters text={S.heroRotated} />
                        </span>
                      </p>
                    </div>
                    <div className={s.heroImg}>
                      <div className={s.slider} data-sr="slider">
                        <div className={s.slide} data-sr="slide-a">
                          <Slot />
                        </div>
                        <div className={`${s.slide} ${s.slideB}`} data-sr="slide-b">
                          <div className={s.rotated}>
                            <Slot tone="steel" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={s.heroBottom} data-sr="hero-bottom">
                      <p className={s.lead}>{S.heroLead}</p>
                      <div className={s.btns}>
                        {S.heroButtons.map((b) => (
                          <a key={b.label} className={`${s.btn}${b.primary ? ` ${s.btnSolid}` : ""}`} href={b.href}>
                            {b.label}
                          </a>
                        ))}
                      </div>
                      <div className={s.divider} />
                      <div className={s.heroRow}>
                        <div className={s.avatars}>
                          <span className={s.faces}>
                            {S.team.map((i) => (
                              <span key={i} className={s.avatar}>
                                {i}
                              </span>
                            ))}
                          </span>
                          <span className={s.avatarsLabel}>{S.avatarsLabel}</span>
                        </div>
                        <p className={s.heroRight}>{S.heroRight}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 · numbered carousel cards: chip, photo, headline, action */}
                <div className={`${s.side} ${s.card2}`} data-sr="card2">
                  <div className={`${s.cc} ${s.ccDark}`}>
                    <Slot />
                    <div className={s.ccUi}>
                      <div className={s.ccTop}>
                        <Chip n={C.employer.n} label={C.employer.label} />
                        <MarkIcon className={s.ccMark} />
                      </div>
                      <div className={s.ccBottom}>
                        <h3>
                          {C.employer.title}
                          <br />
                          <strong>{C.employer.strong}</strong>
                        </h3>
                        <div className={s.glassPill}>
                          <span>
                            <span className={s.pillK}>{C.employer.pillK}</span>
                            <span className={s.pillV}>{C.employer.pillV}</span>
                          </span>
                          <span className={s.badge} aria-hidden="true">+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${s.side} ${s.card3}`} data-sr="card3">
                  <div className={`${s.cc} ${s.ccLight}`}>
                    <Slot tone="light" />
                    <div className={s.ccUi}>
                      <div className={s.ccTop}>
                        <Chip n={C.seeker.n} label={C.seeker.label} />
                        <MarkIcon className={s.ccMark} />
                      </div>
                      <div className={s.ccBottom}>
                        <h3>
                          {C.seeker.title}
                          <br />
                          <strong>{C.seeker.strong}</strong>
                        </h3>
                        <div className={s.search}>
                          <span className={s.badge} aria-hidden="true">+</span>
                          <span className={s.searchQ}>{C.seeker.q}</span>
                          <span className={`${s.badge} ${s.badgeGo}`} aria-hidden="true">➤</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* card 03: the face, the dark network scene behind the hub (the portal), and the mark on top */}
                <div className={`${s.side} ${s.card4}`} data-sr="card4">
                  <div className={s.sphereCard}>
                    <div className={s.cardFace} data-sr="face">
                      <div className={s.faceIn} data-sr="face-in">
                        <div className={s.faceTop}>
                          <Chip n={C.network.n} label={C.network.label} />
                        </div>
                        <h3>
                          {C.network.title}
                          <br />
                          <strong>{C.network.strong}</strong>
                        </h3>
                      </div>
                    </div>
                    <div className={s.blackPanel} data-sr="blackpanel">
                      <div className={s.sphereScene} data-sr="sphere-scene">
                        <div className={s.sphereCanvasWrap} data-sr="sphere-wrap">
                          <canvas data-sr="sphere-canvas" />
                        </div>
                        <div className={s.core} data-sr="core">
                          <MarkIcon className={s.coreMark} />
                        </div>
                        <h2 className={s.hTop} data-sr="h-top">
                          <span className="sr-only">{S.sphereTop}</span>
                          <Line text={S.sphereTop} />
                        </h2>
                        <h2 className={s.hBottom} data-sr="h-bottom">
                          <span className="sr-only">{S.sphereBottom.join(" ")}</span>
                          {S.sphereBottom.map((l) => (
                            <Line key={l} text={l} />
                          ))}
                        </h2>
                        <div className={s.sphereBody} data-sr="sphere-body">
                          {S.sphereBody.map((t) => (
                            <p key={t}>{t}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* the mark on card 03, one element per blade so each can be animated */}
                    <svg
                      className={s.zoom}
                      data-sr="zoom"
                      aria-hidden="true"
                      focusable="false"
                      preserveAspectRatio="none"
                      viewBox={`${MARK_BOX.x} ${MARK_BOX.y} ${MARK_BOX.w} ${MARK_BOX.h}`}
                    >
                      <g data-sr="zoom-rot">
                        <g>
                          {MARK_RAYS.map((r, i) => (
                            <polygon key={r.points} className={s.zmRay} data-sr="zoom-ray" data-i={i} data-g={r.g} points={r.points} />
                          ))}
                        </g>
                        <g className={s.zmFig} data-sr="zoom-fig">
                          <circle cx={MARK_HEAD.cx} cy={MARK_HEAD.cy} r={MARK_HEAD.r} />
                          <polygon points={MARK_BODY_POINTS} />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 6 · the closing frame: the ask (hidden until its scroll window; the prototype's static fallback is the CSS gradient) */}
              <div className={s.target} data-sr="target">
                <canvas data-sr="target-bg" />
                <canvas data-sr="target-canvas" />
                <div className={s.vignette} aria-hidden="true" />
                <div className={s.ctaBlock} data-sr="cta-block">
                  <p className={s.ctaEyebrow} data-sr="cta-part">
                    <span className={s.dot} aria-hidden="true" />
                    {S.finalEyebrow}
                  </p>
                  <h2>
                    <span data-sr="cta-part">{S.finalLines[0]}</span>
                    <span className={s.dim} data-sr="cta-part">{S.finalLines[1]}</span>
                  </h2>
                  <p className={s.ctaLead} data-sr="cta-part">{S.finalLead}</p>
                  <div className={s.ctaRow} data-sr="cta-part">
                    <Link className={s.ctaBtn} href={ROUTES.contact}>{S.finalButton}</Link>
                    <Link className={s.ctaGhost} href={ROUTES.capability}>{S.finalSecondary}</Link>
                  </div>
                  <p className={s.ctaTrust} data-sr="cta-part">
                    {S.finalTrust} ·{" "}
                    <a className={s.ctaTel} href={TEL}>
                      {S.finalAlt} <b>{CONTACT.phone}</b>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={s.cta} data-sr="cta">
            <a href="#process">{S.cta}</a>
          </div>
        </div>
      </div>

      {/* 5 · the three lines of business, in the client's order of priority (a fixed layer shown while the stage is pinned) */}
      <section className={s.pfSection} data-sr="portfolio" aria-label="What we staff">
        <div className={s.pfTrack} data-sr="pf-track">
          {FUNCTIONS.map((f) => (
            <article key={f.n} className={s.pf}>
              <Slot />
              <div className={s.pfTags}>
                {f.tags.flatMap((t, i) => [
                  i > 0 ? <span key={`${t}-sep`} className={s.sep} aria-hidden="true">·</span> : null,
                  <span key={t}>{t}</span>,
                ])}
              </div>
              <div className={s.pfFoot}>
                <p className={s.pfKicker}>
                  <b>{f.n}</b>
                  {f.kicker}
                </p>
                <h3>{f.title}</h3>
                <p className={s.pfLine}>{f.line}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
