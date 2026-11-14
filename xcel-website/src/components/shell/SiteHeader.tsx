"use client";

/* =====================================================================
   SiteHeader: the fixed top bar, on every route.
   Markup, wording and behaviour from landing-prototype-clean (index.html, js/site.js navHTML,
   js/motion.js initHeader): brand mark, five links (NAV in content.ts), pause control,
   sign-in and "Now staffing"; a flat bar at the top that floats into a glass dock once the
   page scrolls more than 40px.

   - Links are next/link routes (routeFor maps the prototype's .html hrefs).
   - Sign-in is design-only: a disabled button, no destination, no accounts.
   - The dock is a spring writing opacity and --dock to refs (per-frame DOM writes stay out of
     React renders). The effect cleans up everything it starts, so React hiding and showing
     the layout (Cache Components / Activity) never doubles a listener or a spring.
   - --bar-h on <html> follows the bar's height; sections and scroll-padding use it.
   ===================================================================== */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/content/content";
import { ROUTES, routeFor } from "@/content/routes";
import { isPaused, setPaused, MOTION_TOGGLE_TITLE } from "@/lib/motion/motion";
import { useMotionPaused } from "@/lib/motion/useMotionPaused";
import { spring } from "@/lib/motion/spring";
import s from "./SiteHeader.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const paused = useMotionPaused();
  const headerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current!;
    const backdrop = backdropRef.current!;
    // other sections (the showreel) read the bar's height to stay clear of it
    const ro = new ResizeObserver(() =>
      document.documentElement.style.setProperty("--bar-h", `${header.offsetHeight}px`),
    );
    ro.observe(header);

    let scrolled = false;
    const dock = spring({
      from: 0,
      to: 0,
      tension: 220,
      friction: 30,
      onUpdate: (v) => {
        backdrop.style.opacity = String(v);
        header.style.setProperty("--dock", String(v));
      },
    });
    const check = () => {
      const sc = window.scrollY > 40;
      if (sc !== scrolled) {
        scrolled = sc;
        dock.set(sc ? 1 : 0);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", check);
      dock.stop();
      ro.disconnect();
    };
  }, []);

  return (
    <header className={s.siteHeader} id="site-header" ref={headerRef}>
      <div className={s.backdrop} ref={backdropRef} aria-hidden="true" />
      <div className={s.hxHeader}>
        <Link href={ROUTES.home} className={s.hxLogo} aria-label="XcelCareers home">
          <svg className={s.hxMark} aria-hidden="true">
            <use href="#i-mark" />
          </svg>
          XcelCareers
          <span className={s.hxReg} aria-hidden="true">
            ®
          </span>
        </Link>
        <nav className={s.hxNav} aria-label="Primary">
          <ul>
            {NAV.map((n) => {
              const href = routeFor(n.href) ?? ROUTES.home;
              return (
                <li key={n.href}>
                  <Link href={href} aria-current={href === pathname ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={s.hxEnd}>
          <button
            type="button"
            className={s.moToggle}
            aria-pressed={paused}
            aria-label="Pause animations"
            title={MOTION_TOGGLE_TITLE[paused ? "paused" : "playing"]}
            onClick={() => setPaused(!isPaused())}
          >
            <svg className={s.icPause} aria-hidden="true" viewBox="0 0 12 12">
              <rect x="2" y="1.5" width="2.8" height="9" rx="0.6" />
              <rect x="7.2" y="1.5" width="2.8" height="9" rx="0.6" />
            </svg>
            <svg className={s.icPlay} aria-hidden="true" viewBox="0 0 12 12">
              <path d="M3 1.6v8.8L10.4 6z" />
            </svg>
          </button>
          <p className={s.hxStatus}>
            <button
              type="button"
              className={s.hxAccount}
              aria-disabled="true"
              aria-describedby="xc-account-note"
              title="Candidate accounts are not live yet"
            >
              Sign in
            </button>
            <span id="xc-account-note" className="sr-only">
              Candidate accounts are not live yet.
            </span>
            <span className={s.hxLive}>Now staffing</span>
          </p>
        </div>
      </div>
    </header>
  );
}
