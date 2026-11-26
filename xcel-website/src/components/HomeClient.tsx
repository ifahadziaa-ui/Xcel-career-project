"use client";

import { useEffect } from "react";
import { HOME_HTML } from "@/legacy/home-html";

/* The home page: the prototype's sections (markup in legacy/home-html.ts) brought to life by the
   prototype's own modules (legacy/home-init.js: showreel, carousel, brain scene, jobs fan, chat).
   The page is a single long WebGL scene that is built once and not torn down, so leaving it is a
   full page load (clicks on internal links, and Back), which also frees the GPU and the listeners. */
export default function HomeClient({ className }: { className?: string }) {
  useEffect(() => {
    let dead = false;
    let lenis: { destroy: () => void } | null = null;

    (async () => {
      const [{ default: Lenis }, { initHome }] = await Promise.all([import("lenis"), import("@/legacy/home-init")]);
      if (dead) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const l = new Lenis({ smoothWheel: !reduce });
      lenis = l;
      const raf = (t: number) => { if (!dead) { l.raf(t); requestAnimationFrame(raf); } };
      requestAnimationFrame(raf);
      (window as unknown as { __proto: unknown }).__proto = { lenis: l };
      initHome({ lenis: l });
    })();

    const leave = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//") || href === "/" || href.startsWith("/#")) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(href);
    };
    const back = () => window.location.reload();
    document.addEventListener("click", leave, true);
    window.addEventListener("popstate", back);
    return () => {
      dead = true;
      lenis?.destroy();
      document.removeEventListener("click", leave, true);
      window.removeEventListener("popstate", back);
    };
  }, []);

  return <main className={className} dangerouslySetInnerHTML={{ __html: HOME_HTML }} />;
}
