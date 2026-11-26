import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm, AuthPanel } from "@/components/auth/AuthForm";
import { accountsConfigured, googleConfigured } from "@/lib/auth";
import { Eyebrow, Headline } from "@/components/pg";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create a candidate account to apply for roles and keep track of your applications.",
  robots: { index: false, follow: false },
};

export default function Page() {
  // The same build-time answer /api/auth-status gives: the placeholder panel in the HTML and the working form
  // both render at their final size straight away (with or without the Google button).
  const status = { configured: accountsConfigured, google: accountsConfigured && googleConfigured };
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
            <Suspense fallback={<AuthPanel mode="in" status={status} />}>
              <AuthForm initialStatus={status} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
