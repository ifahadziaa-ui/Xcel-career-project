/* =====================================================================
   The XcelCareers mark: the single source of its geometry (traced from Assets/Logo.png;
   units are pixels of that 400 px file). Plain data and pure functions, no DOM, safe on the
   server.

   Used by:
   - IconSprite (the #i-mark symbol every small mark in the page references);
   - the showreel's server markup (the SVG "zoom" mark of card 03) and, in later stages, its
     engine and the 3D mark. The prototype read this geometry back out of the sprite's DOM
     (js/mark.js readMark()); reading it from here is the same numbers without the DOM.
   ===================================================================== */

export type MarkPoint = readonly [number, number];

export interface MarkRay {
  /** tone group: 1 (brightest) to 3 */
  g: 1 | 2 | 3;
  /** default fill opacity of the group, as the sprite writes it */
  o: string;
  /** the polygon's `points` attribute, as the sprite writes it */
  points: string;
  pts: readonly MarkPoint[];
}

const parse = (s: string): MarkPoint[] =>
  s
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return [x, y] as const;
    });

/** blades in spiral order, biggest first */
const RAY_DATA: ReadonlyArray<readonly [1 | 2 | 3, string, string]> = [
  [1, "1", "10.93,187.17 62.1,232.65 42.88,166.96"],
  [1, "1", "5,228.45 59.52,237.63 18.23,200.94"],
  [1, "1", "18.96,260.85 60.12,243.59 16.11,236.38"],
  [2, ".74", "42.1,277.18 62.68,247.62 29.55,261.71"],
  [2, ".74", "65,277.99 66.51,249.16 49.94,272.86"],
  [2, ".74", "82.49,268.53 71.19,248.77 70.02,271.65"],
  [3, ".52", "90.58,255.13 74.3,246.41 83.47,262.43"],
  [3, ".52", "90.61,241.74 76.03,243.21 89.02,249.88"],
  [3, ".52", "85.32,232.77 75.77,239.88 87.55,238.8"],
];

export const MARK_RAYS: readonly MarkRay[] = RAY_DATA.map(([g, o, points]) => ({ g, o, points, pts: parse(points) }));

export const MARK_BODY_POINTS = "45.15,148.96 92.03,148.96 68.62,230.36";
export const MARK_BODY: readonly MarkPoint[] = parse(MARK_BODY_POINTS);
export const MARK_HEAD = { cx: 68.6, cy: 130.91, r: 9.87 } as const;

/** the empty centre the nine blades and the body all point at */
export const MARK_HUB: MarkPoint = [69.08, 242.24];
/** the symbol's viewBox, as the sprite writes it */
export const MARK_VIEWBOX = "4 120.04 89.03 158.95";
export const MARK_HUB_ATTR = "69.08 242.24";

const all = [...MARK_RAYS.flatMap((r) => r.pts), ...MARK_BODY];
const x0 = Math.min(...all.map((p) => p[0]), MARK_HEAD.cx - MARK_HEAD.r);
const x1 = Math.max(...all.map((p) => p[0]), MARK_HEAD.cx + MARK_HEAD.r);
const y0 = Math.min(...all.map((p) => p[1]), MARK_HEAD.cy - MARK_HEAD.r);
const y1 = Math.max(...all.map((p) => p[1]));

/** bounding box of the whole mark (same maths as the prototype's readMark()) */
export const MARK_BOX = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 } as const;

/** radius of the empty hub: the distance from the hub to the nearest point of any blade or the body */
export const MARK_HOLE = Math.min(...all.map((p) => Math.hypot(p[0] - MARK_HUB[0], p[1] - MARK_HUB[1])));
