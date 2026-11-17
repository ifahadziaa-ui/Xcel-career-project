// @ts-nocheck
/* =====================================================================
   HERO BACKGROUND REEL (user, 17 Nov 2026): four short clips play in turn behind the hero, 3 seconds each,
   cross-fading, then loop. Built to stay light:
   - markup ships with a poster image (the first frame, WebP) that paints at once; no video bytes load until
     the page is up, then only the first clip, and each next clip is fetched about a second before its turn;
   - clips are 3.9 s (3 s on screen plus the cross-fade), no audio, H.264, about 200 to 460 KB each at 1280x720
     and 80 to 200 KB at 854x480 (phones);
   - only the clip on screen (and the one fading in) is playing; the others are paused;
   - everything stops when the hero is off screen, when the tab is hidden, when the visitor asks for reduced
     motion, and on Save-Data or very slow connections (the poster stays).
   ===================================================================== */
import { isPaused, onPauseChange } from "./pause.js";

const HOLD = 3000; // ms each clip is the one on screen
const FADE = 900; // ms of cross-fade (the outgoing clip keeps playing under it)

export function initHeroReel() {
  const root = document.querySelector(".hx-bgvideo");
  if (!root) return;
  const vids = [...root.querySelectorAll("video")];
  if (!vids.length) return;

  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return; // poster only
  const small = matchMedia("(max-width: 700px)");
  const srcOf = (v) => (small.matches ? v.dataset.sm : v.dataset.lg);
  const load = (v) => {
    if (!v.getAttribute("src")) { v.src = srcOf(v); v.load(); }
  };
  const ready = (v, ms = 7000) =>
    new Promise((res) => {
      if (v.readyState >= 3) return res(true);
      const done = (ok) => { clearTimeout(t); v.removeEventListener("canplay", on); res(ok); };
      const on = () => done(true);
      const t = setTimeout(() => done(false), ms);
      v.addEventListener("canplay", on, { once: true });
    });

  let i = -1, timer = 0, active = false, onScreen = true;
  const stopAll = () => { clearTimeout(timer); timer = 0; vids.forEach((v) => v.pause()); };

  async function show(n) {
    const v = vids[n];
    load(v);
    if (!(await ready(v))) { // not loaded in time: skip it this round, try the next
      if (active) timer = setTimeout(() => show((n + 1) % vids.length), 250);
      return;
    }
    if (!active) return;
    const prev = i >= 0 ? vids[i] : null;
    v.currentTime = 0;
    try { await v.play(); } catch { return; } // autoplay refused (low-power mode): the poster stays
    v.classList.add("is-on");
    if (prev && prev !== v) {
      prev.classList.remove("is-on");
      setTimeout(() => { if (vids[i] !== prev) prev.pause(); }, FADE + 120);
    }
    i = n;
    // fetch the next clip about a second in, so it is ready for its turn
    setTimeout(() => { if (active) load(vids[(n + 1) % vids.length]); }, 900);
    clearTimeout(timer);
    timer = setTimeout(() => show((n + 1) % vids.length), HOLD);
  }

  const start = () => {
    if (active || isPaused() || document.hidden || !onScreen) return;
    active = true;
    if (i >= 0) { // resume the clip that was showing
      vids[i].play().catch(() => {});
      timer = setTimeout(() => show((i + 1) % vids.length), HOLD);
    } else show(0);
  };
  const stop = () => { active = false; stopAll(); };

  // wait for the page to be up before the first video byte
  const go = () => start();
  if (document.readyState === "complete") setTimeout(go, 300);
  else addEventListener("load", () => setTimeout(go, 300), { once: true });

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  onPauseChange((p) => (p ? stop() : start()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      onScreen ? start() : stop();
    }, { threshold: 0.05 }).observe(root);
  }
}
