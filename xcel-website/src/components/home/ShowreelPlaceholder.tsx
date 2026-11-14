/* TEMPORARY placeholder for the scroll-driven showreel (a later stage). It only holds the place and the
   #services anchor; there is no animation, scene or media here. Server component. */
import s from "./ShowreelPlaceholder.module.css";

export default function ShowreelPlaceholder() {
  return (
    <section className={s.reel} id="services" aria-label="What we do" data-showreel-placeholder>
      <p className={`type-caps ${s.label}`}>Showreel: built in a later stage</p>
    </section>
  );
}
