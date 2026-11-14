/* Placeholder for an image or video the client will supply.
   The big label says exactly what goes in this slot. */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const TAGS = { photo: "Photo", video: "▶ Video", logo: "Logo", badge: "Badge art", loop: "Photo or short loop" };

export function ph({ kind = "photo", what = "", note = "", tone = "", top = false, src = "", alt = "", pos = "", video = "", webm = true, quiet = false } = {}) {
  // a slot still waiting for its photo: the brand mark on graphite, with no label or internal note
  if (quiet) return `<div class="ph ph--quiet${tone ? ` ph--${tone}` : ""}" aria-hidden="true"><svg class="ph-mark"><use href="#i-mark"/></svg></div>`;
  // a real clip (name in assets/video/, with .webm (optional: webm: false), .mp4 and -poster.webp) fills a video slot.
  // It is muted, looping and decorative; js/video.js plays it only while it is on screen.
  if (video) {
    const b = `assets/video/${esc(video)}`;
    return `<div class="ph ph--img ph--vid"><video muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1" data-vid poster="${b}-poster.webp">${webm ? `<source src="${b}.webm" type="video/webm">` : ""}<source src="${b}.mp4" type="video/mp4"></video></div>`;
  }
  // a real image fills the same slot the placeholder would have filled
  if (src) {
    return `<div class="ph ph--img"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" draggable="false"${pos ? ` style="object-position:${esc(pos)}"` : ""}></div>`;
  }
  const tag = TAGS[kind] || kind;
  const cls = ["ph", kind === "video" ? "ph--video" : "", tone ? `ph--${tone}` : "", top ? "ph--top" : ""].filter(Boolean).join(" ");
  return `<div class="${cls}" role="img" aria-label="${esc(tag)} placeholder: ${esc(what)}">` +
    `<span class="ph-tag">${esc(tag)} · your asset</span>` +
    `<span class="ph-what">${esc(what)}</span>` +
    (note ? `<span class="ph-note">${esc(note)}</span>` : "") +
    `</div>`;
}

export { esc };
