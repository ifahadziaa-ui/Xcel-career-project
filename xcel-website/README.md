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
