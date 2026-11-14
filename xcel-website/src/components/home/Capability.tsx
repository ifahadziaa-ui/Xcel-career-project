/* 06 Capability statement: the light paper poster. Content: CAPABILITY, CREDENTIALS.pdf (the capability
   page: there is no PDF yet). The cover image is a MediaSlot until the media stage. Server component. */
import { CAPABILITY, CREDENTIALS } from "@/content/content";
import { routeFor } from "@/content/routes";
import MediaSlot from "./MediaSlot";
import { ButtonLink, Eyebrow } from "./parts";
import s from "./home.module.css";

export default function Capability() {
  return (
    <section className={`${s.p2sec} ${s.tit}`} id="capability" aria-labelledby="tit-title">
      <article className={s.poster}>
        <div className={s.pHead}>
          <Eyebrow>contract-ready</Eyebrow>
          <h2 className={`type-display ${s.pTitle}`} id="tit-title">
            Capability
          </h2>
          <span className={s.mark}>statement</span>
        </div>
        <div className={s.pCard}>
          <div className={s.cardRot}>
            <div className={s.cardArt}>
              <MediaSlot tone="light" />
            </div>
          </div>
        </div>
        <ul className={s.points}>
          {CAPABILITY.points.map((p) => (
            <li key={p}>
              <span className={s.bul} aria-hidden="true" />
              <p>{p}</p>
            </li>
          ))}
        </ul>
        <div className={s.pCta}>
          <ButtonLink href={routeFor(CREDENTIALS.pdf) ?? "/capability"}>Capability statement</ButtonLink>
        </div>
        <p className={`type-caps ${s.pMeta}`}>
          {CAPABILITY.meta[0]}
          {"  ·  "}
          <span className={s.v}>{CAPABILITY.meta[1]}</span>
        </p>
      </article>
    </section>
  );
}
