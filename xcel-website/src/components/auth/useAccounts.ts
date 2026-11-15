"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Status = { configured: boolean; google: boolean };
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

/* The signed-in candidate (or null) and whether the answer is still on its way. */
export function useCandidate() {
  const status = useAccountsStatus();
  const { data, isPending } = authClient.useSession();
  return { status, user: data?.user ?? null, pending: status === null || isPending };
}

/* Only follow a next= value that stays on this site. */
export function safeNext(v: string | null | undefined, fallback = "/account") {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}
