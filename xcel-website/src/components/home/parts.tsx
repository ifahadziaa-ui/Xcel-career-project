/* Small shared pieces of the homepage sections. Server components. */
import type { ReactNode } from "react";
import Link from "next/link";
import s from "./home.module.css";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={`type-caps ${s.eyebrow}`}>
      <span className={s.dot} aria-hidden="true" />
      {children}
    </p>
  );
}

export const Arrow = () => (
  <svg aria-hidden="true">
    <use href="#i-arrow" />
  </svg>
);

export function ButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={s.btn} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
