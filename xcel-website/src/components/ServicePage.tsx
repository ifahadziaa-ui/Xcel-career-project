import { CREDENTIALS, LEDGER, SERVICE_PAGES } from "@/content/content";
import NewEraBackdrop from "@/components/NewEraBackdrop";
import { AskBand, Btn, CallLink, CredStrip, PageHero, SectionHead } from "@/components/pg";

type Key = keyof typeof SERVICE_PAGES;

/* The three service pages share one layout: hero, blocks, list, checks, terms, proof, ask. */
export default function ServicePage({ pageKey }: { pageKey: Key }) {
  const P = SERVICE_PAGES[pageKey] as (typeof SERVICE_PAGES)["healthcare"] & { terms?: { t: string; d: string }[] };
  const era = pageKey === "healthcare"; // only the Healthcare page has the DNA backdrop
  return (
    <main className={era ? "pg pg--era" : "pg"} id="main">
      {era ? <NewEraBackdrop /> : null}
      <PageHero
        cascade={era}
        eyebrow={P.eyebrow}
        title={P.title}
        intro={P.intro}
        actions={<><Btn href={P.ask.href}>{P.ask.cta}</Btn><CallLink /></>}
      />
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow={pageKey === "healthcare" ? "Settings" : "Services"} title={P.blocksTitle} />
        <ol className={`pg-grid pg-grid--${P.blocks.length}`}>
          {P.blocks.map((b, i) => (
            <li className="pg-card" data-r={i % 3} key={b.t}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.t}</h3><p>{b.d}</p>
            </li>
          ))}
        </ol>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap pg-split">
        <div>
          <SectionHead eyebrow={pageKey === "specialists" ? "Locations" : pageKey === "government" ? "Primes" : "Roles"} title={P.listTitle} />
          <ul className="pg-list" data-r="2">{P.list.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
        <div className="pg-panel" data-r="2">
          <h3 className="pg-h3">{P.checksTitle}</h3>
          <ul className="pg-checks">{P.checks.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="pg-small">{P.checksNote}</p>
        </div>
      </div></section>
      {P.terms ? (
        <section className="pg-sec"><div className="pg-wrap">
          <SectionHead eyebrow="How we engage" title="Four ways to work with us" />
          <ul className="pg-grid pg-grid--4">
            {P.terms.map((t, i) => <li className="pg-card" data-r={i % 4} key={t.t}><h3>{t.t}</h3><p>{t.d}</p></li>)}
          </ul>
          <p className="pg-small pg-split-note" data-r="1">You keep the final interview, the hiring decision, the work site and day-to-day supervision. We handle the rest.</p>
        </div></section>
      ) : null}
      {pageKey === "government" ? (
        <>
          <section className="pg-sec"><div className="pg-wrap">
            <SectionHead eyebrow="Codes" title="NAICS" />
            <ul className="pg-table" data-r="2">{CREDENTIALS.naics.map((n) => <li key={n.code}><b>{n.code}</b><span>{n.name}</span></li>)}</ul>
          </div></section>
          <section className="pg-sec"><div className="pg-wrap">
            <SectionHead eyebrow="Past performance" title="Who we have worked with" />
            <ul className="pg-ledger" data-r="2">{LEDGER.map((r) => <li key={r.title}><span className="d">{r.date}</span><span className="t">{r.title}</span><span className="s">{r.stamp}</span></li>)}</ul>
          </div></section>
        </>
      ) : null}
      <section className="pg-sec"><div className="pg-wrap">
        <ul className="pg-proof">{P.proof.map(([v, l], i) => <li data-r={i} key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
        {pageKey !== "specialists" ? <CredStrip /> : null}
      </div></section>
      <AskBand {...P.ask} />
    </main>
  );
}
