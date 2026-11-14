import type { MetadataRoute } from "next";

const routes = ["", "/healthcare", "/government", "/specialists", "/jobs", "/capability", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xcelcareers.com";
  return routes.map((r) => ({ url: base + r }));
}
