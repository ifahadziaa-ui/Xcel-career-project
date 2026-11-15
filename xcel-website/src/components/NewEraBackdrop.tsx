"use client";

import { useEffect, useRef } from "react";

/* The Healthcare page's background: one large DNA helix of fine points that twists and drifts as the page scrolls
   (legacy/dna.js; about 40,000 points, no bloom, the site's colours).
   Fixed behind the page (z-index -1, above the body colour). If WebGL is unavailable the plain page shows. */
export default function NewEraBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let dispose: (() => void) | null = null;
    let dead = false;

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

    return () => { dead = true; dispose?.(); };
  }, []);

  return <canvas ref={ref} className="era-canvas" aria-hidden="true" />;
}
