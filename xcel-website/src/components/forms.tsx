"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CONTACT, REQUEST_FORM as R } from "@/content/content";
import { SaveButton } from "@/components/auth/SaveButton";
import { useCandidate } from "@/components/auth/useAccounts";
import { Arrow, Btn } from "@/components/pg";

/* No form is delivered anywhere yet: there is no mail service or database connected.
   Each form says so after it is submitted (never "sent"), until the delivery route is built. */
function useStatus() {
  const [msg, setMsg] = useState("");
  return {
    msg,
    done: (e: FormEvent<HTMLFormElement>, what: string) => {
      e.preventDefault();
      e.currentTarget.reset();
      setMsg(
        `${what} was captured in this browser only. Delivery to ${CONTACT.name} (${CONTACT.email}) is not connected yet, so nothing was sent. Please call ${CONTACT.phone}.`,
      );
    },
  };
}
const Status = ({ msg }: { msg: string }) => (msg ? <p className="pg-small" role="status">{msg}</p> : null);
const Opt = ({ v }: { v: string }) => <option>{v}</option>;

/* ---------- contact: request staff / book a call / looking for work ---------- */
export function ContactForms() {
  const q = useSearchParams();
  const [tab, setTab] = useState<"req" | "call" | "job">("req");
  const req = useStatus();
  const call = useStatus();
  const tabs = [
    ["req", "Request staff"],
    ["call", "Book a call"],
    ["job", "I'm looking for work"],
  ] as const;
  return (
    <div>
      <div className="tabs" role="tablist" data-r="0">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" id={`tb-${k}`} aria-selected={tab === k} aria-controls={`t-${k}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      <form className="pg-form pg-panel" id="t-req" role="tabpanel" aria-labelledby="tb-req" hidden={tab !== "req"} onSubmit={(e) => req.done(e, "Your request")}>
        <div className="f2">
          <label>Organization<input name="org" required autoComplete="organization" defaultValue={q.get("org") ?? ""} /></label>
          <label>Your name<input name="name" required autoComplete="name" /></label>
        </div>
        <div className="f2">
          <label>Your role<input name="role" autoComplete="organization-title" /></label>
          <label>Work email<input name="email" type="email" required autoComplete="email" defaultValue={q.get("email") ?? ""} /></label>
        </div>
        <div className="f2">
          <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
          <label>Type of staff<select name="type">{R.types.map((v) => <Opt key={v} v={v} />)}</select></label>
        </div>
        <div className="f2">
          <label>Number of people<select name="count">{R.headcount.map((v) => <Opt key={v} v={v} />)}</select></label>
          <label>Contract type<select name="contract">{R.contracts.map((v) => <Opt key={v} v={v} />)}</select></label>
        </div>
        <div className="f2">
          <label>Shifts and schedule<input name="shifts" placeholder="e.g. nights, 3×12" /></label>
          <label>Pay range <span className="opt">optional</span><input name="pay" /></label>
        </div>
        <div className="f2">
          <label>License, certification or clearance<input name="cred" placeholder="e.g. active RN, TS/SCI" /></label>
          <label>Work location<select name="loc">{R.locations.map((v) => <Opt key={v} v={v} />)}</select></label>
        </div>
        <div className="f2">
          <label>Start date<input name="start" type="date" /></label>
          <label>Notes<input name="notes" defaultValue={q.get("role") ? `Role: ${q.get("role")}` : ""} /></label>
        </div>
        <button className="btn" type="submit">Send request<Arrow /></button>
        <Status msg={req.msg} />
      </form>

      <form className="pg-form pg-panel" id="t-call" role="tabpanel" aria-labelledby="tb-call" hidden={tab !== "call"} onSubmit={(e) => call.done(e, "Your call request")}>
        <p className="pg-small">A 15-minute call with client services about a current or upcoming requirement.</p>
        <div className="f2">
          <label>Your name<input name="name" required /></label>
          <label>Work email<input name="email" type="email" required /></label>
        </div>
        <div className="f2">
          <label>Phone<input name="phone" type="tel" required /></label>
          <label>Best time<select name="time"><Opt v="Morning" /><Opt v="Midday" /><Opt v="Afternoon" /></select></label>
        </div>
        <label>What is it about?<input name="topic" placeholder="e.g. behavioral health nurses for a county program" /></label>
        <button className="btn" type="submit">Request a call<Arrow /></button>
        <Status msg={call.msg} />
      </form>

      <div className="pg-panel" id="t-job" role="tabpanel" aria-labelledby="tb-job" hidden={tab !== "job"}>
        <p className="pg-lead">Browse open healthcare, IT, finance and cyber roles and apply in a few minutes. Free for candidates, always.</p>
        <div className="pg-actions"><Btn href="/jobs">See open roles</Btn><Btn href="/jobs#resume" ghost>Send your résumé</Btn></div>
      </div>
    </div>
  );
}

/* ---------- jobs: send a résumé, apply to one role ---------- */
export function ResumeForm() {
  const s = useStatus();
  return (
    <form className="pg-form pg-panel" id="resume-form" data-r="2" onSubmit={(e) => s.done(e, "Your résumé")}>
      <div className="f2">
        <label>First name<input name="first" required autoComplete="given-name" /></label>
        <label>Last name<input name="last" required autoComplete="family-name" /></label>
      </div>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Field<select name="field">{["Healthcare", "IT", "Finance", "Cybersecurity", "Other"].map((v) => <Opt key={v} v={v} />)}</select></label>
      <label className="file">Résumé (PDF or Word)<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
      <button className="btn" type="submit">Send résumé<Arrow /></button>
      <Status msg={s.msg} />
    </form>
  );
}

export function ApplyForm({ jobId, title }: { jobId: string; title: string }) {
  const path = usePathname();
  const { status, user, pending } = useCandidate();
  const legacy = useStatus();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // accounts are switched off: the form behaves as before and says nothing is sent
  if (status && !status.configured) {
    return (
      <form className="pg-form" id="apply-form" onSubmit={(e) => legacy.done(e, `Your application for ${title}`)}>
        <div className="f2">
          <label>First name<input name="first" required /></label>
          <label>Last name<input name="last" required /></label>
        </div>
        <div className="f2">
          <label>Email<input name="email" type="email" required /></label>
          <label>Phone<input name="phone" type="tel" /></label>
        </div>
        <label className="file">Résumé<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
        <button className="btn" type="submit">Submit application<Arrow /></button>
        <p className="pg-small">Free for candidates, always.</p>
        <Status msg={legacy.msg} />
      </form>
    );
  }
  if (pending) return <div aria-hidden="true" style={{ minHeight: "14rem" }} />;
  if (!user) {
    const next = encodeURIComponent(path);
    return (
      <div>
        <p className="pg-lead">Sign in to apply. Your applications are kept in your account, so you can see what you applied for.</p>
        <div className="pg-actions">
          <Link className="btn" href={`/login?next=${next}`}>Sign in<Arrow /></Link>
          <Link className="btn btn--ghost" href={`/login?mode=up&next=${next}`}>Create account<Arrow /></Link>
        </div>
        <p className="pg-small">Free for candidates, always.</p>
      </div>
    );
  }

  const [first, ...rest] = user.name.split(" ");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("jobId", jobId);
    setBusy(true); setMsg(""); setErr("");
    const r = await fetch("/api/applications", { method: "POST", body: data });
    const j = (await r.json().catch(() => ({}))) as { error?: string; result?: string };
    setBusy(false);
    if (!r.ok) return setErr(j.error || "The application could not be saved. Please try again.");
    setMsg(
      j.result === "exists"
        ? `You already applied for ${title}.`
        : `Your application for ${title} is saved to your account. Automatic delivery to our team is not connected yet, so please also call ${CONTACT.name} on ${CONTACT.phone}.`,
    );
    if (j.result !== "exists") form.reset();
  }

  return (
    <form className="pg-form" id="apply-form" onSubmit={submit} aria-busy={busy}>
      <div className="f2">
        <label>First name<input name="first" required defaultValue={first} autoComplete="given-name" /></label>
        <label>Last name<input name="last" required defaultValue={rest.join(" ")} autoComplete="family-name" /></label>
      </div>
      <div className="f2">
        <label>Email<input name="email" type="email" required defaultValue={user.email} autoComplete="email" /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
      <label className="file">Résumé (PDF or Word, up to 4 MB)<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
      <p className="err" role="alert">{err}</p>
      <button className="btn" type="submit" disabled={busy}>Submit application<Arrow /></button>
      <p className="pg-small">Free for candidates, always.</p>
      {msg ? <p className="pg-small" role="status">{msg} <Link href="/account">See your applications</Link></p> : null}
    </form>
  );
}

/* ---------- jobs: the list with its filters ---------- */
type Job = { id: string; fn: string; title: string; where: string; type: string; need: string[]; desc: string; reqs: string[] };

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [fn, setFn] = useState("All");
  const [where, setWhere] = useState("");
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const fns = ["All", ...new Set(jobs.map((j) => j.fn))];
  const needle = q.trim().toLowerCase();
  const rows = jobs.filter(
    (j) =>
      (fn === "All" || j.fn === fn) &&
      (!where || j.where === where) &&
      (!type || j.type === type) &&
      (!needle || [j.title, j.fn, j.where, j.type, j.desc, ...j.need, ...j.reqs].join(" ").toLowerCase().includes(needle)),
  );
  return (
    <>
      <div className="jb-bar" data-r="1">
        <label className="jb-search">
          <span className="sr-only">Search roles</span>
          <input type="search" placeholder="Search role, skill or credential" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="jb-chips" role="group" aria-label="Field">
          {fns.map((f) => (
            <button key={f} type="button" className={`chip${fn === f ? " is-on" : ""}`} aria-pressed={fn === f} onClick={() => setFn(f)}>{f}</button>
          ))}
        </div>
        <label className="jb-sel">
          <span className="sr-only">Location</span>
          <select value={where} onChange={(e) => setWhere(e.target.value)}>
            <option value="">All locations</option>
            {[...new Set(jobs.map((j) => j.where))].map((v) => <Opt key={v} v={v} />)}
          </select>
        </label>
        <label className="jb-sel">
          <span className="sr-only">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            {[...new Set(jobs.map((j) => j.type))].map((v) => <Opt key={v} v={v} />)}
          </select>
        </label>
      </div>
      <p className="jb-count" aria-live="polite">{rows.length} {rows.length === 1 ? "role" : "roles"}</p>
      <ul className="jb-list">
        {rows.map((j) => (
          <li className="jb-row" id={`job-${j.id}`} key={j.id}>
            <div className="jb-main">
              <span className="jb-fn">{j.fn}</span>
              <h3><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3>
              <p>{j.where} · {j.type} · {j.need[0]}: <b>{j.need[1]}</b></p>
            </div>
            <div className="jb-acts">
              <SaveButton jobId={j.id} />
              <button type="button" className="btn" onClick={() => router.push(`/jobs/${j.id}`)}>View &amp; apply<Arrow /></button>
            </div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="jb-empty">No roles match. <Link href="#resume">Send your résumé</Link> and we will call you when one opens.</li>
        ) : null}
      </ul>
    </>
  );
}
