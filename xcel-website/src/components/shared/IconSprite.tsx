/* =====================================================================
   SHARED ICON SPRITE, rendered once at the top of <body> in the root layout.
   Ported from landing-prototype-clean/js/sprite.js: same symbol ids, same geometry.
   Use with  <svg aria-hidden="true"><use href="#i-mark" /></svg>.

   #i-mark is the XcelCareers mark (head, body and nine blades in spiral order around
   the hub). Recolour per use with --mk-fig (figure), --mk-ray (blades, defaults to
   currentColor) and --mk-o1..3 (blade tones). The geometry itself lives in lib/mark/geometry.ts
   (the single source, also used by the showreel); this file only draws it into the symbol.
   Server component: no browser APIs.
   ===================================================================== */

import {
  MARK_BODY_POINTS,
  MARK_HEAD,
  MARK_HUB_ATTR,
  MARK_RAYS,
  MARK_VIEWBOX,
} from "@/lib/mark/geometry";

export const ICON_IDS = ["i-arrow", "i-plus", "i-close", "i-spark", "i-mark"] as const;
export type IconId = (typeof ICON_IDS)[number];

export default function IconSprite() {
  return (
    <svg id="xc-sprite" width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-arrow" viewBox="0 0 26 16">
        <path
          d="M1 8 H23 M16 1.5 L23.5 8 L16 14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
        />
      </symbol>
      <symbol id="i-plus" viewBox="0 0 18 18">
        <path d="M9 1 V17 M1 9 H17" fill="none" stroke="currentColor" strokeWidth="2" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 18 18">
        <path d="M2 2 L16 16 M16 2 L2 16" fill="none" stroke="currentColor" strokeWidth="2" />
      </symbol>
      <symbol id="i-spark" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z"
        />
      </symbol>
      <symbol id="i-mark" viewBox={MARK_VIEWBOX} data-hub={MARK_HUB_ATTR}>
        <g style={{ fill: "var(--mk-ray,currentColor)" }}>
          {MARK_RAYS.map(({ g, o, points }) => (
            <polygon
              key={points}
              className="mk-ray"
              data-g={g}
              points={points}
              style={{ fillOpacity: `var(--mk-o${g},${o})` }}
            />
          ))}
        </g>
        <g style={{ fill: "var(--mk-fig,#ff2a45)" }}>
          <circle className="mk-head" cx={MARK_HEAD.cx} cy={MARK_HEAD.cy} r={MARK_HEAD.r} />
          <polygon className="mk-body" points={MARK_BODY_POINTS} />
        </g>
      </symbol>
    </svg>
  );
}
