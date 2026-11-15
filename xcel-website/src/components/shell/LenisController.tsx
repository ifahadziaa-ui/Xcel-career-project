"use client";

/* =====================================================================
   LenisController: owns the single Lenis instance for the whole site.
   Mounted once in the root layout. Renders nothing.

   Ported from the prototype (landing-prototype-clean/js/main.js and site.js):
   - smoothWheel is off whenever animations are paused (OS reduced motion unless the visitor
     chose otherwise: the Stage 1 motion preference), and follows later changes.
   - in-page anchors land just below the fixed bar, immediately when motion is paused.

   What is new for Next.js:
   - one requestAnimationFrame loop for the whole site (the shared ticker), unsubscribed on cleanup;
   - cleanup destroys the instance (removes its listeners and html classes);
   - links to the current page (the logo on "/", "/#contact", "#top") are handled here, other
     links are left to next/link;
   - on route changes the page height is re-measured. history.scrollRestoration is NOT forced to
     "manual" as in the prototype: Next.js and the browser own back/forward restoration.
   - the instance is shared through lib/scroll/lenis.ts, so the showreel's sideways snap
     (a later stage) attaches to this one instead of creating another scroll engine.
   ===================================================================== */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { isPaused, onPauseChange } from "@/lib/motion/motion";
import { ticker } from "@/lib/motion/spring";
import { getLenis, notifyScrollFrame, scrollLocked, setLenis } from "@/lib/scroll/lenis";

export default function LenisController() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: !isPaused() });
    setLenis(lenis);
    if (scrollLocked()) lenis.stop();

    const stopRaf = ticker.add((t) => {
      lenis.raf(t);
      notifyScrollFrame(t); // post-frame subscribers (the showreel), always after this frame's scroll is written
    });
    const offPause = onPauseChange((p) => {
      lenis.options.smoothWheel = !p;
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      const id = decodeURIComponent(url.hash.slice(1));
      const bar = document.getElementById("site-header");
      const immediate = isPaused();
      if (!id || id === "top") {
        e.preventDefault();
        lenis.scrollTo(0, { immediate });
        return;
      }
      const target = document.getElementById(id);
      if (!target) return; // not on this page: let the browser / next/link handle it
      e.preventDefault();
      // land each section just below the fixed top bar
      lenis.scrollTo(target, { offset: -(bar?.offsetHeight ?? 0), immediate });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      offPause();
      stopRaf();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // a new page has a new height: re-measure after it has rendered
  useEffect(() => {
    const id = requestAnimationFrame(() => getLenis()?.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
