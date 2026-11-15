"use client";

import { useEffect, useRef } from "react";

/* The Healthcare page's background: a field of points that morphs sphere, DNA helix, wave, tunnel and galaxy as the
   page scrolls (legacy/newera.js, lighter than the brief: about 40,000 points, no bloom, the site's colours).
   Fixed behind the page (z-index -1, above the body colour). If WebGL is unavailable the plain page shows. */
export default function NewEraBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let dispose: (() => void) | null = null;
    let dead = false;
    let max = 1;
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    import("@/legacy/newera")
      .then(({ createNewEra }) => {
        if (dead) return;
        const era = createNewEra(canvas, () => ({
          progress: Math.min(1, Math.max(0, window.scrollY / max)),
          active: !document.hidden,
          paused: document.documentElement.dataset.motion === "paused",
        }));
        dispose = era.dispose;
        canvas.dataset.on = "1";
      })
      .catch(() => { canvas.style.display = "none"; });

    return () => { dead = true; ro.disconnect(); dispose?.(); };
  }, []);

  return <canvas ref={ref} className="era-canvas" aria-hidden="true" />;
}
