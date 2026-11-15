// @ts-nocheck
/* =====================================================================
   REDUCED MOTION. There is no pause button on the site. When the visitor's system asks for reduced motion
   (prefers-reduced-motion), everything that moves on its own stands still: the marquee, the shader
   animation, the mark's sway, the cursor tilt, looping videos and the drifting fog. One shared state,
   html[data-motion="paused"], follows that setting live. Scroll-linked motion is not touched.
   ===================================================================== */
const mq = matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new Set();
let paused = mq.matches;

const apply = () => {
  document.documentElement.dataset.motion = paused ? "paused" : "playing";
  for (const fn of listeners) fn(paused);
};

export const isPaused = () => paused;
export const onPauseChange = (fn) => { listeners.add(fn); };
mq.addEventListener("change", () => { paused = mq.matches; apply(); });
apply();
