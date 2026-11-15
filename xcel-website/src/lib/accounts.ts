import "server-only";
import { getPool } from "./db";

export type Profile = { phone: string; field: string; location: string };
export type ApplicationRow = { id: string; jobId: string; jobTitle: string; jobField: string; status: string; createdAt: string };

export async function getProfile(userId: string): Promise<Profile> {
  const r = await getPool().query("select phone, field, location from candidate_profile where user_id = $1", [userId]);
  return r.rows[0] ?? { phone: "", field: "", location: "" };
}

export async function saveProfile(userId: string, p: Profile) {
  await getPool().query(
    `insert into candidate_profile (user_id, phone, field, location) values ($1, $2, $3, $4)
     on conflict (user_id) do update set phone = $2, field = $3, location = $4, updated_at = now()`,
    [userId, p.phone, p.field, p.location],
  );
}

export async function listApplications(userId: string): Promise<ApplicationRow[]> {
  const r = await getPool().query(
    "select id, job_id, job_title, job_field, status, created_at from application where user_id = $1 order by created_at desc",
    [userId],
  );
  return r.rows.map((x) => ({
    id: String(x.id),
    jobId: x.job_id,
    jobTitle: x.job_title,
    jobField: x.job_field,
    status: x.status,
    createdAt: new Date(x.created_at).toISOString(),
  }));
}

export async function createApplication(a: {
  userId: string; jobId: string; jobTitle: string; jobField: string;
  first: string; last: string; email: string; phone: string;
  resumeName: string; resumeType: string; resumeFile: Buffer;
}): Promise<"created" | "exists"> {
  const r = await getPool().query(
    `insert into application (user_id, job_id, job_title, job_field, first_name, last_name, email, phone, resume_name, resume_type, resume_file)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) on conflict (user_id, job_id) do nothing`,
    [a.userId, a.jobId, a.jobTitle, a.jobField, a.first, a.last, a.email, a.phone, a.resumeName, a.resumeType, a.resumeFile],
  );
  return r.rowCount ? "created" : "exists";
}

export async function listSaved(userId: string): Promise<string[]> {
  const r = await getPool().query("select job_id from saved_job where user_id = $1 order by created_at desc", [userId]);
  return r.rows.map((x) => x.job_id);
}

export async function setSaved(userId: string, jobId: string, saved: boolean) {
  if (saved) await getPool().query("insert into saved_job (user_id, job_id) values ($1, $2) on conflict do nothing", [userId, jobId]);
  else await getPool().query("delete from saved_job where user_id = $1 and job_id = $2", [userId, jobId]);
}
