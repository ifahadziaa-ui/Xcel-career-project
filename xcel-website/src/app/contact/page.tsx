import type { Metadata } from "next";
import { Suspense } from "react";
import { CONTACT, STEPS } from "@/content/content";
import { ContactForms } from "@/components/forms";
import { PageHero, SectionHead, tel } from "@/components/pg";

export const metadata: Metadata = {
  title: "Contact and staffing requests",
  description:
    "Request healthcare, IT, finance or cybersecurity staff, book a call with client services, or find a job. Call 443-859-0034.",
};

export default function Page() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow="Get in touch"
        title={["Tell us who", "you need"]}
        intro={`Tell us the role, the shifts, the pay range and the license, certification or clearance it needs. Every request goes to ${CONTACT.name}, ${CONTACT.title}.`}
      />
      <section className="pg-sec pg-sec--tight">
        <div className="pg-wrap pg-contact">
          <Suspense fallback={<div className="pg-panel" aria-busy="true">Loading the form…</div>}>
            <ContactForms />
          </Suspense>
          <aside className="pg-panel pg-card-contact" data-r="2">
            <p className="eyebrow type-caps"><span className="dot" aria-hidden="true" />Client services</p>
            <h3>{CONTACT.name}</h3>
            <p className="pg-small">{CONTACT.title}</p>
            <a className="pg-big" href={tel}>Cell {CONTACT.phone}</a>
            <a className="pg-mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <address>{CONTACT.address}</address>
            <p className="pg-small">{CONTACT.ids}</p>
          </aside>
        </div>
      </section>
      <section className="pg-sec">
        <div className="pg-wrap">
          <SectionHead eyebrow="What happens next" title="From request to short list" />
          <ol className="pg-grid pg-grid--4">
            {STEPS.map((s, i) => (
              <li className="pg-card" data-r={i} key={s.title}><span className="n">0{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
