"use client";

import { authClient } from "@/lib/auth-client";
import { useAccountsStatus } from "./accountsStatus";

export { useAccountsStatus };

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
