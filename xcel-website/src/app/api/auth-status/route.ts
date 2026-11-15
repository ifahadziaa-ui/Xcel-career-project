import { connection } from "next/server";
import { accountsConfigured, googleConfigured } from "@/lib/auth";

/* What the sign-in page needs to know: are accounts switched on, and is Google offered. */
export async function GET() {
  await connection();
  return Response.json({ configured: accountsConfigured, google: accountsConfigured && googleConfigured });
}
