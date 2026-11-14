import type { Metadata } from "next";
import { ABOUT, CONTACT, LEADERSHIP, STEPS } from "@/content/content";
import { AskBand, Btn, CredStrip, PageHero, Ph, SectionHead } from "@/components/pg";

export const metadata: Metadata = {
  title: "About",
  description:
    "The people behind XcelCareers: a Maryland minority veteran-owned staffing company that understands both sides of care.",
};

export default function Page() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow={ABOUT.eyebrow}
        title={ABOUT.title}
        intro={ABOUT.intro}
        actions={<><Btn href="/contact">Request staff</Btn><Btn href="/jobs" ghost>Find a job</Btn></>}
      />
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Why XcelCareers" title="Four reasons clients choose us" />
        <ol className="pg-grid pg-grid--4">
          {ABOUT.why.map((w, i) => <li className="pg-card" data-r={i} key={w.t}><span className="n">0{i + 1}</span><h3>{w.t}</h3><p>{w.d}</p></li>)}
        </ol>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Leadership" title="125+ years of combined experience" />
        <ul className="pg-team">
          {LEADERSHIP.map((p, i) => (
            <li data-r={i} key={p.name}>
              <div className="pg-photo"><Ph what={p.name} note="Headshot to come" /></div>
              <h3>{p.name}</h3><p>{p.role}</p>
            </li>
          ))}
        </ul>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap pg-split">
        <div>
          <SectionHead eyebrow="How we hire" title="From open role to day one" note="Our process for employers, step by step." />
          <ol className="pg-steps" data-r="2">
            {STEPS.map((s, i) => <li key={s.title}><b>0{i + 1}</b><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}
          </ol>
        </div>
        <div className="pg-panel" data-r="2">
          <h3 className="pg-h3">For candidates</h3>
          <ul className="pg-list">{ABOUT.candidates.map((c) => <li key={c}>{c}</li>)}</ul>
          <Btn href="/jobs">See open roles</Btn>
        </div>
      </div></section>
      <section className="pg-sec"><div className="pg-wrap">
        <SectionHead eyebrow="Certified" title="Minority veteran-owned small business" />
        <CredStrip />
        <p className="pg-small" data-r="2">Based at {CONTACT.address}. Placing people across Maryland, DC and Virginia, and in remote roles.</p>
      </div></section>
      <AskBand title={["Tell us who", "you need"]} lead="One nurse or a full staff augmentation: start with a short request." cta="Request staff" href="/contact" />
    </main>
  );
}
