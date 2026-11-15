"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV } from "@/content/content";
import { useCandidate } from "@/components/auth/useAccounts";

/* The top bar: flat at the top, a floating glass dock once scrolled (--dock 0 to 1).
   Same markup and classes as the prototype's bar (styles/sections.css, hero.css). */
export function SiteHeader() {
  const path = usePathname();

  useEffect(() => {
    const header = document.getElementById("site-header");
    const backdrop = document.getElementById("header-backdrop");
    if (!header || !backdrop) return;
    const ro = new ResizeObserver(() =>
      document.documentElement.style.setProperty("--bar-h", `${header.offsetHeight}px`),
    );
    ro.observe(header);

    let target = 0;
    let value = 0;
    let raf = 0;
    const tick = () => {
      value += (target - value) * 0.18;
      if (Math.abs(target - value) < 0.002) value = target;
      backdrop.style.opacity = String(value);
      header.style.setProperty("--dock", String(value));
      raf = value === target ? 0 : requestAnimationFrame(tick);
    };
    const check = () => {
      const next = window.scrollY > 40 ? 1 : 0;
      if (next === target) return;
      target = next;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <header className="site-header" id="site-header">
      <div className="backdrop" id="header-backdrop" aria-hidden="true" />
      <div className="hx-header">
        <a href="/" className="hx-logo" aria-label="XcelCareers home">
          <svg className="hx-mark" aria-hidden="true"><use href="#i-mark" /></svg>
          XcelCareers<span className="hx-reg" aria-hidden="true">®</span>
        </a>
        <nav className="hx-nav" aria-label="Primary">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={path === n.href || path.startsWith(n.href + "/") ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hx-end">
          <p className="hx-status"><AccountLink /><span className="hx-live">Now staffing</span></p>
        </div>
      </div>
    </header>
  );
}

/* "Sign in" before sign-in, "Account" after (only when accounts are switched on). */
function AccountLink() {
  const { status, user } = useCandidate();
  if (!status?.configured) return null;
  return <Link className="hx-account" href={user ? "/account" : "/login"}>{user ? "Account" : "Sign in"}</Link>;
}

/* One shared entrance for every [data-r] element: it plays once, when the element enters the view. */
export function Reveals() {
  const path = usePathname();
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-r]:not(.is-in)")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((e) => {
      e.style.setProperty("--d", `${(Number(e.dataset.r) || 0) * 70}ms`);
      io.observe(e);
    });
    return () => io.disconnect();
  }, [path]);
  return null;
}
