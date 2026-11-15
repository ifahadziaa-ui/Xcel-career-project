import "server-only";
import { Pool } from "pg";

/* One small connection pool, shared across requests (and across hot reloads in dev).
   DATABASE_URL is a Postgres connection string (Vercel Postgres / Neon, Supabase, or any Postgres). */
const g = globalThis as unknown as { __xcPool?: Pool };

export const connectionString = () => process.env.DATABASE_URL ?? process.env.POSTGRES_URL; // Vercel Postgres / Neon sets one of the two

export const dbConfigured = Boolean(connectionString());

export function getPool(): Pool {
  const cs = connectionString();
  if (!cs) throw new Error("DATABASE_URL is not set");
  return (g.__xcPool ??= new Pool({ connectionString: cs, max: 5 }));
}
