/* =====================================================================
   Route paths of the website, and the mapping from the prototype's .html links.

   content.ts keeps the prototype's own hrefs (healthcare.html, contact.html, ...) so the data
   stays identical to the verified copy. Components turn them into routes with routeFor().
   Server-safe: plain data.
   ===================================================================== */
export const ROUTES = {
  home: "/",
  healthcare: "/healthcare",
  government: "/government",
  specialists: "/it-finance-cyber",
  jobs: "/jobs",
  capability: "/capability",
  about: "/about",
  contact: "/contact",
} as const;

export type RouteKey = keyof typeof ROUTES;

const PROTO_PAGE: Record<string, string> = {
  "index.html": ROUTES.home,
  "healthcare.html": ROUTES.healthcare,
  "government.html": ROUTES.government,
  "specialists.html": ROUTES.specialists,
  "jobs.html": ROUTES.jobs,
  "capability.html": ROUTES.capability,
  "about.html": ROUTES.about,
  "contact.html": ROUTES.contact,
};

/**
 * "jobs.html#resume" -> "/jobs#resume", "contact.html?role=x" -> "/contact?role=x".
 * Same-page hashes ("#contact") and absolute paths pass through.
 * Returns null for a page that has no route (login.html and account.html: candidate
 * accounts are design-only, there is no destination).
 */
export function routeFor(href: string): string | null {
  if (href.startsWith("#") || href.startsWith("/")) return href;
  const m = href.match(/^([^?#]*)(.*)$/);
  const page = m ? PROTO_PAGE[m[1]] : undefined;
  return page ? page + (m?.[2] ?? "") : null;
}
