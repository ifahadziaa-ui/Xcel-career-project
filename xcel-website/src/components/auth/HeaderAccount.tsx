"use client";

import Link from "next/link";
import { useCandidate } from "./useAccounts";

/* "Sign in" before sign-in, "Account" after. Loaded by the top bar only once accounts are known to be on. */
export default function HeaderAccount() {
  const { user } = useCandidate();
  return <Link className="hx-account" href={user ? "/account" : "/login"}>{user ? "Account" : "Sign in"}</Link>;
}
