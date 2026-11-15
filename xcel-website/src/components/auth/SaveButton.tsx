"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCandidate } from "./useAccounts";

/* A small shared store, so a list of twelve roles asks the server once, not twelve times. */
let ids: string[] | null = null;
let loading: Promise<void> | null = null;
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

function load() {
  loading ??= fetch("/api/saved", { cache: "no-store" })
    .then((r) => r.json() as Promise<{ ids?: string[] }>)
    .then((j) => { ids = j.ids ?? []; })
    .catch(() => { ids = []; })
    .finally(notify);
}

export function useSavedIds(enabled: boolean) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!enabled) { ids = null; loading = null; return; }
    const f = () => force((n) => n + 1);
    subs.add(f);
    load();
    return () => { subs.delete(f); };
  }, [enabled]);
  return enabled ? ids : null;
}

async function toggle(jobId: string, saved: boolean) {
  ids = saved ? [...new Set([...(ids ?? []), jobId])] : (ids ?? []).filter((x) => x !== jobId);
  notify();
  const r = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, saved }) });
  if (!r.ok) { // put it back if the server refused
    ids = saved ? (ids ?? []).filter((x) => x !== jobId) : [...new Set([...(ids ?? []), jobId])];
    notify();
  }
}

/* Save / Saved for one role. Signed out it leads to the sign-in page; with accounts off it is not shown. */
export function SaveButton({ jobId }: { jobId: string }) {
  const path = usePathname();
  const { status, user } = useCandidate();
  const list = useSavedIds(Boolean(user));
  if (!status?.configured) return null;
  if (!user) return <Link className="jb-save" href={`/login?next=${encodeURIComponent(path)}`}>Save</Link>;
  const on = Boolean(list?.includes(jobId));
  return (
    <button type="button" className={`jb-save${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => toggle(jobId, !on)}>
      {on ? "Saved" : "Save"}
    </button>
  );
}
