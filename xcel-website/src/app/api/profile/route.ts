import { headers } from "next/headers";
import { connection } from "next/server";
import { saveProfile } from "@/lib/accounts";
import { getAuth } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";

const FIELDS = ["", "Healthcare", "IT", "Finance", "Cybersecurity", "Other"];
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* The candidate's own details: name (kept by Better Auth), phone, field and location. */
export async function POST(req: Request) {
  await connection();
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return Response.json({ error: "The details could not be read." }, { status: 400 });

  const name = clip(b.name, 120);
  const field = clip(b.field, 40);
  if (!name) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!FIELDS.includes(field)) return Response.json({ error: "Please choose a field from the list." }, { status: 400 });

  if (name !== user.name) await getAuth().api.updateUser({ headers: await headers(), body: { name } });
  await saveProfile(user.id, { phone: clip(b.phone, 40), field, location: clip(b.location, 120) });
  return Response.json({ ok: true });
}
