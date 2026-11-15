import "server-only";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { nextCookies } from "better-auth/next-js";
import { dbConfigured, getPool } from "./db";

/* Accounts need two settings: DATABASE_URL (where profiles, applications and saved roles live) and
   BETTER_AUTH_SECRET (signs the session cookie). Google sign-in also needs GOOGLE_CLIENT_ID and
   GOOGLE_CLIENT_SECRET. Without the first two the site works as before and the account pages say so. */
export const accountsConfigured = dbConfigured && Boolean(process.env.BETTER_AUTH_SECRET);
export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const siteUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

function create() {
  return betterAuth({
    database: getPool(),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: siteUrl,
    trustedOrigins: process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [],
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    socialProviders: googleConfigured
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } }
      : {},
    user: { deleteUser: { enabled: true } },
    plugins: [nextCookies()], // keep last
  });
}

type Auth = ReturnType<typeof create>;
const g = globalThis as unknown as { __xcAuth?: Auth; __xcReady?: Promise<void> | null };

export function getAuth(): Auth {
  if (!accountsConfigured) throw new Error("Accounts are not set up (DATABASE_URL and BETTER_AUTH_SECRET).");
  return (g.__xcAuth ??= create());
}

/* Our own tables. The sign-in tables (user, session, account, verification) are created by the Better Auth
   migration below; both run once per server start and are safe to repeat. */
const APP_SQL = `
create table if not exists candidate_profile (
  user_id text primary key references "user"(id) on delete cascade,
  phone text not null default '',
  field text not null default '',
  location text not null default '',
  updated_at timestamptz not null default now()
);
create table if not exists saved_job (
  user_id text not null references "user"(id) on delete cascade,
  job_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);
create table if not exists application (
  id bigserial primary key,
  user_id text not null references "user"(id) on delete cascade,
  job_id text not null,
  job_title text not null,
  job_field text not null default '',
  status text not null default 'Submitted',
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  resume_name text not null,
  resume_type text not null,
  resume_file bytea not null,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);
`;

export function ensureSchema(): Promise<void> {
  g.__xcReady ??= (async () => {
    const { runMigrations } = await getMigrations(getAuth().options);
    await runMigrations();
    await getPool().query(APP_SQL);
  })().catch((e) => {
    g.__xcReady = null;
    throw e;
  });
  return g.__xcReady;
}
