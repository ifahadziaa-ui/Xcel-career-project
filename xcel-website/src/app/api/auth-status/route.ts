import { accountsConfigured, googleConfigured } from "@/lib/auth";

/* What the sign-in page and the top bar need to know: are accounts switched on, and is Google offered.
   The answer depends only on the deploy's settings (Vercel applies changed settings on the next deploy), so it is
   prerendered at build time and served from the CDN, instead of starting a server function on every page view. */
export async function GET() {
  return Response.json({ configured: accountsConfigured, google: accountsConfigured && googleConfigured });
}
