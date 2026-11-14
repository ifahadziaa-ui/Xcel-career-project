/* Light markdown for bot text: paragraphs, lists, **bold**, linked email and phone.
   Ported from landing-prototype-clean/js/chat.js. Everything is escaped first, so the
   returned HTML only contains the tags built here. Pure: no DOM. */
import { esc, TEL } from "./brain";
import { CONTACT } from "@/content/content";

const PHONE_RE = new RegExp(`\\b(${TEL.slice(0, 3)}[.\\s-]?${TEL.slice(3, 6)}[.\\s-]?${TEL.slice(6)})\\b`, "g");

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\b([\w.+-]+@[\w-]+\.[\w.-]*\w)\b/g, '<a href="mailto:$1">$1</a>')
    .replace(PHONE_RE, `<a href="tel:${TEL}">$1</a>`);
}

export function md(src: string): string {
  const out: string[] = [];
  let para: string[] = [], list: string[] = [];
  const flushP = () => { if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`); para = []; };
  const flushL = () => { if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; };
  for (const raw of String(src).replace(/\r/g, "").split("\n")) {
    const line = raw.trim().replace(/^#{1,6}\s+/, "");
    const item = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (!line) { flushP(); flushL(); }
    else if (item) { flushP(); list.push(item[1]); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return out.join("");
}

/* while text is still arriving, close a dangling ** so it never flashes */
export const closeBold = (s: string): string => ((s.match(/\*\*/g) || []).length % 2 ? s + "**" : s);

export const PHONE_TEXT = CONTACT.phone;
