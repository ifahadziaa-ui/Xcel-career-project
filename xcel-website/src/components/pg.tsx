/* Shared pieces for the inner pages (server components). Class names are the prototype's
   (styles/pages.css), so the pages look the same. */
import Link from "next/link";
import type { ReactNode } from "react";
import { CERTS, CONTACT, CREDENTIALS } from "@/content/content";

export const tel = "tel:+1" + CONTACT.phone.replace(/\D/g, "");

export const Arrow = () => (
  <svg aria-hidden="true"><use href="#i-arrow" /></svg>
);

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="eyebrow type-caps" data-r="0"><span className="dot" aria-hidden="true" />{children}</p>
);

/* headline lines; the last one is the red accent, like CARE in the hero */
export const Headline = ({ lines, as: Tag = "h1" }: { lines: readonly string[]; as?: "h1" | "h2" }) => (
  <Tag className="hl type-display pg-hl" data-r="1">
    {lines.map((l, i) =>
      i === lines.length - 1 ? <span key={l} className="mark">{l}</span> : <span key={l} className="l">{l}</span>,
    )}
  </Tag>
);

export const Btn = ({ href, children, ghost = false }: { href: string; children: ReactNode; ghost?: boolean }) => (
  <Link className={`btn${ghost ? " btn--ghost" : ""}`} href={href}>{children}<Arrow /></Link>
);

export const CallLink = () => (
  <a className="pg-call" href={tel}>or call <b>{CONTACT.phone}</b></a>
);

export const SectionHead = ({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) => (
  <div className="pg-head">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="pg-h2" data-r="1">{title}</h2>
    {note ? <p className="pg-lead" data-r="2">{note}</p> : null}
  </div>
);

export const Notice = ({ tag = "Sample", children }: { tag?: string; children: ReactNode }) => (
  <p className="pg-notice" data-r="0"><span className="tag">{tag}</span>{children}</p>
);

export function PageHero({ eyebrow, title, intro, actions }: { eyebrow: string; title: readonly string[]; intro?: string; actions?: ReactNode }) {
  return (
    <section className="pg-hero">
      <div className="pg-wrap">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Headline lines={title} />
        {intro ? <p className="pg-intro" data-r="2">{intro}</p> : null}
        {actions ? <div className="pg-actions" data-r="3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function AskBand({ title, lead, cta, href }: { title: readonly string[]; lead: string; cta: string; href: string }) {
  return (
    <section className="pg-sec pg-ask">
      <div className="pg-wrap pg-ask-in">
        <div>
          <Headline lines={title} as="h2" />
          <p className="pg-lead" data-r="2">{lead}</p>
        </div>
        <div className="pg-actions" data-r="3"><Btn href={href}>{cta}</Btn><CallLink /></div>
      </div>
    </section>
  );
}

export const CredStrip = () => (
  <ul className="pg-creds" data-r="1">
    {CERTS.map((c) => (
      <li key={c.code}><b>{c.code}</b><span>{c.name}</span></li>
    ))}
    <li><b>No. {CREDENTIALS.certNo}</b><span>Maryland, since {CREDENTIALS.since}</span></li>
    <li><b>CAGE</b><span>{CREDENTIALS.cage}</span></li>
    <li><b>UEI</b><span>{CREDENTIALS.uei}</span></li>
  </ul>
);

/* a labelled placeholder where a real photo will go (the prototype's .ph) */
export const Ph = ({ what, note }: { what: string; note?: string }) => (
  <div className="ph" role="img" aria-label={`Photo placeholder: ${what}`}>
    <span className="ph-tag">Photo · your asset</span>
    <span className="ph-what">{what}</span>
    {note ? <span className="ph-note">{note}</span> : null}
  </div>
);
