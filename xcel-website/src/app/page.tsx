import { CONTACT } from "@/content/content";
import { Btn, CallLink, PageHero } from "@/components/pg";

/* Interim home page (phase 1). The real home (hero, 3D showreel, process, jobs fan, capability
   poster, FAQ, contact) is ported from landing-prototype/ in phase 2. */
export default function Home() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow="Healthcare staffing · Government contracting"
        title={["People behind", "the care"]}
        intro={`Credentialed people for hospitals, clinics, long-term care and county and state health and human services. Tell us the role, the shifts and the credential, and we send a short list of vetted candidates. ${CONTACT.name} is your contact.`}
        actions={<><Btn href="/contact">Request staff</Btn><Btn href="/jobs" ghost>Find a job</Btn><CallLink /></>}
      />
    </main>
  );
}
