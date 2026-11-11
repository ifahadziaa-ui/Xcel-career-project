import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

/**
 * Hero copy lives here so it can be swapped without touching layout.
 * Everything below mirrors the reference design ("Actual hero page design").
 */
const content = {
  brand: "VESSEL",
  nav: [
    { label: "The Piece", href: "#the-piece" },
    { label: "Label", href: "#label" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Enquire", href: "#enquire" },
  ],
  status: "Not for sale",
  specIndex: "Spec. 001",
  vitals: "72 BPM",
  sealed: "Sealed / 2026",
  specimen: { prefix: "Specimen", number: "001", suffix: "· Held, not listed" },
  headline: { lines: ["Kept", "Never"], last: "For", accent: "Sale" },
  placard: [
    { term: "Medium", value: "Human heart, glass, light" },
    { term: "Dimensions", value: "24 × 34 × 60 cm" },
    { term: "Edition", value: "1 of 1" },
    { term: "Status", value: "Held, not listed", accent: true },
  ],
  // Placeholder centrepiece. Replace this file (or swap this block for the
  // 3D scene) without changing anything else in the hero.
  centrepiece: {
    src: "/hero/specimen-placeholder.png",
    alt: "Anatomical heart suspended inside a glass vitrine",
  },
};

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo} aria-label={`${content.brand} home`}>
            {content.brand}
            <span className={styles.reg} aria-hidden="true">
              ®
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Primary">
            <ul>
              {content.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.status}>{content.status}</p>
        </header>

        <div className={styles.metaTop}>
          <p className={`${styles.meta} ${styles.specIndex}`}>{content.specIndex}</p>
          <p className={`${styles.meta} ${styles.vitals}`}>{content.vitals}</p>
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
              {content.specimen.prefix}{" "}
              <span className={styles.red}>{content.specimen.number}</span>{" "}
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
              {content.headline.last}{" "}
              <span className={styles.accent}>{content.headline.accent}</span>
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
