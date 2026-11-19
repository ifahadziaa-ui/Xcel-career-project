import type { Metadata } from "next";
import { CONTACT, LEADERSHIP } from "@/content/content";
import { ABOUT_PAGE as A } from "@/content/pages-copy";
import { Btn, CredStrip, PageHero, Ph, SectionHead } from "@/components/pg";

export const metadata: Metadata = {
  title: "About",
  description:
    "XcelCareers is a Maryland-based, minority- and veteran-owned business bringing together healthcare, technology, cybersecurity, financial, and program expertise.",
};

const Paras = ({ items }: { items: readonly string[] }) => (
  <>{items.map((t) => <p className="pg-lead" data-r="1" key={t}>{t}</p>)}</>
);

/* Wording supplied by the client (16 Nov 2026); the leadership block and the certification strip stay as they were. */
export default function Page() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow={A.eyebrow}
        title={A.title}
        intro={A.intro}
        actions={<><Btn href="/capability">Explore our capabilities</Btn><Btn href="/contact" ghost>Connect with our team</Btn></>}
      />

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={A.foundation.eyebrow} title={A.foundation.title} />
        <Paras items={A.foundation.paras} />
        <CredStrip />
        <p className="pg-small" data-r="2" style={{ textAlign: "center" }}>Based at {CONTACT.address}.</p>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={A.what.eyebrow} title={A.what.title} note={A.what.intro} />
        <ul className="pg-grid pg-grid--3">
          {A.what.items.map((c, i) => <li className="pg-card" data-r={i % 3} key={c.t}><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ul>
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}><Btn href="/capability">{A.what.cta}</Btn></p>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap pg-split">
        <div>
          <SectionHead eyebrow={A.who.eyebrow} title={A.who.title} note={A.who.lead} />
          <ul className="pg-list" data-r="2">{A.who.list.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
        <div className="pg-panel" data-r="2"><p className="pg-lead" style={{ marginTop: 0 }}>{A.who.closing}</p></div>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={A.how.eyebrow} title={A.how.title} />
        <ul className="pg-grid pg-grid--4">
          {A.how.items.map((c, i) => <li className="pg-card" data-r={i} key={c.t}><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ul>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={A.commitment.eyebrow} title={A.commitment.title} />
        <Paras items={A.commitment.paras} />
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Leadership" title="125+ years of combined experience" />
        <ul className="pg-team">
          {LEADERSHIP.map((p, i) => (
            <li data-r={i} key={p.name}>
              <div className="pg-photo">
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo.src} width={p.photo.w} height={p.photo.h} alt={p.name} loading="lazy" decoding="async" />
                ) : (
                  <Ph what={p.name} note="Headshot to come" />
                )}
              </div>
              <h3>{p.name}</h3><p>{p.role}</p>
            </li>
          ))}
        </ul>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={A.careers.eyebrow} title={A.careers.title} />
        <Paras items={A.careers.paras} />
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}>
          <Btn href="/jobs">{A.careers.ctas[0]}</Btn>
          <Btn href="/jobs#resume" ghost>{A.careers.ctas[1]}</Btn>
        </p>
      </div></section>

      <section className="pg-sec pg-ask"><div className="pg-wrap">
        <SectionHead eyebrow={A.connect.eyebrow} title={A.connect.title} />
        <Paras items={A.connect.paras} />
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}>
          <Btn href="/contact">{A.connect.ctas[0]}</Btn>
          <Btn href="/capability" ghost>{A.connect.ctas[1]}</Btn>
        </p>
        <p className="pg-small" data-r="3" style={{ textAlign: "center", marginTop: "var(--sp-6)" }}>{A.connect.closing}</p>
      </div></section>
    </main>
  );
}
