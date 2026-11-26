"use client";

import { useEffect, useRef } from "react";

/* The Healthcare page's background: one large DNA helix of fine points that twists and drifts as the page scrolls
   (legacy/dna.js; about 40,000 points, no bloom, the site's colours).
   Fixed behind the page (z-index -1, above the body colour). If WebGL is unavailable the plain page shows. */
export default function NewEraBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas: HTMLCanvasElement = el;
    let dispose: (() => void) | null = null;
    let dead = false;

    // Wait until the page has loaded and the browser is idle, so the text paints first and the
    // helix build (about 40,000 points) does not compete with it. The canvas still fades in as before.
    let idle = 0;
    let timer = 0;
    const boot = () => {
      if (dead) return;
      import("@/legacy/dna")
        .then(({ createDna }) => {
          if (dead) return;
          const era = createDna(canvas, () => ({
            scrollY: window.scrollY,
            active: !document.hidden,
            paused: document.documentElement.dataset.motion === "paused",
          }));
          dispose = era.dispose;
          canvas.dataset.on = "1";
        })
        .catch(() => { canvas.style.display = "none"; });
    };
    const start = () => {
      if (dead) return;
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(boot, { timeout: 1500 });
      else timer = window.setTimeout(boot, 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      dead = true;
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      dispose?.();
    };
  }, []);

  return <canvas ref={ref} className="era-canvas" aria-hidden="true" />;
}
