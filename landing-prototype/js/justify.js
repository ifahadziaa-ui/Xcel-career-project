/* =====================================================================
   Justify only where it looks right.
   Candidates (.pg-intro, .pg-lead, .acc .a) start left-aligned. For each one
   the paragraph is laid out in a hidden copy with the same font and width,
   justified and hyphenated; if every stretched word gap stays within MAX times
   a normal space, the paragraph gets .just-fit (css/base.css). It is checked
   again when the width changes, when fonts load and when an FAQ item opens.
   Cards, steps, notes and showreel text are never candidates: at their short
   lengths justification stretches the gaps 2x to 7x.
   ===================================================================== */
const SELECTOR = ".pg-intro, .pg-lead, .acc .a";
const MAX = 1.35;
const MIN_WORDS = 8;

function spaceWidths(el, justify) {
  const cs = getComputedStyle(el);
  const d = document.createElement("div");
  d.lang = "en";
  d.setAttribute("aria-hidden", "true");
  d.style.cssText =
    `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;width:${el.offsetWidth}px;` +
    `font:${cs.font};letter-spacing:${cs.letterSpacing};word-spacing:${cs.wordSpacing};line-height:${cs.lineHeight};` +
    `text-align:${justify ? "justify" : "left"};text-align-last:left;hyphens:${justify ? "auto" : "manual"};` +
    `hyphenate-limit-chars:6 3 3;text-wrap:${justify ? "pretty" : "wrap"};overflow-wrap:break-word`;
  d.textContent = el.textContent.replace(/\s+/g, " ").trim();
  document.body.appendChild(d);
  const node = d.firstChild, t = node.textContent, out = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== " ") continue;
    const r = document.createRange();
    r.setStart(node, i); r.setEnd(node, i + 1);
    const b = r.getBoundingClientRect();
    out.push({ w: b.width, top: Math.round(b.top) });
  }
  d.remove();
  return out;
}

function fits(el) {
  if (!el.offsetWidth || el.textContent.trim().split(/\s+/).length < MIN_WORDS) return false;
  const plain = spaceWidths(el, false);
  if (!plain.length) return false;
  const base = plain.reduce((a, s) => a + s.w, 0) / plain.length;
  const just = spaceWidths(el, true);
  const last = Math.max(...just.map((s) => s.top));
  const body = just.filter((s) => s.top < last - 2); // every line but the last
  if (!body.length) return false; // one line: nothing to justify
  return Math.max(...body.map((s) => s.w)) / base <= MAX;
}

export function initJustify(root = document) {
  const apply = () => root.querySelectorAll(SELECTOR).forEach((el) => {
    // measure the unjustified paragraph, so the result does not depend on the last pass
    el.classList.remove("just-fit");
    el.classList.toggle("just-fit", fits(el));
  });
  let raf = 0, w = innerWidth;
  const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
  addEventListener("resize", () => { if (innerWidth !== w) { w = innerWidth; later(); } });
  document.addEventListener("toggle", later, true); // FAQ items measure 0 while closed
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(later);
  later();
}
