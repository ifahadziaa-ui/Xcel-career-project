/* MediaSlot: fills its positioned parent. Without an image it is the quiet placeholder (the mark on
   graphite or paper). With an approved image (media.ts) the photograph covers it with next/image:
   object-fit cover and the prototype's object-position, so the slot's box never changes (no layout
   shift); lazy-loaded unless priority is set; sizes tell the browser the rendered width. The caller
   owns the alt text (empty for decorative photographs). Server component. */
import Image from "next/image";
import type { MediaImage } from "./media";
import s from "./MediaSlot.module.css";

export default function MediaSlot({ tone, image, sizes }: { tone?: "light"; image?: MediaImage; sizes?: string }) {
  return (
    <div className={`${s.slot} ${tone === "light" ? s.light : ""}`} aria-hidden={image?.alt ? undefined : true}>
      <svg className={s.mark} aria-hidden="true">
        <use href="#i-mark" />
      </svg>
      {image ? (
        <Image className={s.photo} src={image.src} alt={image.alt} fill sizes={sizes} style={{ objectPosition: image.position }} />
      ) : null}
    </div>
  );
}
