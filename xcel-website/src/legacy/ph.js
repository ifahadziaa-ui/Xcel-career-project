// @ts-nocheck
/* Placeholder for an image or video the client will supply.
   The big label says exactly what goes in this slot. */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const TAGS = { photo: "Photo", video: "▶ Video", logo: "Logo", badge: "Badge art", loop: "Photo or short loop" };

export function ph({ kind = "photo", what = "", note = "", tone = "", top = false, src = "", alt = "", pos = "", video = "" } = {}) {
  // a real clip (name in assets/video/: .mp4, -sm.mp4 for phones and -poster.webp) fills a video slot.
  // It is muted, looping and decorative; js/video.js plays it only while it is on screen.
  // Speed pass (17 Nov 2026): H.264 4:2:0 only (the old 4:4:4 files did not play on iPhone/Safari, and Chrome
  // picked the WebM, which was the larger file); phones get a 960px copy at about 40% of the size.
  if (video) {
    const b = `assets/video/${esc(video)}`;
    return `<div class="ph ph--img ph--vid"><video muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1" data-vid poster="${b}-poster.webp"><source src="${b}-sm.mp4" type="video/mp4" media="(max-width: 700px)"><source src="${b}.mp4" type="video/mp4"></video></div>`;
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
