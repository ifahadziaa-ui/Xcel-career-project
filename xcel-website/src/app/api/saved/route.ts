import { connection } from "next/server";
import { JOBS } from "@/content/content";
import { listSaved, setSaved } from "@/lib/accounts";
import { getSessionUser } from "@/lib/session";

/* The roles a signed-in candidate has saved. Signed out, the list is simply empty. */
export async function GET() {
  await connection();
  const user = await getSessionUser();
  return Response.json({ signedIn: Boolean(user), ids: user ? await listSaved(user.id) : [] });
}

export async function POST(req: Request) {
  await connection();
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Sign in to save roles." }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { jobId?: unknown; saved?: unknown } | null;
  const jobId = typeof body?.jobId === "string" ? body.jobId : "";
  if (!JOBS.some((j) => j.id === jobId)) return Response.json({ error: "That role was not found." }, { status: 404 });
  await setSaved(user.id, jobId, Boolean(body?.saved));
  return Response.json({ ok: true });
}
