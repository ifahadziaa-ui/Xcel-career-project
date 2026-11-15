import { connection } from "next/server";
import { JOBS } from "@/content/content";
import { createApplication } from "@/lib/accounts";
import { getSessionUser } from "@/lib/session";

const MAX_BYTES = 4 * 1024 * 1024; // stays under the 4.5 MB request limit of serverless functions
const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bad = (error: string, status = 400) => Response.json({ error }, { status });

/* A signed-in candidate applies to a role: the details and the résumé are stored with the account. */
export async function POST(req: Request) {
  await connection();
  const user = await getSessionUser();
  if (!user) return bad("Sign in to apply.", 401);

  const form = await req.formData().catch(() => null);
  if (!form) return bad("The application could not be read.");

  const job = JOBS.find((j) => j.id === text(form.get("jobId"), 80));
  if (!job) return bad("That role was not found.", 404);

  const first = text(form.get("first"), 100);
  const last = text(form.get("last"), 100);
  const email = text(form.get("email"), 200);
  const phone = text(form.get("phone"), 40);
  if (!first || !last) return bad("Please enter your first and last name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email address.");

  const file = form.get("resume");
  if (!(file instanceof File) || file.size === 0) return bad("Please attach your résumé.");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!TYPES[ext]) return bad("The résumé must be a PDF or Word file.");
  if (file.size > MAX_BYTES) return bad("The résumé must be under 4 MB.");

  const result = await createApplication({
    userId: user.id,
    jobId: job.id,
    jobTitle: job.title,
    jobField: job.fn,
    first,
    last,
    email,
    phone,
    resumeName: file.name.slice(0, 200),
    resumeType: TYPES[ext],
    resumeFile: Buffer.from(await file.arrayBuffer()),
  });
  return Response.json({ ok: true, result });
}
