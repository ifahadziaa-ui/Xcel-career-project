import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOBS } from "@/content/content";
import { ApplyForm } from "@/components/forms";
import { Btn, Notice } from "@/components/pg";

/* These listings are samples (see content.ts), so their pages are not indexed and carry no
   JobPosting structured data: publishing invented jobs to Google would be false. When real jobs
   come from the ATS or the admin, add the JobPosting JSON-LD here for those only. */
export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = JOBS.find((j) => j.id === id);
  if (!job) return {};
  return { title: job.title, description: job.desc, robots: { index: false, follow: true } };
}

export default async function Page({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const job = JOBS.find((j) => j.id === id);
  if (!job) notFound();
  return (
    <main className="pg" id="main">
      <section className="pg-hero pg-hero--short">
        <div className="pg-wrap">
          <p className="eyebrow type-caps" data-r="0"><span className="dot" aria-hidden="true" />{job.fn} · Sample listing</p>
          <h1 className="pg-h2" data-r="1">{job.title}</h1>
          <dl className="jb-meta" data-r="2">
            <div><dt>Location</dt><dd>{job.where}</dd></div>
            <div><dt>Type</dt><dd>{job.type}</dd></div>
            <div><dt>{job.need[0]}</dt><dd>{job.need[1]}</dd></div>
          </dl>
        </div>
      </section>
      <section className="pg-sec pg-sec--tight">
        <div className="pg-wrap"><Notice>This is a sample listing, shown to design the page.</Notice></div>
      </section>
      <section className="pg-sec">
        <div className="pg-wrap pg-split">
          <div data-r="1">
            <p className="pg-lead">{job.desc}</p>
            <h3 className="pg-h3">What it needs</h3>
            <ul className="pg-list">{job.reqs.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="pg-actions"><Btn href="/jobs" ghost>All roles</Btn></p>
          </div>
          <div className="pg-panel" data-r="2">
            <h3 className="pg-h3">Apply</h3>
            <ApplyForm title={job.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
