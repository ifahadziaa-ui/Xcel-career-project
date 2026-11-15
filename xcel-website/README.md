# XcelCareers website

Next.js 16 app (App Router, React 19, TypeScript). Source of truth for the live site.

## Run locally

```bash
cd xcel-website
npm ci
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

## Deploy (Vercel)

- Import the GitHub repository in Vercel and set **Root Directory** to `xcel-website` (the repository also holds the design prototypes, which are not deployed).
- Framework preset: Next.js (detected). Build command and output are the defaults.
- Environment variable for launch: `NEXT_PUBLIC_INDEXABLE=true` (until it is set, the site tells search engines not to index it).
- Optional: `NEXT_PUBLIC_SITE_URL=https://<the live domain>` for canonical URLs, the sitemap and robots.txt.
- Forms are not delivered yet and the job listings are samples; see `PROJECT-BRIEF.md`.

## Candidate accounts (sign-in, applications, saved roles)

Built with Better Auth and Postgres. Pages: `/login`, `/account`; the apply form and Save buttons on `/jobs` use them.
The tables are created automatically the first time the site runs with a database. Switched off (the default) until the database is connected in Vercel, and the site works as before:

1. **Database**: in Vercel, Storage > Create Database > Neon Postgres, connect it to the project (it adds `DATABASE_URL`/`POSTGRES_URL`).
2. Nothing else is required. The key that signs sign-in cookies is derived from the database connection string; set `BETTER_AUTH_SECRET` (any long random string) only if you want to control it.
3. **Google** (optional): Google Cloud Console > APIs and Services > Credentials > Create credentials > OAuth client ID > Web application.
   Authorised redirect URI: `https://<the live domain>/api/auth/callback/google` (add `http://localhost:3000/api/auth/callback/google` for local work).
   Fill in the consent screen (app name XcelCareers, a support email) and publish it. Then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. `BETTER_AUTH_URL` is only needed for local work or a custom domain that differs from the Vercel production URL.

See `.env.example`. Not built yet: password reset by email (needs a mail service), email verification, and a view for the recruiters to read applications (they are in the `application` table, résumé included).
