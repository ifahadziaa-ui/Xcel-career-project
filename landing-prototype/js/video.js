/* =====================================================================
   Looping clips (video[data-vid]): muted, decorative, and only playing
   while they are on screen and animations are not paused. While paused
   (or before first play) the poster image shows.
   ===================================================================== */
import { isPaused, onPauseChange } from "./pause.js?v=3";

export function watchVideos(root = document) {
  const vids = [...root.querySelectorAll("video[data-vid]")];
  if (!vids.length) return;
  const visible = new Set();
  const sync = (v) => {
    if (visible.has(v) && !isPaused()) v.play().catch(() => {}); // autoplay can be refused: the poster stays
    else v.pause();
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      sync(e.target);
    }
  }, { threshold: 0.15 });
  vids.forEach((v) => io.observe(v));
  onPauseChange(() => vids.forEach(sync));
}
