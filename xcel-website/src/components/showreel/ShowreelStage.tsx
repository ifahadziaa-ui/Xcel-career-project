"use client";

/* =====================================================================
   ShowreelStage: the one client component of the showreel. It renders the section (its children are
   the server-rendered stage, passed through untouched) and owns the engine's lifetime.

   Why a layout effect and a plain import:
   - useLayoutEffect runs before the first paint after hydration, so the engine's first frame (from the
     real scroll position: restoration, deep links, returning to the page) is on screen at once instead
     of the static opening frame for a moment.
   - Under Cache Components a hidden route is not unmounted: React Activity runs the effect's cleanup
     when it hides the page and runs the effect again when it shows it. So cleanup means "hidden or
     gone", and every hide destroys the engine and every show builds a fresh one: no stale subscription,
     no double listener, nothing running for a page nobody can see. Strict Mode's setup/cleanup/setup in
     development goes through the same path.
   - The first frame also lifts data-sr-pre, the marker the inline script in Showreel.tsx sets when a
     restored or #hash scroll position could otherwise paint the opening frame mid-reel (preScript.ts).
   - The engine module is small and has no heavy dependency yet, so it is imported statically. When
     Three.js arrives (5B-4) it is loaded with a dynamic import() inside the engine, guarded against the
     engine having been destroyed before the import resolves.
   ===================================================================== */
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { createShowreelEngine } from "@/lib/showreel/engine";
import s from "./Showreel.module.css";

export default function ShowreelStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const engine = createShowreelEngine(root);
    // The engine's first frame is drawn. Lift the pre-hydration guard (preScript.ts), but only once the
    // shell has published --bar-h (SiteHeader does it a frame or so after hydration) AND that layout has
    // been rendered once: the opening card is sized from --bar-h, and revealing the stage in the same
    // frame the variable lands would register as a layout shift. One-shot observer on <html> plus one
    // requestAnimationFrame, capped at 1.5 s; not a loop. A normal visit has no marker and skips all of this.
    const lift = () => root.removeAttribute("data-sr-pre");
    const html = document.documentElement;
    let stop = () => {};
    if (root.hasAttribute("data-sr-pre") && !html.style.getPropertyValue("--bar-h")) {
      let raf = 0;
      const mo = new MutationObserver(() => {
        if (!html.style.getPropertyValue("--bar-h")) return;
        mo.disconnect();
        raf = window.requestAnimationFrame(() => { stop(); lift(); });
      });
      const t = window.setTimeout(() => { stop(); lift(); }, 1500);
      stop = () => { mo.disconnect(); window.clearTimeout(t); window.cancelAnimationFrame(raf); };
      mo.observe(html, { attributes: true, attributeFilter: ["style"] });
    } else lift();
    return () => {
      stop();
      engine?.destroy(); // idempotent
    };
  }, []);

  // suppressHydrationWarning: preScript.ts may add data-sr-pre to the section before React hydrates
  return (
    <section ref={ref} className={s.sr} id="services" aria-label="What we do" data-chat-reel="" data-showreel="" suppressHydrationWarning>
      {children}
    </section>
  );
}
