/* 02 Certifications and customers. Content: CERT_LINE, CERTS, CREDENTIALS, CUSTOMERS (content.ts).
   Customers are names only: logo permission is unconfirmed (Q20), so there are no logos.
   Placement decision (docs/HOMEPAGE.md): the Maryland certification (heading, badges, certificate number)
   is kept apart from the veteran-owned self-description (its own ruled line at the end of the section)
   and from the CAGE code (a registration identifier, shown with UEI and NAICS). Server component. */
import { CERT_LINE, CERTS, CREDENTIALS as C, CUSTOMERS } from "@/content/content";
import s from "./home.module.css";

export default function Certifications() {
  return (
    <section className={`${s.p2sec} ${s.certs}`} id="certifications" aria-labelledby="certs-title">
      <div className={s.col}>
        <h2 className={`${s.certsLine} type-display`} id="certs-title">
          Certified in <span className={s.hi}>Maryland</span>
        </h2>
        <ul className={s.certsBadges}>
          {CERTS.map((c) => (
            <li className={s.badge} key={c.code}>
              <span className={s.badgeSeal} role="img" aria-label={c.name}>
                <span className={s.code}>{c.code}</span>
              </span>
              <span className={s.badgeName}>{c.name}</span>
            </li>
          ))}
        </ul>
        <p className={`type-caps ${s.certsSub}`}>Past &amp; current customers</p>
        <ul className={s.customers}>
          {CUSTOMERS.map((c) => (
            <li className={s.cust} key={c.name}>
              <div className={`${s.custLogo} ${s.custLogoName}`}>
                <span>{c.name}</span>
              </div>
              {c.status ? <span className={s.custTag}>{c.status === "current" ? "Current" : "Past"}</span> : null}
            </li>
          ))}
        </ul>
        <p className={s.certsNote}>{`Certified by the ${C.certifier} · No. ${C.certNo} · since ${C.since}.`}</p>
        <p className={s.certsIds}>{`CAGE ${C.cage} · UEI ${C.uei} · NAICS ${C.naics.map((n) => n.code).join(", ")}`}</p>
        <p className={`type-caps ${s.ownership}`}>{CERT_LINE.text}</p>
      </div>
    </section>
  );
}
