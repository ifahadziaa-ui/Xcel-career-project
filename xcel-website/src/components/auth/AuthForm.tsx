"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CONTACT } from "@/content/content";
import { Arrow } from "@/components/pg";
import { authClient } from "@/lib/auth-client";
import { safeNext, useAccountsStatus } from "./useAccounts";

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z" />
    <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5z" />
    <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3z" />
    <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3C6.5 7.4 9 5.4 12 5.4z" />
  </svg>
);

/* Sign in or create an account: Google (when it is set up) or email and password. */
export function AuthForm() {
  const router = useRouter();
  const q = useSearchParams();
  const next = safeNext(q.get("next"));
  const status = useAccountsStatus();
  const [mode, setMode] = useState<"in" | "up">(q.get("mode") === "up" ? "up" : "in");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const off = status !== null && !status.configured;

  async function google() {
    setErr("");
    setBusy(true);
    const r = await authClient.signIn.social({ provider: "google", callbackURL: next });
    if (r.error) { setErr(r.error.message || "Google sign-in could not start."); setBusy(false); }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    setErr("");
    setBusy(true);
    const r =
      mode === "up"
        ? await authClient.signUp.email({ name: String(f.get("name") || "").trim(), email, password, callbackURL: next })
        : await authClient.signIn.email({ email, password, callbackURL: next });
    if (r.error) {
      setErr(r.error.message || "That did not work. Please check the details and try again.");
      setBusy(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="auth pg-panel">
      <div className="tabs" role="tablist" aria-label="Sign in or create an account">
        <button type="button" role="tab" aria-selected={mode === "in"} onClick={() => { setMode("in"); setErr(""); }}>Sign in</button>
        <button type="button" role="tab" aria-selected={mode === "up"} onClick={() => { setMode("up"); setErr(""); }}>Create account</button>
      </div>

      {off ? (
        <p className="pg-notice" role="status">
          <span className="tag">Not yet</span>
          Accounts are not switched on yet. The other forms work as before; call {CONTACT.phone}.
        </p>
      ) : null}

      {status?.google ? (
        <>
          <button type="button" className="gbtn" onClick={google} disabled={busy}>
            <GoogleMark />Continue with Google
          </button>
          <p className="or"><span>or use your email</span></p>
        </>
      ) : null}

      <form className="pg-form" onSubmit={submit} aria-busy={busy}>
        {mode === "up" ? <label>Your name<input name="name" required autoComplete="name" disabled={off} /></label> : null}
        <label>Email<input name="email" type="email" required autoComplete="email" disabled={off} /></label>
        <label>
          Password{mode === "up" ? <span className="opt">at least 8 characters</span> : null}
          <input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} disabled={off} />
        </label>
        <p className="err" role="alert">{err}</p>
        <button className="btn" type="submit" disabled={busy || off}>
          {mode === "up" ? "Create account" : "Sign in"}<Arrow />
        </button>
      </form>
      <p className="pg-small">
        Candidates only. Employers can request staff without an account.
      </p>
    </div>
  );
}
