import type { Metadata } from "next";
import { JOBS } from "@/content/content";
import { JobBoard, ResumeForm } from "@/components/forms";
import { Notice, PageHero, SectionHead } from "@/components/pg";

export const metadata: Metadata = {
  title: "Open jobs",
  description: "Healthcare roles first, then IT, finance and cyber roles in healthcare and government. Applying is always free.",
};

export default function Page() {
  return (
    <main className="pg" id="main">
      <PageHero
        eyebrow="Open roles"
        title={["Find your", "next role"]}
        intro="Healthcare roles first, then IT, finance and cyber roles in healthcare and government. Applying is always free, and we prepare you for the interview."
      />
      <section className="pg-sec pg-sec--tight">
        <div className="pg-wrap">
          <Notice>
            Sample listings. The live list will come from the applicant tracking system or a jobs admin, once the client confirms which.
          </Notice>
          <JobBoard jobs={JOBS} />
        </div>
      </section>
      <section className="pg-sec" id="resume">
        <div className="pg-wrap pg-split">
          <div>
            <SectionHead
              eyebrow="No match yet?"
              title="Send us your résumé"
              note="We search our network for every request. With your résumé on file, we can call you when the right role opens."
            />
          </div>
          <ResumeForm />
        </div>
      </section>
    </main>
  );
}
