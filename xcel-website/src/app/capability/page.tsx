import type { Metadata } from "next";
import { CONTACT, CREDENTIALS, CUSTOMERS, LEDGER, STICKERS } from "@/content/content";
import { AskBand, Arrow, Btn, Notice, PageHero, SectionHead } from "@/components/pg";

export const metadata: Metadata = {
  title: "Capability statement",
  description:
    "XcelCareers capability statement: certifications (Maryland MBE, DBE, SBE), CAGE and UEI codes, NAICS codes, customers and past performance.",
};

const rows: [string, string][] = [
  ["Company", "XcelCareers (XC), LLC"],
  ["Status", "Minority veteran-owned small business"],
  ["Certifications", `Maryland MBE · DBE · SBE, No. ${CREDENTIALS.certNo}, issued by the ${CREDENTIALS.certifier}. Certified since ${CREDENTIALS.since}; current certifications effective ${CREDENTIALS.effective}.`],
  ["CAGE", CREDENTIALS.cage],
  ["UEI", CREDENTIALS.uei],
  ["Contracting", "Prime or subcontractor at the local, state and federal level, including task orders and IDIQ"],
  ["Cleared talent", "Up to TS/SCI with Full Scope Poly"],
  ["Where", "Maryland, DC, Virginia and remote"],
  ["Point of contact", `${CONTACT.name}, ${CONTACT.title} · Cell ${CONTACT.phone} · ${CONTACT.email}`],
];

const capabilities: [string, string][] = [
  ["Healthcare staffing", "Clinical and non-clinical staff for hospitals, clinics, long-term care, behavioral health and county and state HHS."],
  ["Staff augmentation & contract staffing", "From one specialist to 120+ personnel; we are the employer of record for contract staff."],
  ["Task orders / IDIQ", "Prime or subcontractor on local, state and federal vehicles."],
  ["IT · Finance · Cyber", "EHR and systems, revenue cycle and budget analysis, cybersecurity, cleared to TS/SCI."],
];

export default function Page() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow="Contract-ready"
        title={["Capability", "statement"]}
        intro="A certified minority veteran-owned small business, ready to contract at the local, state and federal level, that understands patient care and the IT, finance and security behind it."
        actions={<>
          <span className="btn" aria-disabled="true">PDF to come<Arrow /></span>
          <Btn href="/contact" ghost>Request staff</Btn>
        </>}
      />
      <section className="pg-sec pg-sec--tight"><div className="pg-wrap">
        <Notice tag="To come">The PDF arrives from XcelCareers (a healthcare-focused version). Everything on it is on this page.</Notice>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Company data" title="At a glance" />
        <dl className="pg-dl" data-r="2">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Core capabilities" title="What we deliver" />
        <ol className="pg-grid pg-grid--4">
          {capabilities.map(([t, d], i) => <li className="pg-card" data-r={i} key={t}><span className="n">0{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap pg-split">
        <div>
          <SectionHead eyebrow="Codes" title="NAICS" />
          <ul className="pg-table" data-r="2">{CREDENTIALS.naics.map((n) => <li key={n.code}><b>{n.code}</b><span>{n.name}</span></li>)}</ul>
        </div>
        <div>
          <SectionHead eyebrow="Customers" title="Current and past" />
          <ul className="pg-table" data-r="2">
            {CUSTOMERS.map((c) => <li key={c.name}><b>{c.status === "current" ? "Current" : ("years" in c && c.years) || (c.status === "past" ? "Past" : "Client")}</b><span>{c.name}</span></li>)}
          </ul>
        </div>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Past performance" title="On the record" />
        <ul className="pg-proof">{Object.values(STICKERS).map((s, i) => <li data-r={i} key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}</ul>
        <ul className="pg-ledger" data-r="2">{LEDGER.map((r) => <li key={r.title}><span className="d">{r.date}</span><span className="t">{r.title}</span><span className="s">{r.stamp}</span></li>)}</ul>
      </div></section>
      <AskBand title={["Ready to", "staff it"]} lead="Send a staffing request or call us about a current requirement." cta="Request staff" href="/contact" />
    </main>
  );
}
