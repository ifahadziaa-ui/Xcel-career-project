/* MediaSlot: the one place the homepage marks "a photo or clip goes here". It fills its positioned
   parent. The media stage replaces its body with the real <Image>/<video>; callers do not change.
   Decorative, hidden from assistive technology. Server component. */
import s from "./MediaSlot.module.css";

export default function MediaSlot({ tone }: { tone?: "light" }) {
  return (
    <div className={`${s.slot} ${tone === "light" ? s.light : ""}`} aria-hidden="true">
      <svg className={s.mark}>
        <use href="#i-mark" />
      </svg>
    </div>
  );
}
