/* =====================================================================
   Homepage hero: the cleaned prototype's hero (landing-prototype-clean/index.html, "01 HERO").
   The layout is the original Next hero design (hero.module.css); the copy is XcelCareers'.
   The navigation bar is the shared SiteHeader in the root layout, so there is none here.
   data-chat-hero keeps the chat launcher out of the placard's corner while the hero is on screen
   (contract in docs/SHELL.md). Server component.
   ===================================================================== */
import Image from "next/image";
import { CREDENTIALS } from "@/content/content";
import styles from "./hero.module.css";

// Hero wording from the cleaned prototype's index.html. Facts (CAGE, certificate) come from content.ts.
const content = {
  meta: { left: "Dayton, MD", right: "MD · DC · VA" },
  sealed: `CAGE / ${CREDENTIALS.cage}`,
  specimen: { prefix: "Cert.", number: CREDENTIALS.certNo, suffix: "· MBE · DBE · SBE" },
  headline: { lines: ["People", "Behind"], last: "The", accent: "Care" },
  placard: [
    { term: "Focus", value: "Healthcare staffing" },
    { term: "Contracts", value: "Local · State · Federal" },
    { term: "Specialty", value: "IT · Finance · Cyber" },
    { term: "Status", value: "Accepting requests", accent: true },
  ],
  centrepiece: {
    src: "/hero/specimen-placeholder.png",
    alt: "A human heart held in a glass case",
  },
};

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" id="top" data-chat-hero>
      <div className={styles.stage}>
        <div className={styles.header} aria-hidden="true" />

        <div className={styles.metaTop}>
          <p className={`${styles.meta} ${styles.specIndex}`}>{content.meta.left}</p>
          <p className={`${styles.meta} ${styles.vitals}`}>{content.meta.right}</p>
        </div>

        <div className={styles.centrepiece}>
          <Image
            src={content.centrepiece.src}
            alt={content.centrepiece.alt}
            fill
            sizes="(min-width: 1024px) 37vw, 70vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <p className={`${styles.meta} ${styles.sealed}`}>{content.sealed}</p>

        <div className={styles.titleBlock}>
          <p className={styles.specimen}>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              {content.specimen.prefix} <span className={styles.red}>{content.specimen.number}</span>{" "}
              {content.specimen.suffix}
            </span>
          </p>
          <h1 id="hero-title" className={styles.title}>
            {content.headline.lines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
            <span className={styles.line}>
              {content.headline.last} <span className={styles.accent}>{content.headline.accent}</span>
            </span>
          </h1>
        </div>

        <dl className={styles.placard}>
          {content.placard.map((row) => (
            <div key={row.term} className={styles.row}>
              <dt>{row.term}</dt>
              <dd className={row.accent ? styles.red : undefined}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
