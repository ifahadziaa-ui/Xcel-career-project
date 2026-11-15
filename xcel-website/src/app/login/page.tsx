import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Eyebrow, Headline } from "@/components/pg";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create a candidate account to apply for roles and keep track of your applications.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="pg pg-auth" id="main">
      <section className="pg-hero">
        <div className="pg-wrap pg-auth-in">
          <div>
            <Eyebrow>Candidate account</Eyebrow>
            <Headline lines={["Apply once,", "keep track"]} />
            <ul className="pg-list" data-r="2">
              <li>See every role you applied for, and when.</li>
              <li>Save roles to come back to.</li>
              <li>Keep your details in one place.</li>
            </ul>
            <p className="pg-small" data-r="3">Applying is always free for candidates.</p>
          </div>
          <div data-r="2">
            <Suspense fallback={<div className="auth pg-panel" aria-hidden="true" style={{ minHeight: "22rem" }} />}>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
