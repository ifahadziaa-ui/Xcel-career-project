import "server-only";
import { headers } from "next/headers";
import { accountsConfigured, ensureSchema, getAuth } from "./auth";

export type SessionUser = { id: string; name: string; email: string; image?: string | null };

/* The signed-in candidate, or null. Reads the session cookie, so it can only run at request time
   (call it inside a <Suspense> boundary or a route handler). */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!accountsConfigured) return null;
  await ensureSchema();
  const s = await getAuth().api.getSession({ headers: await headers() });
  return s?.user ? { id: s.user.id, name: s.user.name, email: s.user.email, image: s.user.image } : null;
}
