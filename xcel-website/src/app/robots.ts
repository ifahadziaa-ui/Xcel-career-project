import type { MetadataRoute } from "next";

// Closed until launch: set NEXT_PUBLIC_INDEXABLE=true on the production deploy.
export default function robots(): MetadataRoute.Robots {
  const open = process.env.NEXT_PUBLIC_INDEXABLE === "true";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xcelcareers.com";
  return open
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
