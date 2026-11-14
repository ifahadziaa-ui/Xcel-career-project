/* 04 How we staff: four steps. Content: STEPS, PROCESS_SPLIT. Server component. */
import { PROCESS_SPLIT, STEPS } from "@/content/content";
import { Eyebrow } from "./parts";
import s from "./home.module.css";

export default function Process() {
  return (
    <section className={`${s.p2sec} ${s.process}`} id="process" aria-labelledby="process-title">
      <div className={s.col}>
        <Eyebrow>how we staff</Eyebrow>
        <h2 className={`${s.hl} type-display`} id="process-title">
          <span className={s.l}>From open role</span>
          <span className={s.hlRow}>
            <span className={s.l}>to</span>
            <span className={s.mark}>day one</span>
          </span>
        </h2>
        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <article className={s.step}>
                <div className={s.stepTop}>
                  <p className={`type-display ${s.stepNum}`} aria-hidden="true">{`0${i + 1}`}</p>
                </div>
                <h3 className="type-display">{st.title}</h3>
                <p className={s.txt}>{st.text}</p>
                <p className={`type-caps ${s.stats}`}>
                  {st.stats.map(([k, v], j) => (
                    <span key={k}>
                      {j > 0 ? "   " : null}
                      {k} <span className={s.v}>{v}</span>
                    </span>
                  ))}
                </p>
              </article>
            </li>
          ))}
        </ol>
        <div className={`${s.note} ${s.processSplit}`}>
          <p>{PROCESS_SPLIT}</p>
        </div>
      </div>
    </section>
  );
}
