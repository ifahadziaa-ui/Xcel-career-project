"use client";

/* The homepage request form (client component: validation presentation only).
   Same behaviour as the cleaned prototype: it checks the three fields, shows one message at a time,
   focuses the first problem and, when all three are filled, goes to the contact route. Nothing is sent,
   stored or put in the URL (no query string, no field names), and no success message is shown. Real
   submission awaits a backend; the request form itself lives on /contact (a placeholder until its stage). */
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "./parts";
import s from "./home.module.css";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Name = "org" | "role" | "email";
const MSG: Record<Name, (v: string) => string> = {
  org: () => "Enter your organization so we know who is asking.",
  role: () => "Tell us the role you need, for example RN or behavioral health.",
  email: (v) => (v ? "That doesn't look like an email address. Check it and try again." : "Enter your work email so we know where to reach you."),
};

export default function ContactForm({ action }: { action: string }) {
  const router = useRouter();
  const [error, setError] = useState<{ field: Name; msg: string } | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    for (const name of ["org", "role", "email"] as const) {
      const el = e.currentTarget.elements.namedItem(`join-${name}`) as HTMLInputElement;
      const v = el.value.trim();
      if (v && (name !== "email" || EMAIL_OK.test(v))) continue;
      e.preventDefault();
      setError({ field: name, msg: MSG[name](v) });
      el.focus();
      return;
    } // all three filled: go to the contact route, carrying nothing
    e.preventDefault();
    router.push(action);
  }
  const clear = (name: Name) => { if (error?.field === name) setError(null); };
  const invalid = (name: Name) => (error?.field === name ? true : undefined);

  return (
    <>
      <form className={`${s.joinForm} ${s.joinFormReq}`} action={action} noValidate onSubmit={onSubmit}>
        <label htmlFor="join-org" className="sr-only">Organization</label>
        <input id="join-org" placeholder="Organization" autoComplete="organization" required
          aria-describedby="join-msg" aria-invalid={invalid("org")} onChange={() => clear("org")} />
        <label htmlFor="join-role" className="sr-only">Role you need</label>
        <input id="join-role" placeholder="Role you need, e.g. RN, behavioral health" required
          aria-describedby="join-msg" aria-invalid={invalid("role")} onChange={() => clear("role")} />
        <label htmlFor="join-email" className="sr-only">Work email</label>
        <input id="join-email" type="email" placeholder="Work email" autoComplete="email" required
          aria-describedby="join-msg" aria-invalid={invalid("email")} onChange={() => clear("email")} />
        <button className={s.btn} type="submit">
          Request staff
          <Arrow />
        </button>
      </form>
      <p className={s.joinMsg} id="join-msg" role={error ? "alert" : "status"} aria-live="polite" data-state={error ? "error" : undefined} hidden={!error}>
        {error?.msg}
      </p>
    </>
  );
}
