import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteAccount, ProfileForm, SignOutButton, UnsaveButton } from "@/components/auth/AccountClient";
import { Btn, CallLink, Eyebrow, Headline, SectionHead } from "@/components/pg";
import { JOBS } from "@/content/content";
import { getProfile, listApplications, listSaved } from "@/lib/accounts";
import { accountsConfigured } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function Page() {
  return (
    <main className="pg" id="main">
      <Suspense
        fallback={
          <section className="pg-hero"><div className="pg-wrap"><Eyebrow>Candidate account</Eyebrow><Headline lines={["Your account"]} /></div></section>
        }
      >
        <Account />
      </Suspense>
    </main>
  );
}

/* Reads the session cookie, so it renders per request behind the Suspense boundary above. */
async function Account() {
  if (!accountsConfigured) {
    return (
      <section className="pg-hero">
        <div className="pg-wrap">
          <Eyebrow>Candidate account</Eyebrow>
          <Headline lines={["Accounts are", "not on yet"]} />
          <p className="pg-intro" data-r="2">Candidate accounts are not switched on yet. You can still browse roles and call us.</p>
          <div className="pg-actions" data-r="3"><Btn href="/jobs">See roles</Btn><CallLink /></div>
        </div>
      </section>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const [profile, applications, savedIds] = await Promise.all([getProfile(user.id), listApplications(user.id), listSaved(user.id)]);
  const saved = savedIds.map((id) => JOBS.find((j) => j.id === id)).filter((j) => j !== undefined);

  return (
    <>
      <section className="pg-hero">
        <div className="pg-wrap">
          <Eyebrow>Candidate account</Eyebrow>
          <Headline lines={["Hello,", user.name.split(" ")[0] || "there"]} />
          <p className="pg-intro" data-r="2">{user.email}</p>
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <SectionHead eyebrow="Applications" title="Roles you applied for" />
          {applications.length ? (
            <ul className="pg-ledger" data-r="1">
              {applications.map((a) => (
                <li key={a.id}>
                  <span className="d">{day(a.createdAt)}</span>
                  <span className="t">
                    {JOBS.some((j) => j.id === a.jobId) ? <Link href={`/jobs/${a.jobId}`}>{a.jobTitle}</Link> : a.jobTitle}
                    <span className="pg-small"> · {a.jobField}</span>
                  </span>
                  <span className="s">{a.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pg-lead" data-r="1">You have not applied yet. <Link href="/jobs">Browse roles</Link>, or call us and we will look for a match.</p>
          )}
          {applications.length ? <p className="pg-small pg-split-note" data-r="2">Applications are saved to your account. Automatic delivery to our team is not connected yet, so for a faster reply call Barry Klasson.</p> : null}
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap">
          <SectionHead eyebrow="Saved" title="Roles you saved" />
          {saved.length ? (
            <ul className="jb-list" data-r="1">
              {saved.map((j) => (
                <li className="jb-row" key={j.id}>
                  <div className="jb-main">
                    <span className="jb-fn">{j.fn}</span>
                    <h3><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3>
                    <p>{j.where} · {j.type}</p>
                  </div>
                  <div className="jb-acts"><UnsaveButton jobId={j.id} /><Btn href={`/jobs/${j.id}`}>View &amp; apply</Btn></div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pg-lead" data-r="1">Nothing saved yet. Use Save on a role to keep it here.</p>
          )}
        </div>
      </section>

      <section className="pg-sec">
        <div className="pg-wrap pg-split">
          <div data-r="1">
            <SectionHead eyebrow="Details" title="Your details" />
            <ProfileForm name={user.name} email={user.email} phone={profile.phone} field={profile.field} location={profile.location} />
          </div>
          <div data-r="2">
            <SectionHead eyebrow="Account" title="Sign out or delete" />
            <div className="pg-actions"><SignOutButton /></div>
            <div className="pg-actions"><DeleteAccount /></div>
          </div>
        </div>
      </section>
    </>
  );
}
