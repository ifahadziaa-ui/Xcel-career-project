/* Placeholder for an image or video the client will supply.
   The big label says exactly what goes in this slot. */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const TAGS = { photo: "Photo", video: "▶ Video", logo: "Logo", badge: "Badge art", loop: "Photo or short loop" };

export function ph({ kind = "photo", what = "", note = "", tone = "", top = false, src = "", alt = "", pos = "" } = {}) {
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
