"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Arrow } from "@/components/pg";
import { authClient } from "@/lib/auth-client";

const FIELDS = ["", "Healthcare", "IT & Software Development", "Cybersecurity", "Finance", "Project & Program Management", "Other"];

export function ProfileForm({ name, email, phone, field, location }: { name: string; email: string; phone: string; field: string; location: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setMsg(""); setErr("");
    const r = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: f.get("name"), phone: f.get("phone"), field: f.get("field"), location: f.get("location") }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!r.ok) return setErr(j.error || "The details could not be saved.");
    setMsg("Saved.");
    router.refresh();
  }

  return (
    <form className="pg-form pg-panel" onSubmit={submit} aria-busy={busy}>
      <div className="f2">
        <label>Name<input name="name" defaultValue={name} required autoComplete="name" /></label>
        <label>Email<input value={email} readOnly aria-readonly="true" autoComplete="email" /></label>
      </div>
      <div className="f2">
        <label>Phone<span className="opt">optional</span><input name="phone" type="tel" defaultValue={phone} autoComplete="tel" /></label>
        <label>Field<select name="field" defaultValue={field}>{FIELDS.map((v) => <option key={v} value={v}>{v || "Not set"}</option>)}</select></label>
      </div>
      <label>Location<span className="opt">optional</span><input name="location" defaultValue={location} placeholder="City, state" autoComplete="address-level2" /></label>
      <p className="err" role="alert">{err}</p>
      <div className="pg-actions">
        <button className="btn" type="submit" disabled={busy}>Save details<Arrow /></button>
        <span className="pg-small" role="status">{msg}</span>
      </div>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out<Arrow />
    </button>
  );
}

export function DeleteAccount() {
  const router = useRouter();
  const [ask, setAsk] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await authClient.deleteUser(pw ? { password: pw } : {});
    if (r.error) { setErr(r.error.message || "The account could not be deleted."); setBusy(false); return; }
    router.push("/");
    router.refresh();
  }

  if (!ask) return <button type="button" className="btn btn--ghost" onClick={() => setAsk(true)}>Delete my account</button>;
  return (
    <form className="pg-form" onSubmit={go}>
      <p className="pg-small">This removes your account, applications, saved roles and details. It cannot be undone. If you signed in with Google, leave the password empty.</p>
      <label>Password<span className="opt">email accounts</span><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
      <p className="err" role="alert">{err}</p>
      <div className="pg-actions">
        <button className="btn" type="submit" disabled={busy}>Delete everything<Arrow /></button>
        <button className="btn btn--ghost" type="button" onClick={() => setAsk(false)}>Keep my account</button>
      </div>
    </form>
  );
}

export function UnsaveButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="jb-save"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, saved: false }) });
        router.refresh();
      }}
    >
      Remove
    </button>
  );
}
