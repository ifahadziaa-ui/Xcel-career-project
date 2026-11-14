/* 05 Example roles: the five-card fan. Content: JOBS, FEATURED_JOB, JOBS_NOTE. The roles are examples
   (each card says so), not openings. Photos: only those approved in media.ts; the others keep the placeholder.
   Server component. */
import type { CSSProperties } from "react";
import { FEATURED_JOB, JOBS, JOBS_NOTE, type Job } from "@/content/content";
import { routeFor } from "@/content/routes";
import MediaSlot from "./MediaSlot";
import { JOB_PHOTOS } from "./media";
import { ButtonLink, Eyebrow } from "./parts";
import s from "./home.module.css";

// desktop/tablet positions in % of the 1232-wide fan (cqw); mobile in % of the 350 column
const FAN = [
  { cls: s.fanCardFar, l: 4.71, t: 9.86, w: 19.16, r: -16, ml: 0, mt: 0, mw: 0 },
  { cls: s.fanCardFar, l: 76.14, t: 9.86, w: 19.16, r: 16, ml: 0, mt: 0, mw: 0 },
  { cls: s.fanCardSide, l: 19.89, t: 3.57, w: 21.92, r: -8, ml: 2.43, mt: 10.3, mw: 36.6 },
  { cls: s.fanCardSide, l: 58.2, t: 3.57, w: 21.92, r: 8, ml: 61.3, mt: 10.3, mw: 36.6 },
  { cls: s.fanCardCentre, l: 37.62, t: 0, w: 24.84, r: 1.5, ml: 31.7, mt: 2.1, mw: 36.6 },
];
const FAN_JOB = [0, 4, 1, 3, FEATURED_JOB]; // which job sits in which slot; centre = featured

function JobCard({ j }: { j: Job }) {
  return (
    <div className={s.jobcard}>
      <div className={s.jcIn}>
        <div className={s.jcTop}>
          <span className={s.jcFn}>
            <span className={s.jcFnName}>{j.fn}</span>
            <span className={s.jcEx}>Example</span>
          </span>
          <svg className={s.jcX} aria-hidden="true">
            <use href="#i-mark" />
          </svg>
        </div>
        <div className={s.jcArt}>
          <MediaSlot image={JOB_PHOTOS[j.id]} sizes="(max-width: 699px) 36vw, 22vw" />
        </div>
        <h3 className={s.jcTitle}>{j.title}</h3>
        <p className={s.jcMeta}>{j.where}</p>
        <p className={s.jcStats}>
          <span>
            {j.need[0]} <b>{j.need[1]}</b>
          </span>
          <span>
            <b>{j.type}</b>
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Jobs() {
  const fj = JOBS[FEATURED_JOB];
  const pairs: Array<readonly [string, string]> = [["Role", fj.title], fj.need, ["Location", fj.where], ["Type", fj.type]];
  return (
    <section className={`${s.p2sec} ${s.jobs}`} id="jobs" aria-labelledby="jobs-title">
      <div className={s.col}>
        <div className={`${s.jobsHead} ${s.center}`}>
          <Eyebrow>for candidates</Eyebrow>
          <h2 className={`${s.hl} type-display`} id="jobs-title">
            <span className={s.hlRow}>
              <span className={s.l}>Example</span>
              <span className={s.mark}>roles</span>
            </span>
          </h2>
          <div className={s.note}>
            <p>{JOBS_NOTE}</p>
          </div>
        </div>
        <div className={s.fan}>
          {FAN.map((f, i) => (
            <div
              key={i}
              className={`${s.fanCard} ${f.cls}`}
              style={{ "--l": f.l, "--t": f.t, "--w": f.w, "--r": `${f.r}deg`, "--ml": f.ml, "--mt": f.mt, "--mw": f.mw } as CSSProperties}
            >
              <div className={s.cardRot}>
                <JobCard j={JOBS[FAN_JOB[i]]} />
              </div>
            </div>
          ))}
        </div>
        <p className={`${s.plateStats} type-caps`}>
          {pairs.map(([k, v]) => (
            <span className={s.pair} key={k}>
              {k} <span className={s.v}>{v}</span>
            </span>
          ))}
        </p>
        <div className={s.jobsCta}>
          <ButtonLink href={routeFor("jobs.html") ?? "/jobs"}>See example roles</ButtonLink>
        </div>
      </div>
    </section>
  );
}
