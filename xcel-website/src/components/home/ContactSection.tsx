/* 09 Contact: headline, the request form and the contact line (CONTACT in content.ts).
   The photo card is a MediaSlot until the real client-services photo is supplied. Server component around a client form. */
import { CONTACT } from "@/content/content";
import { routeFor } from "@/content/routes";
import ContactForm from "./ContactForm";
import MediaSlot from "./MediaSlot";
import { Eyebrow } from "./parts";
import s from "./home.module.css";

export default function ContactSection() {
  return (
    <div className={s.joinWrap}>
      <section className={`${s.p2sec} ${s.join}`} id="contact" aria-labelledby="join-title">
        <div className={s.col}>
          <Eyebrow>get in touch</Eyebrow>
          <h2 className={`${s.hl} type-display`} id="join-title">
            <span className={s.l}>Tell us who</span>
            <span className={s.hlRow}>
              <span className={s.l}>you</span>
              <span className={s.mark}>need</span>
            </span>
          </h2>
          <ContactForm action={routeFor("contact.html") ?? "/contact"} />
          <p className={`type-caps ${s.joinFine}`}>
            {`Call ${CONTACT.phone}  ·  ${CONTACT.email}\n${CONTACT.name}, ${CONTACT.title}`}
          </p>
        </div>
        <div className={s.joinCard}>
          <div className={s.cardRot}>
            <div className={s.cardArt}>
              <MediaSlot />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
