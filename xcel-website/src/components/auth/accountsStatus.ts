"use client";

import { useEffect, useState } from "react";

/* Kept apart from useAccounts.ts so the top bar can ask "are accounts on?" without pulling the
   sign-in client (better-auth) into every page's first download. */
export type Status = { configured: boolean; google: boolean };
let cached: Promise<Status> | null = null;

/* Are accounts switched on (and is Google offered)? One request per page load, shared by every component. */
export function useAccountsStatus(): Status | null {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    cached ??= fetch("/api/auth-status", { cache: "no-store" })
      .then((r) => r.json() as Promise<Status>)
      .catch(() => ({ configured: false, google: false }));
    let live = true;
    cached.then((v) => live && setS(v));
    return () => { live = false; };
  }, []);
  return s;
}
