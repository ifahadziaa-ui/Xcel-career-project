import type { Metadata } from "next";
import { Btn, CredStrip, PageHero, SectionHead } from "@/components/pg";
import { CREDENTIALS, LEDGER, SERVICE_PAGES } from "@/content/content";
import { GOV_PAGE as G } from "@/content/pages-copy";

export const metadata: Metadata = {
  title: "Government contracting",
  description:
    "Staff augmentation, proposal support and program services for government agencies, prime contractors and subcontractors across healthcare, technology, cybersecurity, finance and program management.",
};

const Paras = ({ items }: { items: readonly string[] }) => (
  <>{items.map((t) => <p className="pg-lead" data-r="1" key={t}>{t}</p>)}</>
);

/* Wording supplied by the client (16 Nov 2026); certifications, codes and past performance stay as data. */
export default function Page() {
  const cert = SERVICE_PAGES.government;
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow={G.eyebrow}
        title={G.title}
        sub={G.sub}
        intro={G.intro}
        actions={<><Btn href="#capabilities">Explore our capabilities</Btn><Btn href="/contact" ghost>Discuss a partnership</Btn></>}
      />

      <section className="pg-sec" id="capabilities"><div className="pg-wrap">
        <SectionHead eyebrow={G.capabilities.eyebrow} title={G.capabilities.title} />
        <ul className="pg-grid pg-grid--3">
          {G.capabilities.items.map((c, i) => <li className="pg-card" data-r={i % 3} key={c.t}><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ul>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap pg-split">
        <div>
          <SectionHead eyebrow={G.teaming.eyebrow} title={G.teaming.title} />
          <Paras items={G.teaming.paras} />
          <p className="pg-lead" data-r="2"><b>{G.teaming.listLead}</b></p>
          <ul className="pg-list" data-r="2">{G.teaming.list.map((l) => <li key={l}>{l}</li>)}</ul>
          <p className="pg-actions" data-r="3"><Btn href="/contact">{G.teaming.cta}</Btn></p>
        </div>
        <div className="pg-panel" data-r="2">
          <h3 className="pg-h3">{cert.checksTitle}</h3>
          <ul className="pg-checks">{cert.checks.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="pg-small">{cert.checksNote}</p>
        </div>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={G.proposal.eyebrow} title={G.proposal.title} />
        <Paras items={G.proposal.paras} />
        <ul className="pg-grid pg-grid--3" style={{ marginTop: "var(--sp-6)" }}>
          {G.proposal.items.map((c, i) => <li className="pg-card" data-r={i} key={c.t}><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ul>
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}><Btn href="/contact">{G.proposal.cta}</Btn></p>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={G.ways.eyebrow} title={G.ways.title} />
        <ul className="pg-grid pg-grid--3">
          {G.ways.items.map((c, i) => <li className="pg-card" data-r={i} key={c.t}><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ul>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={G.approach.eyebrow} title={G.approach.title} />
        <ol className="pg-grid pg-grid--4">
          {G.approach.steps.map((c, i) => <li className="pg-card" data-r={i} key={c.t}><span className="n">0{i + 1}</span><h3>{c.t}</h3><p>{c.d}</p></li>)}
        </ol>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Codes" title="NAICS" />
        <ul className="pg-table" data-r="2">{CREDENTIALS.naics.map((n) => <li key={n.code}><b>{n.code}</b><span>{n.name}</span></li>)}</ul>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Past performance" title="Who we have worked with" />
        <ul className="pg-ledger" data-r="2">{LEDGER.map((r) => <li key={r.title}><span className="d">{r.date}</span><span className="t">{r.title}</span><span className="s">{r.stamp}</span></li>)}</ul>
      </div></section>

      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={G.why.eyebrow} title={G.why.title} />
        <Paras items={G.why.paras} />
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}><Btn href="/capability">{G.why.cta}</Btn></p>
        <CredStrip />
      </div></section>

      <section className="pg-sec pg-ask"><div className="pg-wrap">
        <SectionHead eyebrow={G.connect.eyebrow} title={G.connect.title} />
        <Paras items={G.connect.paras} />
        <p className="pg-actions" data-r="3" style={{ justifyContent: "center" }}>
          <Btn href="/contact">{G.connect.ctas[0]}</Btn>
          <Btn href="/contact" ghost>{G.connect.ctas[1]}</Btn>
        </p>
        <p className="pg-small" data-r="3" style={{ textAlign: "center", marginTop: "var(--sp-6)" }}>{G.connect.closing}</p>
      </div></section>
    </main>
  );
}
