import { toNextJsHandler } from "better-auth/next-js";
import { connection } from "next/server";
import { accountsConfigured, ensureSchema, getAuth } from "@/lib/auth";

/* Sign-in, sign-up, sign-out, Google and account deletion all go through Better Auth's handler.
   Until DATABASE_URL and BETTER_AUTH_SECRET are set the route answers 503 and the pages say why. */
const off = () => Response.json({ error: "Accounts are not set up yet." }, { status: 503 });

export async function GET(req: Request) {
  await connection();
  const isSession = new URL(req.url).pathname.endsWith("/get-session");
  // the page chrome asks "who is signed in?" on every page; with accounts off, or the database unreachable, the answer is "nobody"
  if (!accountsConfigured) return isSession ? Response.json(null) : off();
  // no session cookie (better-auth.session_token, or __Secure-… on https): nobody is signed in, so answer at once
  // instead of starting the database (and its migration check) for every anonymous page view
  if (isSession && !(req.headers.get("cookie") ?? "").includes("better-auth.session_token")) return Response.json(null);
  try {
    await ensureSchema();
    return await toNextJsHandler(getAuth()).GET(req);
  } catch (e) {
    console.error("auth GET failed:", e);
    return isSession ? Response.json(null) : Response.json({ error: "Accounts are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  await connection();
  if (!accountsConfigured) return off();
  await ensureSchema();
  return toNextJsHandler(getAuth()).POST(req);
}
