/* 08 FAQ: native <details name="faq"> (one open at a time, keyboard and screen-reader support built in,
   no JavaScript). Content: FAQ, FAQ_NOTE. Server component. */
import { FAQ, FAQ_NOTE } from "@/content/content";
import { Eyebrow } from "./parts";
import s from "./home.module.css";

export default function Faq() {
  return (
    <section className={`${s.p2sec} ${s.faqSec}`} id="faq" aria-labelledby="faq-title">
      <div className={`${s.col} ${s.faq}`}>
        <div className={s.faqLeft}>
          <Eyebrow>common questions</Eyebrow>
          <h2 className={`${s.hl} type-display`} id="faq-title">
            <span className={s.l}>Before</span>
            <span className={s.hlRow}>
              <span className={s.l}>you</span>
              <span className={s.mark}>call</span>
            </span>
          </h2>
          <div className={s.note}>
            <p>{FAQ_NOTE}</p>
          </div>
        </div>
        <div className={s.acc}>
          {FAQ.map((f, i) => (
            <details name="faq" key={f.id} open={i === 0}>
              <summary>
                <span className={`type-caps ${s.q}`}>{f.q}</span>
                <svg className={s.ico} aria-hidden="true">
                  <use className={s.plus} href="#i-plus" />
                  <use className={s.minus} href="#i-close" />
                </svg>
              </summary>
              <p className={s.a}>{f.a}</p>
              {f.tags ? (
                <ul className={s.aTags} aria-label="Examples">
                  {f.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
