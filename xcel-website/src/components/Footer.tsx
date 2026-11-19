import Link from "next/link";
import { CONTACT } from "@/content/content";
import { tel } from "@/components/pg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-rule" />
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <svg className="footer-mark" aria-hidden="true"><use href="#i-mark" /></svg>
            XcelCareers<span className="reg" aria-hidden="true">®</span>
          </a>
          <address className="type-caps">
            {CONTACT.address}<br />
            <a href={tel}>{CONTACT.phone}</a> · <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </address>
        </div>
        <div className="footer-cols">
          <nav aria-label="Employers">
            <p className="type-caps ttl">Employers</p>
            <ul>
              <li><Link href="/healthcare">Healthcare staffing</Link></li>
              <li><Link href="/government">Government contracting</Link></li>
              <li><Link href="/specialists">IT · Finance · Cyber</Link></li>
              <li><Link href="/contact">Request staff</Link></li>
            </ul>
          </nav>
          <nav aria-label="Candidates">
            <p className="type-caps ttl">Candidates</p>
            <ul>
              <li><Link href="/jobs">Open jobs</Link></li>
              <li><Link href="/jobs#resume">Upload résumé</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <p className="type-caps ttl">Company</p>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/capability">Capability statement</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="footer-legal type-caps"><p>{CONTACT.legal}</p><p>{CONTACT.ids}</p></div>
    </footer>
  );
}
