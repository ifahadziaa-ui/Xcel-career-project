import type { Metadata } from "next";
import { JOBS } from "@/content/content";
import { JobBoard, ResumeForm } from "@/components/forms";
import { Btn, Eyebrow, Headline, SectionHead } from "@/components/pg";

export const metadata: Metadata = {
  title: "Careers at Xcel",
  description: "Current openings across healthcare, IT, software development, cybersecurity, finance, and project and program management.",
};

/* Wording supplied by the client (17 Nov 2026). */
export default function Page() {
  return (
    <main className="pg" id="main">
      <section className="pg-hero">
        <div className="pg-wrap">
          <Eyebrow>Careers at Xcel</Eyebrow>
          <Headline lines={["Current", "Openings"]} />
          <p className="pg-sub" data-r="2">Your next role. Your next step forward.</p>
          <p className="pg-intro" data-r="2">
            Explore opportunities across healthcare, IT, software development, cybersecurity, finance, and technical project and program management. Bring your expertise to work that supports healthcare organizations, government programs, and commercial businesses.
          </p>
          <div className="pg-actions" data-r="3">
            <Btn href="#openings">Browse current openings</Btn>
            <Btn href="#resume" ghost>Submit your résumé</Btn>
          </div>
        </div>
      </section>
      <section className="pg-sec pg-sec--tight" id="openings">
        <div className="pg-wrap">
          {JOBS.length > 0 ? (
            <JobBoard jobs={JOBS} />
          ) : (
            <div className="pg-panel" data-r="1">
              <h3 className="pg-h3">New jobs will be updated soon.</h3>
              <p className="pg-small">There are no openings listed right now. Submit your résumé below and we will contact you when a role that matches your background opens.</p>
            </div>
          )}
        </div>
      </section>
      <section className="pg-sec" id="resume">
        <div className="pg-wrap pg-split">
          <div>
            <SectionHead
              eyebrow="Submit your résumé"
              title="Let’s find where you Xcel."
              note="Don’t see a position that matches your background? Submit your résumé and tell us about your experience, preferred location, and career interests. Our team will consider you for opportunities that align with your qualifications."
            />
            <p className="pg-small" data-r="2">Healthcare · IT &amp; Software Development · Cybersecurity · Finance · Project &amp; Program Management</p>
          </div>
          <ResumeForm />
        </div>
      </section>
    </main>
  );
}
