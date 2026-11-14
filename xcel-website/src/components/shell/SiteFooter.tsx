/* =====================================================================
   SiteFooter: server component, on every route.
   Structure and wording from landing-prototype-clean (index.html footer, js/site.js footerHTML);
   facts from content.ts (CONTACT). Link targets are routes (routeFor). The entry that pointed
   at the prototype's sign-in page is a disabled button: accounts are design-only.
   The prototype's letter-by-letter wordmark animation belongs to the homepage motion stage.
   ===================================================================== */
import Link from "next/link";
import { CONTACT } from "@/content/content";
import { routeFor } from "@/content/routes";
import s from "./SiteFooter.module.css";

type Item = { label: string; href: string | null };
const COLUMNS: ReadonlyArray<{ title: string; items: readonly Item[] }> = [
  {
    title: "Employers",
    items: [
      { label: "Healthcare staffing", href: "healthcare.html" },
      { label: "Government contracting", href: "government.html" },
      { label: "IT · Finance · Cyber", href: "specialists.html" },
      { label: "Request staff", href: "contact.html" },
    ],
  },
  {
    title: "Candidates",
    items: [
      { label: "Jobs", href: "jobs.html" },
      { label: "Upload résumé", href: "jobs.html#resume" },
      { label: "Sign in", href: "login.html" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "about.html" },
      { label: "Capability statement", href: "capability.html" },
      { label: "Contact", href: "contact.html" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.rule} />
      <div className={s.main}>
        <div className={s.brand}>
          <Link href="/" className={s.logo}>
            <svg className={s.mark} aria-hidden="true">
              <use href="#i-mark" />
            </svg>
            XcelCareers
            <span className={s.reg} aria-hidden="true">
              ®
            </span>
          </Link>
          <address className="type-caps">{CONTACT.address}</address>
        </div>
        <div className={s.cols}>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className={`type-caps ${s.ttl}`}>{col.title}</p>
              <ul>
                {col.items.map((it) => {
                  const href = it.href ? routeFor(it.href) : null;
                  return (
                    <li key={it.label}>
                      {href ? (
                        <Link href={href}>{it.label}</Link>
                      ) : (
                        <button type="button" aria-disabled="true" title="Candidate accounts are not live yet">
                          {it.label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className={`${s.legal} type-caps`}>
        <p>{CONTACT.legal}</p>
        <p>{CONTACT.ids}</p>
      </div>
      <p className={`type-display ${s.word}`} aria-hidden="true">
        XcelCareers
      </p>
    </footer>
  );
}
