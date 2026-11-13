/* =====================================================================
   SHARED ICONS: injected into every page before anything renders.
   Holds the XcelCareers mark (#i-mark), traced from Assets/Logo.png:
   head, body and nine blades in spiral order around the hub. Recolour per
   use with --mk-fig (figure), --mk-ray (blades, defaults to currentColor)
   and --mk-o1..3 (blade tones). js/mark.js reads the geometry from it.
   ===================================================================== */
const SPRITE = `<svg id="xc-sprite" width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-arrow" viewBox="0 0 26 16"><path d="M1 8 H23 M16 1.5 L23.5 8 L16 14.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square"/></symbol>
  <symbol id="i-plus" viewBox="0 0 18 18"><path d="M9 1 V17 M1 9 H17" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-close" viewBox="0 0 18 18"><path d="M2 2 L16 16 M16 2 L2 16" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-spark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z"/></symbol>
  <!-- XcelCareers mark, traced from Assets/Logo.png (head, body, nine blades in spiral order around the hub).
       Recolour per use with --mk-fig (figure), --mk-ray (blades, defaults to currentColor) and --mk-o1..3 (blade tones).
       js/mark.js reads this symbol; this file is the single source of the mark's geometry. -->
  <symbol id="i-mark" viewBox="4 120.04 89.03 158.95" data-hub="69.08 242.24"><g style="fill:var(--mk-ray,currentColor)"><polygon class="mk-ray" data-g="1" points="10.93,187.17 62.1,232.65 42.88,166.96" style="fill-opacity:var(--mk-o1,1)"/><polygon class="mk-ray" data-g="1" points="5,228.45 59.52,237.63 18.23,200.94" style="fill-opacity:var(--mk-o1,1)"/><polygon class="mk-ray" data-g="1" points="18.96,260.85 60.12,243.59 16.11,236.38" style="fill-opacity:var(--mk-o1,1)"/><polygon class="mk-ray" data-g="2" points="42.1,277.18 62.68,247.62 29.55,261.71" style="fill-opacity:var(--mk-o2,.74)"/><polygon class="mk-ray" data-g="2" points="65,277.99 66.51,249.16 49.94,272.86" style="fill-opacity:var(--mk-o2,.74)"/><polygon class="mk-ray" data-g="2" points="82.49,268.53 71.19,248.77 70.02,271.65" style="fill-opacity:var(--mk-o2,.74)"/><polygon class="mk-ray" data-g="3" points="90.58,255.13 74.3,246.41 83.47,262.43" style="fill-opacity:var(--mk-o3,.52)"/><polygon class="mk-ray" data-g="3" points="90.61,241.74 76.03,243.21 89.02,249.88" style="fill-opacity:var(--mk-o3,.52)"/><polygon class="mk-ray" data-g="3" points="85.32,232.77 75.77,239.88 87.55,238.8" style="fill-opacity:var(--mk-o3,.52)"/></g><g style="fill:var(--mk-fig,#ff2a45)"><circle class="mk-head" cx="68.6" cy="130.91" r="9.87"/><polygon class="mk-body" points="45.15,148.96 92.03,148.96 68.62,230.36"/></g></symbol>
</svg>`;

if (!document.getElementById("xc-sprite")) document.body.insertAdjacentHTML("afterbegin", SPRITE);
