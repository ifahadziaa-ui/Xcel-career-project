import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  /* Images and clips in public/ were served "max-age=0, must-revalidate", so every repeat visit re-checked every file.
     Their names are not content-hashed, so the browser keeps them a day (then refreshes in the background for a week)
     rather than for a year: a file replaced under the same name shows within a day. */
  async headers() {
    const media = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/assets/:path*", headers: media },
      { source: "/logos/:path*", headers: media },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        // Leave *.module.css to Next's built-in CSS Modules handling.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
