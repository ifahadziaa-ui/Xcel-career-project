/* 07 On the record: four stat placards and the ledger. Content: STICKERS, LEDGER. Server component. */
import { LEDGER, STICKERS } from "@/content/content";
import { Eyebrow } from "./parts";
import s from "./home.module.css";

const Lbl = ({ t }: { t: string }) => <span className={s.stkLbl}>{t}</span>;
const Val = ({ t }: { t: string }) => <span className={s.stkVal}>{t}</span>;

export default function Record() {
  const { paper, accent, dark, ring } = STICKERS;
  return (
    <section className={`${s.p2sec} ${s.record}`} id="record" aria-labelledby="record-title">
      <div className={s.col}>
        <Eyebrow>on the record</Eyebrow>
        <h2 className={`${s.hl} type-display`} id="record-title">
          <span className={s.l}>Everything is</span>
          <span className={s.hlRow}>
            <span className={s.l}>on the</span>
            <span className={s.mark}>record</span>
          </span>
        </h2>
        <div className={s.stickers}>
          <div className={s.stkPaper}>
            <div className={s.stkIn}><Lbl t={paper.label} /><Val t={paper.value} /></div>
          </div>
          <div className={s.stkAccent}>
            <div className={s.stkIn}><Lbl t={accent.label} /><Val t={accent.value} /></div>
          </div>
          <div className={s.stkDark}>
            <div className={s.stkIn}><Lbl t={dark.label} /><Val t={dark.value} /></div>
          </div>
          <div className={s.stkRing}>
            <div className={s.stkIn}><Val t={ring.value} /><Lbl t={ring.label} /></div>
          </div>
        </div>
        <ul className={s.ledger}>
          {LEDGER.map((r) => (
            <li key={r.title}>
              <span className={`type-caps ${s.lgDate}`}>{r.date}</span>
              <span className={`type-caps ${s.lgTitle}`}>{r.title}</span>
              <span className={`type-caps ${s.lgRef}`}>{r.ref}</span>
              <span className={s.lgStampBox}>
                <span className={`type-display ${s.lgStamp}`}>{r.stamp}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
